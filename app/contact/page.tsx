"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, Send, Sparkles, MessageCircle, Zap, ArrowRight } from "lucide-react"

export default function ContactPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    const card = cardRef.current
    if (card) {
      card.addEventListener('mousemove', handleMouseMove)
      return () => card.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "✨ Message Sent Successfully!",
        description: "Thank you for reaching out. We'll get back to you within 24 hours!",
      })
      setFormData({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      toast({
        title: "❌ Oops! Something went wrong",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl animate-spin" style={{ animationDuration: '20s' }}></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-purple-400/30 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400 animate-pulse" />
            <span className="text-sm font-medium text-purple-300">Get In Touch</span>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent mb-6 leading-tight">
            Let's Create Something
            <br />
            <span className="text-purple-400">Amazing Together</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Ready to transform your ideas into reality? Drop us a message and let's start building your digital masterpiece.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card 
              ref={cardRef}
              className="relative border-0 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Dynamic Gradient Overlay */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(147, 51, 234, 0.1), transparent 40%)`,
                }}
              ></div>
              
              {/* Border Animation */}
              <div className="absolute inset-0 rounded-lg">
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/50 via-blue-500/50 to-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                <div className="absolute inset-[1px] rounded-lg bg-black/40 backdrop-blur-2xl"></div>
              </div>

              <div className="relative z-10">
                <CardHeader className="pb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl md:text-3xl font-bold text-white">Send us a message</CardTitle>
                      <CardDescription className="text-gray-400 text-base mt-1">
                        We'd love to hear from you. Fill out the form below and we'll get back to you.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400">
                          Full Name *
                        </label>
                        <div className="relative">
                          <Input
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="h-12 bg-white/5 border-gray-600/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-500 transition-all duration-300 hover:bg-white/10"
                          />
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-semibold text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Input
                            required
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            className="h-12 bg-white/5 border-gray-600/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-500 transition-all duration-300 hover:bg-white/10"
                          />
                          <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400">
                        Subject *
                      </label>
                      <div className="relative">
                        <Input
                          required
                          placeholder="How can we help you?"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          className="h-12 bg-white/5 border-gray-600/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-500 transition-all duration-300 hover:bg-white/10"
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-semibold text-gray-300 mb-3 transition-colors group-focus-within:text-purple-400">
                        Message *
                      </label>
                      <div className="relative">
                        <Textarea
                          required
                          placeholder="Tell us about your project, goals, and how we can help bring your vision to life..."
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          className="min-h-[140px] bg-white/5 border-gray-600/30 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 text-white placeholder:text-gray-500 transition-all duration-300 hover:bg-white/10 resize-none"
                        />
                        <div className="absolute inset-0 rounded-md bg-gradient-to-r from-purple-500/20 to-blue-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </div>

                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-14 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                      <div className="relative flex items-center justify-center gap-3">
                        {loading ? (
                          <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Sending Message...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            <span>Send Message</span>
                            <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0" />
                          </>
                        )}
                      </div>
                    </Button>
                  </form>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            {/* Email Card */}
            <Card className="border-0 bg-black/40 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-300 group hover:scale-105">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg mb-2">Email Us</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Send us an email and we'll respond within 24 hours.
                    </p>
                    <a 
                      href="mailto:arpkwebsitedevelopment@gmail.com"
                      className="text-purple-400 hover:text-purple-300 transition-colors duration-200 font-medium text-sm break-all"
                    >
                      arpkwebsitedevelopment@gmail.com
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Response Card */}
            <Card className="border-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-2xl shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-lg mb-2">Quick Response</h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      We pride ourselves on fast response times. Most emails are answered within 2-4 hours during business hours.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Availability Card */}
            <Card className="border-0 bg-black/40 backdrop-blur-2xl shadow-xl">
              <CardContent className="p-6">
                <h3 className="font-bold text-white text-lg mb-4">We're Available</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Monday - Friday</span>
                    <span className="text-white text-sm font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Saturday</span>
                    <span className="text-white text-sm font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Sunday</span>
                    <span className="text-gray-500 text-sm">Closed</span>
                  </div>
                  <div className="pt-2 border-t border-gray-700">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-sm font-medium">Currently Online</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}