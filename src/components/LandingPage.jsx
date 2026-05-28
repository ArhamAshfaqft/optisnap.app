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
  TrendingUp
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
    images: 241852,
    activeUsers: 112,
    hoursSaved: 7458
  })
  const [weeklyImages, setWeeklyImages] = useState(100)

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
        const userDiff = Math.floor(Math.random() * 5) - 2
        const nextUsers = Math.min(Math.max(prev.activeUsers + userDiff, 95), 130)
        const hoursInc = Math.random() > 0.7 ? 1 : 0
        
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
      <section style={{
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
          Privacy-First Image Engine
        </span>

        <h1 style={{
          fontSize: '48px',
          fontWeight: 800,
          lineHeight: '1.2',
          letterSpacing: '-1px',
          margin: '24px 0 16px 0',
          color: 'var(--text-main)'
        }}>
          E-Commerce Images, Ready in One Click.
        </h1>

        <p style={{
          fontSize: '18px',
          color: 'var(--text-secondary)',
          maxWidth: '680px',
          margin: '0 auto 32px auto',
          lineHeight: '1.6'
        }}>
          Resize, remove backgrounds, compress, and watermark your product photos with professional-grade speed. Increase shop page speed, protect your assets, and boost Etsy and Shopify SEO.
        </p>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
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
          No installation required. Get instant processing and enterprise-grade privacy for your catalog.
        </p>
      </section>

      {/* Hero Mockup Showcase */}
      <section style={{ padding: '0 40px 60px 40px', maxWidth: '1150px', margin: '0 auto', textAlign: 'center' }}>
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

      {/* CSS Keyframe Styles for Pulse Animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulse-green {
          0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.7); }
          70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(34, 197, 94, 0); }
          100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(34, 197, 94, 0); }
        }
        .pulse-dot {
          animation: pulse-green 2.2s infinite ease-in-out;
        }
        @media (max-width: 640px) {
          .stats-divider {
            display: none !important;
          }
        }
      `}} />

      {/* Live Stats / Processing Milestones (Option 3) */}
      <section style={{
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
              Total Images Processed
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)', fontFamily: 'monospace' }}>
              {stats.images.toLocaleString()}
            </span>
            <span style={{ fontSize: '10.5px', color: '#22c55e', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }}></span>
              Processing live client-side
            </span>
          </div>

          {/* Vertical Divider */}
          <div className="stats-divider" style={{ width: '1px', background: 'var(--border-color)', height: '50px', alignSelf: 'center' }}></div>

          {/* Stat Item 2: Active Sellers */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Sellers Online
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
              Preparing catalog batches
            </span>
          </div>

          {/* Vertical Divider */}
          <div className="stats-divider" style={{ width: '1px', background: 'var(--border-color)', height: '50px', alignSelf: 'center' }}></div>

          {/* Stat Item 3: Time Saved */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Manual Editing Saved
            </span>
            <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'monospace' }}>
              {stats.hoursSaved.toLocaleString()}h
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>
              Compared to manual Photoshop
            </span>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" style={{
        padding: '80px 40px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-color)',
        transition: 'background 0.3s'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '12px' }}>Professional Features. Built to Convert.</h2>
            <p style={{ color: 'var(--text-secondary)', maxW: '600px', margin: '0 auto' }}>
              We loaded OptiSnap with the exact image preparation tools high-volume e-commerce sellers demand daily.
            </p>
          </div>

          <div style={{
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
      <section id="how-it-works" style={{
        padding: '80px 0',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-color)',
        width: '100%',
        transition: 'background 0.3s'
      }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ marginBottom: '12px' }}>Three Steps. Done.</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Get batch listings prepared without opening bloated software suites.</p>
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
      <section id="testimonials" style={{
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
          <h2 style={{ marginBottom: '12px' }}>Loved by E-Commerce Sellers</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Here is why store owners and digital marketers are switching to OptiSnap.</p>
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
      <section style={{
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
            <h2 style={{ fontSize: '26px', fontWeight: 700, margin: '12px 0 8px 0' }}>How much time are you losing?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: 0 }}>
              Adjust the slider to see how much manual Photoshop time OptiSnap saves you.
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
      <section id="pricing" style={{
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
            <h2 style={{ margin: '0 0 16px 0', fontSize: '28px', fontWeight: 700 }}>One-Time Investment or Flexible Plans</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Process images locally with zero cloud limits. Upgrade or cancel anytime.</p>
            
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
      <section id="faq" style={{ padding: '80px 40px', maxWidth: '800px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h2 style={{ marginBottom: '12px' }}>Answering Key Questions</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Clear answers regarding privacy, performance, and features.</p>
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
      <section style={{
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

          <h2 style={{ fontSize: '32px', fontWeight: 800, marginBottom: '16px', color: '#ffffff' }}>Ready to Optimize Your Listing Flow?</h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.9)', maxWidth: '520px', margin: '0 auto 32px auto', fontSize: '15px', lineHeight: '1.6' }}>
            Start processing bulk images securely with 100% data privacy. Accelerate shop loading speed and protect your catalog.
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
      <footer style={{
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
    </div>
  )
}
