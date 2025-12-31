"use client"

import { Search } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"

export function SearchForm({ 
  initialSearch = '',
  status = 'all',
  skill = '',
  experience = '',
  matchScore = '',
  cvQuality = 'all',
  dateRange = 'all',
  sortBy = 'newest'
}: {
  initialSearch?: string
  status?: string
  skill?: string
  experience?: string
  matchScore?: string
  cvQuality?: string
  dateRange?: string
  sortBy?: string
}) {
  const [search, setSearch] = useState(initialSearch)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    const params = new URLSearchParams(searchParams.toString())
    
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    
    // Giữ nguyên các param khác
    if (status !== 'all') params.set('status', status)
    if (skill) params.set('skill', skill)
    if (experience) params.set('experience', experience)
    if (matchScore) params.set('match_score', matchScore)
    if (cvQuality !== 'all') params.set('cv_quality', cvQuality)
    if (dateRange !== 'all') params.set('date_range', dateRange)
    if (sortBy !== 'newest') params.set('sort_by', sortBy)
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(e)
    }
  }

  return (
    <form onSubmit={handleSearch} className="relative w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Tìm theo tên, email, vị trí, kỹ năng..."
        className="w-full px-10 py-2 border rounded-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </form>
  )
}