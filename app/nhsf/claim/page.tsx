"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Globe, Users, Calendar, ArrowDown, Mail, Sparkles, Star, Zap, Eye, Shield, Rocket, ChevronRight, Phone, MapPin, ExternalLink, Flower2, CircleDot } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SocietyFormData {
  societyName: string
  university: string
  committeeRole: string
  academicYear: string
  name: string
  email: string
  phone: string
  primaryColor: string
  secondaryColor: string
  websiteGoals: string
  mainFeatures: string
  additionalInfo: string
}

export default function PremiumNHSFClaimPage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.05])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTablet, setIsTablet] = useState(false)
  
  const [formData, setFormData] = useState<SocietyFormData>({
    societyName: "",
    university: "",
    committeeRole: "",
    academicYear: "2024-2025",
    name: "",
    email: "",
    phone: "",
    primaryColor: "",
    secondaryColor: "",
    websiteGoals: "",
    mainFeatures: "",
    additionalInfo: ""
  })

  useEffect(() => {
    setMounted(true)
    
    const checkDevice = () => {
      const width = window.innerWidth
      setIsMobile(width < 640)
      setIsTablet(width >= 640 && width < 1024)
    }
    
    checkDevice()
    window.addEventListener('resize', checkDevice)
    
    return () => {
      window.removeEventListener('resize', checkDevice)
    }
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    // Handle success
  }

  const features = [
    { 
      icon: Globe, 
      text: "Professional Website", 
      subtitle: "Modern responsive design",
      desc: "Beautiful, culturally-inspired design that represents your society's values" 
    },
    { 
      icon: Users, 
      text: "Committee Management", 
      subtitle: "Profiles & event system",
      desc: "Easy management of committee members and society activities" 
    },
    { 
      icon: Calendar, 
      text: "Event Calendar", 
      subtitle: "Booking & scheduling",
      desc: "Integrated calendar for seamless event planning and management" 
    },
  ]

  const timelineSteps = [
    { title: "Submit", desc: "Requirements", icon: Mail, duration: "24h" },
    { title: "Review", desc: "48h process", icon: Eye, duration: "2 days" },
    { title: "Build", desc: "2-3 weeks", icon: Rocket, duration: "2-3 weeks" },
    { title: "Launch", desc: "Go live", icon: Star, duration: "Immediate" }
  ]

  // Prevent SSR rendering of client-side features
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-orange-500/30 border-t-orange-500 rounded-full"
        />
      </div>
    )
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900 overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-4 md:left-10 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-20 right-4 md:right-10 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-3xl"
        />
      </div>

      {/* Subtle Floating Elements */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(isMobile ? 3 : isTablet ? 5 : 8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-orange-400/20 rounded-full"
            initial={{ 
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), 
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000) 
            }}
            animate={{
              y: [null, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 8
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Logo Section */}
          <motion.div
            style={{ scale }}
            className="relative mb-8 md:mb-12"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 mb-8">
              {/* NHSF Logo */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <Image 
                  src="/Images/-zBWNK3W_400x400-removebg-preview.png" 
                  alt="NHSF Logo" 
                  width={128} 
                  height={128} 
                  className="w-32 h-32 md:w-40 md:h-40 object-contain"
                />
                <div className="mt-4">
                  <h3 className="text-lg md:text-xl font-bold text-white">NHSF</h3>
                  <p className="text-orange-300 text-sm">National Hindu Students Forum</p>
                </div>
              </motion.div>

              {/* Partnership Symbol */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="hidden md:flex items-center"
              >
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
                <CircleDot className="w-8 h-8 text-orange-400 mx-4" />
                <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full" />
              </motion.div>

              {/* ARPK Logo */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="relative"
              >
                <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
                  <Globe className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg md:text-xl font-bold text-white">ARPK</h3>
                  <p className="text-blue-300 text-sm">Digital Excellence</p>
                </div>
              </motion.div>
            </div>

            <motion.h1 
              className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-400 to-orange-600 leading-tight mb-6"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 8, repeat: Infinity }}
              style={{ 
                backgroundSize: "200% 200%",
                textShadow: "0 0 30px rgba(251, 146, 60, 0.3)"
              }}
            >
              Digital Dharma Initiative
            </motion.h1>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6"
          >
            Free Website Initiative
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4"
          >
            Empowering Hindu Student Societies with professional web presence that reflects our cultural values and modern excellence. 
            Exclusively for NHSF committee members 2024-2025.
          </motion.p>

          {/* Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 md:mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  scale: 1.02,
                  y: -5
                }}
                whileTap={{ scale: 0.98 }}
                className="relative group cursor-pointer"
              >
                <div className="flex flex-col items-center justify-between h-full bg-black/40 rounded-2xl border border-orange-500/30 p-6 transition-all duration-300 hover:border-orange-400/60">
                  <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 mb-4">
                    <feature.icon className="w-8 h-8 text-orange-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white text-center mb-1">{feature.text}</h3>
                  <div className="text-orange-300 font-semibold text-sm text-center mb-2">{feature.subtitle}</div>
                  <p className="text-gray-400 text-center text-sm">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="px-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(251, 146, 60, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-2xl font-semibold text-lg md:text-xl shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                Claim Your Website
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-12 md:mt-16"
          >
            <ArrowDown className="w-6 h-6 text-orange-400 mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">ARPK?</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-orange-500/20">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-orange-400" />
                  About ARPK
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4 text-sm md:text-base">
                  ARPK is a leading web development company specializing in creating 
                  modern, responsive websites that blend cultural heritage with digital innovation. 
                  We understand the importance of representing your values authentically online.
                </p>
                <p className="text-gray-300 leading-relaxed text-sm md:text-base">
                  Our partnership with NHSF reflects our commitment to supporting 
                  Hindu student organizations and fostering digital growth while preserving 
                  our cultural identity.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-black/40 backdrop-blur-xl p-6 md:p-8 rounded-3xl border border-orange-500/20">
                <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-orange-400" />
                  Initiative Benefits
                </h3>
                <div className="space-y-4">
                  {[
                    "Help societies attract and engage more members",
                    "Streamline event management and communication",
                    "Showcase society activities and achievements",
                    "Provide a professional platform for growth"
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3 md:w-4 md:h-4 text-white" />
                      </div>
                      <span className="text-gray-300 text-sm md:text-base">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Claim Form Section */}
      <section id="claim-form" className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Free Website</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Fill out the form below to start your journey towards a professional web presence.
            </p>
          </motion.div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Society Details */}
            <div className="bg-black/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-orange-500/20">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Users className="w-5 h-5 text-orange-400" />
                Society Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { id: "societyName", label: "Society Name", placeholder: "NHSF University Name", type: "text" },
                  { id: "university", label: "University", placeholder: "Your University", type: "text" },
                  { id: "committeeRole", label: "Your Committee Role", placeholder: "e.g. President, Secretary", type: "text" },
                  { id: "phone", label: "Contact Number", placeholder: "Your phone number", type: "tel" },
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * index }}
                    className="space-y-2"
                  >
                    <label htmlFor={field.id} className="block text-sm font-medium text-white">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.id as keyof SocietyFormData]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full px-4 py-3 bg-black/60 border border-orange-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300"
                      required
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Website Requirements */}
            <div className="bg-black/40 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-orange-500/20">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Globe className="w-5 h-5 text-orange-400" />
                Website Requirements
              </h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="primaryColor" className="block text-sm font-medium text-white">
                      Primary Brand Color
                    </label>
                    <input
                      id="primaryColor"
                      placeholder="e.g. Orange (#FF9900)"
                      value={formData.primaryColor}
                      onChange={(e) => setFormData({...formData, primaryColor: e.target.value})}
                      className="w-full px-4 py-3 bg-black/60 border border-orange-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="secondaryColor" className="block text-sm font-medium text-white">
                      Secondary Brand Color
                    </label>
                    <input
                      id="secondaryColor"
                      placeholder="e.g. Blue (#0066CC)"
                      value={formData.secondaryColor}
                      onChange={(e) => setFormData({...formData, secondaryColor: e.target.value})}
                      className="w-full px-4 py-3 bg-black/60 border border-orange-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300"
                    />
                  </div>
                </div>

                {[
                  { id: "websiteGoals", label: "Website Goals", placeholder: "What do you want your website to achieve? e.g., Attract new members, showcase events..." },
                  { id: "mainFeatures", label: "Main Features Needed", placeholder: "What features would you like? e.g., Event calendar, committee profiles, blog..." },
                  { id: "additionalInfo", label: "Additional Information", placeholder: "Any other requirements or information you'd like to share..." },
                ].map((field, index) => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="block text-sm font-medium text-white">
                      {field.label}
                    </label>
                    <textarea
                      id={field.id}
                      placeholder={field.placeholder}
                      value={formData[field.id as keyof SocietyFormData]}
                      onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
                      className="w-full px-4 py-3 bg-black/60 border border-orange-500/30 rounded-xl text-white placeholder-gray-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20 focus:outline-none transition-all duration-300 min-h-[100px] resize-none"
                      required={index < 2}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative bg-gradient-to-r from-orange-600 via-orange-700 to-red-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 disabled:opacity-50"
              >
                <AnimatePresence mode="wait">
                  {isSubmitting ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Submitting...
                    </motion.div>
                  ) : (
                    <motion.span
                      key="submit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2"
                    >
                      Claim Your Free Website
                      <Sparkles className="w-5 h-5" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Timeline</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {timelineSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                className="relative group"
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`bg-black/40 backdrop-blur-xl p-6 rounded-3xl border transition-all duration-500 ${
                    currentStep === index 
                      ? 'border-orange-400 shadow-2xl shadow-orange-500/20' 
                      : 'border-orange-500/20'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      animate={currentStep === index ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center ${
                        currentStep === index
                          ? 'from-orange-500 to-red-600 shadow-lg shadow-orange-500/50'
                          : 'from-orange-600/50 to-orange-800/50'
                      }`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm mb-1">{step.desc}</p>
                      <p className="text-orange-400 text-sm font-medium">{step.duration}</p>
                    </div>
                  </div>
                </motion.div>
                
                {index < timelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-orange-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">Questions</span>
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                q: "Who is eligible for this initiative?",
                a: "This offer is exclusively for NHSF committee members for the academic year 2024-2025."
              },
              {
                q: "What's included in the free website?",
                a: "Your website will include modern design, mobile responsiveness, event management system, and committee profiles."
              },
              {
                q: "How long does development take?",
                a: "Typically 2-3 weeks from approval, ensuring your site is ready before the new academic year."
              },
              {
                q: "Will we be able to update the website ourselves?",
                a: "Yes, you'll receive access to an easy-to-use content management system and training."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ scale: 1.01 }}
                className="bg-black/40 backdrop-blur-xl p-6 rounded-3xl border border-orange-500/20 hover:border-orange-400/40 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full" />
                  {faq.q}
                </h4>
                <p className="text-gray-300 leading-relaxed pl-5">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-black/60 backdrop-blur-2xl border-t border-orange-500/20">
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Shield className="w-5 h-5 text-orange-400" />
                About Us
              </h3>
              <p className="text-gray-400 leading-relaxed">
                ARPK is committed to supporting NHSF societies through digital excellence 
                and innovative web solutions. We believe in empowering communities through technology.
              </p>
              <div className="flex gap-3">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.2, rotate: 15 }}
                    className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400" />
                Contact
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Email", value: "arpkwebsitedevelopment@gmail.com", icon: Mail },
                  { label: "Phone", value: "+44 7493412454", icon: Phone },
                  { label: "Location", value: "United Kingdom", icon: MapPin }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-400 hover:text-orange-400 transition-colors duration-300"
                  >
                    <contact.icon className="w-4 h-4" />
                    <span className="text-sm font-medium">{contact.label}:</span>
                    <span className="text-sm">{contact.value}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Rocket className="w-5 h-5 text-orange-400" />
                Quick Links
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Home", href: "#" },
                  { label: "Claim Website", href: "#claim-form" },
                  { label: "NHSF Website", href: "https://nhsf.org.uk", external: true }
                ].map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    whileHover={{ x: 5, scale: 1.05 }}
                    className="group flex items-center gap-3 text-orange-400 hover:text-orange-300 transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 45 }}
                      className="w-2 h-2 bg-orange-400 rounded-full group-hover:bg-orange-300 transition-colors duration-300"
                    />
                    <span className="text-sm font-medium">{link.label}</span>
                    {link.external && (
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-8 border-t border-orange-500/20"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} ARPK. All rights reserved.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-sm text-orange-400"
              >
                <span>Crafted with excellence</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </footer>

      {/* Floating Action Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-14 h-14 bg-gradient-to-r from-orange-600 to-red-600 rounded-full shadow-2xl shadow-orange-500/40 flex items-center justify-center text-white hover:shadow-orange-500/60 transition-all duration-300"
        >
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ArrowDown className="w-6 h-6 rotate-180" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  )
}
