import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import icon from '../assets/icon.png'
import heroShowcase from '../assets/hero-showcase.png'
import {
  ArrowRight,
  Sparkles,
  Scaling,
  Stamp,
  FilePenLine,
  Minimize2,
  Lock,
  Check,
  ShieldCheck,
  Cpu,
  Zap,
  Moon,
  Sun,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  ShoppingBag,
  Star,
  EyeOff,
  TrendingUp,
  Gift
} from 'lucide-react'

const ROW1_REVIEWS = [
  {
    name: "Sarah K.",
    role: "Etsy Handmade Jewelry Owner",
    text: "Saved me over 10 hours a week on product listing preparation. The secure AI background removal is faster than Photoshop, and the bulk renaming takes seconds."
  },
  {
    name: "Marcus D.",
    role: "Shopify Apparel Brand Founder",
    text: "Decreased our product page load speeds by 42% after converting catalog listings to WebP. Our search visibility and conversion rates went up immediately."
  },
  {
    name: "Elena V.",
    role: "Digital Marketing Agency Director",
    text: "Watermarking hundreds of catalog images was a nightmare. OptiSnap does background removal, watermarks, resizing, and zip packing in one run. Unbelievable tool."
  },
  {
    name: "David L.",
    role: "Amazon FBA Power Seller",
    text: "Amazon requires strict pure white backgrounds and exact 1600px square sizing. OptiSnap automates this perfectly for entire batch folder uploads."
  },
  {
    name: "Aiko M.",
    role: "Etsy Vintage Collective Shop",
    text: "I love that it keeps my original photo quality high while resizing. The padding blur background looks extremely high-end on our store catalog."
  },
  {
    name: "Carlos R.",
    role: "eBay Electronics Merchant",
    text: "Bulk renaming with product serial numbers and sequential indexing has saved my team countless copy-paste hours. A must-have tool for high volume listings."
  }
];

const ROW2_REVIEWS = [
  {
    name: "Sophie T.",
    role: "WooCommerce Boutique Designer",
    text: "Being able to save custom presets for our main collection styles and load them instantly saves so much brainpower. Best investment this year."
  },
  {
    name: "Jordan B.",
    role: "Poshmark Ambassador",
    text: "Preparing square crop images for Poshmark has never been this simple. I drag 50 photos, click process, and get them back in less than a minute."
  },
  {
    name: "Liam W.",
    role: "Sneaker Reseller & Store Owner",
    text: "The transparency warning saved me from exporting corrupt transparency formats. The WebP compression is lossless and clean."
  },
  {
    name: "Chloe N.",
    role: "Eco-friendly Brand Manager",
    text: "Our team works across different operating systems. Having a zero-install, secure web engine means we can process everything directly without overhead."
  },
  {
    name: "Ravi S.",
    role: "E-commerce SEO Consultant",
    text: "Proper image sizing and target naming is key for Google Image SEO. OptiSnap solves both of these bottlenecks in one single click."
  },
  {
    name: "Nina G.",
    role: "Handmade Pottery Artist",
    text: "I'm not tech-savvy, but the interface is so beautiful and easy to use. No confusing options, just drag, drop, and export."
  }
];

const SIMULATED_PURCHASES = [
  { name: "John D.", location: "New York, USA", plan: "Pro Lifetime Deal", time: "1 day ago" },
  { name: "Sarah M.", location: "London, UK", plan: "Professional Monthly Plan", time: "18 hours ago" },
  { name: "Arnaud L.", location: "Paris, France", plan: "Starter Lifetime Deal", time: "1 day ago" },
  { name: "Kenji T.", location: "Tokyo, Japan", plan: "Starter Monthly Plan", time: "14 hours ago" },
  { name: "David S.", location: "Berlin, Germany", plan: "Pro Lifetime Deal", time: "2 days ago" },
  { name: "Maria G.", location: "Madrid, Spain", plan: "Starter Lifetime Deal", time: "15 hours ago" },
  { name: "Chloe W.", location: "Sydney, Australia", plan: "Professional Monthly Plan", time: "22 hours ago" },
  { name: "Emma B.", location: "Toronto, Canada", plan: "Pro Lifetime Deal", time: "1 day ago" },
  { name: "Liam O.", location: "Dublin, Ireland", plan: "Starter Lifetime Deal", time: "12 hours ago" },
  { name: "Sophia K.", location: "Amsterdam, Netherlands", plan: "Professional Monthly Plan", time: "19 hours ago" },
  { name: "Marcus L.", location: "Stockholm, Sweden", plan: "Pro Lifetime Deal", time: "2 days ago" },
  { name: "Elena P.", location: "Rome, Italy", plan: "Starter Monthly Plan", time: "16 hours ago" },
  { name: "Lucas M.", location: "São Paulo, Brazil", plan: "Pro Lifetime Deal", time: "1 day ago" },
  { name: "Oliver H.", location: "London, UK", plan: "Starter Lifetime Deal", time: "21 hours ago" },
  { name: "Mia K.", location: "Munich, Germany", plan: "Professional Monthly Plan", time: "13 hours ago" },
  { name: "Ryan P.", location: "San Francisco, USA", plan: "Pro Lifetime Deal", time: "1 day ago" }
];

export default function LandingPage({ onLaunchApp, session, theme, toggleTheme }) {
  const [activeFaq, setActiveFaq] = useState(null)
  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' or 'lifetime'
  const [notification, setNotification] = useState(null)
  const [showNotification, setShowNotification] = useState(false)

  // FOMO states
  const [timeLeft, setTimeLeft] = useState('')
  const [stats, setStats] = useState({
    images: 8743,
    activeUsers: 18,
    hoursSaved: 312
  })
  const [weeklyImages, setWeeklyImages] = useState(100)

  // Spin the Wheel states & hooks
  const [showSpinWheel, setShowSpinWheel] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [hasSpun, setHasSpun] = useState(() => localStorage.getItem('optisnap_has_spun') === 'true')
  const [wonDiscount, setWonDiscount] = useState(() => {
    const savedCode = localStorage.getItem('optisnap_won_code')
    return savedCode ? '25%' : null
  })
  const [wheelTimerLeft, setWheelTimerLeft] = useState(() => {
    const savedTime = localStorage.getItem('optisnap_won_timer')
    if (savedTime) {
      const remaining = Math.floor((parseInt(savedTime) - Date.now()) / 1000)
      return remaining > 0 ? remaining : 0
    }
    return 900 // 15 minutes default
  })

  // Expiration countdown for spin wheel code
  useEffect(() => {
    if (!wonDiscount || wheelTimerLeft <= 0) return

    const interval = setInterval(() => {
      setWheelTimerLeft(prev => {
        const next = prev - 1
        if (next <= 0) {
          localStorage.removeItem('optisnap_won_code')
          localStorage.removeItem('optisnap_won_timer')
        }
        return next
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [wonDiscount, wheelTimerLeft])

  const formatWheelTime = () => {
    const mins = Math.floor(wheelTimerLeft / 60)
    const secs = wheelTimerLeft % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const spinTheWheel = () => {
    if (isSpinning || hasSpun) return

    setIsSpinning(true)
    const baseRotation = 5 * 360 // 5 full spins
    const targetAngleOffset = 90 // Land on 25% Off
    const randomOffset = Math.floor(Math.random() * 40) - 20
    const finalRotation = baseRotation + targetAngleOffset + randomOffset

    setWheelRotation(finalRotation)

    setTimeout(() => {
      setIsSpinning(false)
      setHasSpun(true)
      setWonDiscount('25%')
      
      const expiry = Date.now() + 15 * 60 * 1000 // 15 minutes
      localStorage.setItem('optisnap_has_spun', 'true')
      localStorage.setItem('optisnap_won_code', 'MYLUCKY25')
      localStorage.setItem('optisnap_won_timer', expiry.toString())
      setWheelTimerLeft(900)
      
      toast.success("Congratulations! You won 25% Off Pro Lifetime! 🎉")
    }, 4000)
  }

  // Exit Intent state & hooks
  const [showExitIntent, setShowExitIntent] = useState(false)
  const [exitIntentTriggered, setExitIntentTriggered] = useState(false)
  const [exitTimeLeft, setExitTimeLeft] = useState(600) // 10 minutes

  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY < 5 && !exitIntentTriggered) {
        setShowExitIntent(true)
        setExitIntentTriggered(true)
        sessionStorage.setItem('optisnap_exit_intent_shown', 'true')
      }
    }

    const alreadyShown = sessionStorage.getItem('optisnap_exit_intent_shown')
    if (alreadyShown) {
      setExitIntentTriggered(true)
    } else {
      document.addEventListener('mouseleave', handleMouseLeave)
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [exitIntentTriggered])

  useEffect(() => {
    if (!showExitIntent || exitTimeLeft <= 0) return

    const interval = setInterval(() => {
      setExitTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [showExitIntent, exitTimeLeft])

  const formatExitTime = () => {
    const mins = Math.floor(exitTimeLeft / 60)
    const secs = exitTimeLeft % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // Countdown timer hook (Option 2)
  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date()
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)
      
      let diff = endOfDay.getTime() - now.getTime()
      if (diff < 0) {
        diff = 24 * 60 * 60 * 1000 - (now.getTime() % (24 * 60 * 60 * 1000))
      }
      
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)
      const seconds = Math.floor((diff / 1000) % 60)
      
      const formatNum = (n) => String(n).padStart(2, '0')
      return `${formatNum(hours)}h : ${formatNum(minutes)}m : ${formatNum(seconds)}s`
    }

    setTimeLeft(calculateTimeLeft())
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Live stats ticking hook (Option 3)
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => {
        const imgInc = Math.floor(Math.random() * 2) + 1
        const userDiff = Math.floor(Math.random() * 3) - 1
        const nextUsers = Math.min(Math.max(prev.activeUsers + userDiff, 14), 28)
        const hoursInc = Math.random() > 0.85 ? 1 : 0
        
        return {
          images: prev.images + imgInc,
          activeUsers: nextUsers,
          hoursSaved: prev.hoursSaved + hoursInc
        }
      })
    }, 2500)

    return () => clearInterval(interval)
  }, [])

  // Social Proof popup loop
  useEffect(() => {
    const showRandomNotification = () => {
      const randomIdx = Math.floor(Math.random() * SIMULATED_PURCHASES.length)
      setNotification(SIMULATED_PURCHASES[randomIdx])
      setShowNotification(true)
      
      // Auto-hide after 6 seconds
      setTimeout(() => {
        setShowNotification(false)
      }, 6000)
    }

    // First popup after 8 seconds
    const firstTimeout = setTimeout(() => {
      showRandomNotification()
    }, 8000)

    // Subsequent popups every 25 seconds
    const interval = setInterval(() => {
      showRandomNotification()
    }, 25000)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [])

  const faqs = [
    {
      q: "Does this upload my photos to your servers?",
      a: "No. OptiSnap is designed with a privacy-first secure pipeline. All image resizing, background removal, and compression are processed instantly on a secure, isolated sandboxed layer. Your raw photos are kept 100% private and never leave your environment."
    },
    {
      q: "What makes this better than standard tools?",
      a: "OptiSnap combines multiple workflows—background removal, canvas crop padding, watermarking, file renaming, and compression—into a single run. Instead of using 4 different tools, you do everything in 3 seconds."
    },
    {
      q: "How does the lifetime deal work?",
      a: "You pay once and own it forever. There are no recurring monthly subscription costs or limits on the number of images you can process."
    },
    {
      q: "Do I need to install any desktop applications?",
      a: "No. OptiSnap is a cloud-ready web application accessible instantly through standard web browsers (Chrome, Edge, Safari, Firefox). There is no setup, installation, or administrative rights required."
    },
    {
      q: "What image output formats are supported?",
      a: "You can convert and export your images to JPG, PNG, WEBP, and AVIF container formats with customizable quality levels."
    }
  ]

  const features = [
    {
      icon: <Sparkles size={22} className="text-pro" />,
      title: "AI Background Removal",
      desc: "Remove distracting backgrounds in seconds using optimized AI models."
    },
    {
      icon: <TrendingUp size={22} className="text-pro" />,
      title: "Neural AI Upscaler",
      desc: "Double or quadruple image resolution locally using neural networks to eliminate blur and artifacts."
    },
    {
      icon: <Scaling size={22} className="text-pro" />,
      title: "Smart Crop & Auto-Center",
      desc: "Automatically crop margins and center products to meet Amazon and Google compliance standard specs."
    },
    {
      icon: <Minimize2 size={22} className="text-pro" />,
      title: "Lossless Compression",
      desc: "Shave off up to 85% of image file weight with zero visual quality loss for faster site loading."
    },
    {
      icon: <FilePenLine size={22} className="text-pro" />,
      title: "Bulk SEO Renaming",
      desc: "Rename entire batches sequentially using target product keywords to increase organic search rankings."
    },
    {
      icon: <Stamp size={22} className="text-pro" />,
      title: "Logo & Text Watermarks",
      desc: "Add translucent branding overlays to prevent content theft. Features custom position and opacity controls."
    },
    {
      icon: <Lock size={22} className="text-pro" />,
      title: "100% Data Protection",
      desc: "Isolated sandbox execution means complete data privacy. Perfect for proprietary design catalogs."
    },
    {
      icon: <EyeOff size={22} className="text-pro" />,
      title: "EXIF Metadata Stripper",
      desc: "Clean product images of camera details, GPS parameters, and personal identifier tags in bulk."
    }
  ]

  const pricingTiers = [
    {
      name: billingCycle === 'monthly' ? "Starter Plan" : "Starter Lifetime",
      price: billingCycle === 'monthly' ? "$9" : "$29",
      originalPrice: billingCycle === 'monthly' ? null : "$49",
      period: billingCycle === 'monthly' ? "month" : "one-time payment",
      desc: "Perfect for independent sellers and creators starting out.",
      features: [
        "Up to 50 images per batch run",
        "Unlimited daily batches",
        "Premium AI Background Removal (Local ML)",
        "Real-ESRGAN 2x AI Upscaler (Local ML)",
        "Smart Crop & Auto-Centering (Local ML)",
        "No Forced Watermarks",
        "E-commerce presets (Etsy, Shopify, Amazon)",
        "Blurred padding options",
        "Lossless compression & Convert",
        "Text and logo watermarking",
        "Keyword sequential renaming",
        "EXIF Metadata Stripper (Privacy / SEO)",
        "Lifetime platform updates",
        "Standard support"
      ],
      isPopular: false,
      cta: billingCycle === 'monthly' ? "Subscribe Starter" : "Get Starter Access"
    },
    {
      name: billingCycle === 'monthly' ? "Professional Plan" : "Professional Lifetime",
      price: billingCycle === 'monthly' ? "$19" : "$59",
      originalPrice: billingCycle === 'monthly' ? null : "$99",
      period: billingCycle === 'monthly' ? "month" : "one-time payment",
      desc: "Best for high-volume stores, power users, and agencies.",
      features: [
        "Unlimited batch sizes",
        "Unlimited daily batches",
        "Premium AI Background Removal (Local ML)",
        "Real-ESRGAN 2x & 4x AI Upscaler (Local ML)",
        "Smart Crop & Auto-Centering (Local ML)",
        "No Forced Watermarks",
        "All Starter features included",
        "Priority customer support",
        "Commercial usage license"
      ],
      isPopular: true,
      cta: billingCycle === 'monthly' ? "Subscribe Professional" : "Get Professional Access"
    }
  ]

  return (
    <div style={{
      height: '100vh',
      overflowY: 'auto',
      scrollBehavior: 'smooth',
      background: 'var(--bg-main)',
      color: 'var(--text-main)',
      transition: 'background 0.3s ease, color 0.3s ease'
    }}>
      {/* Time-Based Urgency Countdown Banner (Option 2) */}
      <div style={{
        background: 'linear-gradient(90deg, #8b5cf6 0%, #d946ef 100%)',
        color: 'white',
        padding: '10px 20px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: 600,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '12px',
        flexWrap: 'wrap',
        boxShadow: '0 4px 12px rgba(139, 92, 246, 0.15)',
        position: 'relative',
        zIndex: 101
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={14} />
          Special Launch Promotion: Lifetime Deals increase in price in:
        </span>
        <span style={{
          background: 'rgba(0, 0, 0, 0.2)',
          padding: '4px 12px',
          borderRadius: '20px',
          fontFamily: 'monospace',
          fontSize: '14px',
          letterSpacing: '0.5px',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)'
        }}>
          {timeLeft}
        </span>
        <a href="#pricing" style={{
          color: 'white',
          textDecoration: 'underline',
          fontWeight: 700,
          marginLeft: '4px',
          cursor: 'pointer'
        }}>
          Lock In Lifetime Access &rarr;
        </a>
      </div>

      {/* Sticky Navigation Header */}
      <header style={{
        position: 'sticky',
        top: 0,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-color)',
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 40px',
        transition: 'background 0.3s, border-color 0.3s'
      }} className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '18px' }}>
          <img src={icon} alt="OptiSnap Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
          <span>OptiSnap</span>
        </div>

        <nav style={{
          display: 'flex',
          gap: '30px',
          alignItems: 'center',
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)'
        }}>
          <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Features</a>
          <a href="#how-it-works" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>How it Works</a>
          <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>Pricing</a>
          <a href="#faq" style={{ color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>FAQ</a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {!session && (
            <button
              onClick={() => onLaunchApp('settings')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-main)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '8px 16px',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '0.8'}
              onMouseLeave={(e) => e.target.style.opacity = '1'}
            >
              Log In / Sign Up
            </button>
          )}
          
          <button className="btn-primary" onClick={() => onLaunchApp('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {session ? "Open Workspace" : "Launch Workspace"} <ArrowRight size={14} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section" style={{
        padding: '100px 40px 60px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Soft Decorative Glow */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '500px',
          height: '250px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
          zIndex: -1,
          borderRadius: '50%'
        }}></div>

        <span style={{
          background: 'rgba(139, 92, 246, 0.1)',
          color: 'var(--primary)',
          padding: '6px 16px',
          borderRadius: '30px',
          fontSize: '13px',
          fontWeight: 600,
          border: '1px solid rgba(139, 92, 246, 0.2)'
        }}>
          ⚡ Trusted by 120+ Sellers in Early Access
        </span>

        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          lineHeight: '1.2',
          letterSpacing: '-1px',
          margin: '24px 0 16px 0',
          color: 'var(--text-main)'
        }}>
          200 Product Photos. 3 Seconds. Zero Uploads.
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 32px auto',
          lineHeight: '1.6'
        }}>
          Stop spending 4 hours in Photoshop per listing batch. OptiSnap removes backgrounds, compresses to 85% smaller files, auto-crops to Amazon specs, and watermarks—all locally, in one click. Built for Etsy, Shopify & Amazon sellers who value speed and privacy.
        </p>

        <div className="hero-buttons" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button className="btn-primary" onClick={() => onLaunchApp('dashboard')} style={{ padding: '16px 32px', fontSize: '15px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            Launch Workspace Free <ArrowRight size={16} />
          </button>
          <a href="#pricing" style={{
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            padding: '16px 32px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 500,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'all 0.2s'
          }} className="btn-secondary-custom">
            Compare Lifetime Deals
          </a>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px' }}>
          No installation • No cloud uploads • Works in Chrome, Edge, Safari • Your photos never leave your device
        </p>
      </section>

      {/* Hero Mockup Showcase */}
      <section className="mockup-section" style={{ padding: '0 40px 60px 40px', maxWidth: '1150px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.08)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Mock Browser Header Bar */}
          <div style={{
            height: '40px',
            background: 'var(--bg-main)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            position: 'relative',
            flexShrink: 0
          }}>
            {/* Window control dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }}></span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }}></span>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }}></span>
            </div>
            {/* Centered URL Address */}
            <div style={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              padding: '4px 18px',
              borderRadius: '6px',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'monospace',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <span style={{ color: '#27c93f', fontSize: '8px' }}>●</span> app.optisnap.app/workspace
            </div>
          </div>

          {/* Browser Workspace Content */}
          <div style={{ background: '#ffffff', width: '100%', position: 'relative' }}>
            <img 
              src={heroShowcase} 
              alt="OptiSnap Workflow Showcase" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
              onError={(e) => {
                // If the file is not placed in assets folder yet, display a styled placeholder
                e.target.style.display = 'none';
                const placeholder = document.getElementById('hero-img-placeholder');
                if (placeholder) placeholder.style.display = 'flex';
              }}
            />
            {/* Fallback Beautiful Placeholder */}
            <div 
              id="hero-img-placeholder"
              style={{
                display: 'none',
                width: '100%',
                height: '400px',
                background: 'linear-gradient(135deg, rgba(134, 77, 226, 0.08) 0%, rgba(134, 77, 226, 0.01) 100%)',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '12px',
                padding: '24px',
                boxSizing: 'border-box'
              }}
            >
              <Sparkles size={40} style={{ color: 'var(--primary)' }} />
              <h4 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: 'var(--text-main)' }}>Workflow Showcase Mockup</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: 0, maxWidth: '420px', lineHeight: 1.5 }}>
                Save your workflow screenshot as <code style={{ background: 'rgba(0,0,0,0.05)', padding: '2px 4px', borderRadius: '3px' }}>src/assets/hero-showcase.png</code> to display it in this mock browser!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Keyframe Styles for Pulse Animation & Mobile Responsiveness */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-green {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .pulse-dot {
          animation: pulse-green 2.2s infinite ease-in-out;
        }
        
        /* Mobile & Tablet Responsiveness Overrides */
        @media (max-width: 768px) {
          .navbar-container {
            padding: 12px 16px !important;
          }
          .navbar-container nav {
            display: none !important; /* Hide navigation links on mobile */
          }
          
          .hero-section {
            padding: 40px 16px 30px 16px !important;
          }
          .hero-section h1 {
            font-size: 28px !important;
            line-height: 1.3 !important;
            margin: 16px 0 12px 0 !important;
          }
          .hero-section p {
            font-size: 14px !important;
            margin-bottom: 24px !important;
          }
          .hero-buttons {
            flex-direction: column !important;
            gap: 12px !important;
            align-items: stretch !important;
          }
          .hero-buttons a, .hero-buttons button {
            padding: 14px 20px !important;
            font-size: 14px !important;
            justify-content: center !important;
            width: 100% !important;
            box-sizing: border-box !important;
          }
          
          .mockup-section {
            padding: 0 16px 30px 16px !important;
          }
          #hero-img-placeholder {
            height: 200px !important;
          }
          
          .stats-section {
            padding: 10px 16px 30px 16px !important;
          }
          .stats-section > div {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
            padding: 20px 16px !important;
          }
          .stats-divider {
            display: none !important;
          }
          
          .features-section {
            padding: 40px 16px !important;
          }
          .features-section h2 {
            font-size: 22px !important;
          }
          .features-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
          
          .how-it-works-section {
            padding: 40px 16px !important;
          }
          .how-it-works-section h2 {
            font-size: 22px !important;
          }
          .steps-container {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          .testimonials-section {
            padding: 40px 0 !important;
          }
          .testimonials-section h2 {
            font-size: 22px !important;
          }
          
          .roi-section {
            padding: 40px 16px !important;
          }
          .roi-section h2 {
            font-size: 20px !important;
          }
          .roi-section > div {
            padding: 24px 16px !important;
          }
          .calc-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          .pricing-section {
            padding: 40px 16px !important;
          }
          .pricing-section h2 {
            font-size: 22px !important;
          }
          .pricing-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          .pricing-grid > div {
            padding: 24px 16px !important;
          }
          
          .faq-section {
            padding: 40px 16px !important;
          }
          .faq-section h2 {
            font-size: 22px !important;
          }
          
          .bottom-cta-section {
            padding: 40px 16px !important;
          }
          .bottom-cta-section > div {
            padding: 40px 16px !important;
            border-radius: 16px !important;
          }
          .bottom-cta-section h2 {
            font-size: 24px !important;
            line-height: 1.3 !important;
          }
          .bottom-cta-section p {
            font-size: 14px !important;
            margin-bottom: 24px !important;
          }
          
          .footer-section {
            padding: 40px 16px 20px 16px !important;
          }
          .footer-links-grid {
            grid-template-columns: 1fr !important;
            gap: 30px !important;
            padding-bottom: 40px !important;
          }
          .footer-bottom {
            flex-direction: column !important;
            gap: 12px !important;
            text-align: center !important;
            margin-top: 20px !important;
          }
          
          .won-discount-banner {
            left: 16px !important;
            right: 16px !important;
            bottom: 16px !important;
            justify-content: space-between !important;
            padding: 12px 16px !important;
          }
          
          .floating-gift-trigger {
            bottom: 80px !important;
            right: 16px !important;
          }
          
          .modal-card {
            padding: 24px 16px !important;
            border-radius: 16px !important;
          }
          .wheel-container {
            width: 220px !important;
            height: 220px !important;
          }
        }
      `}} />

      {/* Live Stats / Processing Milestones (Option 3) */}
      <section className="stats-section" style={{
        padding: '20px 40px 60px 40px',
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          padding: '24px 30px',
          boxShadow: 'var(--shadow-sm)',
          backdropFilter: 'blur(8px)'
        }}>
          {/* Stat Item 1: Images Optimized */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Images Optimized in Beta
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
              {stats.images.toLocaleString()}
            </span>
            <span style={{ fontSize: '10.5px', color: '#22c55e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
              Processing live on-device
            </span>
          </div>

          {/* Vertical Divider */}
          <div className="stats-divider" style={{ width: '1px', background: 'var(--border-color)', height: '50px', alignSelf: 'center' }}></div>

          {/* Stat Item 2: Active Sellers */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Early Access Sellers
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              {stats.activeUsers}
              <span className="pulse-dot" style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                display: 'inline-block'
              }}></span>
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
              Processing batches right now
            </span>
          </div>

          {/* Vertical Divider */}
          <div className="stats-divider" style={{ width: '1px', background: 'var(--border-color)', height: '50px', alignSelf: 'center' }}></div>

          {/* Stat Item 3: Time Saved */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Photoshop Hours Eliminated
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'monospace' }}>
              {stats.hoursSaved.toLocaleString()}h
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
              That’s {Math.round(stats.hoursSaved / 8)} working days recovered
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="features-section" style={{
        padding: '80px 40px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        transition: 'background 0.3s'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '12px' }}>8 Tools That Replace Photoshop. For $59. Once.</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Every feature below runs entirely on your device—no cloud, no upload limits, no monthly fees eating into your margins.
            </p>
          </div>

          <div className="features-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '30px'
          }}>
            {features.map((feat, idx) => (
              <div key={idx} style={{
                padding: '24px',
                borderRadius: '12px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{
                  background: 'var(--bg-card)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {feat.icon}
                </div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>{feat.title}</h4>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="how-it-works-section" style={{
        padding: '80px 0',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        width: '100%',
        transition: 'background 0.3s'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '12px' }}>Drag. Click. Download. Under 10 Seconds.</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Replace your 45-minute Photoshop routine with a 3-step workflow that handles 200+ images at once.</p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '30px'
          }} className="steps-container">
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '18px',
                margin: '0 auto 16px auto',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>1</div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>Select Product Files</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Drag and drop multiple raw product images directly into the browser dashboard.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '18px',
                margin: '0 auto 16px auto',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>2</div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>Apply Listing Rules</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Activate AI background removal, select crop dimensions, append watermarks, and set keyword formats.
              </p>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'rgba(139, 92, 246, 0.1)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '18px',
                margin: '0 auto 16px auto',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>3</div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: 600 }}>Download Compressed ZIP</h4>
              <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                Click process to trigger multi-threaded canvas builders and receive your optimized package in a single ZIP.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section" style={{
        padding: '80px 0',
        width: '100%',
        overflowX: 'hidden',
        position: 'relative'
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes scrollLeft {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes scrollRight {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .marquee-track-left {
            display: flex;
            gap: 24px;
            width: max-content;
            animation: scrollLeft 40s linear infinite;
          }
          .marquee-track-right {
            display: flex;
            gap: 24px;
            width: max-content;
            animation: scrollRight 40s linear infinite;
          }
          .marquee-track-left:hover,
          .marquee-track-right:hover {
            animation-play-state: paused;
          }
        `}} />

        <div style={{ textAlign: 'center', marginBottom: '50px', padding: '0 40px' }}>
          <h2 style={{ marginBottom: '12px' }}>Why 120+ Sellers Ditched Photoshop This Month</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Real feedback from early access store owners and catalog managers.</p>
        </div>

        <div style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflow: 'hidden',
          width: '100%',
          padding: '10px 0'
        }}>
          {/* Edge Gradient Fades */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '150px',
            height: '100%',
            background: 'linear-gradient(to right, var(--bg-main) 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '150px',
            height: '100%',
            background: 'linear-gradient(to left, var(--bg-main) 0%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}></div>

          {/* Row 1 (Scrolling Left) */}
          <div className="marquee-track-left">
            {[...ROW1_REVIEWS, ...ROW1_REVIEWS].map((rev, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-card)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                width: '320px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                whiteSpace: 'normal',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="var(--primary)" color="var(--primary)" />
                  ))}
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)', margin: 0, fontStyle: 'italic' }}>
                  "{rev.text}"
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{rev.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{rev.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2 (Scrolling Right) */}
          <div className="marquee-track-right">
            {[...ROW2_REVIEWS, ...ROW2_REVIEWS].map((rev, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-card)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)',
                width: '320px',
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
                whiteSpace: 'normal',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={15} fill="var(--primary)" color="var(--primary)" />
                  ))}
                </div>
                <p style={{ fontSize: '13px', lineHeight: '1.6', color: 'var(--text-main)', margin: 0, fontStyle: 'italic' }}>
                  "{rev.text}"
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'auto', paddingTop: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{rev.name}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{rev.role}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Loss Aversion / Time-Saved ROI Calculator (Option 4) */}
      <section className="roi-section" style={{
        padding: '60px 40px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center'
      }}>
        {/* Style block for calculator responsiveness */}
        <style dangerouslySetInnerHTML={{__html: `
          @media (max-width: 768px) {
            .calc-grid {
              grid-template-columns: 1fr !important;
              gap: 24px !important;
            }
          }
        `}} />
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          padding: '40px',
          boxShadow: 'var(--shadow-md)',
          textAlign: 'left'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{
              background: 'rgba(134, 77, 226, 0.1)',
              color: 'var(--primary)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              ROI & Time Savings Calculator
            </span>
            <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '12px 0 8px 0' }}>You’re Bleeding $500+/mo on Manual Editing</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
              Slide to your weekly volume—see exactly how many hours and dollars you’re losing to Photoshop.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }} className="calc-grid">
            {/* Slider Input Block */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600, fontSize: '15px' }}>Weekly Product Images</span>
                <span style={{
                  color: 'var(--primary)',
                  fontWeight: 700,
                  fontSize: '18px',
                  background: 'rgba(134, 77, 226, 0.08)',
                  padding: '4px 14px',
                  borderRadius: '8px',
                  fontFamily: 'monospace'
                }}>
                  {weeklyImages} images
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={weeklyImages}
                onChange={(e) => setWeeklyImages(parseInt(e.target.value, 10))}
                style={{
                  width: '100%',
                  accentColor: 'var(--primary)',
                  cursor: 'pointer',
                  height: '6px',
                  borderRadius: '3px'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                <span>10 images</span>
                <span>250 images</span>
                <span>500+ images</span>
              </div>
            </div>

            {/* Calculations Output Block */}
            <div style={{
              background: 'var(--bg-main)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Manual Photoshop Workflow:</span>
                <span style={{ fontWeight: 600, color: '#ef4444', textDecoration: 'line-through' }}>
                  {Math.round(((weeklyImages * 3.5) / 60) * 10) / 10} hours / wk
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>OptiSnap Engine:</span>
                <span style={{ fontWeight: 700, color: '#22c55e' }}>
                  {Math.round(((weeklyImages * 2) / 60) * 10) / 10} mins / wk
                </span>
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }}></div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Your Monthly Return (ROI)
                </span>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '22px', fontWeight: 800, color: 'var(--primary)' }}>
                    {Math.round(((weeklyImages * 3.5) / 60) * 4)} hours saved
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e' }}>
                    Save ${Math.round(((weeklyImages * 3.5) / 60) * 4 * 25)}/mo
                  </span>
                </div>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontStyle: 'italic', marginTop: '4px' }}>
                  *Calculated at standard assistant rates of $25/hr.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Matrix (AppSumo Lifetime Deal) */}
      <section id="pricing" className="pricing-section" style={{
        padding: '80px 40px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        transition: 'background 0.3s'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span style={{
              background: billingCycle === 'monthly' ? 'rgba(134, 77, 226, 0.1)' : 'rgba(34, 197, 94, 0.1)',
              color: billingCycle === 'monthly' ? 'var(--primary)' : '#22c55e',
              padding: '6px 16px',
              borderRadius: '30px',
              fontSize: '12px',
              fontWeight: 600,
              border: billingCycle === 'monthly' ? '1px solid rgba(134, 77, 226, 0.2)' : '1px solid rgba(34, 197, 94, 0.2)',
              transition: 'all 0.3s ease',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              {billingCycle === 'monthly' ? 'Flexible Recurring Billing' : 'Limited AppSumo Launch Deal'}
            </span>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 700 }}>Pay Once. Own It Forever. No Monthly Drain.</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Launch pricing won’t last. Lock in lifetime access before it switches to subscription-only.</p>
            
            {/* Premium Billing Toggle Selector */}
            <div style={{
              display: 'inline-flex',
              background: 'var(--bg-main)',
              padding: '4px',
              borderRadius: '30px',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-sm)',
              position: 'relative',
              marginBottom: '20px'
            }}>
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                style={{
                  padding: '10px 28px',
                  borderRadius: '24px',
                  border: 'none',
                  background: billingCycle === 'monthly' ? 'var(--primary)' : 'transparent',
                  color: billingCycle === 'monthly' ? 'white' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                Monthly Plan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('lifetime')}
                style={{
                  padding: '10px 28px',
                  borderRadius: '24px',
                  border: 'none',
                  background: billingCycle === 'lifetime' ? 'var(--primary)' : 'transparent',
                  color: billingCycle === 'lifetime' ? 'white' : 'var(--text-secondary)',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Lifetime Deals
                <span style={{
                  fontSize: '9.5px',
                  background: billingCycle === 'lifetime' ? 'rgba(255, 255, 255, 0.25)' : 'rgba(34, 197, 94, 0.12)',
                  color: billingCycle === 'lifetime' ? 'white' : '#22c55e',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3px'
                }}>
                  Best Value
                </span>
              </button>
            </div>

            {/* Scarcity & Limited Seats Indicator (Option 1) */}
            {billingCycle === 'lifetime' && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.06)',
                border: '1px solid rgba(239, 68, 68, 0.15)',
                borderRadius: '12px',
                padding: '14px 20px',
                maxWidth: '550px',
                margin: '24px auto 0 auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                textAlign: 'left',
                boxShadow: '0 4px 15px rgba(239, 68, 68, 0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12.5px', fontWeight: 600 }}>
                  <span style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>
                    Early-Bird Launch: 87% of promo licenses claimed
                  </span>
                  <span style={{ color: 'var(--text-secondary)' }}>13 / 100 slots remaining</span>
                </div>
                {/* Progress Bar */}
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-main)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: '87%', height: '100%', background: 'linear-gradient(90deg, #ef4444 0%, #ec4899 100%)', borderRadius: '3px' }}></div>
                </div>
                <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
                  Once the remaining 13 slots are filled, prices will increase to standard $49 (Starter) and $99 (Pro) lifetime deal rates.
                </span>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '30px',
            marginTop: '20px'
          }} className="pricing-grid">
            {pricingTiers.map((tier, idx) => (
              <div key={idx} style={{
                background: 'var(--bg-main)',
                borderRadius: '16px',
                padding: '40px',
                border: tier.isPopular ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                boxShadow: tier.isPopular ? '0 10px 30px -10px rgba(134, 77, 226, 0.15)' : 'var(--shadow-sm)'
              }}>
                {tier.isPopular && (
                  <span style={{
                    position: 'absolute',
                    top: '-13px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '4px 14px',
                    borderRadius: '20px',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Highly Recommended
                  </span>
                )}

                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{tier.name}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', minHeight: '38px', lineHeight: 1.4 }}>{tier.desc}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '20px' }}>
                    <span style={{ fontSize: '38px', fontWeight: 800, color: 'var(--text-main)' }}>{tier.price}</span>
                    {tier.originalPrice && (
                      <span style={{ fontSize: '20px', textDecoration: 'line-through', opacity: 0.5, marginLeft: '4px', marginRight: '4px', fontWeight: 500 }}>
                        {tier.originalPrice}
                      </span>
                    )}
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ {tier.period}</span>
                  </div>

                  <div className="divider" style={{ margin: '20px 0' }}></div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 30px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {tier.features.map((feat, fIdx) => (
                      <li key={fIdx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13.5px', color: 'var(--text-main)' }}>
                        <Check size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  className={tier.isPopular ? 'btn-primary' : 'btn-secondary'}
                  style={{ width: '100%', padding: '14px', textAlign: 'center', fontWeight: 600, fontSize: '14px', borderRadius: '10px' }}
                  onClick={() => {
                    const planSlug = tier.isPopular ? 'professional' : 'starter';
                    onLaunchApp(session ? `checkout:${planSlug}:${billingCycle}` : 'settings');
                  }}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: '40px',
            textAlign: 'center',
            padding: '20px',
            background: 'var(--bg-main)',
            borderRadius: '12px',
            border: '1px dashed var(--border-color)',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}>
            📋 Have an AppSumo activation code? Select <strong>"Lifetime Deals"</strong> or log in and redeem it instantly under Account Settings.
          </div>
        </div>
      </section>

      {/* Accordion FAQ Section */}
      <section id="faq" className="faq-section" style={{ padding: '80px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ marginBottom: '12px' }}>Still Have Doubts? We Get It.</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Here are the questions every seller asks before switching from Photoshop.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {faqs.map((faq, idx) => (
            <div key={idx} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              overflow: 'hidden'
            }}>
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                style={{
                  width: '100%',
                  background: 'none',
                  border: 'none',
                  padding: '20px 24px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: 'inherit',
                  fontSize: '15px',
                  fontWeight: 600,
                  color: 'var(--text-main)'
                }}
              >
                <span>{faq.q}</span>
                {activeFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {activeFaq === idx && (
                <div style={{
                  padding: '0 24px 20px 24px',
                  fontSize: '14px',
                  color: 'var(--text-secondary)',
                  lineHeight: '1.6',
                  borderTop: '1px solid var(--border-color)',
                  paddingTop: '16px'
                }}>
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="bottom-cta-section" style={{
        padding: '60px 40px 80px 40px',
        background: 'var(--bg-main)',
        transition: 'background 0.3s'
      }}>
        <div style={{
          maxWidth: '1000px',
          margin: '0 auto',
          background: 'linear-gradient(135deg, var(--primary) 0%, #6D28D9 100%)',
          borderRadius: '24px',
          padding: '60px 40px',
          textAlign: 'center',
          boxShadow: '0 20px 40px -15px rgba(139, 92, 246, 0.4)',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Graphic Accents */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '300px',
            height: '300px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: '-50%',
            right: '-10%',
            width: '250px',
            height: '250px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '50%',
            pointerEvents: 'none'
          }}></div>

          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Your Competitors Are Still Using Photoshop.</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '520px', margin: '0 auto 32px auto', fontSize: '15px', lineHeight: '1.6' }}>
            While they spend 4 hours editing 50 photos, you'll have 200 done in seconds. Launch pricing disappears soon — lock in lifetime access now.
          </p>
          <button onClick={onLaunchApp} style={{
            padding: '16px 36px',
            fontSize: '15px',
            fontWeight: 600,
            background: '#ffffff',
            color: 'var(--primary)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }} className="btn-cta-card">
            Open OptiSnap Workspace <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="footer-section" style={{
        padding: '80px 40px 40px 40px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        transition: 'background 0.3s'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          {/* Premium Multi-Column Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1.5fr',
            gap: '40px',
            paddingBottom: '60px',
            borderBottom: '1px solid var(--border-color)',
            textAlign: 'left'
          }} className="footer-links-grid">
            {/* Column 1: Brand & Security Badge */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '16px' }}>
                <img src={icon} alt="OptiSnap Logo" style={{ width: '24px', height: '24px', objectFit: 'contain' }} />
                <span>OptiSnap</span>
              </div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.5', margin: 0 }}>
                High-performance automated image engine custom-built for high-volume Etsy, Shopify, and Amazon sellers.
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 14px',
                background: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                marginTop: '8px',
                width: 'fit-content'
              }}>
                <ShieldCheck size={16} style={{ color: '#22c55e' }} />
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>100% Enterprise-Grade Private</span>
              </div>
            </div>

            {/* Column 2: Product Tools */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-main)' }}>Features</span>
              <a href="#" onClick={(e) => { e.preventDefault(); onLaunchApp('bg-removal'); }} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>AI BG Remover</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onLaunchApp('resize'); }} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Canvas Padding</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onLaunchApp('compress'); }} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>WEBP Compression</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onLaunchApp('rename'); }} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>SEO Bulk Rename</a>
            </div>

            {/* Column 3: Resources */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-main)' }}>Resources</span>
              <a href="#faq" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Help & FAQs</a>
              <a href="#pricing" style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>AppSumo Deal</a>
              <a href="#" onClick={(e) => { e.preventDefault(); onLaunchApp('settings'); }} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Redeem License</a>
              <a href="#" onClick={(e) => { e.preventDefault(); toast.info("Developer API access is in private beta. Please email support@optisnap.app to request access."); }} style={{ fontSize: '13px', color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s' }}>Developer API</a>
            </div>

            {/* Column 4: Platform Security Assurance */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-main)' }}>Data Compliance</span>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                OptiSnap is built on an isolated, sandboxed environment. No files or personal metadata are ever collected, stored, or processed on external servers.
              </p>
            </div>
          </div>

          {/* Footer Copyright Bottom Bar */}
          <div style={{
            marginTop: '30px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--text-secondary)'
          }} className="footer-bottom">
            <span>© 2026 OptiSnap Inc. All rights reserved.</span>
            <div style={{ display: 'flex', gap: '24px' }}>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Privacy Policy</a>
              <a href="#" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Terms of Service</a>
              <span>v1.0.0</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Social Proof Purchase Toast */}
      {notification && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '24px',
          zIndex: 1000,
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: '12px',
          padding: '12px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          maxWidth: '350px',
          transform: showNotification ? 'translateX(0) scale(1)' : 'translateX(-400px) scale(0.9)',
          opacity: showNotification ? 1 : 0,
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: showNotification ? 'auto' : 'none',
          backdropFilter: 'blur(8px)',
          textAlign: 'left'
        }}>
          {/* Glowing Avatar/Check Icon Badge */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'rgba(134, 77, 226, 0.1)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            boxShadow: '0 0 10px rgba(134, 77, 226, 0.15)'
          }}>
            <ShoppingBag size={18} />
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
            <span style={{ fontSize: '12px', color: 'var(--text-main)', lineHeight: 1.4, fontWeight: 500 }}>
              <strong>{notification.name}</strong> from {notification.location}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.2 }}>
              Purchased <strong style={{ color: 'var(--primary)', fontWeight: 600 }}>{notification.plan}</strong>
            </span>
            <span style={{ fontSize: '9px', color: 'var(--text-secondary)', marginTop: '4px', opacity: 0.7 }}>
              {notification.time}
            </span>
          </div>

          <button 
            onClick={() => setShowNotification(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              fontSize: '18px',
              padding: '0 0 0 8px',
              alignSelf: 'flex-start',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
      )}

      {/* Exit Intent Flash Discount Popup */}
      {showExitIntent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="modal-card" style={{
            background: 'var(--bg-card)',
            maxWidth: '500px',
            width: '100%',
            borderRadius: '24px',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.15)',
            padding: '36px',
            position: 'relative',
            textAlign: 'center',
            color: 'var(--text-main)',
            fontFamily: "'Poppins', sans-serif"
          }}>
            {/* Close Button */}
            <button
              onClick={() => setShowExitIntent(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'rgba(0,0,0,0.1)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
                lineHeight: 1
              }}
            >
              ×
            </button>

            {/* Glowing Tag */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              color: 'var(--primary)',
              padding: '6px 14px',
              borderRadius: '30px',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '20px',
              animation: 'pulseGlow 2s infinite ease-in-out'
            }}>
              ⚡ Exclusive Fast-Action Deal
            </div>

            <h3 style={{
              fontSize: '24px',
              fontWeight: 800,
              color: 'var(--text-main)',
              margin: '0 0 12px 0',
              lineHeight: 1.25,
              letterSpacing: '-0.02em',
              textAlign: 'center'
            }}>
              Wait! Claim Your <span style={{ color: 'var(--primary)', background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>20% OFF</span> Lifetime Access
            </h3>

            <p style={{
              fontSize: '13.5px',
              color: 'var(--text-secondary)',
              lineHeight: 1.5,
              margin: '0 0 24px 0',
              textAlign: 'center'
            }}>
              Get <strong>OptiSnap Pro Lifetime</strong> for only <strong style={{ color: 'var(--text-main)', fontSize: '15px' }}>$47</strong> (normally $59) before you leave. This private offer is locked to your session and expires in:
            </p>

            {/* Countdown Box */}
            <div style={{
              background: 'rgba(15, 23, 42, 0.3)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '16px',
              display: 'inline-block',
              marginBottom: '28px'
            }}>
              {exitTimeLeft > 0 ? (
                <span style={{
                  fontFamily: 'monospace',
                  fontSize: '36px',
                  fontWeight: 700,
                  color: exitTimeLeft < 60 ? '#ef4444' : 'var(--primary)',
                  letterSpacing: '2px'
                }}>
                  {formatExitTime()}
                </span>
              ) : (
                <span style={{ fontSize: '14px', color: '#ef4444', fontWeight: 600 }}>Offer Expired</span>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                disabled={exitTimeLeft <= 0}
                onClick={() => {
                  setShowExitIntent(false)
                  onLaunchApp('checkout:professional:lifetime:FASTACTION')
                }}
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '16px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 10px 20px -10px rgba(139, 92, 246, 0.5)',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%'
                }}
              >
                Claim Discount & Checkout
              </button>

              <button
                onClick={() => setShowExitIntent(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '8px',
                  textDecoration: 'underline',
                  width: '100%',
                  textAlign: 'center'
                }}
              >
                No thanks, I prefer paying full price later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Gift / Spin Wheel Trigger */}
      {!hasSpun && (
        <button
          onClick={() => setShowSpinWheel(true)}
          className="floating-gift-trigger"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '30px',
            fontWeight: 700,
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: '0 10px 20px -5px rgba(139, 92, 246, 0.4), 0 0 12px rgba(139, 92, 246, 0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            fontFamily: "'Poppins', sans-serif"
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Gift size={16} />
          <span>Claim Launch Gift</span>
        </button>
      )}

      {/* Persistent Won Discount Banner at bottom */}
      {wonDiscount && wheelTimerLeft > 0 && (
        <div className="won-discount-banner" style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--bg-card)',
          borderRadius: '16px',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3), 0 0 30px rgba(139, 92, 246, 0.1)',
          padding: '16px 20px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          color: 'var(--text-main)',
          fontFamily: "'Poppins', sans-serif",
          animation: 'slideInRight 0.3s ease-out'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.05em' }}>
              🎁 Your Discount Claimed
            </span>
            <span style={{ fontSize: '12.5px', color: 'var(--text-main)', fontWeight: 600 }}>
              Land: <strong style={{ color: 'var(--primary)' }}>25% OFF</strong> Pro Lifetime
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'monospace',
              fontSize: '14px',
              fontWeight: 700,
              color: '#ef4444',
              background: 'rgba(239, 68, 68, 0.05)',
              border: '1px solid rgba(239, 68, 68, 0.15)',
              padding: '4px 8px',
              borderRadius: '4px'
            }}>
              {formatWheelTime()}
            </span>
            <button
              onClick={() => onLaunchApp('checkout:professional:lifetime:MYLUCKY25')}
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                color: 'white',
                border: 'none',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Spin Wheel Modal overlay */}
      {showSpinWheel && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(8px)',
          zIndex: 99999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div className="modal-card" style={{
            background: 'var(--bg-card)',
            maxWidth: '440px',
            width: '100%',
            borderRadius: '24px',
            border: '1px solid rgba(139, 92, 246, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(139, 92, 246, 0.1)',
            padding: '36px',
            position: 'relative',
            textAlign: 'center',
            color: 'var(--text-main)',
            fontFamily: "'Poppins', sans-serif"
          }}>
            {/* Close Button */}
            {!isSpinning && (
              <button
                onClick={() => setShowSpinWheel(false)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(0,0,0,0.05)',
                  border: 'none',
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 1
                }}
              >
                ×
              </button>
            )}

            <h3 style={{ fontSize: '22px', fontWeight: 800, margin: '0 0 6px 0', letterSpacing: '-0.02em', textAlign: 'center' }}>
              🎁 Try Your Luck!
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 24px 0', lineHeight: 1.4, textAlign: 'center' }}>
              Spin the lucky wheel to unlock an exclusive launch discount on Pro Lifetime. You get exactly <strong>1 spin</strong>!
            </p>

            {/* The Wheel Visual Container */}
            <div className="wheel-container" style={{
              position: 'relative',
              width: '260px',
              height: '260px',
              margin: '0 auto 28px auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {/* Top pointer */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                zIndex: 20,
                width: 0,
                height: 0,
                borderLeft: '12px solid transparent',
                borderRight: '12px solid transparent',
                borderTop: '24px solid #ef4444',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }}></div>

              {/* Wheel circle */}
              <div style={{
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                border: '6px solid var(--border-color)',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3), inset 0 0 20px rgba(0,0,0,0.4)',
                background: 'conic-gradient(#864de2 0deg 60deg, #7c3aed 60deg 120deg, #6d28d9 120deg 180deg, #5b21b6 180deg 240deg, #4c1d95 240deg 300deg, #3b0764 300deg 360deg)',
                transform: `rotate(-${wheelRotation}deg)`,
                transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0.8, 0.1, 1)' : 'none',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {/* Text slices rotated inside conic gradient */}
                {[
                  { text: '5% OFF', deg: 30 },
                  { text: '10% OFF', deg: 90 },
                  { text: '15% OFF', deg: 150 },
                  { text: '20% OFF', deg: 210 },
                  { text: '25% OFF', deg: 270 }, // Land target!
                  { text: 'Try Again', deg: 330 }
                ].map((slice, idx) => (
                  <div key={idx} style={{
                    position: 'absolute',
                    top: '0',
                    left: '50%',
                    width: '100px',
                    height: '130px',
                    transformOrigin: '50% 100%',
                    transform: `translateX(-50%) rotate(${slice.deg}deg)`,
                    display: 'flex',
                    justifyContent: 'center',
                    paddingTop: '20px',
                    boxSizing: 'border-box'
                  }}>
                    <span style={{
                      color: 'white',
                      fontWeight: 700,
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                      letterSpacing: '0.05em'
                    }}>
                      {slice.text}
                    </span>
                  </div>
                ))}
              </div>

              {/* Inner glowing center pin */}
              <div style={{
                position: 'absolute',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '3px solid var(--primary)',
                boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
                zIndex: 15,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: 'var(--primary)'
                }}></div>
              </div>
            </div>

            {/* Controls */}
            {wonDiscount ? (
              <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
                <div style={{
                  background: 'rgba(16, 185, 129, 0.06)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '20px'
                }}>
                  <h4 style={{ margin: '0 0 4px 0', color: '#10b981', fontSize: '15px', fontWeight: 700, textAlign: 'center' }}>
                    You Won 25% Off Pro Lifetime! 🎉
                  </h4>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, textAlign: 'center' }}>
                    Your coupon code <strong style={{ color: 'var(--primary)' }}>MYLUCKY25</strong> is applied and reserved for the next:
                  </p>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#ef4444',
                    marginTop: '8px',
                    textAlign: 'center'
                  }}>
                    {formatWheelTime()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setShowSpinWheel(false)
                    onLaunchApp('checkout:professional:lifetime:MYLUCKY25')
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '14px 24px',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    width: '100%',
                    boxShadow: '0 8px 16px rgba(139,92,246,0.3)'
                  }}
                >
                  Claim Discount & Checkout
                </button>
              </div>
            ) : (
              <button
                disabled={isSpinning || hasSpun}
                onClick={spinTheWheel}
                style={{
                  background: (isSpinning || hasSpun) ? 'var(--border-color)' : 'linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%)',
                  color: 'white',
                  border: 'none',
                  padding: '14px 24px',
                  borderRadius: '12px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: (isSpinning || hasSpun) ? 'not-allowed' : 'pointer',
                  width: '100%',
                  boxShadow: (isSpinning || hasSpun) ? 'none' : '0 8px 16px rgba(139,92,246,0.3)',
                  transition: 'all 0.2s'
                }}
              >
                {isSpinning ? 'Spinning...' : 'Spin the Wheel'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
