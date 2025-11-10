// // components/public/job-search-public.tsx
// "use client"

// import { useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Input } from "@/components/ui/input"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Search, Filter, X } from "lucide-react"
// import { Card, CardContent } from "@/components/ui/card"
// import { Label } from "@/components/ui/label"

// interface JobSearchPublicProps {
//   showFilters?: boolean
// }

// export function JobSearchPublic({ showFilters = false }: JobSearchPublicProps) {
//   const router = useRouter()
//   const searchParams = useSearchParams()
  
//   const [search, setSearch] = useState(searchParams.get("search") || "")
//   const [city, setCity] = useState(searchParams.get("city") || "all")
//   const [type, setType] = useState(searchParams.get("type") || "all")
//   const [salary, setSalary] = useState(searchParams.get("salary") || "all")
//   const [level, setLevel] = useState(searchParams.get("level") || "all")
//   const [showAdvanced, setShowAdvanced] = useState(false)

//   const cities = [
//     "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
//     "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu"
//   ]

//   const jobTypes = [
//     { value: "full_time", label: "Toàn thời gian" },
//     { value: "part_time", label: "Bán thời gian" },
//     { value: "contract", label: "Hợp đồng" },
//     { value: "internship", label: "Thực tập" },
//     { value: "freelance", label: "Freelance" },
//   ]

//   const salaryRanges = [
//     { value: "all", label: "Tất cả mức lương" },
//     { value: "5", label: "Trên 5 triệu" },
//     { value: "10", label: "Trên 10 triệu" },
//     { value: "15", label: "Trên 15 triệu" },
//     { value: "20", label: "Trên 20 triệu" },
//     { value: "30", label: "Trên 30 triệu" },
//   ]

//   const jobLevels = [
//     { value: "all", label: "Tất cả cấp bậc" },
//     { value: "intern", label: "Thực tập" },
//     { value: "junior", label: "Junior" },
//     { value: "middle", label: "Middle" },
//     { value: "senior", label: "Senior" },
//     { value: "lead", label: "Lead" },
//   ]

//   const handleSearch = () => {
//     const params = new URLSearchParams()
    
//     if (search) params.set("search", search)
//     if (city !== "all") params.set("city", city)
//     if (type !== "all") params.set("type", type)
//     if (salary !== "all") params.set("salary_min", salary)
//     if (level !== "all") params.set("level", level)

//     router.push(`/jobs?${params.toString()}`)
//   }

//   const handleReset = () => {
//     setSearch("")
//     setCity("all")
//     setType("all")
//     setSalary("all")
//     setLevel("all")
//     router.push("/jobs")
//   }

//   const activeFilterCount = [
//     city !== "all",
//     type !== "all",
//     salary !== "all",
//     level !== "all"
//   ].filter(Boolean).length

//   return (
//     <div className="space-y-4">
//       {/* Search Bar */}
//       <div className="flex flex-col sm:flex-row gap-4">
//         <div className="flex-1">
//           <Input
//             placeholder="Tìm kiếm công việc, kỹ năng, công ty..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//             className="h-12 text-lg"
//           />
//         </div>
//         <Button onClick={handleSearch} size="lg" className="h-12 px-8">
//           <Search className="w-5 h-5 mr-2" />
//           Tìm kiếm
//         </Button>
//         {showFilters && (
//           <Button 
//             variant="outline" 
//             size="lg"
//             onClick={() => setShowAdvanced(!showAdvanced)}
//             className="h-12"
//           >
//             <Filter className="w-5 h-5 mr-2" />
//             Lọc {activeFilterCount > 0 && `(${activeFilterCount})`}
//           </Button>
//         )}
//       </div>

//       {/* Advanced Filters */}
//       {showAdvanced && showFilters && (
//         <Card>
//           <CardContent className="p-6">
//             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
//               {/* Thành phố */}
//               <div className="space-y-2">
//                 <Label htmlFor="city">Thành phố</Label>
//                 <Select value={city} onValueChange={setCity}>
//                   <SelectTrigger id="city">
//                     <SelectValue placeholder="Tất cả thành phố" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Tất cả thành phố</SelectItem>
//                     {cities.map((city) => (
//                       <SelectItem key={city} value={city}>{city}</SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Loại hình */}
//               <div className="space-y-2">
//                 <Label htmlFor="type">Loại hình</Label>
//                 <Select value={type} onValueChange={setType}>
//                   <SelectTrigger id="type">
//                     <SelectValue placeholder="Tất cả loại hình" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">Tất cả loại hình</SelectItem>
//                     {jobTypes.map((jobType) => (
//                       <SelectItem key={jobType.value} value={jobType.value}>
//                         {jobType.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Mức lương */}
//               <div className="space-y-2">
//                 <Label htmlFor="salary">Mức lương</Label>
//                 <Select value={salary} onValueChange={setSalary}>
//                   <SelectTrigger id="salary">
//                     <SelectValue placeholder="Tất cả mức lương" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {salaryRanges.map((range) => (
//                       <SelectItem key={range.value} value={range.value}>
//                         {range.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Cấp bậc */}
//               <div className="space-y-2">
//                 <Label htmlFor="level">Cấp bậc</Label>
//                 <Select value={level} onValueChange={setLevel}>
//                   <SelectTrigger id="level">
//                     <SelectValue placeholder="Tất cả cấp bậc" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     {jobLevels.map((level) => (
//                       <SelectItem key={level.value} value={level.value}>
//                         {level.label}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex gap-3 mt-6 pt-4 border-t">
//               <Button onClick={handleSearch} className="flex-1">
//                 Áp dụng bộ lọc
//               </Button>
//               <Button variant="outline" onClick={handleReset}>
//                 <X className="w-4 h-4 mr-2" />
//                 Đặt lại
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }
"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface JobSearchPublicProps {
  showFilters?: boolean
}

export function JobSearchPublic({ showFilters = false }: JobSearchPublicProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [city, setCity] = useState(searchParams.get("city") || "all")
  // const [type, setType] = useState(searchParams.get("type") || "all")
  // const [salary, setSalary] = useState(searchParams.get("salary") || "all")
  // const [level, setLevel] = useState(searchParams.get("level") || "all")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [type, setType] = useState<string[]>([])
const [salary, setSalary] = useState<string[]>([])
const [level, setLevel] = useState<string[]>([])


  const cities = [
    "Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Hải Phòng", "Cần Thơ", 
    "An Giang", "Bà Rịa - Vũng Tàu", "Bắc Giang", "Bắc Kạn", "Bạc Liêu"
  ]

  const jobTypes = [
    { value: "full_time", label: "Toàn thời gian" },
    { value: "part_time", label: "Bán thời gian" },
    { value: "contract", label: "Hợp đồng" },
    { value: "internship", label: "Thực tập" },
    { value: "freelance", label: "Freelance" },
  ]

  const salaryRanges = [
    { value: "all", label: "Tất cả mức lương" },
    { value: "5", label: "Trên 5 triệu" },
    { value: "10", label: "Trên 10 triệu" },
    { value: "15", label: "Trên 15 triệu" },
    { value: "20", label: "Trên 20 triệu" },
    { value: "30", label: "Trên 30 triệu" },
  ]

  const jobLevels = [
    { value: "all", label: "Tất cả cấp bậc" },
    { value: "intern", label: "Thực tập" },
    { value: "junior", label: "Junior" },
    { value: "middle", label: "Middle" },
    { value: "senior", label: "Senior" },
    { value: "lead", label: "Lead" },
  ]

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (search) params.set("search", search)
    if (city !== "all") params.set("city", city)
    if (type.length > 0) params.set("type", type[0])
    if (salary.length > 0) params.set("salary_min", salary[0])
    if (level.length > 0) params.set("level", level[0])

    router.push(`/jobs?${params.toString()}`)
  }

  const handleReset = () => {
    setSearch("")
    setCity("all")
    setType([])
    setSalary([])
    setLevel([])
    router.push("/jobs")
  }

  // 🔥 Auto search when filter changes (no button needed)
  useEffect(() => {
    handleSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [city, type, salary, level])

  // 🔥 Delay search typing
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch()
    }, 500)
    return () => clearTimeout(delayDebounce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  // const activeFilterCount = [
  //   city !== "all",
  //   type !== "all",
  //   salary !== "all",
  //   level !== "all"
  // ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Tìm kiếm công việc, kỹ năng, công ty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 text-lg"
          />
        </div>

          {/* <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              
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

     
              <div className="space-y-2">
                <Label htmlFor="salary">Mức lương</Label>
                <Select value={salary} onValueChange={setSalary}>
                  <SelectTrigger id="salary">
                    <SelectValue placeholder="Tất cả mức lương" />
                  </SelectTrigger>
                  <SelectContent>
                    {salaryRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

        
              <div className="space-y-2">
                <Label htmlFor="level">Cấp bậc</Label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger id="level">
                    <SelectValue placeholder="Tất cả cấp bậc" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
        </Card> */}

     <div className="col-lg-3 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-shadow none-shadow mb-30">
                    <div className="sidebar-filters">
                      <div className="filter-block head-border mb-30">
                        <h5>
                          Advance Filter
                          <Button variant="outline" onClick={handleReset}>
                <X className="w-4 h-4 mr-2" />
                Đặt lại
              </Button>
                        </h5>
                      </div>
                    
                        <div className="form-group select-style select-style-icon">
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
                          <i className="fi-rr-marker" />
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Industry</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">180</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Software</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Finance</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">23</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Recruting</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">43</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Management</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Advertising</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-25">Salary Range</h5>
                        <div className="list-checkbox pb-20">
                          <div className="row position-relative mt-10 mb-20">
                            <div className="col-sm-12 box-slider-range">
                              <div id="slider-range" />
                            </div>
                            <div className="box-input-money">
                              <input className="input-disabled form-control min-value-money" type="text" name="min-value-money" disabled={true} defaultValue="" />
                              <input className="form-control min-value" type="hidden" name="min-value" defaultValue="" />
                            </div>
                          </div>
                          <div className="box-number-money">
                            <div className="row mt-30">
                              <div className="col-sm-6 col-6">
                                <span className="font-sm color-brand-1">$0</span>
                              </div>
                              <div className="col-sm-6 col-6 text-end">
                                <span className="font-sm color-brand-1">$500</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-20">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">145</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$0k - $20k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$20k - $40k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">37</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$40k - $60k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">75</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$60k - $80k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">98</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$80k - $100k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">14</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">$100k - $200k</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">25</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Popular Keyword</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Software</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Developer</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">45</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Web</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">57</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Position</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Senior</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Junior</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">35</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Fresher</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Experience Level</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Internship</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Entry Level</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">87</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Associate</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Mid Level</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">45</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Director</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Executive</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">89</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Onsite/Remote</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">On-site</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Remote</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Hybrid</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">58</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-30">
                        <h5 className="medium-heading mb-10">Job Posted</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">78</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">1 day</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">7 days</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">24</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">30 days</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">56</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Job type</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Full Time</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">25</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked={true} />
                                <span className="text-small">Part Time</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">64</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Remote Jobs</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">78</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Freelancer</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">97</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
      </div>

  

  )
}
