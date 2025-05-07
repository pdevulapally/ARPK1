"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import AuthGuard from "@/components/auth-guard"
import { collection, query, getDocs, getFirestore } from "firebase/firestore"
import { setUserAsAdmin, removeAdminRole } from "@/lib/admin-utils"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Shield, ShieldOff } from "lucide-react"

interface UserData {
  id: string
  email: string
  role: string
  createdAt: any
  lastLogin?: any
  displayName?: string
}

export default function AdminUsersPage() {
  const { user, isAdmin } = useAuth()
  const [users, setUsers] = useState<UserData[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()
  const db = getFirestore()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true)
        const q = query(collection(db, "users"))
        const querySnapshot = await getDocs(q)

        const usersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as UserData[]

        setUsers(usersData)
      } catch (error) {
        console.error("Error fetching users:", error)
        toast({
          title: "Error",
          description: "Failed to load users",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [db, toast])

  const handleToggleAdmin = async (userId: string, currentRole: string) => {
    try {
      setActionLoading(userId)

      if (currentRole === "admin") {
        await removeAdminRole(userId)
        toast({
          title: "Success",
          description: "Admin role removed",
        })
        // Update local state
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: "client" } : u)))
      } else {
        await setUserAsAdmin(userId)
        toast({
          title: "Success",
          description: "User promoted to admin",
        })
        // Update local state
        setUsers(users.map((u) => (u.id === userId ? { ...u, role: "admin" } : u)))
      }
    } catch (error) {
      console.error("Error updating user role:", error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-24">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>

        <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>Manage user roles and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Last Login</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((userData) => (
                    <tr key={userData.id} className="border-b border-purple-500/10 hover:bg-purple-900/10">
                      <td className="py-3 px-4">{userData.email}</td>
                      <td className="py-3 px-4">{userData.displayName || "N/A"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            userData.role === "admin"
                              ? "bg-purple-500/20 text-purple-300"
                              : "bg-blue-500/20 text-blue-300"
                          }`}
                        >
                          {userData.role || "client"}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {userData.lastLogin
                          ? new Date(userData.lastLogin?.seconds * 1000 || userData.lastLogin).toLocaleString()
                          : "Never"}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleAdmin(userData.id, userData.role)}
                          disabled={actionLoading === userData.id || userData.id === user?.uid}
                          className={`${
                            userData.role === "admin"
                              ? "border-red-500/30 text-red-400 hover:bg-red-900/20"
                              : "border-purple-500/30 text-purple-400 hover:bg-purple-900/20"
                          }`}
                        >
                          {actionLoading === userData.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : userData.role === "admin" ? (
                            <>
                              <ShieldOff className="h-4 w-4 mr-1" /> Remove Admin
                            </>
                          ) : (
                            <>
                              <Shield className="h-4 w-4 mr-1" /> Make Admin
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
