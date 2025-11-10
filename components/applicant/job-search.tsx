

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Sparkles, X, SlidersHorizontal } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"

export function JobSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // State cho các bộ lọc cơ bản
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [city, setCity] = useState(searchParams.get("city") || "all")
  const [type, setType] = useState(searchParams.get("type") || "all")




  // State cho các bộ lọc nâng cao
  const [showAdvanced, setShowAdvanced] = useState(false)
  // SỬA: Đổi thành number[] thay vì [number, number]
  const [salaryRange, setSalaryRange] = useState<number[]>([
    parseInt(searchParams.get("salary_min") || "0"),
    parseInt(searchParams.get("salary_max") || "100")
  ])
  const [experience, setExperience] = useState(searchParams.get("experience") || "all")
  const [jobLevel, setJobLevel] = useState(searchParams.get("level") || "all")
  const [skills, setSkills] = useState<string[]>([])
  const [remoteOnly, setRemoteOnly] = useState(searchParams.get("remote") === "true")
  const [urgentOnly, setUrgentOnly] = useState(searchParams.get("urgent") === "true")

  // State cho AI Search Suggestions
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [showAiSuggestions, setShowAiSuggestions] = useState(false)
  const [fallbackSuggestions, setFallbackSuggestions] = useState<string[]>([])

  // Các tùy chọn cho bộ lọc
  const cities = ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", "Khác"]
  const jobTypes = [
    { value: "full_time", label: "Toàn thời gian" },
    { value: "part_time", label: "Bán thời gian" },
    { value: "contract", label: "Hợp đồng" },
    { value: "internship", label: "Thực tập" },
    { value: "freelance", label: "Freelance" },
  ]
  const experienceLevels = [
    { value: "0", label: "Chưa có kinh nghiệm" },
    { value: "1", label: "1 năm" },
    { value: "2", label: "2 năm" },
    { value: "3", label: "3 năm" },
    { value: "5", label: "5+ năm" },
  ]
  const jobLevels = [
    { value: "intern", label: "Thực tập" },
    { value: "junior", label: "Junior" },
    { value: "middle", label: "Middle" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
    { value: "manager", label: "Manager" },
  ]
// Hàm tạo fallback suggestions
const generateFallbackSuggestions = (query: string) => {
  const baseSuggestions = [
    `${query} Developer`,
    `Senior ${query}`,
    `${query} Engineer`, 
    `Junior ${query}`,
    `${query} Specialist`,
    `Tuyển dụng ${query}`,
    `Việc làm ${query}`,
    `${query} tại Hà Nội`,
    `${query} tại Hồ Chí Minh`
  ]
  
  // Lọc các suggestions phù hợp
  return baseSuggestions.filter(suggestion => 
    suggestion.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 6)
}
// Cập nhật hàm getAISearchSuggestions
// const getAISearchSuggestions = async (query: string) => {
//   if (!query.trim() || query.length < 2) {
//     setAiSuggestions([])
//     setFallbackSuggestions([])
//     setShowAiSuggestions(false)
//     return
//   }

//   // Hiển thị fallback suggestions ngay lập tức
//   const fallback = generateFallbackSuggestions(query)
//   setFallbackSuggestions(fallback)
//   setShowAiSuggestions(true)

//   try {
//     const response = await fetch("/api/ai/search-suggestions", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ searchQuery: query }),
//     })

//     if (response.ok) {
//       const result = await response.json()
//       if (result.data?.suggestions && result.data.suggestions.length > 0) {
//         setAiSuggestions(result.data.suggestions)
//       } else {
//         setAiSuggestions(fallback)
//       }
//     } else {
//       setAiSuggestions(fallback)
//     }
//   } catch (error) {
//     console.error("Error getting AI suggestions:", error)
//     setAiSuggestions(fallback)
//   }
// }
  // Debounce cho search input
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     getAISearchSuggestions(search)
  //   }, 500)

  //   return () => clearTimeout(timer)
  // }, [search])

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    // Basic filters
     if (search) params.set("search", search.trim())
    if (city !== "all") params.set("city", city)
    if (type !== "all") params.set("type", type)
    
    // Advanced filters - SỬA: sử dụng salaryRange[0] và salaryRange[1]
    if (salaryRange[0] > 0) params.set("salary_min", salaryRange[0].toString())
    if (salaryRange[1] < 100) params.set("salary_max", salaryRange[1].toString())
    if (experience !== "all") params.set("experience", experience)
    if (jobLevel !== "all") params.set("level", jobLevel)
    if (remoteOnly) params.set("remote", "true")
    if (urgentOnly) params.set("urgent", "true")
    if (skills.length > 0) params.set("skills", skills.join(","))

    const queryString = params.toString()
  console.log("Navigating to:", `/applicant/jobs?${queryString}`)
  
  router.push(`/applicant/jobs?${queryString}`)
  }

  const handleReset = () => {
    setSearch("")
    setCity("all")
    setType("all")
    setSalaryRange([0, 100]) // SỬA: reset về [0, 100]
    setExperience("all")
    setJobLevel("all")
    setSkills([])
    setRemoteOnly(false)
    setUrgentOnly(false)
    setAiSuggestions([])
    setShowAiSuggestions(false)
    router.push("/applicant/jobs")
  }

  // const handleSuggestionClick = (suggestion: string) => {
  //   setSearch(suggestion)
  //   setShowAiSuggestions(false)
  //   handleSearch()
  // }

  const formatSalary = (value: number) => {
    if (value >= 100) return "100+ triệu"
    return `${value} triệu`
  }

  const activeFilterCount = [
    city !== "all",
    type !== "all",
    salaryRange[0] > 0 || salaryRange[1] < 100, // SỬA: sử dụng salaryRange[0] và [1]
    experience !== "all",
    jobLevel !== "all",
    remoteOnly,
    urgentOnly,
    skills.length > 0
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar với AI Suggestions */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Input
              placeholder="Tìm kiếm theo kỹ năng, vị trí, công ty... (AI sẽ gợi ý)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pr-10"
            />
            {search && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                onClick={() => setSearch("")}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
          <Button onClick={handleSearch}>
            <Search className="w-4 h-4 mr-2" />
            Tìm kiếm
          </Button>
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)}>
            <Filter className="w-4 h-4 mr-2" />
            Lọc {activeFilterCount > 0 && `(${activeFilterCount})`}
          </Button>
        </div>

        {/* AI Search Suggestions */}
  
{/* {showAiSuggestions && (aiSuggestions.length > 0 || fallbackSuggestions.length > 0) && (
  <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
    <CardContent className="p-2">
      <div className="flex items-center gap-2 p-2 border-b">
        <Sparkles className="w-4 h-4 text-primary" />
        <span className="text-sm font-medium">
          {aiSuggestions.length > 0 ? "Gợi ý từ AI" : "Gợi ý tìm kiếm"}
        </span>
      </div>
      {(aiSuggestions.length > 0 ? aiSuggestions : fallbackSuggestions).map((suggestion, index) => (
        <div
          key={index}
          className="p-2 hover:bg-accent rounded cursor-pointer text-sm"
          onClick={() => handleSuggestionClick(suggestion)}
        >
          {suggestion}
        </div>
      ))}
    </CardContent>
  </Card>
)} */}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Thành phố */}
              <div className="space-y-2">
                <Label htmlFor="city">Thành phố</Label>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder="Tất cả thành phố" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thành phố</SelectItem>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>{city}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Loại hình công việc */}
              <div className="space-y-2">
                <Label htmlFor="type">Loại hình</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Tất cả loại hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại hình</SelectItem>
                    {jobTypes.map((jobType) => (
                      <SelectItem key={jobType.value} value={jobType.value}>
                        {jobType.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Kinh nghiệm */}
              <div className="space-y-2">
                <Label htmlFor="experience">Kinh nghiệm</Label>
                <Select value={experience} onValueChange={setExperience}>
                  <SelectTrigger id="experience">
                    <SelectValue placeholder="Mọi kinh nghiệm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả kinh nghiệm</SelectItem>
                    {experienceLevels.map((exp) => (
                      <SelectItem key={exp.value} value={exp.value}>
                        {exp.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Cấp bậc */}
              <div className="space-y-2">
                <Label htmlFor="level">Cấp bậc</Label>
                <Select value={jobLevel} onValueChange={setJobLevel}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Tất cả cấp bậc" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả cấp bậc</SelectItem>
                    {jobLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Mức lương */}
              <div className="space-y-4">
                <Label>Mức lương (triệu VNĐ)</Label>
                <div className="space-y-4">
                  {/* SỬA: Slider nhận number[] và onValueChange nhận number[] */}
                  <Slider
                    value={salaryRange}
                    onValueChange={setSalaryRange}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatSalary(salaryRange[0])}</span>
                    <span>{formatSalary(salaryRange[1])}</span>
                  </div>
                </div>
              </div>

              {/* Các tùy chọn khác */}
              <div className="space-y-4">
                <Label>Tùy chọn</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="remote" className="text-sm">Làm việc từ xa</Label>
                    <Switch
                      id="remote"
                      checked={remoteOnly}
                      onCheckedChange={setRemoteOnly}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="urgent" className="text-sm">Tuyển gấp</Label>
                    <Switch
                      id="urgent"
                      checked={urgentOnly}
                      onCheckedChange={setUrgentOnly}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6 pt-4 border-t">
              <Button onClick={handleSearch} className="flex-1">
                <Search className="w-4 h-4 mr-2" />
                Áp dụng bộ lọc
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <X className="w-4 h-4 mr-2" />
                Đặt lại
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Bộ lọc đang áp dụng:</span>
          {city !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Thành phố: {cities.find(c => c === city)}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setCity("all")} />
            </Badge>
          )}
          {type !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {jobTypes.find(t => t.value === type)?.label}
              <X className="w-3 h-3 cursor-pointer" onClick={() => setType("all")} />
            </Badge>
          )}
          {/* SỬA: Sử dụng salaryRange[0] và salaryRange[1] */}
          {(salaryRange[0] > 0 || salaryRange[1] < 100) && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Lương: {formatSalary(salaryRange[0])} - {formatSalary(salaryRange[1])}
              <X 
                className="w-3 h-3 cursor-pointer" 
                onClick={() => setSalaryRange([0, 100])} 
              />
            </Badge>
          )}
          {remoteOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Làm việc từ xa
              <X className="w-3 h-3 cursor-pointer" onClick={() => setRemoteOnly(false)} />
            </Badge>
          )}
          {urgentOnly && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Tuyển gấp
              <X className="w-3 h-3 cursor-pointer" onClick={() => setUrgentOnly(false)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}