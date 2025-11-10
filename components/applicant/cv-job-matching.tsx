// // components/applicant/cv-job-matching.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Sparkles, Check, X, AlertCircle, Lightbulb } from "lucide-react";

// interface MatchingResult {
//   match_score: number;
//   detailed_breakdown: {
//     skills_match: number;
//     experience_match: number;
//     education_match: number;
//     title_similarity: number;
//     overall_compatibility: number;
//   };
//   matching_skills: string[];
//   missing_skills: string[];
//   experience_gap: {
//     required_years: number;
//     actual_years: number;
//     meets_requirement: boolean;
//   };
//   title_analysis: {
//     cv_title: string;
//     jd_title: string;
//     similarity_level: string;
//   };
//   strengths: string[];
//   weaknesses: string[];
//   improvement_suggestions: string[];
//   ai_explanation: string;
// }

// interface CVMatchingProps {
//   cvData: any;
//   jobId: string;
//   jobDetails: any;
//   applicantId: string;
//   onMatchResult?: (result: MatchingResult) => void;
// }

// export function CVJobMatching({ cvData, jobId, jobDetails, applicantId, onMatchResult }: CVMatchingProps) {
//   const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
//   const [loading, setLoading] = useState(false);

//   const analyzeMatch = async () => {
//     if (!cvData || !jobDetails) return;
    
//     setLoading(true);
//     try {
//       const matchResponse = await fetch("/api/ai/match-cv-jd", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           cvData,
//           jobDescription: jobDetails.description,
//           jobTitle: jobDetails.title,
//           requirements: jobDetails.requirements, // THÊM DÒNG NÀY
//           skillsRequired: jobDetails.skills_required, // THÊM DÒNG NÀY
//         }),
//       });

//       const result = await matchResponse.json();
      
//       if (result.data) {
//         setMatchingResult(result.data);
//         // Gọi callback nếu được cung cấp
//         if (onMatchResult) {
//           onMatchResult(result.data);
//         }
//       }
//     } catch (error) {
//       console.error("Matching analysis error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Tự động phân tích khi component mount
//   useEffect(() => {
//     if (cvData && jobDetails) {
//       analyzeMatch();
//     }
//   }, [cvData, jobDetails]);

//   const getScoreColor = (score: number) => {
//     if (score >= 80) return "text-green-600";
//     if (score >= 60) return "text-yellow-600";
//     return "text-red-600";
//   };

//   const getScoreVariant = (score: number) => {
//     if (score >= 80) return "default";
//     if (score >= 60) return "secondary";
//     return "destructive";
//   };

//   if (!matchingResult && !loading) {
//     return null;
//   }

//   if (loading) {
//     return (
//       <Card>
//         <CardContent className="py-8 text-center">
//           <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p className="text-muted-foreground">AI đang phân tích độ phù hợp...</p>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (!matchingResult) {
//     return null;
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Sparkles className="w-5 h-5 text-primary" />
//           Phân Tích Độ Phù Hợp CV - JD
//         </CardTitle>
//         <CardDescription>
//           Đánh giá chi tiết từ AI về sự phù hợp giữa CV của bạn và công việc
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {/* Overall Score */}
//         <div className="text-center space-y-4">
//           <div className="flex items-center justify-center gap-4">
//             <div className="text-5xl font-bold">{matchingResult.match_score}%</div>
//             <div className="text-left">
//               <Badge variant={getScoreVariant(matchingResult.match_score)}>
//                 {matchingResult.match_score >= 80
//                   ? "Rất phù hợp"
//                   : matchingResult.match_score >= 60
//                   ? "Khá phù hợp"
//                   : "Cần cải thiện"}
//               </Badge>
//               <p className="text-sm text-muted-foreground mt-1">
//                 {matchingResult.ai_explanation}
//               </p>
//             </div>
//           </div>
//           <Progress value={matchingResult.match_score} className="h-2" />
//         </div>

//         {/* Detailed Breakdown */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium">Kỹ năng</span>
//               <span className={`text-sm font-bold ${getScoreColor(matchingResult.detailed_breakdown.skills_match)}`}>
//                 {matchingResult.detailed_breakdown.skills_match}%
//               </span>
//             </div>
//             <Progress value={matchingResult.detailed_breakdown.skills_match} className="h-1" />
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium">Kinh nghiệm</span>
//               <span className={`text-sm font-bold ${getScoreColor(matchingResult.detailed_breakdown.experience_match)}`}>
//                 {matchingResult.detailed_breakdown.experience_match}%
//               </span>
//             </div>
//             <Progress value={matchingResult.detailed_breakdown.experience_match} className="h-1" />
//           </div>
          
//           <div className="space-y-2">
//             <div className="flex justify-between items-center">
//               <span className="text-sm font-medium">Tiêu đề</span>
//               <span className={`text-sm font-bold ${getScoreColor(matchingResult.detailed_breakdown.title_similarity)}`}>
//                 {matchingResult.detailed_breakdown.title_similarity}%
//               </span>
//             </div>
//             <Progress value={matchingResult.detailed_breakdown.title_similarity} className="h-1" />
//           </div>
//         </div>

//         {/* Skills Analysis */}
//         <div className="grid gap-6 md:grid-cols-2">
//           <div>
//             <h4 className="font-semibold mb-3 flex items-center gap-2">
//               <Check className="w-4 h-4 text-green-600" />
//               Kỹ năng phù hợp
//             </h4>
//             <div className="flex flex-wrap gap-2">
//               {matchingResult.matching_skills.map((skill, index) => (
//                 <Badge key={index} variant="secondary" className="text-green-700 bg-green-50">
//                   {skill}
//                 </Badge>
//               ))}
//             </div>
//           </div>
          
//           <div>
//             <h4 className="font-semibold mb-3 flex items-center gap-2">
//               <X className="w-4 h-4 text-red-600" />
//               Kỹ năng cần bổ sung
//             </h4>
//             <div className="flex flex-wrap gap-2">
//               {matchingResult.missing_skills.map((skill, index) => (
//                 <Badge key={index} variant="outline" className="text-red-700">
//                   {skill}
//                 </Badge>
//               ))}
//             </div>
//           </div>
//         </div>

//         {/* Experience Analysis */}
//         <div className="p-4 border rounded-lg bg-blue-50">
//           <h4 className="font-semibold mb-2">Phân tích Kinh nghiệm</h4>
//           <div className="grid gap-2 text-sm">
//             <div className="flex justify-between">
//               <span>Kinh nghiệm yêu cầu:</span>
//               <span className="font-semibold">{matchingResult.experience_gap.required_years} năm</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Kinh nghiệm của bạn:</span>
//               <span className="font-semibold">{matchingResult.experience_gap.actual_years} năm</span>
//             </div>
//             <div className="flex justify-between">
//               <span>Đáp ứng yêu cầu:</span>
//               <span className={matchingResult.experience_gap.meets_requirement ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
//                 {matchingResult.experience_gap.meets_requirement ? "✓ ĐẠT" : "✗ CHƯA ĐẠT"}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Improvement Suggestions */}
//         <div>
//           <h4 className="font-semibold mb-3 flex items-center gap-2">
//             <Lightbulb className="w-4 h-4 text-yellow-600" />
//             Đề xuất cải thiện
//           </h4>
//           <ul className="space-y-2 text-sm">
//             {matchingResult.improvement_suggestions.map((suggestion, index) => (
//               <li key={index} className="flex items-start gap-2">
//                 <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
//                 <span>{suggestion}</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <Button onClick={analyzeMatch} variant="outline" className="w-full">
//           <Sparkles className="w-4 h-4 mr-2" />
//           Phân Tích Lại
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }
// components/applicant/cv-job-matching.tsx
"use client";

import { useState, useEffect } from "react";
import { Sparkles, Check, X, AlertCircle, Lightbulb } from "lucide-react";
import styles from "../../styles/cv-job-matching.module.css";

interface MatchingResult {
  match_score: number;
  detailed_breakdown: {
    skills_match: number;
    experience_match: number;
    education_match: number;
    title_similarity: number;
    overall_compatibility: number;
  };
  matching_skills: string[];
  missing_skills: string[];
  experience_gap: {
    required_years: number;
    actual_years: number;
    meets_requirement: boolean;
  };
  title_analysis: {
    cv_title: string;
    jd_title: string;
    similarity_level: string;
  };
  strengths: string[];
  weaknesses: string[];
  improvement_suggestions: string[];
  ai_explanation: string;
}

interface CVMatchingProps {
  cvData: any;
  jobId: string;
  jobDetails: any;
  applicantId: string;
  onMatchResult?: (result: MatchingResult) => void;
}

export function CVJobMatching({ cvData, jobId, jobDetails, applicantId, onMatchResult }: CVMatchingProps) {
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null);
  const [loading, setLoading] = useState(false);

  const analyzeMatch = async () => {
    if (!cvData || !jobDetails) return;
    
    setLoading(true);
    try {
      const matchResponse = await fetch("/api/ai/match-cv-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData,
          jobDescription: jobDetails.description,
          jobTitle: jobDetails.title,
          requirements: jobDetails.requirements,
          skillsRequired: jobDetails.skills_required,
        }),
      });

      const result = await matchResponse.json();
      
      if (result.data) {
        setMatchingResult(result.data);
        if (onMatchResult) {
          onMatchResult(result.data);
        }
      }
    } catch (error) {
      console.error("Matching analysis error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cvData && jobDetails) {
      analyzeMatch();
    }
  }, [cvData, jobDetails]);

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "excellent";
    if (score >= 60) return "good";
    return "poor";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "Rất phù hợp";
    if (score >= 60) return "Khá phù hợp";
    return "Cần cải thiện";
  };

  const getProgressVariant = (score: number) => {
    if (score >= 80) return "high";
    if (score >= 60) return "medium";
    return "low";
  };

  if (!matchingResult && !loading) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.card}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p className={styles.loadingText}>AI đang phân tích độ phù hợp...</p>
        </div>
      </div>
    );
  }

  if (!matchingResult) {
    return null;
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Sparkles className="w-5 h-5" />
          Phân Tích Độ Phù Hợp CV - JD
        </h3>
        <p className={styles.description}>
          Đánh giá chi tiết từ AI về sự phù hợp giữa CV của bạn và công việc
        </p>
      </div>
      
      <div className={styles.content}>
        {/* Overall Score */}
        <div className={styles.scoreSection}>
          <div className={styles.scoreMain}>{matchingResult.match_score}%</div>
          <div className={`${styles.scoreBadge} ${styles[getScoreVariant(matchingResult.match_score)]}`}>
            {getScoreText(matchingResult.match_score)}
          </div>
          <p className={styles.scoreExplanation}>{matchingResult.ai_explanation}</p>
          <div className={styles.progress}>
            <div 
              className={`${styles.progressFill} ${styles[getProgressVariant(matchingResult.match_score)]}`}
              style={{ width: `${matchingResult.match_score}%` }}
            ></div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className={styles.progressGrid}>
          {[
            { label: "Kỹ năng", value: matchingResult.detailed_breakdown.skills_match },
            { label: "Kinh nghiệm", value: matchingResult.detailed_breakdown.experience_match },
            { label: "Tiêu đề", value: matchingResult.detailed_breakdown.title_similarity },
            { label: "Tương thích", value: matchingResult.detailed_breakdown.overall_compatibility },
          ].map((item, index) => (
            <div key={index} className={styles.progressItem}>
              <div className={styles.progressLabel}>
                <span>{item.label}</span>
                <span className={`${styles.progressValue} ${styles[getProgressVariant(item.value)]}`}>
                  {item.value}%
                </span>
              </div>
              <div className={styles.progress}>
                <div 
                  className={`${styles.progressFill} ${styles[getProgressVariant(item.value)]}`}
                  style={{ width: `${item.value}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills Analysis */}
        <div className={styles.skillsAnalysis}>
          <div className={styles.skillsColumn}>
            <h4 className={`${styles.skillsTitle} ${styles.matching}`}>
              <Check className="w-4 h-4" />
              Kỹ năng phù hợp
            </h4>
            <div className={styles.skillsList}>
              {matchingResult.matching_skills.map((skill, index) => (
                <span key={index} className={`${styles.skillTag} ${styles.matching}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
          
          <div className={styles.skillsColumn}>
            <h4 className={`${styles.skillsTitle} ${styles.missing}`}>
              <X className="w-4 h-4" />
              Kỹ năng cần bổ sung
            </h4>
            <div className={styles.skillsList}>
              {matchingResult.missing_skills.map((skill, index) => (
                <span key={index} className={`${styles.skillTag} ${styles.missing}`}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Experience Analysis */}
        <div className={styles.experienceAnalysis}>
          <h4 className={styles.experienceTitle}>Phân tích Kinh nghiệm</h4>
          <div className={styles.experienceGrid}>
            <div className={styles.experienceItem}>
              <div className={styles.experienceLabel}>Yêu cầu</div>
              <div className={styles.experienceValue}>{matchingResult.experience_gap.required_years} năm</div>
            </div>
            <div className={styles.experienceItem}>
              <div className={styles.experienceLabel}>Của bạn</div>
              <div className={styles.experienceValue}>{matchingResult.experience_gap.actual_years} năm</div>
            </div>
            <div className={styles.experienceItem}>
              <div className={styles.experienceLabel}>Trạng thái</div>
              <div className={`${styles.experienceStatus} ${matchingResult.experience_gap.meets_requirement ? styles.met : styles.notMet}`}>
                {matchingResult.experience_gap.meets_requirement ? "✓ ĐẠT" : "✗ CHƯA ĐẠT"}
              </div>
            </div>
          </div>
        </div>

        {/* Improvement Suggestions */}
        <div className={styles.suggestionsSection}>
          <h4 className={styles.suggestionsTitle}>
            <Lightbulb className="w-4 h-4" />
            Đề xuất cải thiện
          </h4>
          <ul className={styles.suggestionsList}>
            {matchingResult.improvement_suggestions.map((suggestion, index) => (
              <li key={index} className={styles.suggestionItem}>
                <div className={styles.suggestionIcon}>
                  <AlertCircle className="w-3 h-3 text-orange-600" />
                </div>
                <span className={styles.suggestionText}>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>

        <button className={styles.actionButton} onClick={analyzeMatch}>
          <Sparkles className="w-4 h-4" />
          Phân Tích Lại
        </button>
      </div>
    </div>
  );
}