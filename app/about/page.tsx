"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { History, Target, Award, Code, Zap, Shield, Lightbulb, Rocket, Heart, Star, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  const { ref: missionRef, inView: missionInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: valuesRef, inView: valuesInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true, threshold: 0.1 })
  const { ref: ctaRef, inView: ctaInView } = useInView({ triggerOnce: true, threshold: 0.1 })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  }

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
      },
    },
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Enhanced Hero Section */}
      <section className="relative py-36 md:py-44 overflow-hidden">
        {/* Enhanced gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950 via-indigo-950 to-black animate-gradient-slow z-0" />
        
        {/* Add subtle pattern overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10 z-0"></div>

        {/* Enhanced glow effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow" />
          <div className="absolute top-1/3 right-1/4 w-[32rem] h-[32rem] bg-indigo-500/20 rounded-full mix-blend-multiply filter blur-[150px] animate-pulse-slow animation-delay-2000" />
          <div className="absolute bottom-1/4 left-1/3 w-[28rem] h-[28rem] bg-blue-500/25 rounded-full mix-blend-multiply filter blur-[130px] animate-pulse-slow animation-delay-4000" />
        </div>
        
        {/* Moving particle background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-300 rounded-full animate-float"></div>
          <div className="absolute top-1/3 left-1/4 w-3 h-3 bg-blue-300 rounded-full animate-float animation-delay-1000"></div>
          <div className="absolute top-2/3 left-3/4 w-2 h-2 bg-indigo-300 rounded-full animate-float animation-delay-2000"></div>
          <div className="absolute top-1/4 left-3/4 w-1 h-1 bg-fuchsia-300 rounded-full animate-float animation-delay-3000"></div>
          <div className="absolute top-3/4 left-1/4 w-2 h-2 bg-purple-300 rounded-full animate-float animation-delay-4000"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            {/* Decorative elements */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full opacity-70"></div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-8 text-white tracking-tight">
                About{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 animate-gradient-fast">
                  ARPK
                </span>
              </h1>
            </motion.div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              className="text-xl md:text-2xl text-gray-200 max-w-4xl mx-auto mb-10 leading-relaxed"
            >
              Crafting exceptional digital experiences through innovative web solutions that elevate brands and drive success.
            </motion.p>

            {/* Animated underline */}
            <motion.div 
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "8rem", opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="h-1 bg-gradient-to-r from-purple-400 via-fuchsia-400 to-blue-400 rounded-full mx-auto animate-gradient-fast"
            ></motion.div>
            
            {/* Floating badges */}
            <div className="flex flex-wrap justify-center gap-4 mt-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="bg-purple-900/40 backdrop-blur-md px-5 py-2 rounded-full border border-purple-700/30"
              >
                <span className="text-purple-300 flex items-center gap-2">
                  <Star className="h-4 w-4" /> Award-winning
                </span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="bg-purple-900/40 backdrop-blur-md px-5 py-2 rounded-full border border-purple-700/30"
              >
                <span className="text-purple-300 flex items-center gap-2">
                  <Layers className="h-4 w-4" /> Modern Technologies
                </span>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
                className="bg-purple-900/40 backdrop-blur-md px-5 py-2 rounded-full border border-purple-700/30"
              >
                <span className="text-purple-300 flex items-center gap-2">
                  <Shield className="h-4 w-4" /> Secure By Design
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Story Section */}
      <section className="py-24 bg-black relative">
        {/* Subtle gradient corner */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-purple-900/10 rounded-bl-full blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <motion.div
            ref={storyRef}
            variants={containerVariants}
            initial="hidden"
            animate={storyInView ? "visible" : "hidden"}
            className="grid md:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={itemVariants} className="order-2 md:order-1">
              <div className="inline-block mb-6">
                <div className="flex items-center gap-2 bg-purple-950/50 px-4 py-2 rounded-full border border-purple-800/30">
                  <History className="h-4 w-4 text-purple-400" />
                  <span className="text-purple-300 text-sm font-medium">Our Journey</span>
                </div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Our Story</h2>
              
              <div className="space-y-4 text-gray-300">
                <p className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-purple-500/30 before:rounded-full">
                  ARPK Web Development was founded in 2022 by two university students with a shared passion for creating
                  beautiful, functional websites. What started as a side project quickly grew into a full-service web
                  development agency.
                </p>
                <p>
                  Our journey began when we noticed a gap in the market for affordable, high-quality web development
                  services for small businesses and startups. We combined our technical expertise and creative vision to
                  build a company that delivers premium websites without the premium price tag.
                </p>
                <p>
                  Today, we're proud to have helped dozens of clients establish their online presence and achieve their
                  business goals through custom web solutions.
                </p>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="order-1 md:order-2">
              <div className="relative">
                {/* Enhanced glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-30 animate-pulse-slow"></div>
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-16 h-16 border border-purple-700/50 rounded-lg rotate-12"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 border border-blue-700/50 rounded-lg -rotate-12"></div>
                  
                  <div className="relative bg-gray-900 rounded-2xl overflow-hidden border border-purple-900 aspect-video group">
                    <img
                      src="/Images/team-work.png"
                      alt="ARPK Team Working"
                      className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-80"></div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Mission & Vision section */}
      <section className="py-24 bg-gray-950 relative">
        {/* Background decorative elements */}
        <div className="absolute left-0 top-0 h-full w-1/6 bg-gradient-to-r from-purple-900/20 to-transparent"></div>
        <div className="absolute right-0 top-0 h-full w-1/6 bg-gradient-to-l from-indigo-900/10 to-transparent"></div>
        
        <div className="container mx-auto px-4">
          <motion.div
            ref={missionRef}
            variants={containerVariants}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <div className="flex items-center gap-2 bg-purple-950/50 px-4 py-2 rounded-full border border-purple-800/30 mx-auto">
                <Rocket className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">Forward Thinking</span>
              </div>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Our Mission & Vision
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 max-w-3xl mx-auto">
              We're driven by a clear purpose and ambitious goals for the future.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 border border-purple-700/30">
                <Target className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our Mission</h3>
              <p className="text-gray-300">
                To empower businesses with custom web solutions that are not only visually stunning but also
                strategically designed to drive growth and success. We believe that every business deserves a website
                that truly represents their brand and connects with their audience.
              </p>
              
              {/* Added features list */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <p className="text-gray-400">Craft intuitive, user-focused designs</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <p className="text-gray-400">Build scalable solutions for long-term growth</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <p className="text-gray-400">Deliver measurable business results</p>
                </div>
              </div>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/20"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-lg flex items-center justify-center mb-6 border border-purple-700/30">
                <Lightbulb className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Our Vision</h3>
              <p className="text-gray-300">
                To become the go-to web development partner for businesses seeking quality, innovation, and reliability.
                We envision a future where every client we work with achieves measurable success through their digital
                presence, and where our team continues to push the boundaries of what's possible on the web.
              </p>
              
              {/* Added features list */}
              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <p className="text-gray-400">Pioneer innovative web technologies</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <p className="text-gray-400">Build lasting client partnerships</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-purple-900/60 flex items-center justify-center mt-1">
                    <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                  </div>
                  <p className="text-gray-400">Create global impact through digital excellence</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Values section */}
      <section className="py-24 bg-black relative">
        {/* Background decorative spheres */}
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-indigo-900/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4">
          <motion.div
            ref={valuesRef}
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={itemVariants} className="inline-block mb-4">
              <div className="flex items-center gap-2 bg-purple-950/50 px-4 py-2 rounded-full border border-purple-800/30 mx-auto">
                <Star className="h-4 w-4 text-purple-400" />
                <span className="text-purple-300 text-sm font-medium">What Drives Us</span>
              </div>
            </motion.div>
            
            <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Our Core Values
            </motion.h2>
            <motion.p variants={itemVariants} className="text-gray-300 max-w-3xl mx-auto">
              The principles that guide everything we do.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 border border-purple-700/30 group-hover:bg-purple-800/50 transition-colors duration-300">
                <Code className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Quality Craftsmanship</h3>
              <p className="text-gray-300">
                We take pride in writing clean, efficient code and creating designs that stand the test of time.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group">
                <Rocket className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Innovation</h3>
              <p className="text-gray-300">
                We constantly explore new technologies and approaches to deliver cutting-edge solutions.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group">
                <Heart className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Client-Centered</h3>
              <p className="text-gray-300">
                We listen carefully to our clients' needs and build solutions that truly serve their goals.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group">
                <Zap className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Performance</h3>
              <p className="text-gray-300">
                We optimize every website for speed, responsiveness, and seamless functionality.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group">
                <Shield className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Security</h3>
              <p className="text-gray-300">
                We implement robust security measures to protect our clients and their users.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants} 
              className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-xl border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group"
            >
              <div className="w-16 h-16 bg-purple-900/50 rounded-xl flex items-center justify-center mb-6 border border-gray-700 hover:border-purple-700/30 transition-all duration-300 hover:shadow-lg hover:shadow-purple-900/10 group">
                <Award className="h-8 w-8 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Excellence</h3>
              <p className="text-gray-300">We strive for excellence in everything we do, from code to communication.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-32 bg-gradient-to-br from-purple-950 via-indigo-950 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-10"></div>
        
        {/* Enhanced glow effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse-slow"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/15 rounded-full mix-blend-multiply filter blur-[120px] animate-pulse-slow animation-delay-2000"></div>
        </div>
        
        <motion.div
          ref={ctaRef}
          variants={fadeInVariants}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          className="container mx-auto px-4 text-center relative z-10"
        >
          <div className="max-w-4xl mx-auto">
            <div className="inline-block mb-6">
              <div className="flex items-center gap-2 bg-purple-800/30 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-700/30 mx-auto">
                <Star className="h-4 w-4 text-purple-300" />
                <span className="text-purple-200 text-sm font-medium">Let's Create Together</span>
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-8 text-white tracking-tight">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Let's create something extraordinary together. Start your journey towards digital excellence.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/request">
                <Button size="lg" className="bg-white text-purple-700 hover:bg-purple-50 px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-900/30 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/40">
                  Start Your Project
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-purple-800/30 px-8 py-6 text-lg rounded-xl shadow-lg shadow-purple-900/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/30">
                  Get in Touch
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </section>
      
      {/* Add CSS for custom animations */}
      <style jsx global>{`
        @keyframes gradient-slow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-10px) translateX(10px); }
          50% { transform: translateY(0px) translateX(20px); }
          75% { transform: translateY(10px) translateX(10px); }
          100% { transform: translateY(0px) translateX(0px); }
        }

        @keyframes pulse-slow {
          0% { opacity: 0.4; }
          50% { opacity: 0.7; }
          100% { opacity: 0.4; }
        }

        .animate-gradient-slow {
          animation: gradient-slow 15s ease infinite;
          background-size: 400% 400%;
        }

        .animate-gradient-fast {
          animation: gradient-slow 3s ease infinite;
          background-size: 200% 200%;
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-3000 {
          animation-delay: 3s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}