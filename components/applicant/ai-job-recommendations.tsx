// components/applicant/ai-job-recommendations.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  MapPin,
  Briefcase,
  DollarSign,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

interface AIJobRecommendationsProps {
  applicantId: string;
  autoLoad?: boolean;
  limit?: number;
}

interface Job {
  id: string;
  title: string;
  job_type: string;
  salary_min: number | null;
  salary_max: number | null;
  location: string;
  city: string | null;
  employer_profiles: {
    logo_url: string | null;
    company_name: string;
    industry: string | null;
  } | null;
  match_score: number;
  reasons: string[];
  matching_skills: string[];
  missing_skills: string[];
}

export function AIJobRecommendations({
  applicantId,
  autoLoad = true,
  limit = 6,
}: AIJobRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState<string | null>(null);

  const getAIRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/jobs/ai-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicantId, limit }),
      });

      if (!response.ok) throw new Error("Failed to get recommendations");

      const result = await response.json();
      if (result.data) setRecommendations(result.data);
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackBehavior = async (jobId: string, eventType: string) => {
    try {
      await fetch("/api/analytics/track-behavior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicantId: applicantId,
          jobId,
          eventType,
        }),
      });
    } catch (error) {
      console.error("Error tracking behavior:", error);
    }
  };

  useEffect(() => {
    if (autoLoad && applicantId) {
      getAIRecommendations();
    }
  }, [applicantId, autoLoad]);

  const getMatchColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-800 border-blue-200";
    if (score >= 40) return "bg-orange-100 text-orange-800 border-orange-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const formatSalary = (min: number | null, max: number | null) => {
    if (!min && !max) return "Thỏa thuận";
    if (min && max)
      return `${(min / 1_000_000).toFixed(0)}-${(max / 1_000_000).toFixed(
        0
      )} triệu`;
    if (min) return `Từ ${(min / 1_000_000).toFixed(0)} triệu`;
    return "Thỏa thuận";
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <h3 className="text-lg font-semibold">
            AI đang phân tích công việc phù hợp...
          </h3>
        </div>
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex space-x-4">
              <div className="rounded-lg bg-gray-200 h-16 w-16"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Gợi ý việc làm thông minh</h3>
            <p className="text-sm text-gray-600">
              Phân tích AI với Google Gemini
            </p>
          </div>
        </div>
        <button
          onClick={getAIRecommendations}
          className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <RefreshCw size={14} />
          Làm mới
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {recommendations
          .filter((job: Job) => job.match_score > 40)
          .map((job: Job) => (
            <div
              key={job.id}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow relative"
              onMouseEnter={() => trackBehavior(job.id, "view")}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {job.employer_profiles?.logo_url ? (
                    <Image
                      src={job.employer_profiles.logo_url}
                      alt={job.employer_profiles.company_name}
                      width={40}
                      height={40}
                      className="rounded-lg"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-sm line-clamp-2">
                      {job.title}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {job.employer_profiles?.company_name}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getMatchColor(
                    job.match_score
                  )}`}
                >
                  {job.match_score}%
                </span>
              </div>

              <div className="space-y-2 text-xs text-gray-600 mb-3">
                <div className="flex items-center gap-1">
                  <MapPin size={12} />
                  <span>{job.city || job.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign size={12} />
                  <span>{formatSalary(job.salary_min, job.salary_max)}</span>
                </div>
              </div>

              {/* Phân tích AI */}
              <div className="mb-3">
                <button
                  onClick={() =>
                    setShowAnalysis(showAnalysis === job.id ? null : job.id)
                  }
                  className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 mb-2"
                >
                  <Lightbulb size={12} />
                  {showAnalysis === job.id
                    ? "Ẩn phân tích"
                    : "Xem phân tích AI"}
                </button>

                {showAnalysis === job.id && (
                  <div className="text-xs space-y-2 p-2 bg-blue-50 rounded">
                    <div>
                      <strong>Lý do phù hợp:</strong>
                      <ul className="mt-1 space-y-1">
                        {job.reasons.slice(0, 2).map((reason, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-500 mt-0.5">•</span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {job.matching_skills.length > 0 && (
                      <div>
                        <strong>Kỹ năng phù hợp:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.matching_skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-1.5 py-0.5 bg-green-100 text-green-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {job.missing_skills.length > 0 && (
                      <div>
                        <strong>Kỹ năng cần cải thiện:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {job.missing_skills.map((skill, index) => (
                            <span
                              key={index}
                              className="px-1.5 py-0.5 bg-orange-100 text-orange-700 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button className="flex gap-2 items-center">
                <Link
                  href={`/applicant/jobs/${job.id}`}
                  onClick={() => trackBehavior(job.id, "click")}
                  className="flex-1 text-center text-sm bg-blue-600 py-2 px-3 rounded hover:bg-blue-700 transition-colors"
                >
                  View
                </Link>
                </Button>
              </div>
            </div>
          ))}
      </div>

      {recommendations.filter((job) => job.match_score > 40).length === 0 &&
        !loading && (
          <div className="text-center py-8 text-gray-500">
            <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>
              Chưa có công việc nào phù hợp trên 50%. Hãy cập nhật thêm kỹ năng
              của bạn!
            </p>
          </div>
        )}
    </div>
  );
}
