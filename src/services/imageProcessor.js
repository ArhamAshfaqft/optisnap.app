import { removeBackground } from '@imgly/background-removal'
import imageCompression from 'browser-image-compression'
import JSZip from 'jszip'
import { UpscalerService } from './upscalerService'

// Helper to load a file/blob as an HTMLImageElement
const loadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => resolve(img)
    img.onerror = (err) => reject(err)
  })
}

// Convert canvas to blob with support for standard formats
const canvasToBlob = (canvas, format, quality) => {
  return new Promise((resolve) => {
    let mimeType = 'image/jpeg'
    if (format === 'png') mimeType = 'image/png'
    if (format === 'webp') mimeType = 'image/webp'
    if (format === 'avif') mimeType = 'image/avif'

    canvas.toBlob((blob) => {
      // If the browser doesn't support the requested format (e.g. avif in older engines), 
      // it returns null or falls back. We check if blob is returned.
      if (blob) {
        resolve(blob)
      } else {
        // Fallback to jpeg
        canvas.toBlob((fallbackBlob) => resolve(fallbackBlob), 'image/jpeg', quality)
      }
    }, mimeType, quality)
  })
}

// Yield to the browser event loop so GC can run and UI stays responsive
const yieldToEventLoop = (ms = 50) => new Promise(r => setTimeout(r, ms))

export const ImageProcessorService = {
  /**
   * Process a single image file client-side.
   * Includes explicit canvas memory cleanup to prevent GPU/heap memory accumulation.
   */
  async processSingleImage(file, settings, onProgress) {
    let currentBlob = file
    const originalName = file.name || 'image.jpg'

    // 1. Background Removal (if enabled)
    if (settings.backgroundRemoval?.active) {
      if (onProgress) onProgress("Removing background...")
      try {
        currentBlob = await removeBackground(currentBlob)
      } catch (err) {
        console.error("Background removal error, skipping background removal:", err)
      }
    }

    // 1.5. AI Upscaler (if enabled)
    if (settings.upscaler?.active) {
      if (onProgress) onProgress("AI Upscaling image...")
      try {
        currentBlob = await UpscalerService.upscaleImage(
          currentBlob,
          settings.upscaler.scale || 2,
          (statusText) => {
            if (onProgress) onProgress(statusText)
          }
        )
      } catch (err) {
        console.error("AI upscaler error, skipping upscale:", err)
      }
    }

    // Load image into HTML Image object for canvas operations
    const objectUrl = URL.createObjectURL(currentBlob)
    let img
    try {
      img = await loadImage(objectUrl)
    } finally {
      URL.revokeObjectURL(objectUrl)
    }

    // 2. Setup Canvas & Dimensions
    let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')

    const originalWidth = img.width
    const originalHeight = img.height

    let targetWidth = originalWidth
    let targetHeight = originalHeight

    // Calculate dimensions based on settings
    if (settings.resize?.active) {
      const resizeWidth = parseInt(settings.resize.width) || null
      const resizeHeight = parseInt(settings.resize.height) || null
      const mode = settings.resize.mode || 'inside' // 'inside', 'cover', 'contain', 'fill'

      if (resizeWidth || resizeHeight) {
        if (mode === 'inside') {
          // Scale to fit inside width/height maintaining aspect ratio (No padding)
          const ratio = Math.min(
            resizeWidth ? resizeWidth / originalWidth : 1,
            resizeHeight ? resizeHeight / originalHeight : 1
          )
          targetWidth = Math.round(originalWidth * ratio)
          targetHeight = Math.round(originalHeight * ratio)
        } else if (mode === 'fill') {
          // Stretch to fill
          targetWidth = resizeWidth || originalWidth
          targetHeight = resizeHeight || originalHeight
        } else if (mode === 'cover' || mode === 'contain') {
          targetWidth = resizeWidth || originalWidth
          targetHeight = resizeHeight || originalHeight
        }
      }
    }

    canvas.width = targetWidth
    canvas.height = targetHeight

    // Get output format (to decide if we should initialize with white background)
    const format = settings.convert?.active ? (settings.convert.format || 'jpg') : 'jpg'

    // If format is JPEG (jpg), initialize the canvas with a solid white background
    // to avoid transparent areas rendering as black
    if (format === 'jpg') {
      ctx.fillStyle = '#ffffff'
      ctx.fillRect(0, 0, targetWidth, targetHeight)
    }

    // Fill background / Draw Image
    if (settings.resize?.active && (settings.resize.mode === 'cover' || settings.resize.mode === 'contain')) {
      const mode = settings.resize.mode
      const bgMode = settings.resize.bgMode || 'solid' // 'solid', 'blur'
      const bgColor = settings.resize.bgColor || '#ffffff'

      const scale = mode === 'cover'
        ? Math.max(targetWidth / originalWidth, targetHeight / originalHeight)
        : Math.min(targetWidth / originalWidth, targetHeight / originalHeight)

      const drawWidth = originalWidth * scale
      const drawHeight = originalHeight * scale
      const x = (targetWidth - drawWidth) / 2
      const y = (targetHeight - drawHeight) / 2

      if (mode === 'contain') {
        if (bgMode === 'blur') {
          // Draw blurred background
          ctx.save()
          // Stretch original image to fill canvas as blurred background
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
          ctx.filter = 'blur(20px) brightness(80%)'
          ctx.drawImage(canvas, 0, 0)
          ctx.restore()
        } else {
          // Solid color background
          ctx.fillStyle = bgColor
          ctx.fillRect(0, 0, targetWidth, targetHeight)
        }
      }

      ctx.drawImage(img, x, y, drawWidth, drawHeight)
    } else {
      // Normal draw (inside, fill, or un-resized)
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)
    }

    // 3. Watermarking
    if (settings.watermark?.active) {
      const wmType = settings.watermark.type || 'text'
      const opacity = settings.watermark.opacity || 0.7
      const position = (settings.watermark.position || 'bottom-right').toLowerCase().trim()

      ctx.save()
      ctx.globalAlpha = opacity

      // Helper to calculate X/Y coordinates based on position
      const getCoords = (pos, itemWidth, itemHeight, paddingX = 20, paddingY = 20) => {
        let x = targetWidth - itemWidth - paddingX
        let y = targetHeight - itemHeight - paddingY

        if (pos === 'top-left') {
          x = paddingX
          y = paddingY
        } else if (pos === 'top-right') {
          x = targetWidth - itemWidth - paddingX
          y = paddingY
        } else if (pos === 'bottom-left') {
          x = paddingX
          y = targetHeight - itemHeight - paddingY
        } else if (pos === 'center') {
          x = (targetWidth - itemWidth) / 2
          y = (targetHeight - itemHeight) / 2
        }

        return { x, y }
      }

      if (wmType === 'text' && settings.watermark.text) {
        const text = settings.watermark.text
        const fontSize = Math.floor(targetWidth * 0.04) || 24

        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.fillStyle = '#ffffff'
        
        // Shadow effect for text readability (matches SVG text-shadow)
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
        ctx.shadowBlur = 6
        ctx.shadowOffsetX = 3
        ctx.shadowOffsetY = 3

        const textMetrics = ctx.measureText(text)
        const textWidth = textMetrics.width
        const textHeight = fontSize // Approx height

        // Account for canvas baseline aligning at bottom
        let { x, y } = getCoords(position, textWidth, textHeight)
        y += textHeight // align text ascent

        ctx.fillText(text, x, y)
      } else if (wmType === 'image' && settings.watermark.logoFile) {
        // logoFile is a File object uploaded client-side
        const logoUrl = URL.createObjectURL(settings.watermark.logoFile)
        try {
          const logoImg = await loadImage(logoUrl)
          
          // Logo size is roughly 20% of main image width
          const targetLogoWidth = Math.round(targetWidth * 0.20)
          const targetLogoHeight = (logoImg.height / logoImg.width) * targetLogoWidth

          const { x, y } = getCoords(position, targetLogoWidth, targetLogoHeight)
          ctx.drawImage(logoImg, x, y, targetLogoWidth, targetLogoHeight)
        } catch (err) {
          console.error("Failed to load watermark logo:", err)
        } finally {
          URL.revokeObjectURL(logoUrl)
        }
      }

      ctx.restore()
    }

    // 4. Output format & Quality Export
    const quality = (parseInt(settings.convert?.quality) || 90) / 100
    
    let processedBlob = await canvasToBlob(canvas, format, quality)

    // *** CRITICAL: Release canvas bitmap memory ***
    // A 4000x4000 canvas = ~64MB of GPU/heap memory.
    // Without explicit release, 1000 images = 64GB of unreleased memory.
    canvas.width = 0
    canvas.height = 0
    ctx = null
    canvas = null
    img = null

    // 5. Lossless Browser Compression (if enabled)
    if (settings.compress?.active) {
      if (onProgress) onProgress("Optimizing compression...")
      try {
        const compressionFile = new File([processedBlob], originalName, { type: processedBlob.type })
        const compressedFile = await imageCompression(compressionFile, {
          maxSizeMB: settings.compress.maxSizeMB || 1,
          maxWidthOrHeight: Math.max(targetWidth, targetHeight),
          useWebWorker: true
        })
        processedBlob = compressedFile
      } catch (err) {
        console.error("Compression failed, using uncompressed output:", err)
      }
    }

    return processedBlob
  },

  /**
   * Process a batch of images and generate a downloadable ZIP archive.
   * Legacy method — used when batch size is small (≤ chunk threshold).
   */
  async processBatch(files, settings, onProgress) {
    const zip = new JSZip()
    const errors = []
    let processedCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      try {
        if (onProgress) {
          onProgress({
            current: i + 1,
            total: files.length,
            percentage: Math.round(((i + 1) / files.length) * 100),
            statusText: `Processing image ${i + 1} of ${files.length}...`
          })
        }

        const processedBlob = await this.processSingleImage(file, settings, (statusText) => {
          if (onProgress) {
            onProgress({
              current: i + 1,
              total: files.length,
              percentage: Math.round((i / files.length) * 100),
              statusText: `[Image ${i + 1}/${files.length}] ${statusText}`
            })
          }
        })

        // Naming Logic
        let outputFilename
        const format = settings.convert?.active ? (settings.convert.format || 'jpg') : 'jpg'
        
        if (settings.rename?.active && settings.rename?.baseName) {
          const seq = (parseInt(settings.rename.startSeq) || 1) + i
          outputFilename = `${settings.rename.baseName}-${seq}.${format}`
        } else {
          // Original Name + Suffix
          const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || 'image'
          const suffix = settings.suffix || ''
          outputFilename = `${nameWithoutExt}${suffix}.${format}`
        }

        zip.file(outputFilename, processedBlob)
        processedCount++

        // Yield to event loop periodically to keep UI responsive
        if (i % 5 === 0) await yieldToEventLoop(10)
      } catch (err) {
        console.error(`Error processing file ${file.name}:`, err)
        errors.push({ file: file.name, error: err.message })
      }
    }

    if (processedCount === 0) {
      throw new Error(errors[0]?.error || "No images were successfully processed.")
    }

    if (onProgress) {
      onProgress({
        current: files.length,
        total: files.length,
        percentage: 100,
        statusText: "Packaging ZIP archive..."
      })
    }

    const zipBlob = await zip.generateAsync({ type: 'blob' })
    return { zipBlob, processedCount, errors }
  },

  /**
   * CRASH-PROOF: Process a large batch of images in memory-safe chunks.
   * Each chunk produces its own ZIP, which is immediately downloaded and released from memory.
   * This keeps heap memory bounded regardless of total batch size.
   *
   * @param {File[]} files - Array of image files to process
   * @param {Object} settings - Processing settings
   * @param {Object} callbacks - { onProgress, onChunkReady, chunkSize }
   * @returns {{ totalProcessed: number, errors: Array, totalChunks: number }}
   */
  async processChunkedBatch(files, settings, { onProgress, onChunkReady, chunkSize = 50 }) {
    const totalFiles = files.length
    const totalChunks = Math.ceil(totalFiles / chunkSize)
    let totalProcessed = 0
    const totalErrors = []

    for (let chunkIdx = 0; chunkIdx < totalChunks; chunkIdx++) {
      const chunkStart = chunkIdx * chunkSize
      const chunkEnd = Math.min(chunkStart + chunkSize, totalFiles)
      const chunkFiles = files.slice(chunkStart, chunkEnd)

      let zip = new JSZip()
      let chunkProcessed = 0

      for (let i = 0; i < chunkFiles.length; i++) {
        const globalIdx = chunkStart + i
        const file = chunkFiles[i]

        try {
          if (onProgress) {
            onProgress({
              current: globalIdx + 1,
              total: totalFiles,
              percentage: Math.round(((globalIdx + 1) / totalFiles) * 100),
              statusText: `[Chunk ${chunkIdx + 1}/${totalChunks}] Processing image ${globalIdx + 1} of ${totalFiles}...`,
              chunk: chunkIdx + 1,
              totalChunks
            })
          }

          const processedBlob = await this.processSingleImage(file, settings, (statusText) => {
            if (onProgress) {
              onProgress({
                current: globalIdx + 1,
                total: totalFiles,
                percentage: Math.round((globalIdx / totalFiles) * 100),
                statusText: `[Chunk ${chunkIdx + 1}/${totalChunks}] [Image ${globalIdx + 1}/${totalFiles}] ${statusText}`,
                chunk: chunkIdx + 1,
                totalChunks
              })
            }
          })

          // Naming Logic (preserves global sequential numbering)
          let outputFilename
          const format = settings.convert?.active ? (settings.convert.format || 'jpg') : 'jpg'

          if (settings.rename?.active && settings.rename?.baseName) {
            const seq = (parseInt(settings.rename.startSeq) || 1) + globalIdx
            outputFilename = `${settings.rename.baseName}-${seq}.${format}`
          } else {
            const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.')) || 'image'
            const suffix = settings.suffix || ''
            outputFilename = `${nameWithoutExt}${suffix}.${format}`
          }

          zip.file(outputFilename, processedBlob)
          chunkProcessed++
          totalProcessed++

          // Yield to event loop every 3 images to keep UI responsive
          if (i % 3 === 0) await yieldToEventLoop(10)
        } catch (err) {
          console.error(`Error processing file ${file.name}:`, err)
          totalErrors.push({ file: file.name, error: err.message })
        }
      }

      // Generate this chunk's ZIP and deliver it immediately
      if (chunkProcessed > 0) {
        if (onProgress) {
          onProgress({
            current: chunkEnd,
            total: totalFiles,
            percentage: Math.round((chunkEnd / totalFiles) * 100),
            statusText: `Packaging ZIP${totalChunks > 1 ? ` (part ${chunkIdx + 1}/${totalChunks})` : ''}...`,
            chunk: chunkIdx + 1,
            totalChunks
          })
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' })

        // Deliver the ZIP chunk for immediate download
        if (onChunkReady) {
          onChunkReady(zipBlob, chunkIdx, totalChunks)
        }

        // Save progress for crash recovery
        try {
          localStorage.setItem('optisnap_batch_progress', JSON.stringify({
            completedChunks: chunkIdx + 1,
            totalChunks,
            totalProcessed,
            timestamp: Date.now()
          }))
        } catch (e) { /* localStorage may be full, non-critical */ }
      }

      // *** CRITICAL: Release this chunk's ZIP memory before starting next chunk ***
      zip = null

      // Yield generously between chunks so GC can reclaim memory
      if (chunkIdx < totalChunks - 1) {
        await yieldToEventLoop(200)
      }
    }

    // Clear progress on successful completion
    try {
      localStorage.removeItem('optisnap_batch_progress')
    } catch (e) {}

    return { totalProcessed, errors: totalErrors, totalChunks }
  }
}
