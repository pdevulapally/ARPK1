"use client"
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react";
import Link from 'next/link';

export default function ShaderShowcase() {
  return (
    <div className="bg-transparent relative w-full overflow-hidden">
      {/* Shader Background */}
      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#9333ea", "#7c3aed", "#6d28d9", "#5b21b6"]}
        speed={0.3}
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#000000", "#ffffff", "#9333ea", "#7c3aed"]}
        speed={0.2}
      />


      <div className="relative z-10 container mx-auto px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-5xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto mb-6 flex justify-center"
          >
            <div className="border-white/20 bg-white/10 inline-flex items-center rounded-full border px-3 py-1 text-sm backdrop-blur-sm">
              <span className="bg-purple-600 mr-2 rounded-full px-2 py-0.5 text-xs font-semibold text-white">
                New
              </span>
              <span className="text-white/80">
                Professional web development services
              </span>
              <ChevronRight className="text-white/80 ml-1 h-4 w-4" />
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="from-purple-400/10 via-white/85 to-white/50 bg-gradient-to-tl bg-clip-text text-center text-4xl tracking-tighter text-balance text-transparent sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Transform your business with stunning digital experiences
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-white/70 mx-auto mt-6 max-w-2xl text-center text-lg"
          >
            We create high-performance websites that drive results. From concept to launch, 
            ARPK delivers exceptional web solutions tailored to your business needs.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto"
          >
            <Button
              size="lg"
              className="group bg-purple-600 text-white hover:shadow-purple-600/30 relative overflow-hidden rounded-full px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto shadow-lg transition-all duration-300 text-sm sm:text-base font-semibold"
            >
              <span className="relative z-10 flex items-center justify-center">
                Start Your Project
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="from-purple-600 via-purple-500 to-purple-400 absolute inset-0 z-0 bg-gradient-to-r opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-white/10 flex items-center gap-2 rounded-full backdrop-blur-sm text-white hover:bg-white/20 px-4 sm:px-6 py-3 sm:py-4 w-full sm:w-auto text-sm sm:text-base font-semibold"
            >
              <ExternalLink className="h-4 w-4" />
              <Link href="/contact">Contact Us</Link>
            </Button>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
