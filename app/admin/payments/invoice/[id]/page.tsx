"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { ArrowLeft, Download, Printer, Send } from "lucide-react"
import { motion } from "framer-motion"

interface InvoiceProject {
  id: string
  userId: string
  userEmail: string
  websiteType: string
  features: string[]
  budget: string
  paymentStatus?: string
  depositPaid?: boolean
  finalPaid?: boolean
  createdAt: any
}

export default function InvoicePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [project, setProject] = useState<InvoiceProject | null>(null)
  const [loading, setLoading] = useState(true)
  const db = getFirestore()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectDoc = await getDoc(doc(db, "projects", params.id as string))
        if (!projectDoc.exists()) {
          toast({
            title: "Error",
            description: "Invoice not found",
            variant: "destructive",
          })
          router.push("/admin/projects")
          return
        }

        setProject({
          id: projectDoc.id,
          ...projectDoc.data(),
        } as InvoiceProject)
      } catch (error) {
        console.error("Error fetching invoice:", error)
        toast({
          title: "Error",
          description: "Failed to load invoice",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [params.id, router, toast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
      </div>
    )
  }

  if (!project) return null

  const invoiceNumber = `INV-${project.id.slice(0, 8).toUpperCase()}`
  const invoiceDate = new Date(project.createdAt.toDate()).toLocaleDateString()
  const dueDate = new Date(project.createdAt.toDate())
  dueDate.setDate(dueDate.getDate() + 14)

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6 flex items-center justify-between">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Download
          </Button>
          <Button variant="outline" className="gap-2">
            <Printer className="h-4 w-4" /> Print
          </Button>
          <Button className="gap-2 bg-purple-600 hover:bg-purple-700">
            <Send className="h-4 w-4" /> Send to Client
          </Button>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader className="border-b border-purple-500/20">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl mb-2">Invoice</CardTitle>
                <CardDescription>#{invoiceNumber}</CardDescription>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  ARPK Development
                </h3>
                <p className="text-sm text-gray-400">London, United Kingdom</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-1">Bill To</h3>
                <p className="font-medium">{project.userEmail}</p>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <div className="flex justify-end gap-4">
                    <span className="text-gray-400">Invoice Date:</span>
                    <span>{invoiceDate}</span>
                  </div>
                  <div className="flex justify-end gap-4">
                    <span className="text-gray-400">Due Date:</span>
                    <span>{dueDate.toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="bg-purple-500/20" />

            <div className="space-y-4">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-purple-500/20">
                    <th className="py-2">Description</th>
                    <th className="py-2 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-4">
                      <p className="font-medium">{project.websiteType} Website Development</p>
                      <p className="text-sm text-gray-400 mt-1">Features included:</p>
                      <ul className="text-sm text-gray-400 list-disc list-inside ml-2">
                        {project.features.map((feature) => (
                          <li key={feature}>{feature.replace("-", " ")}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="py-4 text-right">£{project.budget}</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr className="border-t border-purple-500/20">
                    <td className="py-4 text-right font-medium">Total:</td>
                    <td className="py-4 text-right font-bold">£{project.budget}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <Separator className="bg-purple-500/20" />

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Terms</h3>
                <p className="text-sm text-gray-300">
                  50% deposit payment is required to begin the project. The remaining 50% is due upon project completion.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-2">Payment Status</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Deposit Payment (50%)</span>
                    <span className={project.depositPaid ? "text-green-500" : "text-yellow-500"}>
                      {project.depositPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Final Payment (50%)</span>
                    <span className={project.finalPaid ? "text-green-500" : "text-yellow-500"}>
                      {project.finalPaid ? "Paid" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}