"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { doc, getDoc, updateDoc, getFirestore } from "firebase/firestore"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Loader2, 
  User, 
  Mail, 
  Building, 
  Phone, 
  Calendar,
  Shield,
  Crown,
  MapPin,
  Globe,
  Camera,
  Edit3,
  Save,
  X,
  Settings,
  CreditCard,
  Activity,
  Star,
  CheckCircle,
  AlertCircle,
  Zap,
  TrendingUp,
  Award,
  Eye,
  EyeOff
} from "lucide-react"
import { getUserSubscriptions } from "@/lib/firebase-client"
import { Switch } from '@/components/ui/switch'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

interface UserProfile {
  name: string
  email: string
  company?: string
  phone?: string
  location?: string
  website?: string
  bio?: string
  avatar?: string
  joinedDate?: Date
  accountType?: 'admin' | 'client'
  lastLogin?: Date
}

interface UserSubscription {
  id: string
  planName: string
  price: number
  billingCycle: string
  status: string
  startDate?: string
  endDate?: string
  stripeSubscriptionId?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [showSensitiveInfo, setShowSensitiveInfo] = useState(false)
  const [profile, setProfile] = useState<UserProfile>({
    name: "",
    email: "",
    company: "",
    phone: "",
    location: "",
    website: "",
    bio: "",
    avatar: "",
    accountType: 'client',
  })
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [subsLoading, setSubsLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const db = getFirestore()
        const profileDoc = await getDoc(doc(db, "users", user.uid))

        if (profileDoc.exists()) {
          const data = profileDoc.data()
          setProfile({
            ...data as UserProfile,
            email: user.email || "",
            joinedDate: data.createdAt?.toDate() || (user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date()),
            lastLogin: data.lastLogin?.toDate() || (user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime) : new Date()),
          })
        } else {
          setProfile({
            name: user.displayName || "",
            email: user.email || "",
            company: "",
            phone: "",
            location: "",
            website: "",
            bio: "",
            avatar: user.photoURL || "",
            accountType: 'client',
            joinedDate: user.metadata?.creationTime ? new Date(user.metadata.creationTime) : new Date(),
            lastLogin: user.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime) : new Date(),
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, toast])

  useEffect(() => {
    const fetchSubs = async () => {
      if (!user) return
      setSubsLoading(true)
      try {
        const subs = await getUserSubscriptions(user.uid)
        setSubscriptions(subs)
      } catch (e) {
        // Optionally handle error
      } finally {
        setSubsLoading(false)
      }
    }
    fetchSubs()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setSaving(true)
      const db = getFirestore()
      await updateDoc(doc(db, "users", user.uid), {
        name: profile.name,
        company: profile.company,
        phone: profile.phone,
        location: profile.location,
        website: profile.website,
        bio: profile.bio,
        updatedAt: new Date(),
      })

      setEditMode(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Determine if user is premium
  const isPremium = subscriptions.some(s => s.status === 'active')

  // Dynamic badge
  const getAccountBadge = () => {
    const badges = {
      premium: {
        label: 'Premium Client',
        color: 'bg-gradient-to-r from-amber-500 to-orange-500',
        icon: Star,
      },
      free: {
        label: 'Client',
        color: 'bg-gradient-to-r from-blue-500 to-purple-600',
        icon: User,
      },
    }
    const badge = isPremium ? badges.premium : badges.free
    const Icon = badge.icon
    return (
      <Badge className={`${badge.color} text-white border-0 px-4 py-2 text-sm font-semibold shadow-lg`}>
        <Icon className="w-4 h-4 mr-2" />
        {badge.label}
      </Badge>
    )
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Unknown"
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'past_due': return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    }
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  // Dummy handlers for toggles (replace with real logic as needed)
  const handleToggleDarkMode = () => setDarkMode((v) => !v)
  const handleToggleEmailNotifications = () => setEmailNotifications((v) => !v)
  const handleDeleteAccount = () => {
    setShowDeleteDialog(false)
    // TODO: Add real delete logic
    toast({ title: 'Account Deleted', description: 'Your account has been deleted (demo only).' })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex justify-center items-center">
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-pink-500/30 rounded-full animate-spin animate-reverse border-b-pink-500"></div>
          </div>
          <div className="space-y-2">
            <p className="text-white text-xl font-semibold">Loading Dashboard</p>
            <p className="text-white/60">Preparing your premium experience...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 relative overflow-hidden">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        <div className="absolute bottom-1/3 right-1/3 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-700"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative z-10 min-h-screen pt-12 md:pt-20">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-black/20 backdrop-blur-xl border-b border-white/5">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="w-12 h-12 border-2 border-purple-500/50 shadow-lg">
                  <AvatarImage src={profile.avatar || user?.photoURL || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white font-bold">
                    {getInitials(profile.name || user?.displayName || "U")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {profile.name || user?.displayName || "Welcome"}
                  </h1>
                  <p className="text-sm text-white/60">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getAccountBadge()}
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Mobile-First Tab Navigation */}
          <div className="mb-8">
            <div className="flex overflow-x-auto scrollbar-hide gap-2 p-1 bg-black/20 rounded-2xl backdrop-blur-sm border border-white/10">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap min-w-fit ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/30 border-blue-500/30 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-200 text-sm font-medium">Active Plans</p>
                        <p className="text-2xl font-bold text-white">
                          {subscriptions.filter(s => s.status === 'active').length}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                        <Zap className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/30 border-emerald-500/30 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-emerald-200 text-sm font-medium">Account Status</p>
                        <p className="text-lg font-bold text-white">{isPremium ? 'Premium' : 'Free'}</p>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                        {isPremium ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : <AlertCircle className="w-6 h-6 text-amber-400" />}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/30 border-purple-500/30 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-200 text-sm font-medium">Member Since</p>
                        <p className="text-lg font-bold text-white">{formatDate(profile.joinedDate)}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-amber-900/30 to-amber-800/30 border-amber-500/30 backdrop-blur-xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-amber-200 text-sm font-medium">Last Login</p>
                        <p className="text-lg font-bold text-white">{formatDate(profile.lastLogin)}</p>
                      </div>
                      <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <Activity className="w-6 h-6 text-amber-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="border border-white/10 bg-black/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => setActiveTab('profile')}
                      className="h-auto p-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30 flex-col gap-2"
                    >
                      <User className="w-6 h-6" />
                      <span>Edit Profile</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('billing')}
                      className="h-auto p-4 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 border border-blue-500/30 flex-col gap-2"
                    >
                      <CreditCard className="w-6 h-6" />
                      <span>Manage Billing</span>
                    </Button>
                    <Button 
                      onClick={() => setActiveTab('settings')}
                      className="h-auto p-4 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 hover:from-emerald-600/30 hover:to-teal-600/30 border border-emerald-500/30 flex-col gap-2"
                    >
                      <Settings className="w-6 h-6" />
                      <span>Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Header */}
              <Card className="border border-white/10 bg-gradient-to-r from-purple-900/20 to-pink-900/20 backdrop-blur-xl">
                <CardContent className="p-8">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="relative">
                      <Avatar className="w-24 h-24 border-4 border-purple-500/50 shadow-2xl">
                        <AvatarImage src={profile.avatar || user?.photoURL || ""} />
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-xl font-bold">
                          {getInitials(profile.name || user?.displayName || "U")}
                        </AvatarFallback>
                      </Avatar>
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 bg-purple-600 hover:bg-purple-700 border-2 border-black"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl font-bold text-white mb-2">
                        {profile.name || user?.displayName || "User"}
                      </h2>
                      <div className="flex flex-col sm:flex-row items-center gap-2 mb-4">
                        <p className="text-white/70">{profile.email}</p>
                        {getAccountBadge()}
                      </div>
                      {profile.bio && (
                        <p className="text-white/80 leading-relaxed max-w-2xl">{profile.bio}</p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => setEditMode(!editMode)}
                        variant="outline"
                        className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                      >
                        {editMode ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                        {editMode ? "Cancel" : "Edit"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Form */}
              <Card className="border border-white/10 bg-black/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white">Personal Information</CardTitle>
                  <CardDescription className="text-white/60">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white/90 flex items-center gap-2">
                          <User className="w-4 h-4" />
                          Full Name
                        </Label>
                        <Input
                          id="name"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          disabled={!editMode}
                          className="bg-black/40 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-50 h-12"
                          placeholder="Your full name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/90 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          value={profile.email}
                          disabled
                          className="bg-black/40 border-white/20 text-white opacity-50 cursor-not-allowed h-12"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-white/90 flex items-center gap-2">
                          <Building className="w-4 h-4" />
                          Company
                        </Label>
                        <Input
                          id="company"
                          value={profile.company}
                          onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                          disabled={!editMode}
                          className="bg-black/40 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-50 h-12"
                          placeholder="Your company name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white/90 flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          Phone Number
                        </Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profile.phone}
                          onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          disabled={!editMode}
                          className="bg-black/40 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-50 h-12"
                          placeholder="Your phone number"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white/90 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          Location
                        </Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                          disabled={!editMode}
                          className="bg-black/40 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-50 h-12"
                          placeholder="City, Country"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-white/90 flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                          Website
                        </Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          disabled={!editMode}
                          className="bg-black/40 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-50 h-12"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white/90">About You</Label>
                      <textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-4 py-3 bg-black/40 border border-white/20 focus:border-purple-500 rounded-lg text-white placeholder:text-white/40 disabled:opacity-50 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {editMode && (
                      <div className="flex flex-col sm:flex-row gap-4 pt-6">
                        <Button 
                          type="submit" 
                          disabled={saving}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12 font-semibold"
                        >
                          {saving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving Changes...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </>
                          )}
                        </Button>
                        <Button
                          type="button"
                          onClick={() => setEditMode(false)}
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 h-12"
                        >
                          Cancel
                        </Button>
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              {/* Billing Portal */}
              <Card className="border border-blue-500/30 bg-gradient-to-br from-blue-900/30 to-purple-900/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Billing Management
                  </CardTitle>
                  <CardDescription className="text-blue-100/80">
                    Manage your subscription, payment methods, and download invoices
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a
                      href="https://billing.stripe.com/p/login/eVq28rbdr7kz6pdbmnfbq00"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition-all duration-300 h-12"
                    >
                      <CreditCard className="w-4 h-4" />
                      Open Billing Portal
                    </a>
                    <Button
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 h-12"
                      onClick={() => setShowSensitiveInfo(!showSensitiveInfo)}
                    >
                      {showSensitiveInfo ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
                      {showSensitiveInfo ? 'Hide' : 'Show'} Details
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Subscriptions */}
              <Card className="border border-white/10 bg-black/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Your Subscriptions
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    View and manage your active subscriptions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {subsLoading ? (
                    <div className="text-purple-300 animate-pulse">Loading subscriptions...</div>
                  ) : subscriptions.length === 0 ? (
                    <div className="text-gray-400">No subscriptions found.</div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {subscriptions.map((sub) => (
                        <div key={sub.id} className={`w-full bg-black/60 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-2 border ${getStatusColor(sub.status)} hover:border-purple-400/40 transition-all duration-200`}>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-lg font-bold text-purple-300">{sub.planName}</span>
                              <span className={`text-xs font-semibold px-2 py-1 rounded-full ml-2 ${getStatusColor(sub.status)}`}>{sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}</span>
                            </div>
                            <div className="text-sm text-gray-300 mb-1">{sub.billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} &bull; £{sub.price} / {sub.billingCycle}</div>
                            <div className="text-xs text-gray-400">Started: {sub.startDate ? new Date(sub.startDate).toLocaleDateString() : 'N/A'}</div>
                            <div className="text-xs text-gray-400">Ends: {sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}</div>
                          </div>
                          {sub.stripeSubscriptionId && (
                            <a
                              href={`https://dashboard.stripe.com/subscriptions/${sub.stripeSubscriptionId}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block bg-gradient-to-r from-purple-500 to-blue-600 hover:from-blue-600 hover:to-purple-500 text-white font-bold px-4 py-2 rounded-lg shadow text-xs transition-all duration-200 mt-2 md:mt-0"
                            >
                              View in Stripe
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card className="border border-white/10 bg-black/30 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Settings
                  </CardTitle>
                  <CardDescription className="text-white/60">
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Dark Mode Toggle */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-white font-medium">Dark Mode</p>
                        <p className="text-gray-400 text-sm">Switch between dark and light theme</p>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={handleToggleDarkMode} />
                    </div>
                    {/* Email Notifications Toggle */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-white font-medium">Email Notifications</p>
                        <p className="text-gray-400 text-sm">Receive important updates and offers</p>
                      </div>
                      <Switch checked={emailNotifications} onCheckedChange={handleToggleEmailNotifications} />
                    </div>
                    <Separator className="my-6 bg-white/10" />
                    {/* Danger Zone */}
                    <div className="flex flex-col items-start gap-2">
                      <p className="text-red-400 font-semibold text-lg flex items-center gap-2"><AlertCircle className="w-5 h-5" /> Danger Zone</p>
                      <p className="text-gray-400 text-sm mb-2">Permanently delete your account and all associated data.</p>
                      <Button
                        variant="destructive"
                        className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg text-base transition-all duration-200"
                        onClick={() => setShowDeleteDialog(true)}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Delete Account Confirmation Dialog */}
              <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Delete Account</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to permanently delete your account? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter className="flex flex-row gap-4 justify-end">
                    <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDeleteAccount}>
                      Yes, Delete My Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
