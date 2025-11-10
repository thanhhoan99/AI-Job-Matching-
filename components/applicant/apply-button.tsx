
// // components/applicant/apply-button.tsx
// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { createClient } from "@/lib/supabase/client"
// import { useRouter } from "next/navigation"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Upload, FileText, Download, X, AlertCircle, Sparkles } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { CVJobMatching } from "./cv-job-matching"
// import { BestCVSuggestion } from "./best-cv-suggestion"
// import styles from '../../styles/ApplyButton.module.css';
// import { useTrackBehavior } from "@/hooks/useTrackBehavior"

// interface ApplyButtonProps {
//   jobId: string
//   applicantId: string
//   hasApplied: boolean
// }

// interface CV {
//   id: string
//   name: string
//   is_default: boolean
//   pdf_url?: string
//   cv_data?: any
// }

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

// // Thêm interface cho CV Suggestion
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

// export function ApplyButton({ jobId, applicantId, hasApplied }: ApplyButtonProps) {
//   const [open, setOpen] = useState(false)
//   const [coverLetter, setCoverLetter] = useState("")
//   const [selectedCV, setSelectedCV] = useState("")
//   const [uploadedCV, setUploadedCV] = useState<File | null>(null)
//   const [cvs, setCvs] = useState<CV[]>([])
//   const [isLoading, setIsLoading] = useState(false)
//   const [activeTab, setActiveTab] = useState("saved")
//   const [error, setError] = useState<string>("")
//   const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null)
//   const [jobDetails, setJobDetails] = useState<any>(null)
//   const [cvSuggestion, setCvSuggestion] = useState<CVSuggestion | null>(null) // ĐÃ THÊM KHAI BÁO NÀY
//   const router = useRouter()
//   const supabase = createClient()

//   const [currentUser, setCurrentUser] = useState<any>(null)

//   // Lấy dữ liệu CV được chọn
//   const selectedCVData = cvs.find(cv => cv.id === selectedCV)

//     const { trackBehavior } = useTrackBehavior() 

//   useEffect(() => {
//     const getUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser()
//       setCurrentUser(user)
//     }
//     getUser()
//   }, [supabase])

//   useEffect(() => {
//     const fetchCVs = async () => {
//       if (!applicantId) return
//       try {
//         const { data, error } = await supabase
//           .from("applicant_cvs")
//           .select("id, name, is_default, pdf_url, cv_data")
//           .eq("applicant_id", applicantId)
//           .order("is_default", { ascending: false })
        
//         if (error) throw error
//         setCvs(data || [])
        
//         const defaultCV = data?.find(cv => cv.is_default)
//         if (defaultCV) {
//           setSelectedCV(defaultCV.id)
//         } else if (data && data.length > 0) {
//           setSelectedCV(data[0].id)
//         }
//       } catch (err: any) {
//         console.error("Error fetching CVs:", err)
//         setError(`Lỗi tải CV: ${err.message}`)
//       }
//     }
//     fetchCVs()
//   }, [applicantId, supabase])

//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       if (!jobId) return
//       try {
//         const { data, error } = await supabase
//           .from("job_postings")
//           .select("*, employer_profiles(company_name, logo_url, city)")
//           .eq("id", jobId)
//           .single()
        
//         if (error) throw error
//         setJobDetails(data)
//       } catch (err: any) {
//         console.error("Error fetching job details:", err)
//       }
//     }
//     fetchJobDetails()
//   }, [jobId, supabase])

//   const handleFileUpload = (file: File) => {
//     setError("")
    
//     if (file.size > 5 * 1024 * 1024) {
//       setError("File CV không được vượt quá 5MB")
//       return false
//     }

//     if (!file.type.includes('pdf')) {
//       setError("Chỉ hỗ trợ file PDF")
//       return false
//     }

//     setUploadedCV(file)
//     return true
//   }

//   const handleApply = async () => {
//     if (!applicantId || !currentUser) {
//       setError("Vui lòng đăng nhập và hoàn thiện hồ sơ trước khi ứng tuyển")
//       return
//     }

//     if (activeTab === "saved" && !selectedCV) {
//       setError("Vui lòng chọn CV để ứng tuyển")
//       return
//     }

//     if (activeTab === "upload" && !uploadedCV) {
//       setError("Vui lòng chọn file CV để upload")
//       return
//     }

//     setIsLoading(true)
//     setError("")

//     try {
//       let cvUrl = ""
//       let cvId = null

//       // Xử lý upload file PDF
//       if (activeTab === "upload" && uploadedCV) {
//         const fileExt = uploadedCV.name.split('.').pop()
//         const timestamp = Date.now()
//         const safeFileName = uploadedCV.name.replace(/[^a-zA-Z0-9.-]/g, '_')
//         const fileName = `uploaded/${currentUser.id}/${timestamp}-${safeFileName}`

//         console.log("Uploading file to:", fileName)

//         // Upload file
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from('cvs')
//           .upload(fileName, uploadedCV, {
//             cacheControl: '3600',
//             upsert: false
//           })

//         if (uploadError) {
//           console.error("Storage upload error:", uploadError)
//           throw new Error(`Lỗi upload file: ${uploadError.message}`)
//         }

//         // Lấy public URL
//         const { data: urlData } = supabase.storage
//           .from('cvs')
//           .getPublicUrl(fileName)
        
//         cvUrl = urlData.publicUrl
//         console.log("Uploaded CV URL:", cvUrl)
        
//       } else if (activeTab === "saved") {
//         // Sử dụng CV đã lưu từ database
//         cvId = selectedCV
//         const selectedCvData = cvs.find(cv => cv.id === selectedCV)
//         cvUrl = selectedCvData?.pdf_url || ""
//       }

//       // Chuẩn bị dữ liệu application với AI matching score và CV suggestion
//       const applicationData = {
//         job_id: jobId,
//         applicant_id: applicantId,
//         cover_letter: coverLetter || null,
//         cv_id: cvId,
//         cv_url: cvUrl,
//         status: "pending",
//         match_score: matchingResult?.match_score || 0,
//         match_analysis: {
//           detailed_breakdown: matchingResult?.detailed_breakdown,
//           matching_skills: matchingResult?.matching_skills || [],
//           missing_skills: matchingResult?.missing_skills || [],
//           improvement_suggestions: matchingResult?.improvement_suggestions || [],
//           // Thêm thông tin CV comparison nếu có
//           ...(cvSuggestion && {
//             cv_comparison: {
//               best_cv_id: cvSuggestion.best_cv.cv_id,
//               all_scores: cvSuggestion.all_cv_scores.map(cv => ({
//                 cv_id: cv.cv_id,
//                 score: cv.match_score,
//                 reasons: cv.strengths
//               }))
//             }
//           })
//         },
//         applied_at: new Date().toISOString(),
//         updated_at: new Date().toISOString()
//       }

//       console.log("Inserting application data:", applicationData)

//       // Insert application
//       const { data: application, error: insertError } = await supabase
//         .from("job_applications")
//         .insert(applicationData)
//         .select()
//         .single()

//       if (insertError) {
//         console.error("Application insert error:", insertError)
        
//         if (insertError.code === '42501') {
//           throw new Error("Không có quyền thực hiện hành động này.")
//         } else if (insertError.code === '23503') {
//           throw new Error("Lỗi tham chiếu dữ liệu. Vui lòng kiểm tra thông tin hồ sơ.")
//         } else if (insertError.code === '23505') {
//           throw new Error("Bạn đã ứng tuyển vị trí này rồi.")
//         } else {
//           throw new Error(`Lỗi database: ${insertError.message}`)
//         }
//       }

//       console.log("Application created successfully:", application)
//       await trackBehavior({
//         jobId,
//         eventType: 'apply',
//       })

//       console.log(`✅ Tracked apply for job: ${jobId}`)
      
//       // Thành công
//       alert("Ứng tuyển thành công!")
//       setOpen(false)
//       setUploadedCV(null)
//       setCoverLetter("")
//       setMatchingResult(null)
//       setCvSuggestion(null) // Reset CV suggestion
//       setError("")
//       router.refresh()
      
//     } catch (error: any) {
//       console.error("Full application error:", error)
//       setError(error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getScoreVariant = (score: number) => {
//     if (score >= 80) return "default";
//     if (score >= 60) return "secondary";
//     return "destructive";
//   };

//   // Reset states khi đóng dialog
//   const handleOpenChange = (open: boolean) => {
//     setOpen(open);
//     if (!open) {
//       // Reset các state khi đóng dialog
//       setMatchingResult(null);
//       setCvSuggestion(null);
//       setError("");
//     }
//   };

//   if (hasApplied) {
//     return (
//       <Button disabled variant="secondary">
//         Đã ứng tuyển
//       </Button>
//     )
//   }

//   return (
//     <Dialog open={open} onOpenChange={handleOpenChange}>
//       <DialogTrigger asChild>
//         <Button>Apply Now</Button>
//       </DialogTrigger>
//       <DialogContent className={`${styles.dialogContent} max-w-4xl max-h-[90vh] overflow-y-auto`}>
//         <DialogHeader className={styles.dialogHeader}>
//           <DialogTitle  className={styles.dialogTitle}>
//             <Sparkles className="w-5 h-5 text-primary" />
//             Ứng tuyển vị trí
//           </DialogTitle>
//           <DialogDescription>
//             Chọn CV và viết thư giới thiệu để tăng cơ hội được chọn
//             {jobDetails && ` - ${jobDetails.title} tại ${jobDetails.employer_profiles?.company_name}`}
//           </DialogDescription>
//         </DialogHeader>

//         {error && (
//           <Alert variant="destructive" className={styles.errorAlert}>
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>{error}</AlertDescription>
//           </Alert>
//         )}
        
//         <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
//           <TabsList className={`${styles.tabsList} grid w-full grid-cols-2`}>
//             <TabsTrigger value="saved" className={styles.tabTrigger}>CV đã lưu</TabsTrigger>
//             <TabsTrigger value="upload" className={styles.tabTrigger}>Upload CV</TabsTrigger>
//           </TabsList>
          
//           <TabsContent value="saved" className="space-y-4">
//             <div className={styles.formGroup}>
//               <Label className={styles.label}>Chọn CV *</Label>
//               <Select value={selectedCV} onValueChange={setSelectedCV}>
//                 <SelectTrigger className={styles.selectTrigger}>
//                   <SelectValue placeholder="Chọn CV" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {cvs.map((cv) => (
//                     <SelectItem key={cv.id} value={cv.id}>
//                       <div className="flex items-center justify-between w-full">
//                         <span>{cv.name} {cv.is_default && "(Mặc định)"}</span>
//                         {cv.pdf_url && (
//                           <Button
//                             type="button"
//                             variant="ghost"
//                             size="sm"
//                             onClick={(e) => {
//                               e.stopPropagation()
//                               e.preventDefault()
//                               window.open(cv.pdf_url, '_blank')
//                             }}
//                           >
//                             <Download className="w-4 h-4" />
//                           </Button>
//                         )}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//               <p className="text-xs text-muted-foreground">
//                 Chọn CV từ danh sách CV đã tạo của bạn
//               </p>
//             </div>

//             {/* AI Best CV Suggestion - Chỉ hiển thị khi có nhiều CV */}
//             {cvs.length > 1 && (
//               <BestCVSuggestion
//                 jobId={jobId}
//                 applicantId={applicantId}
//                 cvs={cvs}
//                 onCVSelect={setSelectedCV}
//                 selectedCV={selectedCV}
//                 onSuggestionChange={setCvSuggestion}
//               />
//             )}

//             {/* AI Matching Component - Chỉ hiển thị khi có CV được chọn */}
//             {selectedCVData && jobDetails && (
//               <CVJobMatching 
//                 cvData={selectedCVData.cv_data} 
//                 jobId={jobId}
//                 jobDetails={jobDetails}
//                 applicantId={applicantId}
//                 onMatchResult={setMatchingResult}
//               />
//             )}

//              {matchingResult && (
//           <Alert className={`${styles.matchAlert} ${
//             matchingResult.match_score >= 60 
//               ? "bg-green-50 border-green-200" 
//               : "bg-yellow-50 border-yellow-200"
//           }`}>
//             <AlertDescription>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <span className="font-semibold">Độ phù hợp với công việc: </span>
//                   <span>{matchingResult.match_score}%</span>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {matchingResult.ai_explanation}
//                   </p>
//                 </div>
//                 <Badge variant={getScoreVariant(matchingResult.match_score)}>
//                   {matchingResult.match_score >= 80 ? "Rất phù hợp" :
//                    matchingResult.match_score >= 60 ? "Khá phù hợp" : "Cần cải thiện"}
//                 </Badge>
//               </div>
//             </AlertDescription>
//           </Alert>
//         )}
//           </TabsContent>
          
//           <TabsContent value="upload" className="space-y-4">
//             <div className={styles.formGroup}>
//               <Label>Upload CV (PDF) *</Label>
              
//               {!uploadedCV ? (
//                 <div 
//                    className={styles.fileUploadArea}
//                   onClick={() => document.getElementById('cv-upload')?.click()}
//                 >
//                   <div className="flex flex-col items-center justify-center space-y-2">
//                     <Upload className={`${styles.fileUploadIcon} w-8 h-8`} />
//                     <div className="text-sm text-muted-foreground text-center">
//                       <span className="text-primary hover:underline">Click để chọn file</span>
//                       <span> hoặc kéo thả file vào đây</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Hỗ trợ file PDF, tối đa 5MB</p>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
//                   <FileText className="w-4 h-4 text-green-600" />
//                   <span className="text-sm text-green-800 flex-1">{uploadedCV.name}</span>
//                   <span className="text-xs text-green-600">
//                     ({(uploadedCV.size / 1024 / 1024).toFixed(2)} MB)
//                   </span>
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={() => setUploadedCV(null)}
//                      className={`${styles.removeFileButton} h-8 w-8 p-0`}
//                   >
//                     <X className="w-4 h-4" />
//                   </Button>
//                 </div>
//               )}

//               <input
//                 id="cv-upload"
//                 type="file"
//                 accept=".pdf,application/pdf"
//                 className="hidden"
//                 onChange={(e) => {
//                   const file = e.target.files?.[0]
//                   if (file) handleFileUpload(file)
//                   e.target.value = '' // Reset input
//                 }}
//               />
//             </div>
//           </TabsContent>
//         </Tabs>

//         {/* Hiển thị kết quả matching tổng quan */}
//         {/* {matchingResult && (
//           <Alert className={`${styles.matchAlert} ${
//             matchingResult.match_score >= 60 
//               ? "bg-green-50 border-green-200" 
//               : "bg-yellow-50 border-yellow-200"
//           }`}>
//             <AlertDescription>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <span className="font-semibold">Độ phù hợp với công việc: </span>
//                   <span>{matchingResult.match_score}%</span>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {matchingResult.ai_explanation}
//                   </p>
//                 </div>
//                 <Badge variant={getScoreVariant(matchingResult.match_score)}>
//                   {matchingResult.match_score >= 80 ? "Rất phù hợp" :
//                    matchingResult.match_score >= 60 ? "Khá phù hợp" : "Cần cải thiện"}
//                 </Badge>
//               </div>
//             </AlertDescription>
//           </Alert>
//         )} */}

//         {/* Hiển thị CV suggestion nếu có */}
//         {/* {cvSuggestion && (
//           <Alert className="bg-blue-50 border-blue-200">
//             <AlertDescription>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <span className="font-semibold">CV được đề xuất: </span>
//                   <span>{cvSuggestion.best_cv.cv_name}</span>
//                   <p className="text-sm text-muted-foreground mt-1">
//                     {cvSuggestion.best_cv.reasons[0]}
//                   </p>
//                 </div>
//                 <Badge variant="default">
//                   {cvSuggestion.best_cv.match_score}% phù hợp
//                 </Badge>
//               </div>
//             </AlertDescription>
//           </Alert>
//         )} */}

//         <div className={styles.formGroup}>
//           <Label htmlFor="cover_letter" className={styles.label}>Thư giới thiệu (Tùy chọn)</Label>
//           <Textarea
//             id="cover_letter"
//             rows={4}
//             placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
//             value={coverLetter}
//             onChange={(e) => setCoverLetter(e.target.value)}
//              className={styles.selectTrigger}
//           />
//         </div>
        
//         <Button 
//           onClick={handleApply} 
//           disabled={isLoading || (activeTab === "saved" && !selectedCV) || (activeTab === "upload" && !uploadedCV)} 
//           className={styles.mainApplyButton}
//         >
//           {isLoading ? (
//             <>
//               <div className={styles.spinner}></div>
//               Đang gửi...
//             </>
//           ) : (
//             matchingResult 
//               ? `Gửi đơn ứng tuyển (${matchingResult.match_score}% phù hợp)` 
//               : cvSuggestion
//               ? `Gửi đơn với ${cvSuggestion.best_cv.cv_name} (${cvSuggestion.best_cv.match_score}% phù hợp)`
//               : "Gửi đơn ứng tuyển"
//           )}
//         </Button>
//       </DialogContent>
//     </Dialog>
//   )
// }



// components/applicant/apply-button.tsx
"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, FileText, Download, X, AlertCircle, Sparkles } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { CVJobMatching } from "./cv-job-matching"
import { BestCVSuggestion } from "./best-cv-suggestion"
import styles from '../../styles/ApplyButton.module.css';
import { useTrackBehavior } from "@/hooks/useTrackBehavior"

interface ApplyButtonProps {
  jobId: string
  applicantId: string | null
  hasApplied: boolean
   compact?: boolean // THÊM PROP MỚI
  onApplySuccess?: () => void // CALLBACK KHI APPLY THÀNH CÔNG
}

interface CV {
  id: string
  name: string
  is_default: boolean
  pdf_url?: string
  cv_data?: any
}

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

// Thêm interface cho CV Suggestion
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

export function ApplyButton({ jobId, applicantId, hasApplied ,compact = false,onApplySuccess }: ApplyButtonProps) {
  const [open, setOpen] = useState(false)
  const [coverLetter, setCoverLetter] = useState("")
  const [selectedCV, setSelectedCV] = useState("")
  const [uploadedCV, setUploadedCV] = useState<File | null>(null)
  const [cvs, setCvs] = useState<CV[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("saved")
  const [error, setError] = useState<string>("")
  const [matchingResult, setMatchingResult] = useState<MatchingResult | null>(null)
  const [jobDetails, setJobDetails] = useState<any>(null)
  const [cvSuggestion, setCvSuggestion] = useState<CVSuggestion | null>(null) // ĐÃ THÊM KHAI BÁO NÀY
  const router = useRouter()
  const supabase = createClient()

  const [currentUser, setCurrentUser] = useState<any>(null)

  // Lấy dữ liệu CV được chọn
  const selectedCVData = cvs.find(cv => cv.id === selectedCV)

    const { trackBehavior } = useTrackBehavior() 

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)
    }
    getUser()
  }, [supabase])

  useEffect(() => {
    const fetchCVs = async () => {
      if (!applicantId) return
      try {
        const { data, error } = await supabase
          .from("applicant_cvs")
          .select("id, name, is_default, pdf_url, cv_data")
          .eq("applicant_id", applicantId)
          .order("is_default", { ascending: false })
        
        if (error) throw error
        setCvs(data || [])
        
        const defaultCV = data?.find(cv => cv.is_default)
        if (defaultCV) {
          setSelectedCV(defaultCV.id)
        } else if (data && data.length > 0) {
          setSelectedCV(data[0].id)
        }
      } catch (err: any) {
        console.error("Error fetching CVs:", err)
        setError(`Lỗi tải CV: ${err.message}`)
      }
    }
    fetchCVs()
  }, [applicantId, supabase])

  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return
      try {
        const { data, error } = await supabase
          .from("job_postings")
          .select("*, employer_profiles(company_name, logo_url, city)")
          .eq("id", jobId)
          .single()
        
        if (error) throw error
        setJobDetails(data)
      } catch (err: any) {
        console.error("Error fetching job details:", err)
      }
    }
    fetchJobDetails()
  }, [jobId, supabase])

  const handleFileUpload = (file: File) => {
    setError("")
    
    if (file.size > 5 * 1024 * 1024) {
      setError("File CV không được vượt quá 5MB")
      return false
    }

    if (!file.type.includes('pdf')) {
      setError("Chỉ hỗ trợ file PDF")
      return false
    }

    setUploadedCV(file)
    return true
  }

  //   const handleApplyClick = () => {
  //   if (!applicantId) {
  //     setError("Vui lòng đăng nhập và hoàn thiện hồ sơ trước khi ứng tuyển")
  //     setOpen(true) // VẪN MỞ DIALOG ĐỂ HIỂN THỊ LỖI
  //     return
  //   }
  //   setOpen(true)
  // }
  const handleApply = async () => {
    if (!applicantId || !currentUser) {
      setError("Vui lòng đăng nhập và hoàn thiện hồ sơ trước khi ứng tuyển")
      return
    }

    if (activeTab === "saved" && !selectedCV) {
      setError("Vui lòng chọn CV để ứng tuyển")
      return
    }

    if (activeTab === "upload" && !uploadedCV) {
      setError("Vui lòng chọn file CV để upload")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      let cvUrl = ""
      let cvId = null

      // Xử lý upload file PDF
      if (activeTab === "upload" && uploadedCV) {
        const fileExt = uploadedCV.name.split('.').pop()
        const timestamp = Date.now()
        const safeFileName = uploadedCV.name.replace(/[^a-zA-Z0-9.-]/g, '_')
        const fileName = `uploaded/${currentUser.id}/${timestamp}-${safeFileName}`

        console.log("Uploading file to:", fileName)

        // Upload file
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('cvs')
          .upload(fileName, uploadedCV, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error("Storage upload error:", uploadError)
          throw new Error(`Lỗi upload file: ${uploadError.message}`)
        }

        // Lấy public URL
        const { data: urlData } = supabase.storage
          .from('cvs')
          .getPublicUrl(fileName)
        
        cvUrl = urlData.publicUrl
        console.log("Uploaded CV URL:", cvUrl)
        
      } else if (activeTab === "saved") {
        // Sử dụng CV đã lưu từ database
        cvId = selectedCV
        const selectedCvData = cvs.find(cv => cv.id === selectedCV)
        cvUrl = selectedCvData?.pdf_url || ""
      }

      // Chuẩn bị dữ liệu application với AI matching score và CV suggestion
      const applicationData = {
        job_id: jobId,
        applicant_id: applicantId,
        cover_letter: coverLetter || null,
        cv_id: cvId,
        cv_url: cvUrl,
        status: "pending",
        match_score: matchingResult?.match_score || 0,
        match_analysis: {
          detailed_breakdown: matchingResult?.detailed_breakdown,
          matching_skills: matchingResult?.matching_skills || [],
          missing_skills: matchingResult?.missing_skills || [],
          improvement_suggestions: matchingResult?.improvement_suggestions || [],
          // Thêm thông tin CV comparison nếu có
          ...(cvSuggestion && {
            cv_comparison: {
              best_cv_id: cvSuggestion.best_cv.cv_id,
              all_scores: cvSuggestion.all_cv_scores.map(cv => ({
                cv_id: cv.cv_id,
                score: cv.match_score,
                reasons: cv.strengths
              }))
            }
          })
        },
        applied_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      console.log("Inserting application data:", applicationData)

      // Insert application
      const { data: application, error: insertError } = await supabase
        .from("job_applications")
        .insert(applicationData)
        .select()
        .single()

      if (insertError) {
        console.error("Application insert error:", insertError)
        
        if (insertError.code === '42501') {
          throw new Error("Không có quyền thực hiện hành động này.")
        } else if (insertError.code === '23503') {
          throw new Error("Lỗi tham chiếu dữ liệu. Vui lòng kiểm tra thông tin hồ sơ.")
        } else if (insertError.code === '23505') {
          throw new Error("Bạn đã ứng tuyển vị trí này rồi.")
        } else {
          throw new Error(`Lỗi database: ${insertError.message}`)
        }
      }

      console.log("Application created successfully:", application)
      await trackBehavior({
        jobId,
        eventType: 'apply',
      })

      console.log(`✅ Tracked apply for job: ${jobId}`)
       onApplySuccess?.()

      
      // Thành công
      alert("Ứng tuyển thành công!")
      setOpen(false)
      setUploadedCV(null)
      setCoverLetter("")
      setMatchingResult(null)
      setCvSuggestion(null) // Reset CV suggestion
      setError("")
      router.refresh()
      
    } catch (error: any) {
      console.error("Full application error:", error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreVariant = (score: number) => {
    if (score >= 80) return "default";
    if (score >= 60) return "secondary";
    return "destructive";
  };

  // Reset states khi đóng dialog
  const handleOpenChange = (open: boolean) => {
    setOpen(open);
    if (!open) {
      // Reset các state khi đóng dialog
      setMatchingResult(null);
      setCvSuggestion(null);
      setError("");
    }
  };

  if (hasApplied) {
    return (
      <Button
  disabled
  variant="secondary"
  className={`${styles["btn-apply-now"]} ${compact ? styles.disabled : ""}`}
>
  Applied
</Button>
    )
  }
  // NẾU COMPACT MODE, HIỂN THỊ BUTTON ĐƠN GIẢN
  if (compact) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className={styles.applyButton}  >
          Apply Now
          </Button>
        </DialogTrigger>
       <DialogContent className={`${styles.dialogContent} max-w-4xl max-h-[70vh] overflow-y-auto `} style={{
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(100, 116, 139, 0.5) transparent",
  }}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle  className={styles.dialogTitle}>
            <Sparkles className="w-5 h-5 text-primary" />
            Ứng tuyển vị trí
          </DialogTitle>
          <DialogDescription>
            Chọn CV và viết thư giới thiệu để tăng cơ hội được chọn
            {jobDetails && ` - ${jobDetails.title} tại ${jobDetails.employer_profiles?.company_name}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className={styles.errorAlert}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`${styles.tabsList} grid w-full grid-cols-2`}>
            <TabsTrigger value="saved" className={styles.tabTrigger}>CV đã lưu</TabsTrigger>
            <TabsTrigger value="upload" className={styles.tabTrigger}>Upload CV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-4">
            <div className={styles.formGroup}>
              <Label className={styles.label}>Chọn CV *</Label>
              <Select value={selectedCV} onValueChange={setSelectedCV}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Chọn CV" />
                </SelectTrigger>
                <SelectContent>
                  {cvs.map((cv) => (
                    <SelectItem key={cv.id} value={cv.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{cv.name} {cv.is_default && "(Mặc định)"}</span>
                        {cv.pdf_url && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              window.open(cv.pdf_url, '_blank')
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Chọn CV từ danh sách CV đã tạo của bạn
              </p>
            </div>

            {/* AI Best CV Suggestion - Chỉ hiển thị khi có nhiều CV */}
            {cvs.length > 1 && (
              <BestCVSuggestion
                jobId={jobId}
                applicantId={applicantId || ""}
                cvs={cvs}
                onCVSelect={setSelectedCV}
                selectedCV={selectedCV}
                onSuggestionChange={setCvSuggestion}
              />
            )}

            {/* AI Matching Component - Chỉ hiển thị khi có CV được chọn */}
            {selectedCVData && jobDetails && (
              <CVJobMatching 
                cvData={selectedCVData.cv_data} 
                jobId={jobId}
                jobDetails={jobDetails}
                applicantId={applicantId || ""}
                onMatchResult={setMatchingResult}
              />
            )}

             {/* {matchingResult && (
          <Alert className={`${styles.matchAlert} ${
            matchingResult.match_score >= 60 
              ? "bg-green-50 border-green-200" 
              : "bg-yellow-50 border-yellow-200"
          }`}>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">Độ phù hợp với công việc: </span>
                  <span>{matchingResult.match_score}%</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {matchingResult.ai_explanation}
                  </p>
                </div>
                <Badge variant={getScoreVariant(matchingResult.match_score)}>
                  {matchingResult.match_score >= 80 ? "Rất phù hợp" :
                   matchingResult.match_score >= 60 ? "Khá phù hợp" : "Cần cải thiện"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )} */}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className={styles.formGroup}>
              <Label>Upload CV (PDF) *</Label>
              
              {!uploadedCV ? (
                <div 
                   className={styles.fileUploadArea}
                  onClick={() => document.getElementById('cv-upload')?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className={`${styles.fileUploadIcon} w-8 h-8`} />
                    <div className="text-sm text-muted-foreground text-center">
                      <span className="text-primary hover:underline">Click để chọn file</span>
                      <span> hoặc kéo thả file vào đây</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Hỗ trợ file PDF, tối đa 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 flex-1">{uploadedCV.name}</span>
                  <span className="text-xs text-green-600">
                    ({(uploadedCV.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedCV(null)}
                     className={`${styles.removeFileButton} h-8 w-8 p-0`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <input
                id="cv-upload"
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                  e.target.value = '' // Reset input
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

      
        {/* Hiển thị CV suggestion nếu có */}
        {/* {cvSuggestion && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">CV được đề xuất: </span>
                  <span>{cvSuggestion.best_cv.cv_name}</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cvSuggestion.best_cv.reasons[0]}
                  </p>
                </div>
                <Badge variant="default">
                  {cvSuggestion.best_cv.match_score}% phù hợp
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )} */}

        <div className={styles.formGroup}>
          <Label htmlFor="cover_letter" className={styles.label}>Thư giới thiệu (Tùy chọn)</Label>
          <Textarea
            id="cover_letter"
            rows={4}
            placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
             className={styles.selectTrigger}
          />
        </div>
        
        <Button 
          onClick={handleApply} 
          disabled={isLoading || (activeTab === "saved" && !selectedCV) || (activeTab === "upload" && !uploadedCV)} 
          className={styles.mainApplyButton}
        >
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              Đang gửi...
            </>
          ) : (
            matchingResult 
              ? `Gửi đơn ứng tuyển (${matchingResult.match_score}% phù hợp)` 
              : cvSuggestion
              ? `Gửi đơn với ${cvSuggestion.best_cv.cv_name} (${cvSuggestion.best_cv.match_score}% phù hợp)`
              : "Gửi đơn ứng tuyển"
          )}
        </Button>
      </DialogContent>
      </Dialog>
    )
  }

// MODE ĐẦY ĐỦ (CHO TRANG CHI TIẾT)
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button  className={styles.applyButton}>Apply Now</Button>
      </DialogTrigger>
      <DialogContent className={`${styles.dialogContent} max-w-4xl max-h-[90vh] overflow-y-auto`} style={{
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(100, 116, 139, 0.5) transparent",
  }}>
        <DialogHeader className={styles.dialogHeader}>
          <DialogTitle  className={styles.dialogTitle}>
            <Sparkles className="w-5 h-5 text-primary" />
            Ứng tuyển vị trí
          </DialogTitle>
          <DialogDescription>
            Chọn CV và viết thư giới thiệu để tăng cơ hội được chọn
            {jobDetails && ` - ${jobDetails.title} tại ${jobDetails.employer_profiles?.company_name}`}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className={styles.errorAlert}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className={`${styles.tabsList} grid w-full grid-cols-2`}>
            <TabsTrigger value="saved" className={styles.tabTrigger}>CV đã lưu</TabsTrigger>
            <TabsTrigger value="upload" className={styles.tabTrigger}>Upload CV</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved" className="space-y-4">
            <div className={styles.formGroup}>
              <Label className={styles.label}>Chọn CV *</Label>
              <Select value={selectedCV} onValueChange={setSelectedCV}>
                <SelectTrigger className={styles.selectTrigger}>
                  <SelectValue placeholder="Chọn CV" />
                </SelectTrigger>
                <SelectContent>
                  {cvs.map((cv) => (
                    <SelectItem key={cv.id} value={cv.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{cv.name} {cv.is_default && "(Mặc định)"}</span>
                        {cv.pdf_url && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              window.open(cv.pdf_url, '_blank')
                            }}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Chọn CV từ danh sách CV đã tạo của bạn
              </p>
            </div>

            {/* AI Best CV Suggestion - Chỉ hiển thị khi có nhiều CV */}
            {cvs.length > 1 && (
              <BestCVSuggestion
                jobId={jobId}
                applicantId={applicantId || ""}
                cvs={cvs}
                onCVSelect={setSelectedCV}
                selectedCV={selectedCV}
                onSuggestionChange={setCvSuggestion}
              />
            )}

            {/* AI Matching Component - Chỉ hiển thị khi có CV được chọn */}
            {selectedCVData && jobDetails && (
              <CVJobMatching 
                cvData={selectedCVData.cv_data} 
                jobId={jobId}
                jobDetails={jobDetails}
                applicantId={applicantId || ""}
                onMatchResult={setMatchingResult}
              />
            )}

             {/* {matchingResult && (
          <Alert className={`${styles.matchAlert} ${
            matchingResult.match_score >= 60 
              ? "bg-green-50 border-green-200" 
              : "bg-yellow-50 border-yellow-200"
          }`}>
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">Độ phù hợp với công việc: </span>
                  <span>{matchingResult.match_score}%</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {matchingResult.ai_explanation}
                  </p>
                </div>
                <Badge variant={getScoreVariant(matchingResult.match_score)}>
                  {matchingResult.match_score >= 80 ? "Rất phù hợp" :
                   matchingResult.match_score >= 60 ? "Khá phù hợp" : "Cần cải thiện"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )} */}
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div className={styles.formGroup}>
              <Label>Upload CV (PDF) *</Label>
              
              {!uploadedCV ? (
                <div 
                   className={styles.fileUploadArea}
                  onClick={() => document.getElementById('cv-upload')?.click()}
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Upload className={`${styles.fileUploadIcon} w-8 h-8`} />
                    <div className="text-sm text-muted-foreground text-center">
                      <span className="text-primary hover:underline">Click để chọn file</span>
                      <span> hoặc kéo thả file vào đây</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Hỗ trợ file PDF, tối đa 5MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-800 flex-1">{uploadedCV.name}</span>
                  <span className="text-xs text-green-600">
                    ({(uploadedCV.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setUploadedCV(null)}
                     className={`${styles.removeFileButton} h-8 w-8 p-0`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}

              <input
                id="cv-upload"
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                  e.target.value = '' // Reset input
                }}
              />
            </div>
          </TabsContent>
        </Tabs>

      
        {/* Hiển thị CV suggestion nếu có */}
        {/* {cvSuggestion && (
          <Alert className="bg-blue-50 border-blue-200">
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-semibold">CV được đề xuất: </span>
                  <span>{cvSuggestion.best_cv.cv_name}</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    {cvSuggestion.best_cv.reasons[0]}
                  </p>
                </div>
                <Badge variant="default">
                  {cvSuggestion.best_cv.match_score}% phù hợp
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        )} */}

        <div className={styles.formGroup}>
          <Label htmlFor="cover_letter" className={styles.label}>Thư giới thiệu (Tùy chọn)</Label>
          <Textarea
            id="cover_letter"
            rows={4}
            placeholder="Giới thiệu về bản thân và lý do bạn phù hợp với vị trí này..."
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
             className={styles.selectTrigger}
          />
        </div>
        
        <Button 
          onClick={handleApply} 
          disabled={isLoading || (activeTab === "saved" && !selectedCV) || (activeTab === "upload" && !uploadedCV)} 
          className={styles.mainApplyButton}
        >
          {isLoading ? (
            <>
              <div className={styles.spinner}></div>
              Đang gửi...
            </>
          ) : (
            matchingResult 
              ? `Gửi đơn ứng tuyển (${matchingResult.match_score}% phù hợp)` 
              : cvSuggestion
              ? `Gửi đơn với ${cvSuggestion.best_cv.cv_name} (${cvSuggestion.best_cv.match_score}% phù hợp)`
              : "Gửi đơn ứng tuyển"
          )}
        </Button>
      </DialogContent>
    </Dialog>
  )
}