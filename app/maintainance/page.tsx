"use client"

import Image from "next/image"
import { useState } from "react"
import { CheckCircle } from "lucide-react"
import CustomMaintenanceForm from "@/components/CustomMaintenanceForm"

const plans = [
  {
    name: "Basic Maintenance",
    price: "£29/mo",
    description: "Essential updates, security monitoring, and monthly backups for your website.",
    features: [
      "Monthly core & plugin updates",
      "Security monitoring",
      "Monthly backups",
      "Email support",
    ],
    planKey: "basic",
  },
  {
    name: "Standard Maintenance",
    price: "£59/mo",
    description: "Everything in Basic, plus priority support and bi-weekly updates.",
    features: [
      "Bi-weekly updates",
      "Priority email support",
      "Performance checks",
      "Uptime monitoring",
    ],
    planKey: "standard",
    featured: true,
  },
  {
    name: "Premium Maintenance",
    price: "£99/mo",
    description: "Full-service maintenance, including content updates and on-demand support.",
    features: [
      "Weekly updates",
      "On-demand content changes",
      "Phone & chat support",
      "Advanced security scans",
    ],
    planKey: "premium",
  },
]

export default function MaintenancePlansPage() {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const handleSubscribe = async (planKey: string) => {
    setLoadingPlan(planKey)
    setError(null)
    try {
      const res = await fetch("/api/stripe/checkout-maintenance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || "Something went wrong. Please try again.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoadingPlan(null)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#1a1333] via-[#2d1846] to-[#1a1333] text-white px-2 py-8 flex flex-col items-center">
      {/* Hero Section */}
      <div className="w-full max-w-6xl flex flex-col-reverse md:flex-row items-center justify-between gap-8 md:gap-16 mb-12 md:mb-20 mt-8 md:mt-20">
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600 drop-shadow-lg">
            Website Maintenance Plans
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 max-w-xl text-gray-200">
            Keep your website secure, up-to-date, and running smoothly. Choose a plan that fits your needs and pay securely in GBP via Stripe.
          </p>
          {error && <div className="mb-4 text-red-400 font-semibold text-center md:text-left">{error}</div>}
        </div>
        <div className="flex-1 flex justify-center items-center">
          <Image
            src="/Images/Maintainance.png"
            alt="Maintenance"
            width={350}
            height={260}
            className="rounded-2xl shadow-2xl max-w-[90vw] h-auto border-4 border-purple-700/30 bg-black/30"
            priority
          />
        </div>
      </div>
      {/* Soft Divider */}
      <div className="w-full max-w-4xl h-1 bg-gradient-to-r from-transparent via-purple-700/30 to-transparent rounded-full mb-12" />
      {/* Plans Section */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={plan.name}
            className={`relative flex flex-col h-full bg-black/80 border border-purple-500/30 rounded-2xl shadow-xl p-8 items-center transition-transform duration-300 hover:scale-[1.03] hover:border-purple-400/60 hover:shadow-2xl
              ${plan.featured ? "ring-2 ring-purple-400 border-2 scale-105 z-10" : ""}
            `}
          >
            {plan.featured && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-purple-700 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg border border-purple-300/40 z-20">
                Most Popular
              </span>
            )}
            <h2 className="text-2xl font-bold mb-2 text-purple-300 text-center">{plan.name}</h2>
            <div className="text-3xl font-extrabold mb-2 text-purple-100">{plan.price}</div>
            <p className="mb-4 text-center text-gray-300">{plan.description}</p>
            <ul className="mb-6 text-left space-y-3 w-full max-w-xs mx-auto">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-gray-200">
                  <CheckCircle className="w-5 h-5 text-purple-400 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
            {plan.planKey === "basic" ? (
              <a
                href="https://buy.stripe.com/eVq28rbdr7kz6pdbmnfbq00"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200">
                  Choose this Plan
                </button>
              </a>
            ) : plan.planKey === "standard" ? (
              <a
                href="https://buy.stripe.com/bJe7sL2GV34j6pd1LNfbq01"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200">
                  Upgrade Now
                </button>
              </a>
            ) : plan.planKey === "premium" ? (
              <a
                href="https://buy.stripe.com/5kQeVda9n9sHdRF2PRfbq02"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200">
                  Choose this Plan
                </button>
              </a>
            ) : (
              <button
                className={`w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 focus:ring-offset-black ${loadingPlan === plan.planKey ? "opacity-60 cursor-not-allowed" : ""}`}
                onClick={() => handleSubscribe(plan.planKey)}
                disabled={loadingPlan === plan.planKey}
              >
                {loadingPlan === plan.planKey
                  ? (plan.featured ? "Redirecting..." : "Redirecting...")
                  : (plan.featured ? "Upgrade Now" : "Choose this Plan")}
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Contact Us Button */}
      <div className="flex justify-center mt-10">
        <button
          className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-8 py-4 rounded-lg shadow-lg transition-all duration-200 text-lg"
          onClick={() => setModalOpen(true)}
        >
          Contact Us for Custom Maintenance
        </button>
      </div>
      <CustomMaintenanceForm open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
} 
