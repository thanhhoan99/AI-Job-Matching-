// // components/elements/CategoryTab.tsx (sửa đổi)
// "use client";
// import React, { useState } from "react";
// import Link from "next/link";
// import { motion, AnimatePresence } from "framer-motion";
// import { Button } from "../ui/button";

// const tabs = [
//   { id: 1, icon: "management.svg", title: "Tất cả" },
//   { id: 2, icon: "marketing.svg", title: "Marketing & Bán hàng" },
//   { id: 3, icon: "finance.svg", title: "Tài chính" },
//   { id: 4, icon: "human.svg", title: "Nhân sự" },
//   { id: 5, icon: "retail.svg", title: "Bán lẻ & Sản phẩm" },
//   { id: 6, icon: "content.svg", title: "Content Writer" },
// ];

// interface Job {
//   id: string
//   title: string
//   description: string
//   job_type: string
//   job_level: string
//   salary_min: number | null
//   salary_max: number | null
//   location: string
//   city: string | null
//   skills_required: string[]
//   employer_profiles: {
//     company_name: string
//     logo_url: string | null
//     city: string | null
//   } | null
// }

// interface CategoryTabProps {
//   jobs: Job[]
// }

// const CategoryTab = ({ jobs }: CategoryTabProps) => {
//   const [active, setActive] = useState(1);

//   const formatSalary = (min: number | null, max: number | null) => {
//     if (!min && !max) return "Thỏa thuận"
//     if (min && max) return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} triệu`
//     return "Thỏa thuận"
//   }

//   const formatJobType = (type: string) => {
//     const types: Record<string, string> = {
//       full_time: "Toàn thời gian",
//       part_time: "Bán thời gian",
//       contract: "Hợp đồng",
//       internship: "Thực tập",
//       freelance: "Freelance",
//     }
//     return types[type] || type
//   }

//   return (
//     <div className="w-full">
//       {/* Tabs Header */}
//       <div className="flex flex-wrap justify-center gap-4 mt-10 text-center">
//         {tabs.map((tab) => (
//           <button
//             key={tab.id}
//             onClick={() => setActive(tab.id)}
//             className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-medium transition-all duration-300
//               ${
//                 active === tab.id
//                   ? "bg-blue-600 text-white shadow-md scale-105"
//                   : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
//               }`}
//           >
//             <img
//               src={`/assets/imgs/page/homepage1/${tab.icon}`}
//               alt={tab.title}
//               className="w-5 h-5"
//             />
//             {tab.title}
//           </button>
//         ))}
//       </div>

//       {/* Tabs Content */}
//       <div className="mt-16 min-h-[300px]">
//         <AnimatePresence mode="wait">
//           <motion.div
//             key={active}
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0, y: -20 }}
//             transition={{ duration: 0.4, ease: "easeInOut" }}
//           >
//             <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//               {jobs.map((job) => (
//                 <JobCard key={job.id} job={job} />
//               ))}
//             </div>

//             {jobs.length === 0 && (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg">Chưa có công việc nào</p>
//                 <p className="text-sm text-gray-400 mt-2">Hãy quay lại sau để xem các công việc mới</p>
//               </div>
//             )}
//           </motion.div>
//         </AnimatePresence>
//       </div>
//     </div>
//   );
// };

// export default CategoryTab;

// /* ------------ JobCard Component với dữ liệu thực ------------ */
// interface JobCardProps {
//   job: Job
// }

// const JobCard = ({ job }: JobCardProps) => {
//   const formatSalary = (min: number | null, max: number | null) => {
//     if (!min && !max) return "Thỏa thuận"
//     if (min && max) return `${(min / 1000000).toFixed(0)}-${(max / 1000000).toFixed(0)} triệu`
//     if (min) return `Từ ${(min / 1000000).toFixed(0)} triệu`
//     return "Thỏa thuận"
//   }

//   const formatJobType = (type: string) => {
//     const types: Record<string, string> = {
//       full_time: "Toàn thời gian",
//       part_time: "Bán thời gian",
//       contract: "Hợp đồng",
//       internship: "Thực tập",
//       freelance: "Freelance",
//     }
//     return types[type] || type
//   }

//   return (
//     <motion.div
//       whileHover={{ y: -4 }}
//       transition={{ type: "spring", stiffness: 300 }}
//       className="group bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 p-6"
//     >
//       {/* Header */}
//       <div className="flex items-center gap-3">
//         <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center">
//           {job.employer_profiles?.logo_url ? (
//             <img
//               src={job.employer_profiles.logo_url}
//               alt={job.employer_profiles.company_name}
//               className="w-8 h-8 object-contain"
//             />
//           ) : (
//             <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
//               <span className="text-blue-600 font-bold text-sm">
//                 {job.employer_profiles?.company_name?.[0] || "C"}
//               </span>
//             </div>
//           )}
//         </div>
//         <div>
//           <Link href={`/companies/${job.employer_profiles?.company_name}`}>
//             <span className="block text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition">
//               {job.employer_profiles?.company_name || "Công ty"}
//             </span>
//           </Link>
//           <span className="text-xs text-gray-500">{job.city || job.location}</span>
//         </div>
//       </div>

//       {/* Body */}
//       <div className="mt-4">
//         <h6 className="font-semibold text-gray-800 leading-snug mb-2">
//           <Link href={`/jobs/${job.id}`} className="hover:text-blue-600 transition">
//             {job.title}
//           </Link>
//         </h6>
//         <div className="flex items-center gap-3 text-sm text-gray-500">
//           <span className="px-2 py-0.5 bg-gray-100 rounded-md">
//             {formatJobType(job.job_type)}
//           </span>
//           <span className="text-xs text-gray-400">{job.job_level}</span>
//         </div>

//         <p className="text-sm text-gray-500 mt-3 line-clamp-2">
//           {job.description}
//         </p>

//         {/* Skills */}
//         {job.skills_required && job.skills_required.length > 0 && (
//           <div className="flex flex-wrap gap-2 mt-4">
//             {job.skills_required.slice(0, 3).map((skill: string, i: number) => (
//               <Link key={i} href={`/?search=${encodeURIComponent(skill)}`}>
//                 <span className="px-3 py-1 bg-gray-100 text-sm text-gray-700 rounded-full hover:bg-blue-50 hover:text-blue-600 transition">
//                   {skill}
//                 </span>
//               </Link>
//             ))}
//             {job.skills_required.length > 3 && (
//               <span className="px-2 py-1 text-xs text-gray-500">
//                 +{job.skills_required.length - 3} kỹ năng khác
//               </span>
//             )}
//           </div>
//         )}

//         {/* Footer */}
//         <div className="flex items-center justify-between mt-6">
//           <div className="text-gray-800 font-semibold">
//             {formatSalary(job.salary_min, job.salary_max)}
//             <span className="text-gray-400 text-sm font-normal">/tháng</span>
//           </div>
//           <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-md transition">
//             <Link href={`/jobs/${job.id}`}>
//               Ứng tuyển
//             </Link>
//           </Button>
//         </div>
//       </div>
//     </motion.div>
//   );
// };
// components/elements/CategoryTab.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const tabs = [
  { id: 1, icon: "management.svg", title: "Tất cả" },
  { id: 2, icon: "marketing.svg", title: "Marketing & Bán hàng" },
  { id: 3, icon: "finance.svg", title: "Tài chính" },
  { id: 4, icon: "human.svg", title: "Nhân sự" },
  { id: 5, icon: "retail.svg", title: "Bán lẻ & Sản phẩm" },
  { id: 6, icon: "content.svg", title: "Content Writer" },
];

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
  category_id?: number;
  skills_required: string[];
  employer_profiles: {
    company_name: string;
    logo_url: string | null;
    city: string | null;
  } | null;
}

interface CategoryTabProps {
  jobs: Job[];
}

export default function CategoryTab({ jobs }: CategoryTabProps) {
  const [active, setActive] = useState(1);

  const filterJobs = () => {
    if (active === 1) return jobs;
    return jobs.filter((job) => job.category_id === active);
  };

  const jobsToShow = filterJobs();

  return (
    <>
      {/* Tabs Header */}
      <div className="list-tabs mt-40 text-center">
        <ul
          className="nav nav-tabs flex justify-center flex-wrap gap-3"
          role="tablist"
        >
          {tabs.map((tab) => (
            <li key={tab.id}>
              <span
                className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                  active === tab.id
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
                onClick={() => setActive(tab.id)}
              >
                <img
                  src={`/assets/imgs/page/homepage1/${tab.icon}`}
                  alt={tab.title}
                  className="w-5 h-5"
                />
                {tab.title}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tabs Content */}
      <div className="tab-content mt-70">
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="row">
              {jobsToShow.length > 0 ? (
                jobsToShow.map((job) => (
                  <div
                    key={job.id}
                    className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                  >
                    <div className="card-grid-2 hover-up">
                      <div className="card-grid-2-image-left">
                        <span className="flash" />
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
                              <span className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="right-info">
                          <Link
                            href={`/companies/${job.employer_profiles?.company_name}`}
                          >
                            <span className="name-job">
                              {job.employer_profiles?.company_name || "Công ty"}
                            </span>
                          </Link>
                          <span className="location-small">
                            {job.city || job.location}
                          </span>
                        </div>
                      </div>

                      <div className="card-block-info flex-grow-1 d-flex flex-column">
                        <h6>
                          <Link href={`/applicant/jobs/${job.id}`}>
                            <span>{job.title}</span>
                          </Link>
                        </h6>
                        <div className="mt-5">
                          <span className="card-briefcase">
                            {formatJobType(job.job_type)}
                          </span>
                          <span className="card-time">{job.job_level}</span>
                        </div>
                        <p className="font-sm color-text-paragraph mt-15 line-clamp-3">
                          {job.description || "Không có mô tả công việc."}
                        </p>

                        {/* Kỹ năng */}
                        <div className="mt-30 flex flex-wrap gap-2">
                          {job.skills_required.slice(0, 2).map((skill, i) => (
                            <Link
                              key={i}
                              href={`/?search=${encodeURIComponent(skill)}`}
                            >
                              <span className="btn btn-grey-small mr-5">
                                {skill}
                              </span>
                            </Link>
                          ))}
                        </div>

                        {/* Lương + Apply */}
                        <div className="card-2-bottom mt-30">
                          <div className="row">
                            <div className="col-lg-7 col-7">
                              <span
                                style={{ fontSize: 12 }}
                                className="card-text-price"
                              >
                                {formatSalary(job.salary_min, job.salary_max)}
                              </span>
                              <span
                                style={{ fontSize: 11 }}
                                className="text-muted"
                              >
                                /tháng
                              </span>
                            </div>
                            <div className="col-lg-5 col-5 text-end">
                              <Link
                                href={`/applicant/jobs/${job.id}`}
                                className="btn btn-apply-now"
                              >
                                View
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-500 col-12">
                  Chưa có công việc trong danh mục này.
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}

/* === Helper === */
const formatSalary = (min: number | null, max: number | null) => {
  if (!min && !max) return "Thỏa thuận";
  if (min && max)
    return `${(min / 1_000_000).toFixed(0)}-${(max / 1_000_000).toFixed(
      0
    )} triệu`;
  if (min) return `Từ ${(min / 1_000_000).toFixed(0)} triệu`;
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
