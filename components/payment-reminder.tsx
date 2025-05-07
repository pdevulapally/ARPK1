"use client"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Bell, Calendar, DollarSign } from "lucide-react"
import { PaymentButton } from "@/components/payment-button"
import type { PaymentReminder } from "@/lib/firebase"

interface PaymentReminderCardProps {
  reminder: PaymentReminder
  projectId: string
  userEmail: string
}

export function PaymentReminderCard({ reminder, projectId, userEmail }: PaymentReminderCardProps) {
  const { toast } = useToast()
  const dueDate = new Date(reminder.dueDate)
  const isOverdue = dueDate < new Date() && reminder.status === "pending"

  // Calculate days until due or days overdue
  const today = new Date()
  const diffTime = Math.abs(dueDate.getTime() - today.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  return (
    <Card className={`border ${isOverdue ? "border-red-500/30" : "border-purple-500/30"} bg-black/60 backdrop-blur-md`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="flex items-center gap-2">
            <Bell className={`h-5 w-5 ${isOverdue ? "text-red-500" : "text-purple-500"}`} />
            Payment Reminder
          </CardTitle>
          <Badge
            className={
              reminder.status === "paid"
                ? "bg-green-500/20 text-green-500"
                : isOverdue
                  ? "bg-red-500/20 text-red-500"
                  : "bg-yellow-500/20 text-yellow-500"
            }
          >
            {reminder.status === "paid" ? "Paid" : isOverdue ? "Overdue" : "Due Soon"}
          </Badge>
        </div>
        <CardDescription>
          {reminder.paymentType === "deposit" ? "Deposit Payment (50%)" : "Final Payment (50%)"}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-gray-400" />
              <span>Amount Due:</span>
            </div>
            <span className="font-medium">${reminder.amount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>Due Date:</span>
            </div>
            <span className="font-medium">{new Date(reminder.dueDate).toLocaleDateString()}</span>
          </div>

          {isOverdue ? (
            <div className="text-red-500 text-sm font-medium text-center mt-2">
              {diffDays} {diffDays === 1 ? "day" : "days"} overdue
            </div>
          ) : reminder.status !== "paid" ? (
            <div className="text-yellow-500 text-sm font-medium text-center mt-2">
              Due in {diffDays} {diffDays === 1 ? "day" : "days"}
            </div>
          ) : null}
        </div>
      </CardContent>
      <CardFooter>
        {reminder.status !== "paid" && (
          <PaymentButton
            projectId={projectId}
            amount={reminder.amount}
            userEmail={userEmail}
            paymentType={reminder.paymentType}
            label={isOverdue ? "Pay Now (Overdue)" : "Pay Now"}
            className={`w-full ${isOverdue ? "bg-red-600 hover:bg-red-700" : "bg-purple-600 hover:bg-purple-700"}`}
          />
        )}
      </CardFooter>
    </Card>
  )
}
