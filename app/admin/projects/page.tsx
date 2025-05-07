"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllProjects, type Project } from "@/lib/firebase"
import { formatDistanceToNow } from "date-fns"
import { Loader2, Search, FileText, ArrowUpDown } from "lucide-react"
import Link from "next/link"

const statusColors = {
  pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
  approved: "bg-green-500/20 text-green-500 border-green-500/50",
  rejected: "bg-red-500/20 text-red-500 border-red-500/50",
  "on hold": "bg-blue-500/20 text-blue-500 border-blue-500/50",
  "in progress": "bg-purple-500/20 text-purple-500 border-purple-500/50",
  "client review": "bg-orange-500/20 text-orange-500 border-orange-500/50",
  "final review": "bg-indigo-500/20 text-indigo-500 border-indigo-500/50",
  completed: "bg-green-500/20 text-green-500 border-green-500/50",
}

export default function AdminProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const projectsData = await getAllProjects()
        setProjects(projectsData)
        setFilteredProjects(projectsData)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    // Apply filters and sorting
    let result = [...projects]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) =>
          project.websiteType.toLowerCase().includes(query) || project.userEmail.toLowerCase().includes(query),
      )
    }

    // Filter by status
    if (statusFilter !== "all") {
      result = result.filter((project) => project.status === statusFilter)
    }

    // Sort by date
    result.sort((a, b) => {
      const dateA =
        a.createdAt && typeof a.createdAt === "object" && "toDate" in a.createdAt
          ? a.createdAt.toDate().getTime()
          : new Date(a.createdAt as string).getTime()

      const dateB =
        b.createdAt && typeof b.createdAt === "object" && "toDate" in b.createdAt
          ? b.createdAt.toDate().getTime()
          : new Date(b.createdAt as string).getTime()

      return sortOrder === "asc" ? dateA - dateB : dateB - dateA
    })

    setFilteredProjects(result)
  }, [projects, searchQuery, statusFilter, sortOrder])

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc")
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button className="bg-purple-600 hover:bg-purple-700">Create Project</Button>
      </div>

      <Card className="border border-purple-500/30 bg-black/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle>All Projects</CardTitle>
          <CardDescription>Manage and track all client projects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-black/50 border-purple-500/30 focus:border-purple-500"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-black/50 border-purple-500/30 focus:border-purple-500">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="client review">Client Review</SelectItem>
                  <SelectItem value="final review">Final Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on hold">On Hold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button variant="outline" size="icon" onClick={toggleSortOrder} className="h-10 w-10">
              <ArrowUpDown className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No projects found matching your filters</div>
            ) : (
              filteredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border border-purple-500/20 rounded-lg p-4 bg-black/40 hover:border-purple-500/40 transition-all cursor-pointer"
                  onClick={() => router.push(`/admin/projects/${project.id}`)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-purple-400" />
                        <h3 className="font-medium capitalize">{project.websiteType} Website</h3>
                      </div>
                      <p className="text-sm text-gray-400 mt-1">Client: {project.userEmail}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className={`${statusColors[project.status as keyof typeof statusColors]}`}>
                        <span className="capitalize">{project.status}</span>
                      </Badge>
                      <div className="text-sm text-gray-400">
                        {formatDistanceToNow(
                          project.createdAt && typeof project.createdAt === "object" && "toDate" in project.createdAt
                            ? project.createdAt.toDate()
                            : new Date(project.createdAt as string),
                          { addSuffix: true },
                        )}
                      </div>
                      <Button variant="ghost" size="sm" asChild className="ml-auto">
                        <Link href={`/admin/projects/${project.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
