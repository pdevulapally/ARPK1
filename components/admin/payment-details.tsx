"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Calendar, User, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { InvoiceButton } from "@/components/invoice-button"

interface PaymentDetailsProps {
  payment: any
  project?: any
  isOpen: boolean
  onClose: () => void
}

export function PaymentDetails({ payment, project, isOpen, onClose }: PaymentDetailsProps) {
  if (!payment) return null

  const isStripePayment = payment.currency !== undefined

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP 'at' p")
    } catch (e) {
      return dateString || "N/A"
    }
  }

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "succeeded":
      case "paid":
      case "complete":
        return "bg-green-500/20 text-green-500 border-green-500/50"
      case "pending":
      case "processing":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50"
      case "failed":
      case "canceled":
        return "bg-red-500/20 text-red-500 border-red-500/50"
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/50"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-black/90 border border-purple-500/30">
        <DialogHeader>
          <DialogTitle>Payment Details</DialogTitle>
          <DialogDescription>
            {isStripePayment ? "Transaction processed through Stripe" : "Project payment information"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Payment ID */}
          <div>
            <h3 className="text-sm font-medium mb-1">Payment ID</h3>
            <p className="text-sm text-muted-foreground font-mono">{payment.id}</p>
          </div>

          {/* Amount */}
          <div>
            <h3 className="text-sm font-medium mb-1">Amount</h3>
            <p className="text-lg font-semibold">
              {isStripePayment
                ? `£${payment.amount.toFixed(2)}`
                : `£${Number.parseFloat(payment.budget || "0").toFixed(2)}`}
            </p>
          </div>

          {/* Status */}
          <div>
            <h3 className="text-sm font-medium mb-1">Status</h3>
            <Badge className={getStatusColor(payment.status)}>{payment.status || "Unknown"}</Badge>
          </div>

          {/* Date */}
          <div>
            <h3 className="text-sm font-medium mb-1">Date</h3>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm">{formatDate(payment.created)}</p>
            </div>
          </div>

          {/* Customer/Client */}
          <div>
            <h3 className="text-sm font-medium mb-1">{isStripePayment ? "Customer" : "Client"}</h3>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-2 text-muted-foreground" />
              <p className="text-sm">
                {isStripePayment ? payment.receipt_email || payment.customer || "Anonymous" : payment.userEmail}
              </p>
            </div>
          </div>

          {/* Card Details (Stripe only) */}
          {isStripePayment && payment.card && (
            <div>
              <h3 className="text-sm font-medium mb-1">Payment Method</h3>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <p className="text-sm capitalize">
                  {payment.card.brand} •••• {payment.card.last4} | Expires {payment.card.exp_month}/
                  {payment.card.exp_year}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {isStripePayment && payment.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{payment.description}</p>
            </div>
          )}

          {/* Project Type (Firebase only) */}
          {!isStripePayment && payment.websiteType && (
            <div>
              <h3 className="text-sm font-medium mb-1">Project Type</h3>
              <p className="text-sm text-muted-foreground capitalize">{payment.websiteType} Website</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {/* Receipt URL (Stripe only) */}
          {isStripePayment && payment.receipt_url && (
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => window.open(payment.receipt_url, "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Receipt
            </Button>
          )}

          {/* Invoice (Firebase only) */}
          {!isStripePayment && project && (
            <InvoiceButton
              project={project}
              invoiceType={payment.paymentType || "deposit"}
              className="w-full sm:w-auto"
            />
          )}

          <Button variant="default" className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
