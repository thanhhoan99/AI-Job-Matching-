"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

interface EmployerProfile {
  company_name?: string;
  logo_url?: string | null;
}

interface Job {
  id: string;
  title: string;
  city: string | null;
  category_id: string;
  salary_min: number | null;
  salary_max: number | null;
  employer_profiles?: EmployerProfile | null;
}

export default function SimilarJobs({ currentJob }: { currentJob: Job }) {
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchSimilarJobs = async () => {
      if (!currentJob) return;

      const { data, error } = await supabase
        .from("job_postings")
        .select(`
          id,
          title,
          city,
          category_id,
          salary_min,
          salary_max,
          employer_profiles ( company_name, logo_url )
        `)
        .neq("id", currentJob.id)
        .or(`category_id.eq.${currentJob.category_id},city.eq.${currentJob.city}`)
        .eq("is_active", true)
        .eq("status", "published")
        .limit(6);

      if (error) {
        console.error("Error fetching similar jobs:", error);
        return;
      }

      // map employer_profiles từ mảng sang object duy nhất với fallback
      const formatted = (data || []).map((job: any) => ({
        ...job,
        employer_profiles: job.employer_profiles?.[0] || { company_name: "Ẩn danh", logo_url: null },
      }));

      setSimilarJobs(formatted);
    };

    fetchSimilarJobs();
  }, [currentJob]);

  if (!similarJobs.length) return null;

  return (
    <div className="space-y-3">
      {similarJobs.map((job) => (
        <Link
          key={job.id}
          href={`/jobs/${job.id}`}
          className="flex items-center gap-3 border rounded-xl p-3 hover:bg-gray-50 transition"
        >
          {/* LOGO / FALLBACK */}
          {/* {job.employer_profiles?.logo_url ? (
            <img
              src={job.employer_profiles.logo_url}
              alt={job.employer_profiles.company_name || "Logo"}
              className="w-10 h-10 rounded-lg object-cover border"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-sm font-medium">
              {job.employer_profiles?.company_name?.[0] || "🏢"}
            </div>
          )} */}

          <div className="flex-1">
            <h5 style={{fontSize:14}} className="text-sm font-medium text-gray-900 line-clamp-1">
              {job.title}
            </h5>
            <p style={{fontSize:10}} className="text-xs text-gray-500">
                {job.city || "Không rõ"} • {" "}
              {job.salary_min && job.salary_max
                ? `${(job.salary_min / 1_000_000).toFixed(0)}-${(job.salary_max / 1_000_000).toFixed(0)}tr`
                : "Thỏa thuận"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
