
// components/elements/CategoryTab.tsx
"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

export default function CategoryTab2({ jobs }: CategoryTabProps) {
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
        <ul className="nav nav-tabs flex justify-center flex-wrap gap-3" role="tablist">
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
                          <img
                            src={
                              job.employer_profiles?.logo_url ||
                              "/assets/imgs/brands/default.png"
                            }
                            alt={job.employer_profiles?.company_name || "Company"}
                          />
                        </div>
                        <div className="right-info">
                          <Link href={`/companies/${job.employer_profiles?.company_name}`}>
                            <span className="name-job">
                              {job.employer_profiles?.company_name || "Công ty"}
                            </span>
                          </Link>
                          <span className="location-small">
                            {job.city || job.location}
                          </span>
                        </div>
                      </div>

                      <div className="card-block-info">
                        <h6>
                          <Link href={`/applicant/jobs/${job.id}`}>
                            <span>{job.title}</span>
                          </Link>
                        </h6>
                        <div className="mt-5">
                          <span className="card-briefcase">{formatJobType(job.job_type)}</span>
                          <span className="card-time">{job.job_level}</span>
                        </div>
                        <p className="font-sm color-text-paragraph mt-15 line-clamp-3">
                          {job.description || "Không có mô tả công việc."}
                        </p>

                        {/* Kỹ năng */}
                        <div className="mt-30 flex flex-wrap gap-2">
                          {job.skills_required.slice(0, 3).map((skill, i) => (
                            <Link key={i} href={`/?search=${encodeURIComponent(skill)}`}>
                              <span className="btn btn-grey-small mr-5">{skill}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Lương + Apply */}
                        <div className="card-2-bottom mt-30">
                          <div className="row">
                            <div className="col-lg-7 col-7">
                              <span className="card-text-price">
                                {formatSalary(job.salary_min, job.salary_max)}
                              </span>
                              <span className="text-muted">/tháng</span>
                            </div>
                            <div className="col-lg-5 col-5 text-end">
                              <Link
                                href={`/applicant/jobs/${job.id}`}
                                className="btn btn-apply-now"
                              >
                                Ứng tuyển
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
  if (min && max) return `${(min / 1_000_000).toFixed(0)}-${(max / 1_000_000).toFixed(0)} triệu`;
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
