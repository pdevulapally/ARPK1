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
  X
} from "lucide-react"

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
  accountType?: 'admin' | 'client'  // Update this line
  lastLogin?: Date
}

export default function ProfilePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editMode, setEditMode] = useState(false)
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

  const getAccountBadge = () => {
    const badges = {
      admin: { 
        label: "Admin", 
        color: "bg-gradient-to-r from-purple-500 to-pink-500", 
        icon: Shield 
      },
      client: { 
        label: "Client", 
        color: "bg-gradient-to-r from-blue-500 to-cyan-500", 
        icon: User 
      }
    }
    const badge = badges[profile.accountType || 'client']
    const Icon = badge.icon
    
    return (
      <Badge className={`${badge.color} text-white border-0 px-3 py-1`}>
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </Badge>
    )
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return "Unknown"
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).format(date)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex justify-center items-center">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 rounded-full animate-spin border-t-purple-500"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-pink-500/30 rounded-full animate-spin animate-reverse border-b-pink-500"></div>
          </div>
          <p className="text-white/80 text-lg">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 lg:py-16">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
              Profile Dashboard
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Manage your account settings and personal information in your premium dashboard
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Overview Card */}
            <div className="lg:col-span-1">
              <Card className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center pb-6">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-32 h-32 border-4 border-purple-500/50 shadow-2xl">
                      <AvatarImage src={profile.avatar || user?.photoURL || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-2xl font-bold">
                        {getInitials(profile.name || user?.displayName || "U")}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-10 h-10 bg-purple-600 hover:bg-purple-700 border-2 border-black"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <CardTitle className="text-white text-xl">
                      {profile.name || user?.displayName || "User"}
                    </CardTitle>
                    <p className="text-white/60">{profile.email}</p>
                    <div className="flex justify-center">
                      {getAccountBadge()}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <Separator className="bg-white/10" />
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center text-white/70">
                      <Calendar className="w-4 h-4 mr-3 text-purple-400" />
                      <span>Joined {formatDate(profile.joinedDate)}</span>
                    </div>
                    
                    <div className="flex items-center text-white/70">
                      <User className="w-4 h-4 mr-3 text-purple-400" />
                      <span>Last login {formatDate(profile.lastLogin)}</span>
                    </div>
                    
                    {profile.location && (
                      <div className="flex items-center text-white/70">
                        <MapPin className="w-4 h-4 mr-3 text-purple-400" />
                        <span>{profile.location}</span>
                      </div>
                    )}
                    
                    {profile.website && (
                      <div className="flex items-center text-white/70">
                        <Globe className="w-4 h-4 mr-3 text-purple-400" />
                        <span className="truncate">{profile.website}</span>
                      </div>
                    )}
                  </div>
                  
                  {profile.bio && (
                    <>
                      <Separator className="bg-white/10" />
                      <div>
                        <h4 className="text-white font-medium mb-2">About</h4>
                        <p className="text-white/70 text-sm leading-relaxed">{profile.bio}</p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-2">
              <Card className="border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl">Profile Settings</CardTitle>
                    <CardDescription className="text-white/60">
                      Update your personal information and preferences
                    </CardDescription>
                  </div>
                  <Button
                    onClick={() => setEditMode(!editMode)}
                    variant="outline"
                    className="border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
                  >
                    {editMode ? <X className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
                    {editMode ? "Cancel" : "Edit"}
                  </Button>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white/90">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                          <Input
                            id="name"
                            value={profile.name}
                            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                            disabled={!editMode}
                            className="pl-10 bg-black/60 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-70"
                            placeholder="Your full name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white/90">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                          <Input
                            id="email"
                            value={profile.email}
                            disabled
                            className="pl-10 bg-black/60 border-white/20 text-white opacity-70 cursor-not-allowed"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-white/90">Company</Label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                          <Input
                            id="company"
                            value={profile.company}
                            onChange={(e) => setProfile({ ...profile, company: e.target.value })}
                            disabled={!editMode}
                            className="pl-10 bg-black/60 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-70"
                            placeholder="Your company name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-white/90">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                          <Input
                            id="phone"
                            type="tel"
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                            disabled={!editMode}
                            className="pl-10 bg-black/60 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-70"
                            placeholder="Your phone number"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="location" className="text-white/90">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                          <Input
                            id="location"
                            value={profile.location}
                            onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                            disabled={!editMode}
                            className="pl-10 bg-black/60 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-70"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="website" className="text-white/90">Website</Label>
                        <div className="relative">
                          <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-purple-400" />
                          <Input
                            id="website"
                            value={profile.website}
                            onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                            disabled={!editMode}
                            className="pl-10 bg-black/60 border-white/20 focus:border-purple-500 text-white placeholder:text-white/40 disabled:opacity-70"
                            placeholder="https://yourwebsite.com"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white/90">Bio</Label>
                      <textarea
                        id="bio"
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        disabled={!editMode}
                        rows={4}
                        className="w-full px-3 py-2 bg-black/60 border border-white/20 focus:border-purple-500 rounded-md text-white placeholder:text-white/40 disabled:opacity-70 resize-none"
                        placeholder="Tell us about yourself..."
                      />
                    </div>

                    {editMode && (
                      <div className="flex gap-4 pt-4">
                        <Button 
                          type="submit" 
                          disabled={saving}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 h-12"
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
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
