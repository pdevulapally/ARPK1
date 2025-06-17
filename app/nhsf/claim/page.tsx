"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion"
import { ArrowRight, Check, Globe, Users, Calendar, Gift, ArrowDown, Mail, Sparkles, Star, Zap, Eye, Shield, Rocket } from "lucide-react"
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
  
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400])
  const rotate = useTransform(scrollYProgress, [0, 1], [0, 360])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [currentStep, setCurrentStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  
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
    
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true)
      }
    }

    // Only add event listener after component mounts
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % 4)
    }, 3000)
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

  const scrollToForm = () => {
    const element = document.getElementById('claim-form')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const features = [
    { icon: Globe, text: "Professional website with modern design", color: "from-purple-500 to-pink-500" },
    { icon: Users, text: "Committee profiles and event management", color: "from-blue-500 to-purple-500" },
    { icon: Calendar, text: "Event calendar and booking system", color: "from-purple-500 to-indigo-500" },
    { icon: Gift, text: "Free domain for one year", color: "from-pink-500 to-purple-500" },
  ]

  const timelineSteps = [
    { title: "Submission", desc: "Submit your requirements", icon: Mail },
    { title: "Review", desc: "48-hour review process", icon: Eye },
    { title: "Development", desc: "2-3 weeks build time", icon: Rocket },
    { title: "Launch", desc: "Ready for the new term", icon: Star }
  ]

  // Prevent SSR rendering of client-side features
  if (!mounted) {
    return null // or a loading state
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/30 to-slate-950 overflow-hidden">
     

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          style={{ y: y1 }}
          className="absolute top-20 left-10 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
        />
        <motion.div
          style={{ y: y2, rotate }}
          className="absolute bottom-20 right-10 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: mousePosition.x / 50,
            y: mousePosition.y / 50,
          }}
          className="absolute top-1/2 left-1/2 w-96 h-96 bg-gradient-radial from-purple-500/10 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/60 rounded-full"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight 
            }}
            animate={{
              y: [null, -20, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* 3D Logo Effect */}
          <motion.div
            style={{ scale }}
            className="relative mb-8"
          >
            <motion.h1 
              className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 leading-tight"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{ duration: 5, repeat: Infinity }}
              style={{ 
                backgroundSize: "200% 200%",
                textShadow: "0 0 40px rgba(168, 85, 247, 0.5)"
              }}
            >
              NHSF × ARPK
            </motion.h1>
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-2xl rounded-full"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-6"
          >
            Free Website Initiative
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-lg sm:text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Empowering Hindu Student Societies with professional web presence. 
            Exclusively for NHSF committee members 2024-2025.
          </motion.p>

          {/* Premium Feature Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                whileHover={{ 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group cursor-pointer"
                style={{ perspective: "1000px" }}
              >
                <div className="relative bg-black/60 backdrop-blur-2xl p-6 rounded-2xl border border-purple-500/30 hover:border-purple-400/60 transition-all duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="relative flex items-center gap-4">
                    <motion.div 
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-r ${feature.color} p-0.5 group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <div className="w-full h-full bg-black/80 rounded-2xl flex items-center justify-center">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                    <span className="text-white font-medium text-sm sm:text-base">{feature.text}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('claim-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/40 transition-all duration-300"
            >
              <span className="relative z-10 flex items-center gap-2">
                Claim Your Website
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.button>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16"
          >
            <ArrowDown className="w-6 h-6 text-purple-400 mx-auto" />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">ARPK?</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-3xl border border-purple-500/20">
                <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-purple-400" />
                  About ARPK
                </h3>
                <p className="text-gray-300 leading-relaxed mb-4">
                  ARPK is a leading web development company specializing in creating 
                  modern, responsive websites for businesses and organizations. With years 
                  of experience and a passion for excellence, we're committed to delivering 
                  high-quality digital solutions.
                </p>
                <p className="text-gray-300 leading-relaxed">
                  Our partnership with NHSF reflects our commitment to supporting 
                  student organizations and fostering digital growth in the Hindu 
                  student community.
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
              <div className="bg-black/40 backdrop-blur-2xl p-8 rounded-3xl border border-purple-500/20">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Zap className="w-6 h-6 text-purple-400" />
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
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-300">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Claim Form Section */}
      <section id="claim-form" className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Claim Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Free Website</span>
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
            <div className="bg-black/40 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
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
                      className="w-full px-4 py-3 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
                      required
                    />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Website Requirements */}
            <div className="bg-black/40 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-purple-500/20">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
                <Globe className="w-5 h-5 text-purple-400" />
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
                      className="w-full px-4 py-3 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
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
                      className="w-full px-4 py-3 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300"
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
                      className="w-full px-4 py-3 bg-black/60 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 focus:outline-none transition-all duration-300 min-h-[100px] resize-none"
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
                className="relative bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-2xl hover:shadow-purple-500/40 transition-all duration-300 disabled:opacity-50"
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
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Development <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Timeline</span>
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
                  whileHover={{ scale: 1.05, rotateY: 5 }}
                  className={`bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border transition-all duration-500 ${
                    currentStep === index 
                      ? 'border-purple-400 shadow-2xl shadow-purple-500/20' 
                      : 'border-purple-500/20'
                  }`}
                >
                  <div className="flex flex-col items-center text-center space-y-4">
                    <motion.div
                      animate={currentStep === index ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-r flex items-center justify-center ${
                        currentStep === index
                          ? 'from-purple-500 to-pink-500 shadow-lg shadow-purple-500/50'
                          : 'from-purple-600/50 to-purple-800/50'
                      }`}
                    >
                      <step.icon className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                      <p className="text-gray-400 text-sm">{step.desc}</p>
                    </div>
                  </div>
                </motion.div>
                
                {index < timelineSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-6 h-6 text-purple-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black/20 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Questions</span>
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
                a: "Your website will include modern design, mobile responsiveness, event management system, committee profiles, and one year of free hosting."
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
                whileHover={{ scale: 1.02 }}
                className="bg-black/40 backdrop-blur-2xl p-6 rounded-3xl border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-3">
                  <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full" />
                  {faq.q}
                </h4>
                <p className="text-gray-300 leading-relaxed pl-5">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="relative bg-black/60 backdrop-blur-2xl border-t border-purple-500/20">
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                <Shield className="w-5 h-5 text-purple-400" />
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
                    className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"
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
                <Mail className="w-5 h-5 text-purple-400" />
                Contact
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Email", value: "info@arpk.co.uk" },
                  { label: "Phone", value: "+44 123 456 7890" },
                  { label: "Location", value: "United Kingdom" }
                ].map((contact, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-center gap-3 text-gray-400 hover:text-purple-400 transition-colors duration-300"
                  >
                    <div className="w-1 h-1 bg-purple-400 rounded-full" />
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
                <Rocket className="w-5 h-5 text-purple-400" />
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
                    className="group flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-all duration-300"
                  >
                    <motion.div
                      whileHover={{ rotate: 45 }}
                      className="w-2 h-2 bg-purple-400 rounded-full group-hover:bg-purple-300 transition-colors duration-300"
                    />
                    <span className="text-sm font-medium">{link.label}</span>
                    {link.external && (
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            className="mt-16 pt-8 border-t border-purple-500/20"
          >
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} ARPK. All rights reserved.
              </p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 text-sm text-purple-400"
              >
                <Sparkles className="w-4 h-4" />
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
          className="w-14 h-14 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-2xl shadow-purple-500/40 flex items-center justify-center text-white hover:shadow-purple-500/60 transition-all duration-300"
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
