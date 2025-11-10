


// // components/public/jobs-content.tsx
// "use client";

// import { useState, useEffect, useRef, useMemo } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Building2, ChevronLeft, ChevronRight, MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import BlogSlider from "@/components/sliders/Blog";
// import { Slider } from "../ui/slider";

// interface Category {
//   id: string;
//   name: string;
// }

// interface Job {
//   id: string;
//   title: string;
//   description: string;
//   job_type: string;
//   job_level: string;
//   salary_min: number | null;
//   salary_max: number | null;
//   location: string;
//   city: string | null;
//   deadline: string | null;
//   created_at: string;
//   skills_required?: string[];
//   categories: {
//     id: string;
//     name: string;
//   };
//   employer_profiles: {
//     company_name: string;
//     logo_url: string | null;
//     city: string | null;
//     industry: string | null;
//   } | null;
// }

// interface JobsContentProps {
//   categories: Category[];
//   initialJobs: Job[];
//   totalJobs: number;
//   searchParams: Record<string, string>;
// }

// export function JobList({
//   categories,
//   initialJobs,
//   totalJobs,
//   searchParams,
// }: JobsContentProps) {
//   const router = useRouter();
//   const urlSearchParams = useSearchParams();

//   // State cho các bộ lọc
//   const [search, setSearch] = useState(searchParams.search || "");
//   const [city, setCity] = useState(searchParams.city || "all");
//   const [type, setType] = useState(searchParams.type || "all");
//   const [level, setLevel] = useState(searchParams.level || "all");
//   const [category, setCategory] = useState(searchParams.category || "all");
//   const [salaryRange, setSalaryRange] = useState<number[]>([
//     parseInt(searchParams.salary_min || "0"),
//     parseInt(searchParams.salary_max || "50"),
//   ]);
//   const [remoteOnly, setRemoteOnly] = useState(searchParams.remote === "true");
//   const [urgentOnly, setUrgentOnly] = useState(searchParams.urgent === "true");
//   const [jobs, setJobs] = useState<Job[]>(initialJobs);
//   const [viewType, setViewType] = useState<"list" | "grid">("grid");

//   // State cho phân trang
//   const [currentPage, setCurrentPage] = useState(1);
//   const [jobsPerPage, setJobsPerPage] = useState(9);
//   const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

//   // Cập nhật jobs khi initialJobs thay đổi
//   useEffect(() => {
//     setJobs(initialJobs);
//     setCurrentPage(1);
//   }, [initialJobs]);

//   // Ref để tránh gọi search khi mount lần đầu
//   const isInitialMount = useRef(true);

//   // Các tùy chọn cho bộ lọc
//   const cities = [
//     "Hà Nội",
//     "Hồ Chí Minh",
//     "Đà Nẵng",
//     "Hải Phòng",
//     "Cần Thơ",
//     "Khác",
//   ];
//   const jobTypes = [
//     { value: "all", label: "Tất cả loại hình" },
//     { value: "full_time", label: "Toàn thời gian" },
//     { value: "part_time", label: "Bán thời gian" },
//     { value: "contract", label: "Hợp đồng" },
//     { value: "internship", label: "Thực tập" },
//     { value: "freelance", label: "Freelance" },
//   ];
//     const jobLevels = [
//     { value: "all", label: "Tất cả cấp độ" },
//     { value: "intern", label: "Cấp độ intern" },
//     { value: "junior", label: "Cấp độ junior" },
//     { value: "middle", label: "Cấp độ middle" },
//     { value: "senior", label: "Cấp độ senior" },
//     { value: "lead", label: "Cấp độ lead" },
//     { value: "manager", label: "Cấp độ manager" },
//     { value: "director", label: "Cấp độ director" },
//   ];
  

//   // Hàm search với debounce
//   const handleSearch = useRef(
//     require("lodash").debounce(
//       (
//         searchValue: string,
//         cityValue: string,
//         typeValue: string,
//         levelValue: string,
//         categoryValue: string,
//         salaryRangeValue: number[],
//         remoteValue: boolean,
//         urgentValue: boolean
//       ) => {
//         const params = new URLSearchParams();

//         if (searchValue) params.set("search", searchValue.trim());
//         if (cityValue !== "all") params.set("city", cityValue);
//         if (typeValue !== "all") params.set("type", typeValue);
//         if (levelValue !== "all") params.set("level", levelValue);
//         if (categoryValue !== "all") params.set("category", categoryValue);

//         if (salaryRangeValue[0] > 0)
//           params.set("salary_min", salaryRangeValue[0].toString());
//         if (salaryRangeValue[1] < 50)
//           params.set("salary_max", salaryRangeValue[1].toString());
//         if (remoteValue) params.set("remote", "true");
//         if (urgentValue) params.set("urgent", "true");

//         const queryString = params.toString();
//         router.push(`/applicant/jobs?${queryString}`);
//       },
//       300
//     )
//   ).current;

//   // Tự động gọi search khi các filter thay đổi
//   useEffect(() => {
//     if (isInitialMount.current) {
//       isInitialMount.current = false;
//       return;
//     }

//     handleSearch(
//       search,
//       city,
//       type,
//       level,
//       category,
//       salaryRange,
//       remoteOnly,
//       urgentOnly
//     );
//   }, [
//     search,
//     city,
//     type,
//     level,
//     category,
//     salaryRange,
//     remoteOnly,
//     urgentOnly,
//     handleSearch,
//   ]);

//   const handleReset = () => {
//     setSearch("");
//     setCity("all");
//     setType("all");
//     setLevel("all");
//     setCategory("all");
//     setSalaryRange([0, 50]);
//     setRemoteOnly(false);
//     setUrgentOnly(false);
//     setCurrentPage(1);
//   };

//   // Job List Functions
//   const formatJobSalary = (min: number | null, max: number | null) => {
//     if (!min && !max) return "Thỏa thuận";
//     if (min && max)
//       return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} triệu`;
//     if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu`;
//     return "Thỏa thuận";
//   };

//   const formatJobType = (type: string) => {
//     const types: Record<string, string> = {
//       full_time: "Toàn thời gian",
//       part_time: "Bán thời gian",
//       contract: "Hợp đồng",
//       internship: "Thực tập",
//       freelance: "Freelance",
//     };
//     return types[type] || type;
//   };

//   const formatJobLevel = (level: string) => {
//     const levels: Record<string, string> = {
//       intern: "Cấp độ intern",
//       junior: "Cấp độ junior",
//       middle: "Cấp độ middle",
//       senior: "Cấp độ senior",
//       lead: "Cấp độ lead",
//       manager: "Cấp độ manager",
//       director: "Cấp độ director",
//     };
//     return levels[level] || level;
//   };


//   const getTimeAgo = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffMs = now.getTime() - date.getTime();
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     if (diffMins < 60) return `${diffMins} phút trước`;
//     if (diffHours < 24) return `${diffHours} giờ trước`;
//     return `${diffDays} ngày trước`;
//   };

//   // Logic lọc lương theo Overlap Range
//   const filteredJobs = useMemo(() => {
//     let filtered = [...jobs];

//     // Lọc theo lương - Overlap Range
//     const minSalaryFilter = salaryRange[0] * 1000000;
//     const maxSalaryFilter = salaryRange[1] * 1000000;

//     filtered = filtered.filter((job) => {
//       const jobMin = job.salary_min || 0;
//       const jobMax = job.salary_max || Infinity;
//       const hasOverlap = jobMin <= maxSalaryFilter && jobMax >= minSalaryFilter;
//       return hasOverlap;
//     });

//     // Sắp xếp
//     filtered.sort((a, b) => {
//       switch (sortBy) {
//         case "newest":
//           return (
//             new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
//           );
//         case "oldest":
//           return (
//             new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
//           );
//         default:
//           return 0;
//       }
//     });

//     return filtered;
//   }, [jobs, salaryRange, sortBy]);

//   // Phân trang logic
//   const indexOfLastJob = currentPage * jobsPerPage;
//   const indexOfFirstJob = indexOfLastJob - jobsPerPage;
//   const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
//   const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;

//   // Tạo mảng các trang để hiển thị
//   const getPageNumbers = () => {
//     if (totalPages <= 1) return [1];

//     const pageNumbers = [];
//     const maxPagesToShow = 5;

//     if (totalPages <= maxPagesToShow) {
//       for (let i = 1; i <= totalPages; i++) {
//         pageNumbers.push(i);
//       }
//     } else {
//       if (currentPage <= 3) {
//         for (let i = 1; i <= 4; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push("...");
//         pageNumbers.push(totalPages);
//       } else if (currentPage >= totalPages - 2) {
//         pageNumbers.push(1);
//         pageNumbers.push("...");
//         for (let i = totalPages - 3; i <= totalPages; i++) {
//           pageNumbers.push(i);
//         }
//       } else {
//         pageNumbers.push(1);
//         pageNumbers.push("...");
//         for (let i = currentPage - 1; i <= currentPage + 1; i++) {
//           pageNumbers.push(i);
//         }
//         pageNumbers.push("...");
//         pageNumbers.push(totalPages);
//       }
//     }

//     return pageNumbers;
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleJobsPerPageChange = (value: number) => {
//     setJobsPerPage(value);
//     setCurrentPage(1);
//   };

//   // Đảm bảo currentPage không vượt quá totalPages
//   useEffect(() => {
//     if (currentPage > totalPages && totalPages > 0) {
//       setCurrentPage(totalPages);
//     }
//   }, [totalPages, currentPage]);

//   return (
//     <div className="w-full">
//       {/* Banner Hero Section */}
//       <section className="section-box-2">
//         <div className="container">
//           <div className="banner-hero banner-single banner-single-bg">
//             <div className="block-banner text-center">
//               <h3 className="wow animate__animated animate__fadeInUp">
//                 <span className="color-brand-2">{totalJobs} Việc làm</span> Đang chờ bạn
//               </h3>
//               <div className="font-sm color-text-paragraph-2 mt-10 wow animate__animated animate__fadeInUp">
//                 Khám phá hàng ngàn cơ hội việc làm phù hợp với kỹ năng và kinh nghiệm của bạn
//               </div>
//               <div className="form-find text-start mt-40 wow animate__animated animate__fadeInUp">
//                 <form className="form-search-job">
//                   <div className="box-search">
//                     <input
//                       className="form-input input-keysearch mr-10"
//                       placeholder="Tìm kiếm theo kỹ năng, vị trí, công ty..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                     />
//                     <select 
//                       className="form-input mr-10 input-location"
//                       value={city}
//                       onChange={(e) => setCity(e.target.value)}
//                     >
//                       <option value="all">Tất cả thành phố</option>
//                       {cities.map((city) => (
//                         <option key={city} value={city}>{city}</option>
//                       ))}
//                     </select>
//                     <select
//                       className="form-input mr-10 input-industry"
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                     >
//                       <option value="all">Tất cả danh mục</option>
//                       {categories.map((cat) => (
//                         <option key={cat.id} value={cat.id}>{cat.name}</option>
//                       ))}
//                     </select>
//                     <button className="btn btn-default btn-find font-sm" type="button">
//                       Tìm kiếm
//                     </button>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Content Section */}
//       <section className="section-box mt-30">
//         <div className="container">
//           <div className="row flex-row-reverse">
//             {/* Job Listings */}
//             <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
//               <div className="content-page">
//                 {/* Filters Bar */}
//                 <div className="box-filters-job">
//                   <div className="row">
//                     <div className="col-xl-6 col-lg-5">
//                       <span className="text-small text-showing">
//                         Hiển thị{" "}
//                         <strong>
//                           {indexOfFirstJob + 1}-
//                           {Math.min(indexOfLastJob, filteredJobs.length)}
//                         </strong>{" "}
//                         trong <strong>{filteredJobs.length}</strong> việc làm
//                       </span>
//                     </div>
//                     <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
//                       <div className="display-flex2">
//                         <div className="box-border mr-10">
//                           <span className="text-sortby">Hiển thị:</span>
//                           <div className="dropdown dropdown-sort">
//                             <button className="btn dropdown-toggle" type="button">
//                               <span>{jobsPerPage}</span>
//                               <i className="fi-rr-angle-small-down" />
//                             </button>
//                             <ul className="dropdown-menu dropdown-menu-light">
//                               {[6, 12, 24].map((num) => (
//                                 <li key={num}>
//                                   <button
//                                     className={`dropdown-item ${jobsPerPage === num ? "active" : ""}`}
//                                     onClick={() => handleJobsPerPageChange(num)}
//                                   >
//                                     {num}
//                                   </button>
//                                 </li>
//                               ))}
//                             </ul>
//                           </div>
//                         </div>
//                         <div className="box-border">
//                           <span className="text-sortby">Sắp xếp:</span>
//                           <div className="dropdown dropdown-sort">
//                             <button className="btn dropdown-toggle" type="button">
//                               <span>
//                                 {sortBy === "newest" ? "Mới nhất" : "Cũ nhất"}
//                               </span>
//                               <i className="fi-rr-angle-small-down" />
//                             </button>
//                             <ul className="dropdown-menu dropdown-menu-light">
//                               <li>
//                                 <button
//                                   className={`dropdown-item ${sortBy === "newest" ? "active" : ""}`}
//                                   onClick={() => setSortBy("newest")}
//                                 >
//                                   Mới nhất
//                                 </button>
//                               </li>
//                               <li>
//                                 <button
//                                   className={`dropdown-item ${sortBy === "oldest" ? "active" : ""}`}
//                                   onClick={() => setSortBy("oldest")}
//                                 >
//                                   Cũ nhất
//                                 </button>
//                               </li>
//                             </ul>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Job Listings */}
//                 {currentJobs.length === 0 ? (
//                   <div className="text-center py-12">
//                     <div className="card-grid-2 bg-9 text-center p-40">
//                       <Building2 className="text-mutted mx-auto mb-15" size={48} />
//                       <h6 className="text-16 mb-10">Không tìm thấy công việc phù hợp</h6>
//                       <p className="text-sm color-text-mutted">
//                         Thử điều chỉnh bộ lọc tìm kiếm của bạn hoặc quay lại sau
//                       </p>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="row">
//                     {currentJobs.map((job) => (
//                       <div
//                         key={job.id}
//                         className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 "
//                       >
//                         <div className="card-grid-2 hover-up ">
//                           <div className="card-grid-2-image-left">
//                             {urgentOnly && <span className="flash" />}
//                             <div className="image-box">
//                               {job.employer_profiles?.logo_url ? (
//                                 <Image
//                                   width={50}
//                                   height={50}
//                                   src={job.employer_profiles.logo_url}
//                                   alt={job.employer_profiles.company_name}
//                                   className="img-responsive"
//                                 />
//                               ) : (
//                                 <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
//                                   <Building2 className="w-6 h-6 text-muted-foreground" />
//                                 </div>
//                               )}
//                             </div>
//                             <div className="right-info">
//                               <Link
//                                 href={`/company/${job.employer_profiles?.company_name}`}
//                               >
//                                 <span className="name-job">
//                                   {job.employer_profiles?.company_name}
//                                 </span>
//                               </Link>
//                               <span className="location-small">
//                                 {job.city || job.location}
//                               </span>
//                             </div>
//                           </div>

//                           <div className="card-block-info flex-grow-1 d-flex flex-column">
//                             <h6>
//                               <Link href={`/jobs/${job.id}`}>
//                                 {job.title}
//                               </Link>
//                             </h6>
//                             <div className="mt-5">
//                                {/* <span className="card-level">{job.job_level}</span> */}
//                               <span className="card-briefcase">
//                                 {formatJobType(job.job_type)}
//                               </span>
                             
//                               <span className="card-time">
//                                 {getTimeAgo(job.created_at)}
//                               </span>
//                             </div>
//                             <p className="font-sm color-text-paragraph mt-15 line-clamp-2 flex-grow-0">
//                               {job.description}
//                             </p>
//                             <div className="mt-30  flex flex-wrap gap-2">
//                               {job.skills_required
//                                 ?.slice(0, 2)
//                                 .map((skill: string) => (
//                                   <span
//                                     key={skill}
//                                     className="btn btn-grey-small mr-5"
//                                   >
//                                     {skill}
//                                   </span>
//                                 ))}
//                             </div>
//                             <div className="card-2-bottom mt-auto pt-30">
//                               <div className="row">
//                                 <div className="col-lg-7 col-7">
//                                   <span
//                                     style={{ fontSize: 12 }}
//                                     className="card-text-price"
//                                   >
//                                     {formatJobSalary(
//                                       job.salary_min,
//                                       job.salary_max
//                                     )}
//                                     <span style={{ fontSize: 11 }}>/Tháng</span>
//                                   </span>
//                                 </div>
//                                 <div className="col-lg-5 col-5 text-end">
//                                   <Link
//                                     href={`/applicant/jobs/${job.id}`}
//                                     className="btn btn-apply-now"
//                                   >
//                                     Ứng tuyển
//                                   </Link>
//                                 </div>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* Pagination */}
//                 {filteredJobs.length > 0 && totalPages > 1 && (
//                   <div className="flex justify-center mt-8">
//                     <ul className="flex items-center gap-2">
//                       <li>
//                         <button
//                           className={`w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-400 transition ${
//                             currentPage === 1
//                               ? "opacity-50 cursor-not-allowed"
//                               : ""
//                           }`}
//                           onClick={() =>
//                             currentPage > 1 && handlePageChange(currentPage - 1)
//                           }
//                         >
//                           ‹
//                         </button>
//                       </li>

//                       {getPageNumbers().map((page, index) => (
//                         <li key={index}>
//                           {page === "..." ? (
//                             <span className="px-2 text-gray-400">...</span>
//                           ) : (
//                             <button
//                               className={`w-9 h-9 rounded-md border flex items-center justify-center text-sm font-medium transition ${
//                                 currentPage === page
//                                   ? "bg-blue-500 text-white border-blue-500"
//                                   : "border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-400"
//                               }`}
//                               onClick={() => handlePageChange(page as number)}
//                             >
//                               {page}
//                             </button>
//                           )}
//                         </li>
//                       ))}

//                       <li>
//                         <button
//                           className={`w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-400 transition ${
//                             currentPage === totalPages
//                               ? "opacity-50 cursor-not-allowed"
//                               : ""
//                           }`}
//                           onClick={() =>
//                             currentPage < totalPages &&
//                             handlePageChange(currentPage + 1)
//                           }
//                         >
//                           ›
//                         </button>
//                       </li>
//                     </ul>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Sidebar Filters */}
//             <div className="col-lg-3 col-md-12 col-sm-12 col-12">
//               <div className="sidebar-shadow none-shadow mb-30">
//                 <div className="sidebar-filters">
//                   <div className="filter-block head-border mb-30">
//                     <h5>
//                       Bộ lọc nâng cao
//                       <a className="link-reset" onClick={handleReset}>
//                         Đặt lại
//                       </a>
//                     </h5>
//                   </div>

//                   {/* Location Filter */}
//                   <div className="filter-block mb-30">
//                     <div className="form-group select-style select-style-icon">
//                       <select 
//                         className="form-control form-icons select-active"
//                         value={city}
//                         onChange={(e) => setCity(e.target.value)}
//                       >
//                         <option value="all">Tất cả thành phố</option>
//                         {cities.map((city) => (
//                           <option key={city} value={city}>{city}</option>
//                         ))}
//                       </select>
//                       <i className="fi-rr-marker" />
//                     </div>
//                   </div>

//                   {/* Industry Filter */}
//                   <div className="filter-block mb-20">
//                     <h5 className="medium-heading mb-15">Danh mục</h5>
//                     <div className="form-group">
//                       <ul className="list-checkbox">
//                         <li>
//                           <label className="cb-container">
//                             <input
//                               type="checkbox"
//                               checked={category === "all"}
//                               onChange={() => setCategory("all")}
//                             />
//                             <span className="text-small">Tất cả</span>
//                             <span className="checkmark" />
//                           </label>
//                           <span className="number-item">{jobs.length}</span>
//                         </li>
//                         {categories.slice(0, 5).map((cat) => (
//                           <li key={cat.id}>
//                             <label className="cb-container">
//                               <input
//                                 type="checkbox"
//                                 checked={category === cat.id}
//                                 onChange={() => setCategory(cat.id)}
//                               />
//                               <span className="text-small">{cat.name}</span>
//                               <span className="checkmark" />
//                             </label>
//                             <span className="number-item">
//                               {jobs.filter((j) => j.categories.id === cat.id).length}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>

//                        {/* Salary Range - SỬA LẠI VỚI OVERLAP RANGE */}
//                  <div className="filter-block mb-20">
//                     <h5 className="medium-heading mb-25">
//                        Mức lương (triệu VNĐ)
//                      </h5>
//                     <div className="list-checkbox pb-20">
//                       <div className="row position-relative mt-10 mb-20">                         <div className="col-sm-12 box-slider-range">
//                           <Slider
//                             value={salaryRange}
//                             onValueChange={setSalaryRange}
//                             max={50}
//                             step={1}
//                             className="w-full"
//                           />
//                         </div>
//                         <div className="box-input-money">
//                           <input
//                             className="input-disabled form-control min-value-money text-center"
//                             type="text"
//                             disabled
//                             value={`${salaryRange[0]} - ${salaryRange[1]} triệu`}
//                           />
//                         </div>
//                       </div>
//                       <div className="box-number-money">
//                         <div className="row mt-30">
//                           <div className="col-sm-6 col-6">
//                             <span className="font-sm color-brand-1">0tr</span>
//                           </div>
//                           <div className="col-sm-6 col-6 text-end">
//                             <span className="font-sm color-brand-1">50+tr</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="text-xs text-muted-foreground mt-2 text-center">
//                       Hiển thị công việc có mức lương GIAO với khoảng bạn chọn
//                     </div>
//                   </div>

//                   {/* Job Type */}
//                   <div className="filter-block mb-20">
//                     <h5 className="medium-heading mb-15">Loại hình công việc</h5>
//                     <div className="form-group">
//                       <ul className="list-checkbox">
//                         <li>
//                           <label className="cb-container">
//                             <input
//                               type="checkbox"
//                               checked={type === "all"}
//                               onChange={() => setType("all")}
//                             />
//                             <span className="text-small">Tất cả</span>
//                             <span className="checkmark" />
//                           </label>
//                           <span className="number-item">{jobs.length}</span>
//                         </li>
//                         {jobTypes.filter((t) => t.value !== "all").map((jobType) => (
//                           <li key={jobType.value}>
//                             <label className="cb-container">
//                               <input
//                                 type="checkbox"
//                                 checked={type === jobType.value}
//                                 onChange={() => setType(jobType.value)}
//                               />
//                               <span className="text-small">{jobType.label}</span>
//                               <span className="checkmark" />
//                             </label>
//                             <span className="number-item">
//                               {jobs.filter((j) => j.job_type === jobType.value).length}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>

//                      {/* Job Level */}
//                   <div className="filter-block mb-20">
//                     <h5 className="medium-heading mb-15">Cấp độ công việc</h5>
//                     <div className="form-group">
//                       <ul className="list-checkbox">
//                         <li>
//                           <label className="cb-container">
//                             <input
//                               type="checkbox"
//                               checked={level === "all"}
//                               onChange={() => setLevel("all")}
//                             />
//                             <span className="text-small">Tất cả</span>
//                             <span className="checkmark" />
//                           </label>
//                           <span className="number-item">{jobs.length}</span>
//                         </li>
//                         {jobLevels.filter((t) => t.value !== "all").map((jobLevel) => (
//                           <li key={jobLevel.value}>
//                             <label className="cb-container">
//                               <input
//                                 type="checkbox"
//                                 checked={level === jobLevel.value}
//                                 onChange={() => setLevel(jobLevel.value)}
//                               />
//                               <span className="text-small">{jobLevel.label}</span>
//                               <span className="checkmark" />
//                             </label>
//                             <span className="number-item">
//                               {jobs.filter((j) => j.job_level === jobLevel.value).length}
//                             </span>
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Blog Section */}
//       <section className="section-box mt-50 mb-50">
//         <div className="container">
//           <div className="text-start">
//             <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
//               Tin tức và Blog
//             </h2>
//             <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
//               Cập nhật tin tức mới nhất và mẹo nghề nghiệp
//             </p>
//           </div>
//         </div>
//         <div className="container">
//           <div className="mt-50">
//             <div className="box-swiper style-nav-top">
//               <BlogSlider />
//             </div>
//             <div className="text-center">
//               <Link href="/blog">
//                 <div className="btn btn-brand-1 btn-icon-load mt--30 hover-up">
//                   Xem thêm bài viết
//                 </div>
//               </Link>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Newsletter Section */}
//       <section className="section-box mt-50 mb-20">
//         <div className="container">
//           <div className="box-newsletter">
//             <div className="row">
//               <div className="col-xl-3 col-12 text-center d-none d-xl-block">
//                 <img
//                   src="/assets/imgs/template/newsletter-left.png"
//                   alt="Newsletter"
//                 />
//               </div>
//               <div className="col-lg-12 col-xl-6 col-12">
//                 <h2 className="text-md-newsletter text-center">
//                   Nhận thông tin việc làm mới
//                   <br /> Cập nhật thường xuyên
//                 </h2>
//                 <div className="box-form-newsletter mt-40">
//                   <form className="form-newsletter">
//                     <input
//                       className="input-newsletter"
//                       placeholder="Nhập email của bạn..."
//                       type="email"
//                     />
//                     <button className="btn btn-default font-heading icon-send-letter">
//                       Đăng ký
//                     </button>
//                   </form>
//                 </div>
//               </div>
//               <div className="col-xl-3 col-12 text-center d-none d-xl-block">
//                 <img
//                   src="/assets/imgs/template/newsletter-right.png"
//                   alt="Newsletter"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }



// components/public/jobs-content.tsx
"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Building2, ChevronLeft, ChevronRight, MapPin, Briefcase, DollarSign, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import BlogSlider from "@/components/sliders/Blog";
import { Slider } from "../ui/slider";
import { useTrackBehavior } from "@/hooks/useTrackBehavior";

import { ApplyButton } from "./apply-button";
import { createClient } from "@/lib/supabase/client";

interface Category {
  id: string;
  name: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  job_type: string;
  job_level: string;
  salary_min: number | null;
  salary_max: number | null;
  location: string;
  city: string | null;
  deadline: string | null;
  created_at: string;
  skills_required?: string[];
  categories: {
    id: string;
    name: string;
  };
  employer_profiles: {
    company_name: string;
    logo_url: string | null;
    city: string | null;
    industry: string | null;
  } | null;
}

interface JobsContentProps {
  categories: Category[];
  initialJobs: Job[];
  totalJobs: number;
  searchParams: Record<string, string>;
}

export  function JobList({
  categories,
  initialJobs,
  totalJobs,
  searchParams,
}: JobsContentProps) {
  const router = useRouter();
  const urlSearchParams = useSearchParams();

  const { trackBehavior } = useTrackBehavior();
  const supabase =  createClient(); 

  // State cho các bộ lọc
  const [search, setSearch] = useState(searchParams.search || "");
  const [city, setCity] = useState(searchParams.city || "all");
  const [type, setType] = useState(searchParams.type || "all");
  const [level, setLevel] = useState(searchParams.level || "all");
  const [category, setCategory] = useState(searchParams.category || "all");
  const [salaryRange, setSalaryRange] = useState<number[]>([
    parseInt(searchParams.salary_min || "0"),
    parseInt(searchParams.salary_max || "50"),
  ]);
  const [remoteOnly, setRemoteOnly] = useState(searchParams.remote === "true");
  const [urgentOnly, setUrgentOnly] = useState(searchParams.urgent === "true");
  const [jobs, setJobs] = useState<Job[]>(initialJobs);
  const [viewType, setViewType] = useState<"list" | "grid">("grid");

  // State cho phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(9);
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");

  // THÊM STATE CHO APPLICANT VÀ APPLICATIONS
  const [applicantId, setApplicantId] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Set<string>>(new Set());
  const [isLoadingApplicant, setIsLoadingApplicant] = useState(true);

  // Cập nhật jobs khi initialJobs thay đổi
  useEffect(() => {
    setJobs(initialJobs);
    setCurrentPage(1);
  }, [initialJobs]);

   // LẤY THÔNG TIN APPLICANT VÀ DANH SÁCH ỨNG TUYỂN
  useEffect(() => {
    const getApplicantInfo = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Lấy applicant profile
          const { data: applicantProfile } = await supabase
            .from('applicant_profiles')
            .select('id')
            .eq('user_id', session.user.id)
            .single();

          if (applicantProfile) {
            setApplicantId(applicantProfile.id);

            // Lấy danh sách job applications của applicant
            const { data: applications } = await supabase
              .from('job_applications')
              .select('job_id')
              .eq('applicant_id', applicantProfile.id);

            if (applications) {
              const appliedIds = new Set(applications.map(app => app.job_id));
              setAppliedJobIds(appliedIds);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching applicant info:', error);
      } finally {
        setIsLoadingApplicant(false);
      }
    };

    getApplicantInfo();
  }, [supabase]);

  const handleApplySuccess = async () => {
    if (applicantId) {
      try {
        const { data: applications } = await supabase
          .from('job_applications')
          .select('job_id')
          .eq('applicant_id', applicantId);

        if (applications) {
          const appliedIds = new Set(applications.map(app => app.job_id));
          setAppliedJobIds(appliedIds);
        }
      } catch (error) {
        console.error('Error refreshing applications:', error);
      }
    }
  };

   const handleJobClick = (jobId: string, jobTitle: string) => {
    trackBehavior({
      jobId,
      eventType: 'click',
    });
    console.log(`🖱️ Clicked on job: ${jobTitle}`);
  }
  //  const handleJobView = (jobId: string, jobTitle: string) => {
  //   trackBehavior({
  //     jobId,
  //     eventType: 'view',
  //     page: 'job-list'
  //   });
  // }
  // Ref để tránh gọi search khi mount lần đầu
  const isInitialMount = useRef(true);

  // Các tùy chọn cho bộ lọc
  const cities = [
    "Hà Nội",
    "Hồ Chí Minh",
    "Đà Nẵng",
    "Hải Phòng",
    "Cần Thơ",
    "Khác",
  ];
  const jobTypes = [
    { value: "all", label: "Tất cả loại hình" },
    { value: "full_time", label: "Toàn thời gian" },
    { value: "part_time", label: "Bán thời gian" },
    { value: "contract", label: "Hợp đồng" },
    { value: "internship", label: "Thực tập" },
    { value: "freelance", label: "Freelance" },
  ];
    const jobLevels = [
    { value: "all", label: "Tất cả cấp độ" },
    { value: "intern", label: "Cấp độ intern" },
    { value: "junior", label: "Cấp độ junior" },
    { value: "middle", label: "Cấp độ middle" },
    { value: "senior", label: "Cấp độ senior" },
    { value: "lead", label: "Cấp độ lead" },
    { value: "manager", label: "Cấp độ manager" },
    { value: "director", label: "Cấp độ director" },
  ];
  

  // Hàm search với debounce
  const handleSearch = useRef(
    require("lodash").debounce(
      (
        searchValue: string,
        cityValue: string,
        typeValue: string,
        levelValue: string,
        categoryValue: string,
        salaryRangeValue: number[],
        remoteValue: boolean,
        urgentValue: boolean
      ) => {
        const params = new URLSearchParams();

        if (searchValue) params.set("search", searchValue.trim());
        if (cityValue !== "all") params.set("city", cityValue);
        if (typeValue !== "all") params.set("type", typeValue);
        if (levelValue !== "all") params.set("level", levelValue);
        if (categoryValue !== "all") params.set("category", categoryValue);

        if (salaryRangeValue[0] > 0)
          params.set("salary_min", salaryRangeValue[0].toString());
        if (salaryRangeValue[1] < 50)
          params.set("salary_max", salaryRangeValue[1].toString());
        if (remoteValue) params.set("remote", "true");
        if (urgentValue) params.set("urgent", "true");

        const queryString = params.toString();
        router.push(`/applicant/jobs?${queryString}`);
      },
      300
    )
  ).current;

  // Tự động gọi search khi các filter thay đổi
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    handleSearch(
      search,
      city,
      type,
      level,
      category,
      salaryRange,
      remoteOnly,
      urgentOnly
    );
  }, [
    search,
    city,
    type,
    level,
    category,
    salaryRange,
    remoteOnly,
    urgentOnly,
    handleSearch,
  ]);

  const handleReset = () => {
    setSearch("");
    setCity("all");
    setType("all");
    setLevel("all");
    setCategory("all");
    setSalaryRange([0, 50]);
    setRemoteOnly(false);
    setUrgentOnly(false);
    setCurrentPage(1);
  };

  // Job List Functions
  const formatJobSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max)
      return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} triệu`;
    if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu`;
    return "Thỏa thuận";
  };

  const formatJobType = (type: string) => {
    const types: Record<string, string> = {
      full_time: "Toàn thời gian",
      part_time: "Bán thời gian",
      contract: "Hợp đồng",
      internship: "Thực tập",
      freelance: "Freelance",
    };
    return types[type] || type;
  };

  const formatJobLevel = (level: string) => {
    const levels: Record<string, string> = {
      intern: "Cấp độ intern",
      junior: "Cấp độ junior",
      middle: "Cấp độ middle",
      senior: "Cấp độ senior",
      lead: "Cấp độ lead",
      manager: "Cấp độ manager",
      director: "Cấp độ director",
    };
    return levels[level] || level;
  };


  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    return `${diffDays} ngày trước`;
  };

  // Logic lọc lương theo Overlap Range
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Lọc theo lương - Overlap Range
    const minSalaryFilter = salaryRange[0] * 1000000;
    const maxSalaryFilter = salaryRange[1] * 1000000;

    filtered = filtered.filter((job) => {
      const jobMin = job.salary_min || 0;
      const jobMax = job.salary_max || Infinity;
      const hasOverlap = jobMin <= maxSalaryFilter && jobMax >= minSalaryFilter;
      return hasOverlap;
    });

    // Sắp xếp
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        case "oldest":
          return (
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [jobs, salaryRange, sortBy]);

  // Phân trang logic
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage) || 1;

  // Tạo mảng các trang để hiển thị
  const getPageNumbers = () => {
    if (totalPages <= 1) return [1];

    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleJobsPerPageChange = (value: number) => {
    setJobsPerPage(value);
    setCurrentPage(1);
  };

  // Đảm bảo currentPage không vượt quá totalPages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  return (
    <div className="w-full">
      {/* Banner Hero Section */}
      <section className="section-box-2">
        <div className="container">
          <div className="banner-hero banner-single banner-single-bg">
            <div className="block-banner text-center">
              <h3 className="wow animate__animated animate__fadeInUp">
                <span className="color-brand-2">{totalJobs} Việc làm</span> Đang chờ bạn
              </h3>
              <div className="font-sm color-text-paragraph-2 mt-10 wow animate__animated animate__fadeInUp">
                Khám phá hàng ngàn cơ hội việc làm phù hợp với kỹ năng và kinh nghiệm của bạn
              </div>
              <div className="form-find text-start mt-40 wow animate__animated animate__fadeInUp">
                <form className="form-search-job">
                  <div className="box-search">
                    <input
                      className="form-input input-keysearch mr-10"
                      placeholder="Tìm kiếm theo kỹ năng, vị trí, công ty..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <select 
                      className="form-input mr-10 input-location"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    >
                      <option value="all">Tất cả thành phố</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <select
                      className="form-input mr-10 input-industry"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="all">Tất cả danh mục</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                    <button className="btn btn-default btn-find font-sm" type="button">
                      Tìm kiếm
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="section-box mt-30">
        <div className="container">
          <div className="row flex-row-reverse">
            {/* Job Listings */}
            <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
              <div className="content-page">
                {/* Filters Bar */}
                <div className="box-filters-job">
                  <div className="row">
                    <div className="col-xl-6 col-lg-5">
                      <span className="text-small text-showing">
                        Hiển thị{" "}
                        <strong>
                          {indexOfFirstJob + 1}-
                          {Math.min(indexOfLastJob, filteredJobs.length)}
                        </strong>{" "}
                        trong <strong>{filteredJobs.length}</strong> việc làm
                      </span>
                    </div>
                    <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
                      <div className="display-flex2">
                        <div className="box-border mr-10">
                          <span className="text-sortby">Hiển thị:</span>
                          <div className="dropdown dropdown-sort">
                            <button className="btn dropdown-toggle" type="button">
                              <span>{jobsPerPage}</span>
                              <i className="fi-rr-angle-small-down" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-light">
                              {[6, 12, 24].map((num) => (
                                <li key={num}>
                                  <button
                                    className={`dropdown-item ${jobsPerPage === num ? "active" : ""}`}
                                    onClick={() => handleJobsPerPageChange(num)}
                                  >
                                    {num}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        <div className="box-border">
                          <span className="text-sortby">Sắp xếp:</span>
                          <div className="dropdown dropdown-sort">
                            <button className="btn dropdown-toggle" type="button">
                              <span>
                                {sortBy === "newest" ? "Mới nhất" : "Cũ nhất"}
                              </span>
                              <i className="fi-rr-angle-small-down" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-light">
                              <li>
                                <button
                                  className={`dropdown-item ${sortBy === "newest" ? "active" : ""}`}
                                  onClick={() => setSortBy("newest")}
                                >
                                  Mới nhất
                                </button>
                              </li>
                              <li>
                                <button
                                  className={`dropdown-item ${sortBy === "oldest" ? "active" : ""}`}
                                  onClick={() => setSortBy("oldest")}
                                >
                                  Cũ nhất
                                </button>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Job Listings */}
                {currentJobs.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="card-grid-2 bg-9 text-center p-40">
                      <Building2 className="text-mutted mx-auto mb-15" size={48} />
                      <h6 className="text-16 mb-10">Không tìm thấy công việc phù hợp</h6>
                      <p className="text-sm color-text-mutted">
                        Thử điều chỉnh bộ lọc tìm kiếm của bạn hoặc quay lại sau
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {currentJobs.map((job) => (
                      <div
                        key={job.id}
                        className="col-xl-4 col-lg-6 col-md-6 col-sm-12 col-12 "
                        //  onMouseEnter={() => handleJobView(job.id, job.title)}
                      >
                        <div className="card-grid-2 hover-up ">
                          <div className="card-grid-2-image-left">
                            {urgentOnly && <span className="flash" />}
                            <div className="image-box">
                              {job.employer_profiles?.logo_url ? (
                                <Image
                                  width={50}
                                  height={50}
                                  src={job.employer_profiles.logo_url}
                                  alt={job.employer_profiles.company_name}
                                  className="img-responsive"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                                  <Building2 className="w-6 h-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                            <div className="right-info">
                              <Link
                                href={`/company/${job.employer_profiles?.company_name}`}
                              >
                                <span className="name-job">
                                  {job.employer_profiles?.company_name}
                                </span>
                              </Link>
                              <span className="location-small">
                                {job.city || job.location}
                              </span>
                            </div>
                          </div>

                          <div className="card-block-info flex-grow-1 d-flex flex-column">
                            <h6>
                              <Link href={`/applicant/jobs/${job.id}`}  onClick={() => handleJobClick(job.id, job.title)}>
                                {job.title}
                              </Link>
                            </h6>
                            <div className="mt-5">
                               {/* <span className="card-level">{job.job_level}</span> */}
                              <span className="card-briefcase">
                                {formatJobType(job.job_type)}
                              </span>
                             
                              <span className="card-time">
                                {getTimeAgo(job.created_at)}
                              </span>
                            </div>
                            <p className="font-sm color-text-paragraph mt-15 line-clamp-2 flex-grow-0">
                              {job.description}
                            </p>
                            <div className="mt-30  flex flex-wrap gap-2">
                              {job.skills_required
                                ?.slice(0, 2)
                                .map((skill: string) => (
                                  <span
                                    key={skill}
                                    className="btn btn-grey-small mr-5"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            </div>
                            <div className="card-2-bottom mt-auto pt-30">
                              <div className="row">
                                <div className="col-lg-7 col-7">
                                  <span
                                    style={{ fontSize: 12 }}
                                    className="card-text-price"
                                  >
                                    {formatJobSalary(
                                      job.salary_min,
                                      job.salary_max
                                    )}
                                    <span style={{ fontSize: 11 }}>/Tháng</span>
                                  </span>
                                </div>
                                <div  className="col-lg-5 col-5 text-end">
                                  {/* <Link
                                    href={`/applicant/jobs/${job.id}`}
                                    className="btn btn-apply-now"
                                     onClick={() => handleJobClick(job.id, job.title)}
                                  >
                                    Ứng tuyển
                                  </Link> */}

                                    {isLoadingApplicant ? (
                                    <button 
                                      className="btn btn-apply-now disabled" 
                                      disabled
                                    >
                                      Đang tải...
                                    </button>
                                  ) : (
                                    <ApplyButton
                                      jobId={job.id}
                                      applicantId={applicantId}
                                      hasApplied={appliedJobIds.has(job.id)}
                                      onApplySuccess={handleApplySuccess}
                                      compact={true} // THÊM PROP COMPACT CHO GIAO DIỆN NHỎ
                                    />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {filteredJobs.length > 0 && totalPages > 1 && (
                  <div className="flex justify-center mt-8">
                    <ul className="flex items-center gap-2">
                      <li>
                        <button
                          className={`w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-400 transition ${
                            currentPage === 1
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            currentPage > 1 && handlePageChange(currentPage - 1)
                          }
                        >
                          ‹
                        </button>
                      </li>

                      {getPageNumbers().map((page, index) => (
                        <li key={index}>
                          {page === "..." ? (
                            <span className="px-2 text-gray-400">...</span>
                          ) : (
                            <button
                              className={`w-9 h-9 rounded-md border flex items-center justify-center text-sm font-medium transition ${
                                currentPage === page
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "border-gray-300 text-gray-700 hover:text-blue-600 hover:border-blue-400"
                              }`}
                              onClick={() => handlePageChange(page as number)}
                            >
                              {page}
                            </button>
                          )}
                        </li>
                      ))}

                      <li>
                        <button
                          className={`w-9 h-9 rounded-md border border-gray-300 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:border-blue-400 transition ${
                            currentPage === totalPages
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                          onClick={() =>
                            currentPage < totalPages &&
                            handlePageChange(currentPage + 1)
                          }
                        >
                          ›
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar Filters */}
            <div className="col-lg-3 col-md-12 col-sm-12 col-12">
              <div className="sidebar-shadow none-shadow mb-30">
                <div className="sidebar-filters">
                  <div className="filter-block head-border mb-30">
                    <h5>
                      Bộ lọc nâng cao
                      <a className="link-reset" onClick={handleReset}>
                        Đặt lại
                      </a>
                    </h5>
                  </div>

                  {/* Location Filter */}
                  <div className="filter-block mb-30">
                    <div className="form-group select-style select-style-icon">
                      <select 
                        className="form-control form-icons select-active"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                      >
                        <option value="all">Tất cả thành phố</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <i className="fi-rr-marker" />
                    </div>
                  </div>

                  {/* Industry Filter */}
                  <div className="filter-block mb-20">
                    <h5 className="medium-heading mb-15">Danh mục</h5>
                    <div className="form-group">
                      <ul className="list-checkbox">
                        <li>
                          <label className="cb-container">
                            <input
                              type="checkbox"
                              checked={category === "all"}
                              onChange={() => setCategory("all")}
                            />
                            <span className="text-small">Tất cả</span>
                            <span className="checkmark" />
                          </label>
                          <span className="number-item">{jobs.length}</span>
                        </li>
                        {categories.slice(0, 5).map((cat) => (
                          <li key={cat.id}>
                            <label className="cb-container">
                              <input
                                type="checkbox"
                                checked={category === cat.id}
                                onChange={() => setCategory(cat.id)}
                              />
                              <span className="text-small">{cat.name}</span>
                              <span className="checkmark" />
                            </label>
                            <span className="number-item">
                              {jobs.filter((j) => j.categories.id === cat.id).length}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                       {/* Salary Range - SỬA LẠI VỚI OVERLAP RANGE */}
                 <div className="filter-block mb-20">
                    <h5 className="medium-heading mb-25">
                       Mức lương (triệu VNĐ)
                     </h5>
                    <div className="list-checkbox pb-20">
                      <div className="row position-relative mt-10 mb-20">                         <div className="col-sm-12 box-slider-range">
                          <Slider
                            value={salaryRange}
                            onValueChange={setSalaryRange}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>
                        <div className="box-input-money">
                          <input
                            className="input-disabled form-control min-value-money text-center"
                            type="text"
                            disabled
                            value={`${salaryRange[0]} - ${salaryRange[1]} triệu`}
                          />
                        </div>
                      </div>
                      <div className="box-number-money">
                        <div className="row mt-30">
                          <div className="col-sm-6 col-6">
                            <span className="font-sm color-brand-1">0tr</span>
                          </div>
                          <div className="col-sm-6 col-6 text-end">
                            <span className="font-sm color-brand-1">50+tr</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2 text-center">
                      Hiển thị công việc có mức lương GIAO với khoảng bạn chọn
                    </div>
                  </div>

                  {/* Job Type */}
                  <div className="filter-block mb-20">
                    <h5 className="medium-heading mb-15">Loại hình công việc</h5>
                    <div className="form-group">
                      <ul className="list-checkbox">
                        <li>
                          <label className="cb-container">
                            <input
                              type="checkbox"
                              checked={type === "all"}
                              onChange={() => setType("all")}
                            />
                            <span className="text-small">Tất cả</span>
                            <span className="checkmark" />
                          </label>
                          <span className="number-item">{jobs.length}</span>
                        </li>
                        {jobTypes.filter((t) => t.value !== "all").map((jobType) => (
                          <li key={jobType.value}>
                            <label className="cb-container">
                              <input
                                type="checkbox"
                                checked={type === jobType.value}
                                onChange={() => setType(jobType.value)}
                              />
                              <span className="text-small">{jobType.label}</span>
                              <span className="checkmark" />
                            </label>
                            <span className="number-item">
                              {jobs.filter((j) => j.job_type === jobType.value).length}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                     {/* Job Level */}
                  <div className="filter-block mb-20">
                    <h5 className="medium-heading mb-15">Cấp độ công việc</h5>
                    <div className="form-group">
                      <ul className="list-checkbox">
                        <li>
                          <label className="cb-container">
                            <input
                              type="checkbox"
                              checked={level === "all"}
                              onChange={() => setLevel("all")}
                            />
                            <span className="text-small">Tất cả</span>
                            <span className="checkmark" />
                          </label>
                          <span className="number-item">{jobs.length}</span>
                        </li>
                        {jobLevels.filter((t) => t.value !== "all").map((jobLevel) => (
                          <li key={jobLevel.value}>
                            <label className="cb-container">
                              <input
                                type="checkbox"
                                checked={level === jobLevel.value}
                                onChange={() => setLevel(jobLevel.value)}
                              />
                              <span className="text-small">{jobLevel.label}</span>
                              <span className="checkmark" />
                            </label>
                            <span className="number-item">
                              {jobs.filter((j) => j.job_level === jobLevel.value).length}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="section-box mt-50 mb-50">
        <div className="container">
          <div className="text-start">
            <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
              Tin tức và Blog
            </h2>
            <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
              Cập nhật tin tức mới nhất và mẹo nghề nghiệp
            </p>
          </div>
        </div>
        <div className="container">
          <div className="mt-50">
            <div className="box-swiper style-nav-top">
              <BlogSlider />
            </div>
            <div className="text-center">
              <Link href="/blog">
                <div className="btn btn-brand-1 btn-icon-load mt--30 hover-up">
                  Xem thêm bài viết
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-box mt-50 mb-20">
        <div className="container">
          <div className="box-newsletter">
            <div className="row">
              <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                <img
                  src="/assets/imgs/template/newsletter-left.png"
                  alt="Newsletter"
                />
              </div>
              <div className="col-lg-12 col-xl-6 col-12">
                <h2 className="text-md-newsletter text-center">
                  Nhận thông tin việc làm mới
                  <br /> Cập nhật thường xuyên
                </h2>
                <div className="box-form-newsletter mt-40">
                  <form className="form-newsletter">
                    <input
                      className="input-newsletter"
                      placeholder="Nhập email của bạn..."
                      type="email"
                    />
                    <button className="btn btn-default font-heading icon-send-letter">
                      Đăng ký
                    </button>
                  </form>
                </div>
              </div>
              <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                <img
                  src="/assets/imgs/template/newsletter-right.png"
                  alt="Newsletter"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}