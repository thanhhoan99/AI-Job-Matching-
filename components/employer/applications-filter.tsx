"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Filter, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { createQueryString } from "@/lib/utils"

const experienceRanges = [
  { label: "Dưới 1 năm", value: "0-1" },
  { label: "1-3 năm", value: "1-3" },
  { label: "3-5 năm", value: "3-5" },
  { label: "5-10 năm", value: "5-10" },
  { label: "Trên 10 năm", value: "10-99" },
]

const matchScoreRanges = [
  { label: "Trên 90%", value: "90-100" },
  { label: "80-90%", value: "80-90" },
  { label: "70-80%", value: "70-80" },
  { label: "Dưới 70%", value: "0-70" },
]

export function ApplicationsFilter({ 
  topSkills,
  currentFilters 
}: { 
  topSkills: string[]
  currentFilters: Record<string, string>
}) {
  const [selectedSkills, setSelectedSkills] = useState<string[]>(
    currentFilters.skill ? [currentFilters.skill] : []
  )
  const [experience, setExperience] = useState<string | null>(currentFilters.experience || null)
  const [matchScore, setMatchScore] = useState<string | null>(currentFilters.matchScore || null)
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Xóa các filter cũ
    params.delete('skill')
    params.delete('experience')
    params.delete('match_score')
    
    // Thêm filter mới
    if (selectedSkills.length > 0) {
      params.set('skill', selectedSkills[0])
    }
    
    if (experience) {
      params.set('experience', experience)
    }
    
    if (matchScore) {
      params.set('match_score', matchScore)
    }
    
    router.push(`${pathname}?${params.toString()}`)
  }

  const clearFilters = () => {
    setSelectedSkills([])
    setExperience(null)
    setMatchScore(null)
    router.push(pathname)
  }

  const activeFilterCount = [
    selectedSkills.length > 0,
    experience,
    matchScore
  ].filter(Boolean).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Lọc
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 p-4">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Bộ lọc ứng viên</span>
          {activeFilterCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
            >
              <X className="w-3 h-3 mr-1" />
              Xóa lọc
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        <DropdownMenuGroup className="space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Lọc theo kỹ năng */}
          <div className="space-y-3">
            <Label className="font-semibold">Kỹ năng</Label>
            <div className="flex flex-wrap gap-2">
              {topSkills.map(skill => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    if (selectedSkills.includes(skill)) {
                      setSelectedSkills(selectedSkills.filter(s => s !== skill))
                    } else {
                      setSelectedSkills([skill])
                    }
                  }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Lọc theo kinh nghiệm */}
          <div className="space-y-3">
            <Label className="font-semibold">Kinh nghiệm</Label>
            <div className="space-y-2">
              {experienceRanges.map(range => (
                <div key={range.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`exp-${range.value}`}
                    checked={experience === range.value}
                    onCheckedChange={(checked) => {
                      setExperience(checked ? range.value : null)
                    }}
                  />
                  <Label 
                    htmlFor={`exp-${range.value}`}
                    className="cursor-pointer text-sm"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Lọc theo điểm AI */}
          <div className="space-y-3">
            <Label className="font-semibold">Độ phù hợp AI</Label>
            <div className="space-y-2">
              {matchScoreRanges.map(range => (
                <div key={range.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`match-${range.value}`}
                    checked={matchScore === range.value}
                    onCheckedChange={(checked) => {
                      setMatchScore(checked ? range.value : null)
                    }}
                  />
                  <Label 
                    htmlFor={`match-${range.value}`}
                    className="cursor-pointer text-sm"
                  >
                    {range.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Nút áp dụng */}
          <div className="pt-4 border-t">
            <Button 
              onClick={applyFilters}
              className="w-full"
            >
              Áp dụng bộ lọc
            </Button>
          </div>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}