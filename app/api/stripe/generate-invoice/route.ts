import { NextResponse } from "next/server"
import { getStripeServer } from "@/lib/stripe"

export async function POST(request: Request) {
  try {
    const { projectId, customerId, amount, description } = await request.json()
    
    const stripe = getStripeServer()
    
    // Create an invoice item
    const invoiceItem = await stripe.invoiceItems.create({
      customer: customerId,
      amount: amount * 100, // Convert to cents
      currency: 'usd',
      description: description,
    })

    // Create and finalize the invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      auto_advance: true, // Auto-finalize the invoice
      collection_method: 'send_invoice',
      metadata: {
        projectId: projectId
      }
    })

    // Send the invoice only if it has an ID and is finalized
    if (invoice.id) {
      // Finalize the invoice first
      const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id)
      
      // Then send it
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