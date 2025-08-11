import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Zap, Shield, ChevronRight, Award, Users, Globe } from "lucide-react"
import Spline from '@splinetool/react-spline'
import Navbar from "@/components/navbar"
import HeroSection from "@/components/ui/hero-section"
import { FeatureSteps } from "@/components/ui/feature-section"

export default function Home() {
  const features = [
    { 
      step: 'Feature 1', 
      title: 'Responsive & Device-Optimized Designs',
      content: 'Websites that look stunning on all screens', 
      image: '/Images/left-screen.png' 
    },
    { 
      step: 'Feature 2',
      title: 'SEO & Performance Optimisation',
      content: 'Speed-optimised and search-friendly websites from day one',
      image: '/Images/SEOandOptimisation.png'
    },
    { 
      step: 'Feature 3',
      title: 'Custom Web Applications',
      content: 'We build complex solutions tailored to your exact needs',
      image: '/Images/middle-screen.png'
    },
    { 
      step: 'Feature 4',
      title: 'Direct with Developers 🔥',
      content: 'No middlemen — communicate directly with the developer building your project',
      image: '/Images/team-work.png'
    },
    { 
      step: 'Feature 5',
      title: 'E-Commerce Integration',
      content: 'Sell anything with powerful online store setups',
      image: '/Images/senjewels.png'
    },
    { 
      step: 'Feature 6',
      title: 'Ongoing Maintenance & Support',
      content: 'We don\'t disappear after launch — we\'re here for updates and fixes',
      image: '/Images/Maintainance.png'
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <Navbar />
      {/* Navbar Accent Line */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 w-full" />

      {/* Hero Section */}
      <HeroSection />

      {/* Trusted By Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50 border-y border-gray-100 dark:border-gray-800 overflow-hidden">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500 dark:text-gray-400 text-sm font-medium uppercase tracking-wider mb-8">
           Services we use to build your website
          </p>
          <div className="relative">
            <div className="flex animate-infinite-scroll space-x-12">
              {/* First set of logos */}
              <div className="flex items-center space-x-12 shrink-0">
                <img src="/Images/Firebase_Logo.png" alt="Brand 1" className="h-8 w-32 object-contain" />
                <img src="/Images/Netlify_logo_(2).svg" alt="Brand 2" className="h-8 w-32 object-contain" />
                <img src="/Images/Nextjs.png" alt="Brand 3" className="h-8 w-32 object-contain" />
                <img src="/Images/Stripe_Logo,_revised_2016.svg.png" alt="Brand 4" className="h-8 w-32 object-contain" />
                <img src="/Images/vercel-text.png" alt="Brand 5" className="h-8 w-32 object-contain" />
              </div>
              {/* Duplicate set for seamless loop */}
              <div className="flex items-center space-x-12 shrink-0">
                <img src="/Images/Firebase_Logo.png" alt="Brand 1" className="h-8 w-32 object-contain" />
                <img src="/Images/Netlify_logo_(2).svg" alt="Brand 2" className="h-8 w-32 object-contain" />
                <img src="/Images/Nextjs.png" alt="Brand 3" className="h-8 w-32 object-contain" />
                <img src="/Images/Stripe_Logo,_revised_2016.svg.png" alt="Brand 4" className="h-8 w-32 object-contain" />
                <img src="/Images/vercel-text.png" alt="Brand 5" className="h-8 w-32 object-contain" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Replaced with FeatureSteps */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        
        <FeatureSteps 
          features={features}
          title="Our Services & Features"
          autoPlayInterval={4000}
          imageHeight="h-[500px]"
        />
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center mb-16">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold uppercase tracking-wider">
              Why ARPK
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              The <span className="text-purple-600 dark:text-purple-400">ARPK</span> Difference
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              What sets our work apart and why industry leaders choose to partner with us.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Uncompromising Quality</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Meticulous attention to detail and relentless pursuit of excellence in every project we undertake.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Client Partnership</h3>
              <p className="text-gray-600 dark:text-gray-400">
                A collaborative approach that treats your goals as our goals, ensuring alignment at every stage.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="mx-auto w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-6">
                <Globe className="h-8 w-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Global Expertise</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Drawing from international best practices while delivering solutions tailored to your local market.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-purple-800" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-300/10 rounded-full filter blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Ready to Transform Your Digital Presence?
            </h2>
            <p className="text-xl md:text-2xl text-purple-100 mb-10 leading-relaxed">
              Let's collaborate to create a digital experience that captivates your audience and elevates your brand to new heights.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link href="/request">
                <Button className="bg-white hover:bg-gray-50 text-purple-700 px-10 py-7 text-lg font-medium rounded-lg shadow-xl hover:shadow-white/20 transition-all duration-300">
                  Schedule a Consultation
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="bg-white/5 backdrop-blur-sm px-10 py-7 text-lg font-medium rounded-lg border-2 border-white/20 text-white hover:bg-white/10 transition-all duration-300">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <footer className="py-16 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="space-y-4">
              <h4 className="text-lg font-bold text-gray-900 dark:text-white">ARPK Studio</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Crafting exceptional digital experiences that drive business growth and user engagement.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Services</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="/services/development" className="hover:text-purple-600 dark:hover:text-purple-400">Web Development</a></li>
                <li><a href="/services/design" className="hover:text-purple-600 dark:hover:text-purple-400">UI/UX Design</a></li>
                <li><a href="/services/optimization" className="hover:text-purple-600 dark:hover:text-purple-400">Performance</a></li>
                <li><a href="/services/security" className="hover:text-purple-600 dark:hover:text-purple-400">Security</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li><a href="/about" className="hover:text-purple-600 dark:hover:text-purple-400">About Us</a></li>
                <li><a href="/portfolio" className="hover:text-purple-600 dark:hover:text-purple-400">Portfolio</a></li>
                <li><a href="/careers" className="hover:text-purple-600 dark:hover:text-purple-400">Careers</a></li>
                <li><a href="/contact" className="hover:text-purple-600 dark:hover:text-purple-400">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                <li>arpkwebsitedevelopment@gmail.com</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                © 2024 ARPK Studio. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
                <a href="/privacy" className="hover:text-purple-600 dark:hover:text-purple-400">Privacy Policy</a>
                <a href="/terms" className="hover:text-purple-600 dark:hover:text-purple-400">Terms of Service</a>
                <a href="/cookies" className="hover:text-purple-600 dark:hover:text-purple-400">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
