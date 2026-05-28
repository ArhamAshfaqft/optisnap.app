import * as ort from 'onnxruntime-web/webgpu';

// Set global WASM path dynamically matching the current package version
const version = '1.21.0';
ort.env.wasm.wasmPaths = `https://cdn.jsdelivr.net/npm/onnxruntime-web@${version}/dist/`;

// Global cached session variables
let activeSession = null;
let activeScale = null;

// Helper to load image as HTMLImageElement
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = url;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
};

// Download model with progress report and Cache Storage backend
async function getModelBuffer(url, onProgress) {
  try {
    const cache = await caches.open('optisnap-ai-models');
    const cachedResponse = await cache.match(url);
    if (cachedResponse) {
      if (onProgress) onProgress(100);
      return await cachedResponse.arrayBuffer();
    }
  } catch (e) {
    console.warn('Cache storage access failed, falling back to direct fetch:', e);
  }

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Model fetch failed: ${response.status} ${response.statusText}`);
  }

  const contentLength = response.headers.get('content-length');
  const total = contentLength ? parseInt(contentLength, 10) : 0;

  const reader = response.body.getReader();
  let received = 0;
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;

    if (onProgress && total > 0) {
      const pct = Math.round((received / total) * 100);
      onProgress(pct);
    }
  }

  const buffer = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    buffer.set(chunk, offset);
    offset += chunk.length;
  }

  try {
    const cache = await caches.open('optisnap-ai-models');
    await cache.put(url, new Response(buffer.buffer.slice(0), {
      headers: { 'Content-Type': 'application/octet-stream' }
    }));
  } catch (e) {
    console.warn('Failed to cache model in Cache Storage:', e);
  }

  return buffer.buffer;
}

// Get or initialize the ONNX Runtime session
async function getSession(scale, onProgress) {
  if (activeSession && activeScale === scale) {
    return activeSession;
  }

  activeSession = null;

  const modelUrl = scale === 4
    ? 'https://huggingface.co/TensorStack/Upscale-amuse/resolve/main/RealESRGAN-4x/model.onnx'
    : 'https://huggingface.co/TensorStack/Upscale-amuse/resolve/main/RealESRGAN-2x/model.onnx';

  const buffer = await getModelBuffer(modelUrl, onProgress);

  try {
    // Try to load with WebGPU provider
    activeSession = await ort.InferenceSession.create(buffer, {
      executionProviders: ['webgpu']
    });
    activeScale = scale;
    console.log('ONNX Runtime: loaded model with WebGPU successfully.');
  } catch (gpuError) {
    console.warn('ONNX Runtime: WebGPU failed, trying WASM fallback:', gpuError);
    try {
      // Fallback to WASM
      activeSession = await ort.InferenceSession.create(buffer, {
        executionProviders: ['wasm']
      });
      activeScale = scale;
      console.log('ONNX Runtime: loaded model with WASM successfully.');
    } catch (wasmError) {
      console.error('ONNX Runtime: both WebGPU and WASM failed:', wasmError);
      throw new Error(`Failed to initialize upscaler: ${wasmError.message}`);
    }
  }

  return activeSession;
}

export const UpscalerService = {
  /**
   * Preloads the upscaler session/model in the background.
   */
  async preloadModel(scale, onProgress) {
    try {
      await getSession(scale, onProgress);
    } catch (err) {
      console.warn("Failed to preload upscaler model:", err);
    }
  },

  /**
   * Upscales an image blob or file using a memory-safe overlap tiling strategy.
   *
   * @param {Blob|File} fileOrBlob - Input image
   * @param {number} scale - Upscale factor (2 or 4)
   * @param {function} onProgress - Callback for status updates
   * @returns {Promise<Blob>} Upscaled image blob
   */
  async upscaleImage(fileOrBlob, scale, onProgress) {
    const url = URL.createObjectURL(fileOrBlob);
    let img;
    try {
      img = await loadImage(url);
    } finally {
      URL.revokeObjectURL(url);
    }

    const session = await getSession(scale, (downloadProgress) => {
      if (onProgress) {
        onProgress(`Downloading model: ${downloadProgress}%`);
      }
    });

    const W = img.width;
    const H = img.height;
    const outW = W * scale;
    const outH = H * scale;

    // Check if original image has any transparency
    let hasAlpha = false;
    try {
      const checkCanvas = document.createElement('canvas');
      checkCanvas.width = W;
      checkCanvas.height = H;
      const checkCtx = checkCanvas.getContext('2d');
      checkCtx.drawImage(img, 0, 0);
      const checkData = checkCtx.getImageData(0, 0, W, H).data;
      for (let i = 3; i < checkData.length; i += 4) {
        if (checkData[i] < 255) {
          hasAlpha = true;
          break;
        }
      }
      checkCanvas.width = 0;
      checkCanvas.height = 0;
    } catch (e) {
      console.warn('Alpha channel check failed, assuming no alpha:', e);
    }

    const destCanvas = document.createElement('canvas');
    destCanvas.width = outW;
    destCanvas.height = outH;
    const destCtx = destCanvas.getContext('2d');

    // Tiling configuration
    const TILE_SIZE = 256;
    const OVERLAP = 16;
    const W_step = TILE_SIZE - 2 * OVERLAP;

    const cols = Math.ceil(W / W_step);
    const rows = Math.ceil(H / W_step);
    const totalTiles = cols * rows;
    let tileCount = 0;

    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = TILE_SIZE;
    tileCanvas.height = TILE_SIZE;
    const tileCtx = tileCanvas.getContext('2d');

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        tileCount++;
        if (onProgress) {
          onProgress(`Upscaling tile ${tileCount}/${totalTiles}...`);
        }

        const x_start_core = c * W_step;
        const x_end_core = Math.min(x_start_core + W_step, W);
        const y_start_core = r * W_step;
        const y_end_core = Math.min(y_start_core + W_step, H);

        let x_start_tile = x_start_core - OVERLAP;
        let y_start_tile = y_start_core - OVERLAP;

        if (x_start_tile < 0) x_start_tile = 0;
        if (y_start_tile < 0) y_start_tile = 0;

        if (x_start_tile + TILE_SIZE > W) {
          x_start_tile = Math.max(0, W - TILE_SIZE);
        }
        if (y_start_tile + TILE_SIZE > H) {
          y_start_tile = Math.max(0, H - TILE_SIZE);
        }

        const dx_start = x_start_core - x_start_tile;
        const dy_start = y_start_core - y_start_tile;
        const w_core = x_end_core - x_start_core;
        const h_core = y_end_core - y_start_core;

        tileCtx.fillStyle = '#ffffff';
        tileCtx.fillRect(0, 0, TILE_SIZE, TILE_SIZE);

        const sourceDrawW = Math.min(TILE_SIZE, W - x_start_tile);
        const sourceDrawH = Math.min(TILE_SIZE, H - y_start_tile);

        tileCtx.drawImage(
          img,
          x_start_tile, y_start_tile, sourceDrawW, sourceDrawH,
          0, 0, sourceDrawW, sourceDrawH
        );

        const imgData = tileCtx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
        const data = imgData.data;
        const inputBuffer = new Float32Array(3 * TILE_SIZE * TILE_SIZE);

        for (let i = 0; i < TILE_SIZE * TILE_SIZE; i++) {
          inputBuffer[i] = data[i * 4] / 255.0;
          inputBuffer[i + TILE_SIZE * TILE_SIZE] = data[i * 4 + 1] / 255.0;
          inputBuffer[i + 2 * TILE_SIZE * TILE_SIZE] = data[i * 4 + 2] / 255.0;
        }

        const inputTensor = new ort.Tensor('float32', inputBuffer, [1, 3, TILE_SIZE, TILE_SIZE]);

        const inputName = session.inputNames[0];
        const outputName = session.outputNames[0];
        const feeds = { [inputName]: inputTensor };

        const results = await session.run(feeds);
        const outputTensor = results[outputName];

        const outTileSize = TILE_SIZE * scale;
        const outputData = outputTensor.data;

        const outImgData = new Uint8ClampedArray(4 * outTileSize * outTileSize);
        const numPixels = outTileSize * outTileSize;

        for (let i = 0; i < numPixels; i++) {
          const rVal = Math.min(255, Math.max(0, Math.round(outputData[i] * 255)));
          const gVal = Math.min(255, Math.max(0, Math.round(outputData[i + numPixels] * 255)));
          const bVal = Math.min(255, Math.max(0, Math.round(outputData[i + 2 * numPixels] * 255)));

          outImgData[i * 4] = rVal;
          outImgData[i * 4 + 1] = gVal;
          outImgData[i * 4 + 2] = bVal;
          outImgData[i * 4 + 3] = 255;
        }

        const outCanvas = document.createElement('canvas');
        outCanvas.width = outTileSize;
        outCanvas.height = outTileSize;
        const outCtx = outCanvas.getContext('2d');
        outCtx.putImageData(new ImageData(outImgData, outTileSize, outTileSize), 0, 0);

        const dx_prime_start = dx_start * scale;
        const dy_prime_start = dy_start * scale;
        const w_prime_core = w_core * scale;
        const h_prime_core = h_core * scale;
        const dest_x = x_start_core * scale;
        const dest_y = y_start_core * scale;

        destCtx.drawImage(
          outCanvas,
          dx_prime_start, dy_prime_start, w_prime_core, h_prime_core,
          dest_x, dest_y, w_prime_core, h_prime_core
        );

        outCanvas.width = 0;
        outCanvas.height = 0;

        await new Promise((r) => setTimeout(r, 0));
      }
    }

    tileCanvas.width = 0;
    tileCanvas.height = 0;

    // Apply alpha channel back if transparency is present
    if (hasAlpha) {
      if (onProgress) {
        onProgress('Restoring transparency mask...');
      }
      try {
        const alphaCanvas = document.createElement('canvas');
        alphaCanvas.width = outW;
        alphaCanvas.height = outH;
        const alphaCtx = alphaCanvas.getContext('2d');
        alphaCtx.drawImage(img, 0, 0, outW, outH);

        const alphaData = alphaCtx.getImageData(0, 0, outW, outH).data;
        const destData = destCtx.getImageData(0, 0, outW, outH);
        const destPixels = destData.data;

        for (let i = 3; i < destPixels.length; i += 4) {
          destPixels[i] = alphaData[i];
        }
        destCtx.putImageData(destData, 0, 0);

        alphaCanvas.width = 0;
        alphaCanvas.height = 0;
      } catch (e) {
        console.warn('Failed to restore transparency mask:', e);
      }
    }

    const outputBlob = await new Promise((resolve) => {
      destCanvas.toBlob(resolve, fileOrBlob.type || 'image/jpeg', 0.95);
    });

    destCanvas.width = 0;
    destCanvas.height = 0;

    return outputBlob;
  }
};
