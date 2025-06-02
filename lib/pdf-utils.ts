import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import type { Project } from "./firebase"

export async function generateInvoice(project: Project, invoiceType: "deposit" | "final") {
  // Validate required project properties
  if (!project.id || !project.budget || !project.userEmail || !project.websiteType) {
    throw new Error("Missing required project information")
  }

  // Create a new PDF document
  const doc = new jsPDF()

  // Set up document properties
  const invoiceNumber = `INV-${project.id.substring(0, 6)}-${invoiceType === "deposit" ? "DEP" : "FIN"}`
  const invoiceDate = format(new Date(), "yyyy-MM-dd")
  const dueDate = format(new Date(new Date().setDate(new Date().getDate() + 14)), "yyyy-MM-dd")

  // Calculate amounts - ensure budget is a number
  const budget = typeof project.budget === 'string' ? parseFloat(project.budget) : project.budget
  if (isNaN(budget)) {
    throw new Error("Invalid budget amount")
  }
  
  const amount = budget * 0.5
  const total = amount // Removed tax calculation

  // Add company logo/header
  doc.setFontSize(20)
  doc.setTextColor(128, 0, 128) // Purple color
  doc.text("ARPK Web Development", 20, 20)

  // Add invoice details
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text(`Invoice Number: ${invoiceNumber}`, 20, 40)
  doc.text(`Invoice Date: ${invoiceDate}`, 20, 45)
  doc.text(`Due Date: ${dueDate}`, 20, 50)

  // Add client details
  doc.text("Billed To:", 20, 60)
  doc.text(project.userEmail || 'N/A', 20, 65)

  // Add project details
  doc.text("Project Details:", 20, 75)
  doc.text(`Project ID: ${project.id}`, 20, 80)
  doc.text(`Project Type: ${project.websiteType} Website`, 20, 85)

  // Format currency values
  const formatCurrency = (value: number) => `£${value.toFixed(2)}`

  // Add invoice items table
  autoTable(doc, {
    startY: 95,
    head: [["Description", "Quantity", "Unit Price", "Amount"]],
    body: [
      [
        `${invoiceType === "deposit" ? "Deposit Payment (50%)" : "Final Payment (50%)"} - ${project.websiteType} Website`,
        "1",
        formatCurrency(amount),
        formatCurrency(amount),
      ],
    ],
    foot: [
      ["", "", "Total", formatCurrency(total)],
    ],
    theme: "striped",
    headStyles: { fillColor: [128, 0, 128] },
    footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: "bold" },
  })

  // Add payment instructions
  const finalY = (doc as any).lastAutoTable.finalY || 95
  doc.text("Payment Instructions:", 20, finalY + 10)
  doc.text("Please make payment via the payment button in your dashboard.", 20, finalY + 15)
  doc.text("Payment is due within 14 days of invoice date.", 20, finalY + 20)

  // Add footer
  doc.text("Thank you for your business!", 20, finalY + 30)
  doc.text("ARPK Web Development", 20, finalY + 35)
  doc.text("PreethamDevulapally@gmail.com | arpk.vercel.app", 20, finalY + 40)

  return doc
}

export async function downloadInvoice(project: Project, invoiceType: "deposit" | "final") {
  try {
    const doc = await generateInvoice(project, invoiceType)
    const invoiceNumber = `INV-${project.id.substring(0, 6)}-${invoiceType === "deposit" ? "DEP" : "FIN"}`
    doc.save(`${invoiceNumber}.pdf`)
  } catch (error) {
    console.error("Error generating invoice:", error)
    throw new Error("Failed to generate invoice. Please ensure all project details are complete.")
  }
}
