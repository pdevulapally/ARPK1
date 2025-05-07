"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Calendar } from "lucide-react"
import { useAuth } from "@/lib/auth"
import AuthGuard from "@/components/auth-guard"
import { getUserSubscriptions, type UserSubscription } from "@/lib/firebase"
import { format } from "date-fns"
import { SubscriptionPlans } from "@/components/subscription-plans"

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    const fetchSubscriptions = async () => {
      if (!user) return

      try {
        setLoading(true)
        const subscriptionsData = await getUserSubscriptions(user.uid)
        setSubscriptions(subscriptionsData)
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load subscriptions",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchSubscriptions()
  }, [user, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">Maintenance Plans</h1>

        {subscriptions.length > 0 ? (
          <div className="space-y-8">
            <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
              <CardHeader>
                <CardTitle>Your Active Subscriptions</CardTitle>
                <CardDescription>Manage your current maintenance plans</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {subscriptions.map((subscription) => (
                  <Card key={subscription.id} className="border border-purple-500/20 bg-black/40">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold">{subscription.planName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {subscription.billingCycle.charAt(0).toUpperCase() + subscription.billingCycle.slice(1)}{" "}
                            billing
                          </p>
                        </div>
                        <Badge
                          className={
                            subscription.status === "active"
                              ? "bg-green-500/20 text-green-500"
                              : subscription.status === "cancelled"
                                ? "bg-yellow-500/20 text-yellow-500"
                                : "bg-red-500/20 text-red-500"
                          }
                        >
                          {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Price</p>
                          <p className="text-sm">
                            ${subscription.price}/{subscription.billingCycle}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Start Date</p>
                          <p className="text-sm">{format(new Date(subscription.startDate), "MMM d, yyyy")}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">End Date</p>
                          <p className="text-sm">{format(new Date(subscription.endDate), "MMM d, yyyy")}</p>
                        </div>
                      </div>

                      <div className="flex justify-end">
                        {subscription.status === "active" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-500/30 text-red-500 hover:bg-red-900/20"
                          >
                            Cancel Subscription
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">Upgrade Your Plan</h2>
              <p className="text-gray-400 max-w-2xl mx-auto mb-8">
                Looking for more features? Check out our other maintenance plans below.
              </p>
            </div>
          </div>
        ) : (
          <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md mb-12">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="mx-auto w-16 h-16 rounded-full bg-purple-900/30 flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-purple-400" />
                </div>
                <h2 className="text-2xl font-bold mb-2">No Active Subscriptions</h2>
                <p className="text-gray-400 max-w-lg mx-auto">
                  You don't have any active maintenance plans. Subscribe to a plan to keep your website running
                  smoothly.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <SubscriptionPlans />
      </div>
    </AuthGuard>
  )
}
