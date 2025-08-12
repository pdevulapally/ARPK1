import { NextRequest, NextResponse } from 'next/server'
import PDFDocument from 'pdfkit'

export async function POST(request: NextRequest) {
  try {
    const {
      paymentId,
      projectId,
      amount,
      customerEmail,
      projectName,
      discountCode,
      discountPercentage,
      originalAmount
    } = await request.json()

    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      margin: 50
    })

    // Set response headers for PDF download
    const response = new NextResponse()
    response.headers.set('Content-Type', 'application/pdf')
    response.headers.set('Content-Disposition', `attachment; filename="invoice-${paymentId}.pdf"`)

    // Pipe the PDF to the response
    doc.pipe(response)

    // Add company header
    doc.fontSize(24)
      .font('Helvetica-Bold')
      .text('ARPK1', { align: 'center' })
    doc.fontSize(12)
      .font('Helvetica')
      .text('Web Development & Design Services', { align: 'center' })
    doc.moveDown(0.5)
    doc.fontSize(10)
      .text('123 Business Street, London, UK', { align: 'center' })
    doc.text('Email: info@arpk1.com | Phone: +44 123 456 7890', { align: 'center' })

    doc.moveDown(2)

    // Add invoice title
    doc.fontSize(18)
      .font('Helvetica-Bold')
      .text('INVOICE')
    doc.moveDown(0.5)

    // Add invoice details
    doc.fontSize(10)
      .font('Helvetica')
      .text(`Invoice Number: ${paymentId}`)
      .text(`Date: ${new Date().toLocaleDateString('en-GB')}`)
      .text(`Project ID: ${projectId}`)
    doc.moveDown()

    // Add customer details
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Bill To:')
    doc.fontSize(10)
      .font('Helvetica')
      .text(customerEmail)
    doc.moveDown()

    // Add project details
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Project:')
    doc.fontSize(10)
      .font('Helvetica')
      .text(projectName)
    doc.moveDown()

    // Add line items
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Description', 50, doc.y)
      .text('Amount', 400, doc.y)
    doc.moveDown(0.5)

    // Draw line
    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
    doc.moveDown(0.5)

    doc.fontSize(10)
      .font('Helvetica')

    if (discountCode && discountPercentage && originalAmount) {
      // Show original amount
      doc.text('Project Payment (Original)', 50, doc.y)
      doc.text(`£${(originalAmount / 100).toFixed(2)}`, 400, doc.y)
      doc.moveDown(0.5)

      // Show discount
      doc.text(`Discount (${discountCode} - ${discountPercentage}% off)`, 50, doc.y)
      doc.text(`-£${((originalAmount - amount) / 100).toFixed(2)}`, 400, doc.y)
      doc.moveDown(0.5)

      // Draw line
      doc.moveTo(50, doc.y)
        .lineTo(550, doc.y)
        .stroke()
      doc.moveDown(0.5)
    } else {
      // Show regular payment
      doc.text('Project Payment', 50, doc.y)
      doc.text(`£${(amount / 100).toFixed(2)}`, 400, doc.y)
      doc.moveDown(0.5)
    }

    // Draw line
    doc.moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke()
    doc.moveDown(0.5)

    // Add total
    doc.fontSize(12)
      .font('Helvetica-Bold')
      .text('Total:', 350, doc.y)
      .text(`£${(amount / 100).toFixed(2)}`, 400, doc.y)
    doc.moveDown(2)

    // Add payment status
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('Payment Status: PAID', { color: 'green' })
    doc.moveDown()

    // Add terms and conditions
    doc.fontSize(10)
      .font('Helvetica-Bold')
      .text('Terms & Conditions:')
    doc.fontSize(8)
      .font('Helvetica')
      .text('• Payment is due upon receipt of this invoice')
      .text('• All amounts are in British Pounds (GBP)')
      .text('• This invoice is automatically generated upon successful payment')
      .text('• For any questions, please contact us at info@arpk1.com')
    doc.moveDown()

    // Add footer
    doc.fontSize(8)
      .font('Helvetica')
      .text('Thank you for your business!', { align: 'center' })

    // Finalize the PDF
    doc.end()

    return response
  } catch (error) {
    console.error('Error generating invoice:', error)
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    )
  }
}
