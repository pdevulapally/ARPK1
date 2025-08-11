import { NextResponse } from "next/server"
import { getStripeServer } from "@/lib/stripe"

import { headers } from "next/headers"
import { RateLimiter } from "@/lib/rate-limit"
import { getClientIpFromHeaders, isBlockedUserAgent } from "@/lib/security"

export async function POST(request: Request) {
  try {
    const { projectId, customerId, amount, description, captchaToken } = await request.json()

    const hdrs = await headers()
    const ip = getClientIpFromHeaders(hdrs as unknown as Headers) || "unknown"
    const ua = hdrs.get("user-agent") || ""
    if (isBlockedUserAgent(ua)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const limiter = new RateLimiter({ windowSeconds: 60, maxRequests: 5, prefix: "invoice" })
    const rl = await limiter.check(ip)
    if (!rl.allowed) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }
    
    const stripe = getStripeServer()
    
    // Create an invoice item
    await stripe.invoiceItems.create({
      customer: customerId,
      amount: Math.floor(amount * 100),
      currency: 'usd',
      description: description,
    })

    // Create and finalize the invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true,
      collection_method: 'send_invoice',
      metadata: {
        projectId: projectId
      }
    })

    if (invoice.id) {
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
      await stripe.invoices.sendInvoice(invoice.id)
      return NextResponse.json({ 
        success: true, 
        invoiceUrl: finalizedInvoice.hosted_invoice_url,
        invoiceId: finalizedInvoice.id 
      })
    }

    throw new Error("Failed to create invoice")
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}