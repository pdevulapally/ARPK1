"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, FileText } from "lucide-react"
import { downloadInvoice } from "@/lib/pdf-utils"
import type { Project } from "@/lib/firebase"

interface InvoiceButtonProps {
  project: Project
  invoiceType: "deposit" | "final"
  className?: string
}

export function InvoiceButton({ project, invoiceType, className }: InvoiceButtonProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleDownload = async () => {
    try {
      setLoading(true)
      await downloadInvoice(project, invoiceType)
      toast({
        title: "Invoice Downloaded",
        description: "Your invoice has been downloaded successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to download invoice",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={loading} variant="outline" className={className}>
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          Download Invoice
        </>
      )}
    </Button>
  )
}
