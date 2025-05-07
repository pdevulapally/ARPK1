"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface PaymentFiltersProps {
  onFilterChange: (filters: any) => void
}

export function PaymentFilters({ onFilterChange }: PaymentFiltersProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("")
  const [source, setSource] = useState("")
  const [dateRange, setDateRange] = useState("")
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    applyFilters()
  }

  const applyFilters = () => {
    onFilterChange({
      searchTerm,
      status,
      source,
      dateRange,
    })
  }

  const resetFilters = () => {
    setSearchTerm("")
    setStatus("")
    setSource("")
    setDateRange("")
    onFilterChange({})
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by ID, email or description..."
            className="pl-8 bg-black/40 border-purple-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          className="border-purple-500/20"
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </form>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border border-purple-500/20 rounded-md bg-black/40">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger id="status" className="bg-black/60">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="succeeded">Succeeded</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="source">Source</Label>
            <Select value={source} onValueChange={setSource}>
              <SelectTrigger id="source" className="bg-black/60">
                <SelectValue placeholder="All sources" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All sources</SelectItem>
                <SelectItem value="stripe">Stripe</SelectItem>
                <SelectItem value="project">Project</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-range">Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger id="date-range" className="bg-black/60">
                <SelectValue placeholder="All time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This week</SelectItem>
                <SelectItem value="month">This month</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button type="button" className="flex-1 bg-purple-600 hover:bg-purple-700" onClick={applyFilters}>
              Apply Filters
            </Button>
            <Button
              type="button"
              variant="outline"
              className="border-red-500/30 text-red-500 hover:bg-red-900/20"
              onClick={resetFilters}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
