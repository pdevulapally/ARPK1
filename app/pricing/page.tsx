"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Check, X, AlertTriangle, Loader2 } from "lucide-react"
import Link from "next/link"
import { useInView } from "framer-motion"

export default function PricingPage() {
  const [aiLoading, setAiLoading] = useState(false)
  const [aiResponse, setAiResponse] = useState("")
  const [projectDescription, setProjectDescription] = useState("")

  const comparisonRef = useRef(null)
  const quoteRef = useRef(null)
  const isComparisonInView = useInView(comparisonRef, { once: true, amount: 0.3 })
  const isQuoteInView = useInView(quoteRef, { once: true, amount: 0.3 })

  const handleAiSuggestion = async (e: React.FormEvent) => {
    e.preventDefault()
    setAiLoading(true)

    try {
      // In a real implementation, this would call an API endpoint that uses Groq AI
      // For now, we'll simulate the AI response
      const response = await simulateAiResponse(projectDescription)
      setAiResponse(response)
    } catch (error) {
      console.error("Error getting AI suggestion:", error)
      setAiResponse("Sorry, there was an error processing your request. Please try again.")
    } finally {
      setAiLoading(false)
    }
  }

  // This simulates what would normally be an API call to Groq AI
  const simulateAiResponse = async (description: string): Promise<string> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const lowercaseDesc = description.toLowerCase()

    if (
      lowercaseDesc.includes("portfolio") ||
      lowercaseDesc.includes("landing page") ||
      lowercaseDesc.includes("simple") ||
      lowercaseDesc.includes("basic")
    ) {
      return "Based on your description, I recommend our **Simple Website** plan (£100-£200). This is perfect for your portfolio or landing page needs, and we can deliver it in 2-4 weeks."
    } else if (
      lowercaseDesc.includes("blog") ||
      lowercaseDesc.includes("contact form") ||
      lowercaseDesc.includes("medium") ||
      lowercaseDesc.includes("business")
    ) {
      return "Your project sounds like a good fit for our **Medium Website** plan (£250-£400). This includes custom animations and contact forms, and we can deliver it in 5-7 weeks."
    } else if (
      lowercaseDesc.includes("login") ||
      lowercaseDesc.includes("dashboard") ||
      lowercaseDesc.includes("admin") ||
      lowercaseDesc.includes("complex") ||
      lowercaseDesc.includes("ecommerce") ||
      lowercaseDesc.includes("e-commerce") ||
      lowercaseDesc.includes("payment")
    ) {
      return "Your project requires our **Complex Website** plan (£500-£1000+). This includes login systems, dashboards, and admin panels. We can deliver it in 10-20 weeks depending on the complexity."
    } else {
      return "I need a bit more information to make a recommendation. Could you tell me more about the number of pages you need, any special features (like login systems, forms, or e-commerce), and your timeline?"
    }
  }

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">
          Transparent Pricing
        </h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Choose the perfect plan for your project. No hidden fees, just clear pricing based on your needs.
        </p>
      </div>

      {/* Pricing Cards */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Simple Website */}
        <motion.div variants={fadeInUp} className="h-full">
          <Card className="relative h-full overflow-hidden border border-green-500/30 bg-black/60 backdrop-blur-md hover:scale-105 transition-transform duration-300 hover:border-green-500/50 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-green-400 to-green-600 shadow-[0_0_10px_rgba(34,197,94,0.7)]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Simple Website</CardTitle>
              <CardDescription>Perfect for portfolios and landing pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">£100 – £200</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>1–3 pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Clean, mobile-friendly design</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Ideal for portfolios and landing pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Time: ~2–4 weeks</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/request">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Medium Website */}
        <motion.div variants={fadeInUp} className="h-full">
          <Card className="relative h-full overflow-hidden border border-yellow-500/30 bg-black/60 backdrop-blur-md hover:scale-105 transition-transform duration-300 hover:border-yellow-500/50 hover:shadow-[0_0_15px_rgba(234,179,8,0.3)]">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-yellow-400 to-yellow-600 shadow-[0_0_10px_rgba(234,179,8,0.7)]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Medium Website</CardTitle>
              <CardDescription>For businesses with more content needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">£250 – £400</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>4–8 pages</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Custom animations, contact forms</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Optional blog (Notion/Sanity integration)</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Time: ~5–7 weeks</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-yellow-600 hover:bg-yellow-700">
                <Link href="/request">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Complex Website */}
        <motion.div variants={fadeInUp} className="h-full">
          <Card className="relative h-full overflow-hidden border border-red-500/30 bg-black/60 backdrop-blur-md hover:scale-105 transition-transform duration-300 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]">
            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-red-400 to-red-600 shadow-[0_0_10px_rgba(239,68,68,0.7)]"></div>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Complex Website</CardTitle>
              <CardDescription>Advanced functionality and systems</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">£500 – £1000+</div>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span>Logins, dashboards, admin panels</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span>Stripe integration, user systems</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span>Custom CMS and advanced features</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span>Time: ~10–20 weeks</span>
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/request">Get Started</Link>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </motion.div>

      {/* AI Plan Suggester */}
      <div className="mb-20">
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center">
              <span className="bg-purple-600 text-white p-1 rounded-md mr-2 text-sm">AI</span>
              Not sure which plan is right for you?
            </CardTitle>
            <CardDescription>
              Tell us about your project and our AI assistant will recommend the best plan for you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAiSuggestion} className="space-y-4">
              <Textarea
                placeholder="Describe your project: type of site, number of pages, special features, timeline..."
                className="min-h-[120px] bg-black/50 border-purple-500/30 focus:border-purple-500"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
              />
              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={aiLoading || projectDescription.trim().length < 10}
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing your project...
                  </>
                ) : (
                  "Get AI Recommendation"
                )}
              </Button>
            </form>

            {aiResponse && (
              <div className="mt-6 p-4 rounded-lg bg-purple-900/20 border border-purple-500/30">
                <h3 className="font-medium text-lg mb-2">Our Recommendation:</h3>
                <div
                  className="text-gray-200"
                  dangerouslySetInnerHTML={{
                    __html: aiResponse.replace(/\*\*(.*?)\*\*/g, '<span class="font-bold text-purple-400">$1</span>'),
                  }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Discount Section */}
      <div className="mb-20">
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md overflow-hidden">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Special Discounts</CardTitle>
            <CardDescription>We offer special pricing for the following groups</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/40 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-all">
                <h3 className="text-lg font-medium mb-2">Students</h3>
                <p className="text-gray-300 mb-2">20% off any plan with valid student ID</p>
                <div className="text-2xl font-bold text-purple-400">20% OFF</div>
              </div>
              <div className="bg-black/40 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-all">
                <h3 className="text-lg font-medium mb-2">Startups</h3>
                <p className="text-gray-300 mb-2">15% off for registered startups under 2 years old</p>
                <div className="text-2xl font-bold text-purple-400">15% OFF</div>
              </div>
              <div className="bg-black/40 border border-purple-500/20 rounded-lg p-4 hover:border-purple-500/50 transition-all">
                <h3 className="text-lg font-medium mb-2">Non-Profits</h3>
                <p className="text-gray-300 mb-2">25% off for registered non-profit organizations</p>
                <div className="text-2xl font-bold text-purple-400">25% OFF</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Section */}
      <motion.div
        className="mb-20"
        ref={comparisonRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isComparisonInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Why Choose ARPK?</CardTitle>
            <CardDescription>See how we compare to other popular website building options</CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-purple-500/20">
                  <th className="text-left py-4 px-2">Feature</th>
                  <th className="text-left py-4 px-2 bg-purple-900/20">ARPK</th>
                  <th className="text-left py-4 px-2">Wix</th>
                  <th className="text-left py-4 px-2">WordPress</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-purple-500/10 hover:bg-purple-900/10">
                  <td className="py-4 px-2 font-medium">Fully Custom Code</td>
                  <td className="py-4 px-2 bg-purple-900/10 text-green-400">
                    <Check className="h-5 w-5" />
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    <X className="h-5 w-5" /> <span className="text-xs text-gray-400">(Template-Based)</span>
                  </td>
                  <td className="py-4 px-2 text-yellow-400">
                    <AlertTriangle className="h-5 w-5" /> <span className="text-xs text-gray-400">(Limited)</span>
                  </td>
                </tr>
                <tr className="border-b border-purple-500/10 hover:bg-purple-900/10">
                  <td className="py-4 px-2 font-medium">Backend/Logins</td>
                  <td className="py-4 px-2 bg-purple-900/10 text-green-400">
                    <Check className="h-5 w-5" /> <span className="text-xs text-gray-400">(Included on demand)</span>
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    <X className="h-5 w-5" />
                  </td>
                  <td className="py-4 px-2 text-yellow-400">
                    <AlertTriangle className="h-5 w-5" />{" "}
                    <span className="text-xs text-gray-400">(Plugin Required)</span>
                  </td>
                </tr>
                <tr className="border-b border-purple-500/10 hover:bg-purple-900/10">
                  <td className="py-4 px-2 font-medium">Timeline Flexibility</td>
                  <td className="py-4 px-2 bg-purple-900/10 text-green-400">
                    <Check className="h-5 w-5" /> <span className="text-xs text-gray-400">(Tailored to you)</span>
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    <X className="h-5 w-5" /> <span className="text-xs text-gray-400">(Fixed)</span>
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    <X className="h-5 w-5" /> <span className="text-xs text-gray-400">(Depends on devs)</span>
                  </td>
                </tr>
                <tr className="border-b border-purple-500/10 hover:bg-purple-900/10">
                  <td className="py-4 px-2 font-medium">One-to-One Support</td>
                  <td className="py-4 px-2 bg-purple-900/10 text-green-400">
                    <Check className="h-5 w-5" /> <span className="text-xs text-gray-400">(Direct with devs)</span>
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    <X className="h-5 w-5" /> <span className="text-xs text-gray-400">(Bot/Forum)</span>
                  </td>
                  <td className="py-4 px-2 text-yellow-400">
                    <AlertTriangle className="h-5 w-5" /> <span className="text-xs text-gray-400">(Community)</span>
                  </td>
                </tr>
                <tr className="border-b border-purple-500/10 hover:bg-purple-900/10">
                  <td className="py-4 px-2 font-medium">Stripe Integration</td>
                  <td className="py-4 px-2 bg-purple-900/10 text-green-400">
                    <Check className="h-5 w-5" /> <span className="text-xs text-gray-400">(Built-in)</span>
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    <X className="h-5 w-5" /> <span className="text-xs text-gray-400">(Premium App)</span>
                  </td>
                  <td className="py-4 px-2 text-yellow-400">
                    <AlertTriangle className="h-5 w-5" />{" "}
                    <span className="text-xs text-gray-400">(Requires setup)</span>
                  </td>
                </tr>
                <tr className="hover:bg-purple-900/10">
                  <td className="py-4 px-2 font-medium">Pricing Transparency</td>
                  <td className="py-4 px-2 bg-purple-900/10 text-green-400">
                    <Check className="h-5 w-5" /> <span className="text-xs text-gray-400">(Fixed Quote)</span>
                  </td>
                  <td className="py-4 px-2 text-red-400">
                    <X className="h-5 w-5" /> <span className="text-xs text-gray-400">(Hidden Fees)</span>
                  </td>
                  <td className="py-4 px-2 text-yellow-400">
                    <AlertTriangle className="h-5 w-5" /> <span className="text-xs text-gray-400">(Varies)</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </motion.div>

      {/* How It Works */}
      <motion.div
        className="mb-20"
        ref={quoteRef}
        initial={{ opacity: 0, y: 20 }}
        animate={isQuoteInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">How It Works</CardTitle>
            <CardDescription>Our transparent pricing process explained</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <p className="text-lg">We price based on how complex the site is — for example:</p>
              <ul className="space-y-2 mt-4">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Simple portfolio sites are usually £100–200</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-yellow-500 mr-2 shrink-0 mt-0.5" />
                  <span>Business sites range from £250–400</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-red-500 mr-2 shrink-0 mt-0.5" />
                  <span>Bigger builds like e-commerce or dashboards start at £500+</span>
                </li>
              </ul>
              <p className="mt-4">
                Once we see your request, we'll send a clear quote + timeline. No hidden fees or surprises.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* FAQ Section */}
      <div className="mb-20">
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Frequently Asked Questions</CardTitle>
            <CardDescription>Common questions about our pricing and process</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="payment" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-purple-500/20">
                <TabsTrigger value="payment">Payment</TabsTrigger>
                <TabsTrigger value="process">Process</TabsTrigger>
                <TabsTrigger value="support">Support</TabsTrigger>
              </TabsList>
              <TabsContent value="payment" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Do you require a deposit?</h3>
                  <p className="text-gray-300">
                    Yes, we typically require a 50% deposit to begin work, with the remaining 50% due upon project
                    completion.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What payment methods do you accept?</h3>
                  <p className="text-gray-300">We accept credit/debit cards, bank transfers, and PayPal.</p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Are there any hidden fees?</h3>
                  <p className="text-gray-300">
                    No, we provide a clear quote upfront with no hidden fees. Any additional work requested after the
                    initial quote will be discussed and agreed upon before proceeding.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="process" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">How long does the process take?</h3>
                  <p className="text-gray-300">
                    Timelines vary by project complexity: Simple websites (2-4 weeks), Medium websites (5-7 weeks), and
                    Complex websites (10-20 weeks).
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What's included in the price?</h3>
                  <p className="text-gray-300">
                    Our pricing includes design, development, testing, and deployment. We also include basic SEO setup
                    and responsive design for all devices.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Do you offer revisions?</h3>
                  <p className="text-gray-300">
                    Yes, we include 2 rounds of revisions in our standard pricing. Additional revisions can be arranged
                    at an hourly rate.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="support" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Do you provide ongoing support?</h3>
                  <p className="text-gray-300">
                    We offer 30 days of free support after project completion. Beyond that, we offer monthly maintenance
                    packages or hourly support as needed.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Who will I be working with?</h3>
                  <p className="text-gray-300">
                    You'll work directly with our founders, Arjun and Preetham, throughout the entire process.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">What if I need help after the project is complete?</h3>
                  <p className="text-gray-300">
                    We're always available to help with updates or issues. We offer hourly support or monthly
                    maintenance packages depending on your needs.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <div>
        <Card className="border border-purple-500/30 bg-gradient-to-r from-purple-900/50 to-purple-600/50 backdrop-blur-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-gray-200 mb-6 max-w-2xl mx-auto">
              Let's build something amazing together. Request a quote today and we'll get back to you within 24 hours.
            </p>
            <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
              <Link href="/request">Request a Quote</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
