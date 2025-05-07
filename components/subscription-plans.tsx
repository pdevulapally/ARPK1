"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Check } from "lucide-react"
import { getAllSubscriptionPlans, type SubscriptionPlan } from "@/lib/firebase"
import { useAuth } from "@/lib/auth"

export function SubscriptionPlans() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const plansData = await getAllSubscriptionPlans()
        setPlans(plansData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load subscription plans",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchPlans()
  }, [toast])

  const handleSubscribe = async (plan: SubscriptionPlan) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to subscribe to a plan",
        variant: "destructive",
      })
      return
    }

    try {
      setSubscribing(plan.id)

      // In a real implementation, this would create a subscription in Stripe
      // For now, we'll just show a success message
      toast({
        title: "Subscription Created",
        description: `You have successfully subscribed to the ${plan.name} plan.`,
      })

      // Redirect to dashboard or subscription management page
      // window.location.href = "/dashboard/subscriptions"
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create subscription",
        variant: "destructive",
      })
    } finally {
      setSubscribing(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Maintenance Plans</h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Keep your website running smoothly with our maintenance plans. Choose the plan that best fits your needs.
        </p>
      </div>

      <Tabs defaultValue="monthly" className="w-full max-w-4xl mx-auto">
        <div className="flex justify-center mb-6">
          <TabsList className="bg-black/40 border border-purple-500/20">
            <TabsTrigger value="monthly" onClick={() => setBillingCycle("monthly")}>
              Monthly Billing
            </TabsTrigger>
            <TabsTrigger value="yearly" onClick={() => setBillingCycle("yearly")}>
              Yearly Billing <Badge className="ml-2 bg-green-500/20 text-green-400">Save 20%</Badge>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="border border-purple-500/30 bg-black/60 backdrop-blur-md hover:border-purple-500/50 transition-all"
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    ${plan.monthlyPrice}
                    <span className="text-sm font-normal text-gray-400">/month</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribing === plan.id}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {subscribing === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="yearly" className="space-y-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className="border border-purple-500/30 bg-black/60 backdrop-blur-md hover:border-purple-500/50 transition-all"
              >
                <CardHeader>
                  <CardTitle>{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold">
                    ${plan.yearlyPrice}
                    <span className="text-sm font-normal text-gray-400">/year</span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-purple-500 mr-2 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => handleSubscribe(plan)}
                    disabled={subscribing === plan.id}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    {subscribing === plan.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Subscribe Now"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
