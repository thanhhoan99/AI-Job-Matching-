"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Filter, X } from "lucide-react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { Label } from "@/components/ui/label"

interface AdvancedSearchProps {
  currentFilters: {
    status: string
    skill?: string
    experience?: string
    matchScore?: string
    cvQuality?: string
    dateRange?: string
    sortBy?: string
  }
  topSkills: string[]
}

const experienceRanges = [
  { label: "Tất cả", value: "all" },
  { label: "Dưới 1 năm", value: "0-1" },
  { label: "1-3 năm", value: "1-3" },
  { label: "3-5 năm", value: "3-5" },
  { label: "5-8 năm", value: "5-8" },
  { label: "Trên 8 năm", value: "8-100" },
]

const matchScoreRanges = [
  { label: "Tất cả", value: "all" },
  { label: "90-100% (Xuất sắc)", value: "90-100" },
  { label: "70-90% (Tốt)", value: "70-90" },
  { label: "50-70% (Khá)", value: "50-70" },
  { label: "30-50% (Trung bình)", value: "30-50" },
  { label: "0-30% (Yếu)", value: "0-30" },
]

const cvQualityOptions = [
  { label: "Tất cả", value: "all" },
  { label: "Chất lượng cao", value: "high" },
  { label: "Trung bình", value: "medium" },
  { label: "Chất lượng thấp", value: "low" },
  { label: "CV spam", value: "spam" },
]

const dateRangeOptions = [
  { label: "Tất cả thời gian", value: "all" },
  { label: "Hôm nay", value: "today" },
  { label: "7 ngày qua", value: "week" },
  { label: "30 ngày qua", value: "month" },
  { label: "3 tháng qua", value: "quarter" },
]

const sortOptions = [
  { label: "Mới nhất", value: "newest" },
  { label: "Cũ nhất", value: "oldest" },
  { label: "Điểm cao nhất", value: "highest_score" },
  { label: "Điểm thấp nhất", value: "lowest_score" },
  { label: "Kinh nghiệm cao nhất", value: "highest_exp" },
]

export function AdvancedSearch({ currentFilters, topSkills }: AdvancedSearchProps) {
  const [open, setOpen] = useState(false)
  const [filters, setFilters] = useState(currentFilters)
  
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString())
    
    // Cập nhật các tham số lọc
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    router.push(`${pathname}?${params.toString()}`)
    setOpen(false)
  }

  const resetFilters = () => {
    setFilters({
      status: 'all',
      skill: undefined,
      experience: undefined,
      matchScore: undefined,
      cvQuality: undefined,
      dateRange: undefined,
      sortBy: 'newest'
    })
  }

  const activeFilterCount = Object.values(filters).filter(
    value => value && value !== 'all'
  ).length

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Bộ lọc nâng cao
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Bộ lọc nâng cao
          </DialogTitle>
          <DialogDescription>
            Tìm kiếm ứng viên theo nhiều tiêu chí khác nhau
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Lọc theo kỹ năng */}
          <div className="space-y-3">
            <Label>Kỹ năng</Label>
            <div className="flex flex-wrap gap-2">
              {topSkills.map(skill => (
                <Badge
                  key={skill}
                  variant={filters.skill === skill ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => {
                    setFilters(prev => ({
                      ...prev,
                      skill: prev.skill === skill ? undefined : skill
                    }))
                  }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Chọn kỹ năng để lọc ứng viên
            </p>
          </div>

          {/* Lọc theo kinh nghiệm */}
          <div className="space-y-3">
            <Label>Kinh nghiệm</Label>
            <Select
              value={filters.experience || 'all'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, experience: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng kinh nghiệm" />
              </SelectTrigger>
              <SelectContent>
                {experienceRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lọc theo điểm AI */}
          <div className="space-y-3">
            <Label>Điểm phù hợp AI</Label>
            <Select
              value={filters.matchScore || 'all'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, matchScore: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng điểm" />
              </SelectTrigger>
              <SelectContent>
                {matchScoreRanges.map(range => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lọc theo chất lượng CV */}
          <div className="space-y-3">
            <Label>Chất lượng CV</Label>
            <Select
              value={filters.cvQuality || 'all'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, cvQuality: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chất lượng CV" />
              </SelectTrigger>
              <SelectContent>
                {cvQualityOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Lọc theo thời gian */}
          <div className="space-y-3">
            <Label>Thời gian ứng tuyển</Label>
            <Select
              value={filters.dateRange || 'all'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sắp xếp */}
          <div className="space-y-3">
            <Label>Sắp xếp theo</Label>
            <Select
              value={filters.sortBy || 'newest'}
              onValueChange={(value) => setFilters(prev => ({ ...prev, sortBy: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn cách sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={resetFilters} className="gap-2">
            <X className="w-4 h-4" />
            Xóa tất cả
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button onClick={applyFilters}>
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}