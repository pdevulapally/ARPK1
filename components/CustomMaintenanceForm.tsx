import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getUserProjects, createMaintenanceSubmission } from "@/lib/firebase-client"
import { useAuth } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"

const COMPANY_SIZES = [
  "1-10", "11-50", "51-200", "201-1000", "1000+"
]

export default function CustomMaintenanceForm({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { user } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<{ id: string, websiteType?: string, status?: string }[]>([])
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    companySize: "",
    referenceProject: "",
    needs: "",
    extra: "",
  })

  useEffect(() => {
    if (user) {
      setLoadingProjects(true)
      getUserProjects(user.uid)
        .then((res) => setProjects(res))
        .finally(() => setLoadingProjects(false))
    }
  }, [user])

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await createMaintenanceSubmission({
        ...form,
        userId: user?.uid,
      })
      
      setSubmitted(true)
      setForm({
        name: "",
        email: "",
        company: "",
        companySize: "",
        referenceProject: "",
        needs: "",
        extra: "",
      })
      
      toast({
        title: "Request Submitted Successfully!",
        description: "We'll contact you soon to discuss your maintenance needs.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Custom Maintenance Request</DialogTitle>
          <DialogDescription>
            Fill out the form below and our team will get in touch to discuss your custom maintenance needs.
          </DialogDescription>
        </DialogHeader>
        {submitted ? (
          <div className="py-12 text-center">
            <div className="text-2xl font-bold text-purple-500 mb-2">Thank you!</div>
            <div className="text-gray-300 mb-4">Your request has been received. We'll contact you soon.</div>
            <Button onClick={() => { setSubmitted(false); onOpenChange(false) }} className="mt-2">Close</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-1">Name *</label>
              <Input required value={form.name} onChange={e => handleChange("name", e.target.value)} placeholder="Your name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Email *</label>
              <Input required type="email" value={form.email} onChange={e => handleChange("email", e.target.value)} placeholder="you@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Company Name</label>
              <Input value={form.company} onChange={e => handleChange("company", e.target.value)} placeholder="Your company (optional)" />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Company Size</label>
              <select className="w-full bg-black/40 border border-white/20 rounded-lg text-white px-3 py-2" value={form.companySize} onChange={e => handleChange("companySize", e.target.value)}>
                <option value="">Select size</option>
                {COMPANY_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Reference Project (optional)</label>
              <select className="w-full bg-black/40 border border-white/20 rounded-lg text-white px-3 py-2" value={form.referenceProject} onChange={e => handleChange("referenceProject", e.target.value)} disabled={loadingProjects || !user}>
                <option value="">Select your project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.websiteType || 'Project'} ({p.status})</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Describe your needs *</label>
              <Textarea required value={form.needs} onChange={e => handleChange("needs", e.target.value)} placeholder="Tell us about your maintenance requirements..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-1">Anything else?</label>
              <Textarea value={form.extra} onChange={e => handleChange("extra", e.target.value)} placeholder="Additional info (optional)" />
            </div>
            <DialogFooter>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-all duration-200"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
} 
