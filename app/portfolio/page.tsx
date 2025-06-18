"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ExternalLink, Search, Filter, Eye, Star, Calendar, Tag, ArrowRight, Sparkles, Globe, Code, Palette, Zap } from "lucide-react"

type PortfolioItem = {
  id: number
  title: string
  category: string
  description: string
  imageUrl: string
  liveUrl: string
  technologies: string[]
  features: string[]
  completionDate: string
  rating: number
  clientType: string
  budget: string
  timeline: string
}

const Portfolio = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([])
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTech, setSelectedTech] = useState("all")
  const [loading, setLoading] = useState(true)
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  // Simulate loading portfolio data
  useEffect(() => {
    const loadPortfolio = async () => {
      setLoading(true)
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // This would typically fetch from your database/API
      const items = await fetchPortfolioItems()
      setPortfolioItems(items)
      setFilteredItems(items)
      setLoading(false)
    }
    
    loadPortfolio()
  }, [])

  // Simulated API function - replace with actual API call
  const fetchPortfolioItems = async () => {
    return [
      {
        id: 1,
        title: "Senj Jewels",
        category: "ecommerce",
        description: "A modern e-commerce store for jewelry, featuring secure payments and real-time inventory.",
        imageUrl: `/Images/senjewels.png`,
        liveUrl: "https://senjewels.co.uk/",
        technologies: ["React", "Node.js", "Stripe", "Firebase", "Tailwind CSS"],
        features: ["Real-time Analytics", "product integration", "Custom Dashboards", "API Integration"],
        completionDate: "2024-11-15",
        rating: 5,
        clientType: "Business",
        budget: "£1000",
        timeline: "8 weeks"
      },
      {
        id: 2,
        title: "Alison Tait Coaching",
        category: "business",
        description: "High-end  coaching platform with personalized user dashboards and progress tracking",
        imageUrl: `/Images/alison-tait-coaching.png`,
        liveUrl: "https://www.alisontaitcoaching.co.uk/",
        technologies: ["Next.js", "PostgreSQL", "firebase", "PWA"],
        features: ["custom dashboard", "Payment Processing", "Inventory Management"],
        completionDate: "2024-10-22",
        rating: 5,
        clientType: "Business",
        budget: "£500",
        timeline: "2 weeks"
      },
      {
        id: 3,
        title: "Westminster Hindu society",
        category: "UWSU Society",
        description: "A vibrant society website for the University of Westminster, featuring event management and member portal",
        imageUrl: `/Images/westminster-hindu-society.png`,
        liveUrl: "https://westminsterhindusociety.co.uk/",
        technologies: ["React", "Firebase", "Tailwind CSS", "Node.js"],
        features: ["Appointment Booking", "Patient Portal", "HIPAA Compliant", "Telehealth"],
        completionDate: "2024-09-30",
        rating: 5,
        clientType: "University",
        budget: "free",
        timeline: "2 weeks"
      },
      {
        id: 4,
        title: "University of Westminster Desi Society",
        category: "UWSU Society",
        description: "A dynamic society website for the University of Westminster, featuring event management and member portal",
        imageUrl: `/Images/uow-desi-society.png`,
        liveUrl: "https://uowdesisoc.co.uk/",
        technologies: ["Next.js", "Firebase", "Tailwind CSS", "Node.js"],
        features: ["Interactive Gallery", "Event Calendar", "Member Portal", "Newsletter Signup"],
        completionDate: "2024-08-14",
        rating: 5,
        clientType: "Creative",
        budget: "£100",
        timeline: "2 weeks"
      }
    ]
  }

  // Filter logic
  useEffect(() => {
    let filtered = portfolioItems

    if (selectedCategory !== "all") {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    if (selectedTech !== "all") {
      filtered = filtered.filter(item => 
        item.technologies.some(tech => tech.toLowerCase().includes(selectedTech.toLowerCase()))
      )
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    }

    setFilteredItems(filtered)
  }, [searchTerm, selectedCategory, selectedTech, portfolioItems])

  const categories = [
    { value: "all", label: "All Projects", icon: Globe },
    { value: "ecommerce", label: "E-Commerce", icon: Zap },
    { value: "business", label: "Business", icon: Sparkles },
    { value: "portfolio", label: "Portfolio", icon: Palette },
    { value: "landing", label: "Landing Pages", icon: ArrowRight },
    { value: "blog", label: "Blogs", icon: Eye }
  ]

  const technologies = ["all", "React", "Next.js", "Vue.js", "Node.js", "MongoDB", "PostgreSQL", "Stripe", "Firebase"]

  const getStarRating = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
      />
    ))
  }

  const getCategoryIcon = (category: string) => {
    const categoryObj = categories.find(cat => cat.value === category)
    return categoryObj ? categoryObj.icon : Globe
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/50 to-black">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mb-4"></div>
            <h3 className="text-xl font-semibold text-white mb-2">Loading Our Amazing Work</h3>
            <p className="text-purple-300">Preparing our portfolio showcase...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/50 to-black">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 blur-3xl"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 rounded-full px-6 py-2 border border-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span className="text-purple-300 font-medium">Our Portfolio</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight">
              Crafting Digital
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Masterpieces
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-purple-200 max-w-3xl mx-auto">
              Explore our collection of stunning websites and applications that have transformed businesses and delighted users worldwide.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 text-purple-300">
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">{portfolioItems.length}+</span>
                <span>Projects Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">98%</span>
                <span>Client Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-white">24/7</span>
                <span>Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-12 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <Input
                placeholder="Search projects, technologies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-purple-500/30 focus:border-purple-500 text-white placeholder-purple-300"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-black/50 border-purple-500/30 focus:border-purple-500 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => {
                    const Icon = category.icon
                    return (
                      <SelectItem key={category.value} value={category.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {category.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
              <Select value={selectedTech} onValueChange={setSelectedTech}>
                <SelectTrigger className="w-40 bg-black/50 border-purple-500/30 focus:border-purple-500 text-white">
                  <SelectValue placeholder="Technology" />
                </SelectTrigger>
                <SelectContent>
                  {technologies.map((tech) => (
                    <SelectItem key={tech} value={tech}>
                      {tech === "all" ? "All Tech" : tech}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {categories.map((category) => {
              const Icon = category.icon
              const isActive = selectedCategory === category.value
              return (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
                      : 'bg-black/30 text-purple-300 hover:bg-purple-600/20 border border-purple-500/30'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-8 text-center">
          <p className="text-purple-300">
            Showing <span className="text-white font-semibold">{filteredItems.length}</span> of <span className="text-white font-semibold">{portfolioItems.length}</span> projects
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category)
            return (
              <Card
                key={item.id}
                className="group relative overflow-hidden border border-purple-500/30 bg-gradient-to-br from-black/80 to-purple-950/30 backdrop-blur-md hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-purple-600/90 text-white border-0">
                      <CategoryIcon className="w-3 h-3 mr-1" />
                      {categories.find(cat => cat.value === item.category)?.label}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full">
                      {getStarRating(item.rating)}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      size="sm"
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => window.open(item.liveUrl, '_blank')}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-purple-200 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Client Type:</span>
                      <span className="text-white font-medium">{item.clientType}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Budget:</span>
                      <span className="text-white font-medium">{item.budget}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">Timeline:</span>
                      <span className="text-white font-medium">{item.timeline}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-300">
                        Completed: {new Date(item.completionDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-300">Technologies:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.technologies.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      <span className="text-sm font-medium text-purple-300">Key Features:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {item.features.map((feature, index) => (
                        <Badge
                          key={index}
                          className="text-xs bg-purple-600/20 text-purple-200 border-purple-500/30"
                        >
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-purple-500/20">
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                      onClick={() => window.open(item.liveUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Project
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Search className="w-12 h-12 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No Projects Found</h3>
            <p className="text-purple-300 mb-6">
              Try adjusting your search criteria or browse all projects
            </p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
                setSelectedTech("all")
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-12 border border-purple-500/30">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 blur-3xl"></div>
            <div className="relative space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white">
                Ready to Create Your Own Masterpiece?
              </h2>
              <p className="text-xl text-purple-200 max-w-2xl mx-auto">
                Join our satisfied clients and let us bring your vision to life with cutting-edge technology and stunning design.
              </p>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg"
              >
                Start Your Project
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Portfolio