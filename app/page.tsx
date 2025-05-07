import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Code, Zap, Shield, ChevronRight, Award, Users, Globe } from "lucide-react"
import Spline from '@splinetool/react-spline'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Navbar Accent Line */}
      <div className="h-1 bg-gradient-to-r from-purple-600 via-violet-500 to-indigo-600 w-full" />

      {/* Hero Section - with Spline 3D */}
      <section className="relative pt-36 pb-24 md:pt-48 md:pb-32 overflow-hidden">
        {/* Spline Background */}
        <div className="absolute inset-0 z-0">
          <Spline 
            scene="https://prod.spline.design/Gqncpqdr6VRaRJ7u/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        
        {/* Remove or comment out the old gradient backgrounds */}
        {/* <div className="absolute inset-0 bg-[radial-gradient(...)]" /> */}
        {/* <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/5..." /> */}
        {/* <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-600/5..." /> */}

        <div className="container mx-auto px-4 relative z-10">
          {/* Rest of your hero content remains the same */}
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-4 px-4 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 text-sm font-medium">
              Transforming Digital Experiences Since 2018
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-violet-600 to-indigo-700 dark:from-purple-400 dark:via-violet-400 dark:to-indigo-400 leading-tight">
              Your Vision, Our Code
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-10 leading-relaxed">
              ARPK Studio delivers meticulously designed websites that captivate your audience, elevate your brand, and drive exceptional results.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-5">
              <Link href="/request" className="w-full sm:w-auto">
                <Button className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 dark:from-purple-600 dark:to-indigo-600 text-white px-10 py-7 text-lg font-medium rounded-lg shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                  Request a Consultation <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/portfolio" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full px-10 py-7 text-lg font-medium rounded-lg border-2 border-gray-300 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-all duration-300">
                  View Our Work
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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

      {/* Features Section */}
      <section className="py-24 md:py-32 bg-white dark:bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent" />
        
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center mb-16">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              Services
            </div>
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              Digital Solutions <span className="text-purple-600 dark:text-purple-400">Expertly Crafted</span> For You
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Our comprehensive suite of services designed to elevate your digital presence and drive business growth.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 group hover:border-purple-200 dark:hover:border-purple-800/30 transition-all duration-300 hover:shadow-purple-500/5">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-all duration-300">
                <Code className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Bespoke Development</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Meticulous custom websites built from the ground up to align perfectly with your brand identity and business objectives.
              </p>
              <Link href="/services/development" className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 group hover:border-purple-200 dark:hover:border-purple-800/30 transition-all duration-300 hover:shadow-purple-500/5">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-all duration-300">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Performance Excellence</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Ultra-responsive websites optimized for speed, search engine visibility, and exceptional conversion rates.
              </p>
              <Link href="/services/optimization" className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-900 p-8 md:p-10 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 group hover:border-purple-200 dark:hover:border-purple-800/30 transition-all duration-300 hover:shadow-purple-500/5">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 dark:from-purple-600 dark:to-indigo-700 rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/30 transition-all duration-300">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Enterprise Security</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">
                Advanced protection systems safeguarding your digital assets and customer data against evolving threats.
              </p>
              <Link href="/services/security" className="flex items-center text-purple-600 dark:text-purple-400 font-medium group-hover:text-purple-700 dark:group-hover:text-purple-300 transition-colors duration-300">
                Learn more <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
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
                <li>PreethamDevulapally@gmail.com</li>
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
