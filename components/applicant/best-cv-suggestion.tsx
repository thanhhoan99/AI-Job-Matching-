// "use client";

// import { useState } from "react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Sparkles, Crown, Target, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";
// import { Alert, AlertDescription } from "@/components/ui/alert";

// interface CVSuggestion {
//   best_cv: {
//     cv_id: string;
//     cv_name: string;
//     match_score: number;
//     reasons: string[];
//     confidence_level: "high" | "medium" | "low";
//   };
//   all_cv_scores: Array<{
//     cv_id: string;
//     cv_name: string;
//     match_score: number;
//     strengths: string[];
//     weaknesses: string[];
//     recommendation: string;
//   }>;
//   summary: string;
//   improvement_suggestions: string[];
// }

// interface BestCVSuggestionProps {
//   jobId: string;
//   applicantId: string;
//   cvs: Array<{ id: string; name: string }>;
//   onCVSelect: (cvId: string) => void;
//   selectedCV?: string;
//   onSuggestionChange?: (suggestion: CVSuggestion) => void; // THÊM PROP NÀY
// }

// export function BestCVSuggestion({ jobId, applicantId, cvs, onCVSelect, selectedCV, onSuggestionChange }: BestCVSuggestionProps) {
//   const [suggestion, setSuggestion] = useState<CVSuggestion | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const analyzeBestCV = async () => {
//     if (cvs.length <= 1) {
//       setError("Bạn cần có ít nhất 2 CV để sử dụng tính năng so sánh");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch("/api/ai/suggest-best-cv", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ jobId, applicantId }),
//       });

//       const result = await response.json();
      
//       if (result.data) {
//         setSuggestion(result.data);
//         // Gọi callback để thông báo cho parent component
//         if (onSuggestionChange) {
//           onSuggestionChange(result.data);
//         }
//       } else {
//         setError(result.error || "Không thể phân tích CV");
//       }
//     } catch (err: any) {
//       setError("Lỗi kết nối: " + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };


//   const getConfidenceColor = (level: string) => {
//     switch (level) {
//       case "high": return "text-green-600 bg-green-50 border-green-200";
//       case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
//       case "low": return "text-red-600 bg-red-50 border-red-200";
//       default: return "text-gray-600 bg-gray-50 border-gray-200";
//     }
//   };

//   const getConfidenceText = (level: string) => {
//     switch (level) {
//       case "high": return "Độ tin cậy cao";
//       case "medium": return "Độ tin cậy trung bình";
//       case "low": return "Độ tin cậy thấp";
//       default: return "Không xác định";
//     }
//   };

//   if (cvs.length <= 1) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Target className="w-5 h-5 text-primary" />
//             Gợi ý CV Tốt Nhất
//           </CardTitle>
//           <CardDescription>
//             Tính năng này yêu cầu ít nhất 2 CV để so sánh
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center py-4">
//             <p className="text-muted-foreground mb-4">
//               Bạn hiện có {cvs.length} CV. Tạo thêm CV để sử dụng tính năng so sánh AI.
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Target className="w-5 h-5 text-primary" />
//           AI Gợi ý CV Tốt Nhất
//         </CardTitle>
//         <CardDescription>
//           Phân tích {cvs.length} CV của bạn để tìm CV phù hợp nhất với công việc này
//         </CardDescription>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {error && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}

//         {!suggestion && !loading && (
//           <div className="text-center space-y-4">
//             <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
//               <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
//               <h4 className="font-semibold text-lg mb-2">So Sánh {cvs.length} CV Của Bạn</h4>
//               <p className="text-muted-foreground mb-4">
//                 AI sẽ phân tích tất cả CV của bạn và đề xuất CV nào phù hợp nhất 
//                 để ứng tuyển công việc này
//               </p>
//             </div>
//             <Button onClick={analyzeBestCV} className="w-full" size="lg">
//               <Sparkles className="w-4 h-4 mr-2" />
//               Bắt Đầu Phân Tích
//             </Button>
//           </div>
//         )}

//         {loading && (
//           <div className="text-center py-8">
//             <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
//             <p className="text-muted-foreground">AI đang phân tích {cvs.length} CV của bạn...</p>
//             <p className="text-sm text-muted-foreground mt-2">
//               So sánh kỹ năng, kinh nghiệm và độ phù hợp với công việc
//             </p>
//           </div>
//         )}

//         {suggestion && (
//           <div className="space-y-6">
//             {/* Best CV Recommendation */}
//             <Alert className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
//               <Crown className="h-5 w-5 text-green-600" />
//               <AlertDescription>
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h4 className="font-semibold text-lg flex items-center gap-2">
//                         {suggestion.best_cv.cv_name}
//                         <Badge variant="default" className="text-sm">
//                           {suggestion.best_cv.match_score}% phù hợp
//                         </Badge>
//                       </h4>
//                       <Badge 
//                         variant="outline" 
//                         className={getConfidenceColor(suggestion.best_cv.confidence_level)}
//                       >
//                         {getConfidenceText(suggestion.best_cv.confidence_level)}
//                       </Badge>
//                     </div>
//                     <Button 
//                       size="sm"
//                       onClick={() => onCVSelect(suggestion.best_cv.cv_id)}
//                       disabled={selectedCV === suggestion.best_cv.cv_id}
//                     >
//                       {selectedCV === suggestion.best_cv.cv_id ? (
//                         <>
//                           <CheckCircle2 className="w-4 h-4 mr-1" />
//                           Đã chọn
//                         </>
//                       ) : (
//                         "Chọn CV này"
//                       )}
//                     </Button>
//                   </div>
                  
//                   <div>
//                     <h5 className="font-semibold mb-2">Lý do đề xuất:</h5>
//                     <ul className="space-y-1 text-sm">
//                       {suggestion.best_cv.reasons.map((reason, index) => (
//                         <li key={index} className="flex items-start gap-2">
//                           <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
//                           <span>{reason}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                 </div>
//               </AlertDescription>
//             </Alert>

//             {/* All CVs Comparison */}
//             <div>
//               <h4 className="font-semibold mb-4 flex items-center gap-2">
//                 <Target className="w-4 h-4" />
//                 So Sánh Tất Cả CV
//               </h4>
//               <div className="space-y-4">
//                 {suggestion.all_cv_scores.map((cv, index) => (
//                   <div
//                     key={cv.cv_id}
//                     className={`p-4 border rounded-lg ${
//                       cv.cv_id === suggestion.best_cv.cv_id
//                         ? "bg-green-50 border-green-200"
//                         : "bg-white border-gray-200"
//                     }`}
//                   >
//                     <div className="flex items-center justify-between mb-3">
//                       <div className="flex items-center gap-3">
//                         <span className="font-medium">{cv.cv_name}</span>
//                         {cv.cv_id === suggestion.best_cv.cv_id && (
//                           <Badge variant="default" className="text-xs">
//                             <Crown className="w-3 h-3 mr-1" />
//                             Tốt nhất
//                           </Badge>
//                         )}
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <Badge variant={cv.match_score >= 70 ? "default" : "secondary"}>
//                           {cv.match_score}%
//                         </Badge>
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => onCVSelect(cv.cv_id)}
//                           disabled={selectedCV === cv.cv_id}
//                         >
//                           {selectedCV === cv.cv_id ? "Đã chọn" : "Chọn"}
//                         </Button>
//                       </div>
//                     </div>

//                     <div className="grid gap-4 md:grid-cols-2 text-sm">
//                       <div>
//                         <span className="font-medium text-green-600">Điểm mạnh:</span>
//                         <ul className="mt-1 space-y-1">
//                           {cv.strengths.map((strength, idx) => (
//                             <li key={idx} className="flex items-start gap-2">
//                               <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5 flex-shrink-0" />
//                               <span>{strength}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                       <div>
//                         <span className="font-medium text-red-600">Điểm yếu:</span>
//                         <ul className="mt-1 space-y-1">
//                           {cv.weaknesses.map((weakness, idx) => (
//                             <li key={idx} className="flex items-start gap-2">
//                               <div className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5 flex-shrink-0" />
//                               <span>{weakness}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>

//                     {cv.recommendation && (
//                       <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
//                         <span className="font-medium">Khuyến nghị:</span> {cv.recommendation}
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Improvement Suggestions */}
//             {suggestion.improvement_suggestions.length > 0 && (
//               <div>
//                 <h4 className="font-semibold mb-3 flex items-center gap-2">
//                   <Lightbulb className="w-4 h-4 text-yellow-600" />
//                   Gợi ý Cải Thiện CV
//                 </h4>
//                 <div className="space-y-2">
//                   {suggestion.improvement_suggestions.map((suggestion, index) => (
//                     <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                       <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
//                       <span className="text-sm">{suggestion}</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Summary */}
//             <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
//               <h4 className="font-semibold mb-2">Tóm tắt</h4>
//               <p className="text-sm text-muted-foreground">{suggestion.summary}</p>
//             </div>

//             <Button onClick={analyzeBestCV} variant="outline" className="w-full">
//               <Sparkles className="w-4 h-4 mr-2" />
//               Phân Tích Lại
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

// components/applicant/best-cv-suggestion.tsx
"use client";

import { useState } from "react";
import { Sparkles, Crown, Target, AlertCircle, Lightbulb, CheckCircle2 } from "lucide-react";
import styles from "../../styles/best-cv-suggestion.module.css";

interface CVSuggestion {
  best_cv: {
    cv_id: string;
    cv_name: string;
    match_score: number;
    reasons: string[];
    confidence_level: "high" | "medium" | "low";
  };
  all_cv_scores: Array<{
    cv_id: string;
    cv_name: string;
    match_score: number;
    strengths: string[];
    weaknesses: string[];
    recommendation: string;
  }>;
  summary: string;
  improvement_suggestions: string[];
}

interface BestCVSuggestionProps {
  jobId: string;
  applicantId: string;
  cvs: Array<{ id: string; name: string }>;
  onCVSelect: (cvId: string) => void;
  selectedCV?: string;
  onSuggestionChange?: (suggestion: CVSuggestion) => void;
}

export function BestCVSuggestion({ jobId, applicantId, cvs, onCVSelect, selectedCV, onSuggestionChange }: BestCVSuggestionProps) {
  const [suggestion, setSuggestion] = useState<CVSuggestion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeBestCV = async () => {
    if (cvs.length <= 1) {
      setError("Bạn cần có ít nhất 2 CV để sử dụng tính năng so sánh");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/suggest-best-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, applicantId }),
      });

      const result = await response.json();
      
      if (result.data) {
        setSuggestion(result.data);
        if (onSuggestionChange) {
          onSuggestionChange(result.data);
        }
      } else {
        setError(result.error || "Không thể phân tích CV");
      }
    } catch (err: any) {
      setError("Lỗi kết nối: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceClass = (level: string) => {
    switch (level) {
      case "high": return styles.confidenceHigh;
      case "medium": return styles.confidenceMedium;
      case "low": return styles.confidenceLow;
      default: return "";
    }
  };

  const getConfidenceText = (level: string) => {
    switch (level) {
      case "high": return "Độ tin cậy cao";
      case "medium": return "Độ tin cậy trung bình";
      case "low": return "Độ tin cậy thấp";
      default: return "Không xác định";
    }
  };

  const getScoreClass = (score: number) => {
    if (score >= 80) return styles.high;
    if (score >= 60) return styles.medium;
    return styles.low;
  };

  if (cvs.length <= 1) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            <Target className="w-5 h-5" />
            Gợi Ý CV Tốt Nhất
          </h3>
          <p className={styles.description}>
            Tính năng này yêu cầu ít nhất 2 CV để so sánh
          </p>
        </div>
        <div className={styles.content}>
          <div className={styles.initialState}>
            <p className={styles.promoDescription}>
              Bạn hiện có {cvs.length} CV. Tạo thêm CV để sử dụng tính năng so sánh AI.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Target className="w-5 h-5" />
          AI Gợi Ý CV Tốt Nhất
        </h3>
        <p className={styles.description}>
          Phân tích {cvs.length} CV của bạn để tìm CV phù hợp nhất với công việc này
        </p>
      </div>
      
      <div className={styles.content}>
        {error && (
          <div className={styles.errorAlert}>
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          </div>
        )}

        {!suggestion && !loading && (
          <div className={styles.initialState}>
            <div className={styles.promoBox}>
              <Sparkles className={styles.promoIcon} />
              <h4 className={styles.promoTitle}>So Sánh {cvs.length} CV Của Bạn</h4>
              <p className={styles.promoDescription}>
                AI sẽ phân tích tất cả CV của bạn và đề xuất CV nào phù hợp nhất 
                để ứng tuyển công việc này
              </p>
            </div>
            <button className={styles.analyzeButton} onClick={analyzeBestCV}>
              <Sparkles className="w-4 h-4" />
              Bắt Đầu Phân Tích
            </button>
          </div>
        )}

        {loading && (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner}></div>
            <p className={styles.loadingText}>AI đang phân tích {cvs.length} CV của bạn...</p>
            <p className={styles.loadingSubtext}>
              So sánh kỹ năng, kinh nghiệm và độ phù hợp với công việc
            </p>
          </div>
        )}

        {suggestion && (
          <div className="space-y-6">
            {/* Best CV Recommendation */}
            <div className={styles.bestCVAlert}>
              <div className={styles.bestCVHeader}>
                <div className={styles.bestCVInfo}>
                  <div className={styles.bestCVName}>
                    {suggestion.best_cv.cv_name}
                    <span className={styles.scoreBadge}>
                      {suggestion.best_cv.match_score}% phù hợp
                    </span>
                  </div>
                  <span className={`${styles.confidenceBadge} ${getConfidenceClass(suggestion.best_cv.confidence_level)}`}>
                    {getConfidenceText(suggestion.best_cv.confidence_level)}
                  </span>
                </div>
                <button
                  className={`${styles.selectButton} ${selectedCV === suggestion.best_cv.cv_id ? styles.selected : ''}`}
                  onClick={() => onCVSelect(suggestion.best_cv.cv_id)}
                  disabled={selectedCV === suggestion.best_cv.cv_id}
                >
                  {selectedCV === suggestion.best_cv.cv_id ? (
                    <>
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Đã chọn
                    </>
                  ) : (
                    "Chọn CV này"
                  )}
                </button>
              </div>
              
              <div>
                <h5 className="font-semibold mb-2 text-sm">Lý do đề xuất:</h5>
                <ul className={styles.reasonsList}>
                  {suggestion.best_cv.reasons.map((reason, index) => (
                    <li key={index} className={styles.reasonItem}>
                      <div className={styles.reasonDot}></div>
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* All CVs Comparison */}
            <div className={styles.comparisonSection}>
              <h4 className={styles.comparisonTitle}>
                <Target className="w-4 h-4" />
                So Sánh Tất Cả CV
              </h4>
              <div className="space-y-4">
                {suggestion.all_cv_scores.map((cv) => (
                  <div
                    key={cv.cv_id}
                    className={`${styles.cvCard} ${cv.cv_id === suggestion.best_cv.cv_id ? styles.best : ''}`}
                  >
                    <div className={styles.cvHeader}>
                      <div className={styles.cvName}>
                        {cv.cv_name}
                        {cv.cv_id === suggestion.best_cv.cv_id && (
                          <span className={styles.bestBadge}>
                            <Crown className="w-3 h-3" />
                            Tốt nhất
                          </span>
                        )}
                      </div>
                      <div className={styles.cvActions}>
                        <span className={`${styles.score} ${getScoreClass(cv.match_score)}`}>
                          {cv.match_score}%
                        </span>
                        <button
                          className={styles.cvButton}
                          onClick={() => onCVSelect(cv.cv_id)}
                          disabled={selectedCV === cv.cv_id}
                        >
                          {selectedCV === cv.cv_id ? "Đã chọn" : "Chọn"}
                        </button>
                      </div>
                    </div>

                    <div className={styles.cvAnalysis}>
                      <div className={styles.strengths}>
                        <div className={styles.analysisTitle}>
                          <CheckCircle2 className="w-3 h-3" />
                          Điểm mạnh
                        </div>
                        <ul className={styles.analysisList}>
                          {cv.strengths.map((strength, idx) => (
                            <li key={idx} className={styles.analysisItem}>
                              <div className={styles.analysisDot}></div>
                              <span>{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className={styles.weaknesses}>
                        <div className={styles.analysisTitle}>
                          <AlertCircle className="w-3 h-3" />
                          Điểm yếu
                        </div>
                        <ul className={styles.analysisList}>
                          {cv.weaknesses.map((weakness, idx) => (
                            <li key={idx} className={styles.analysisItem}>
                              <div className={styles.analysisDot}></div>
                              <span>{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {cv.recommendation && (
                      <div className={styles.recommendation}>
                        <span className="font-medium">Khuyến nghị:</span> {cv.recommendation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Improvement Suggestions */}
            {suggestion.improvement_suggestions.length > 0 && (
              <div className={styles.suggestionsSection}>
                <h4 className={styles.suggestionsTitle}>
                  <Lightbulb className="w-4 h-4" />
                  Gợi Ý Cải Thiện CV
                </h4>
                <div className={styles.suggestionsList}>
                  {suggestion.improvement_suggestions.map((suggestion, index) => (
                    <div key={index} className={styles.suggestionItem}>
                      <Lightbulb className={styles.suggestionIcon} />
                      <span className={styles.suggestionText}>{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Summary */}
            <div className={styles.summarySection}>
              <h4 className={styles.summaryTitle}>Tóm tắt</h4>
              <p className={styles.summaryText}>{suggestion.summary}</p>
            </div>

            <button className={styles.retryButton} onClick={analyzeBestCV}>
              <Sparkles className="w-4 h-4" />
              Phân Tích Lại
            </button>
          </div>
        )}
      </div>
    </div>
  );
}