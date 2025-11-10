// import { createClient } from "@/lib/supabase/server"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Briefcase, FileText, BookmarkIcon, TrendingUp, Plus, Star, Eye } from "lucide-react"
// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { Badge } from "@/components/ui/badge"
// import Layout from "@/components/Layout/Layout"

// export default async function ApplicantDashboardPage() {
//   const supabase = await createClient()
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) return null

//   // Get applicant profile
//   const { data: applicantProfile } = await supabase
//     .from("applicant_profiles")
//     .select("*")
//     .eq("user_id", user.id)
//     .maybeSingle()

//   // Get statistics
//   let applicationsCount = 0
//   let savedJobsCount = 0
//   let recentApplications: any[] = []
// let cvsCount = 0

//   if (applicantProfile?.id) {
//     const { count: appCount } = await supabase
//       .from("job_applications")
//       .select("*", { count: "exact", head: true })
//       .eq("applicant_id", applicantProfile.id)

//     const { count: savedCount } = await supabase
//       .from("saved_jobs")
//       .select("*", { count: "exact", head: true })
//       .eq("applicant_id", applicantProfile.id)

//         // ĐẾM TỔNG SỐ CV - QUAN TRỌNG
//     const { count: cvCount } = await supabase
//       .from("applicant_cvs")
//       .select("*", { count: "exact", head: true })
//       .eq("applicant_id", applicantProfile.id)

//     applicationsCount = appCount || 0
//     savedJobsCount = savedCount || 0
//       cvsCount = cvCount || 0

//     // Get recent applications
//     const { data: apps } = await supabase
//       .from("job_applications")
//       .select(
//         `
//         *,
//         job_postings (
//           title,
//           employer_profiles (
//             company_name
//           )
//         )
//       `,
//       )
//       .eq("applicant_id", applicantProfile.id)
//       .order("applied_at", { ascending: false })
//       .limit(5)

//     recentApplications = apps || []
//   }

//   // Lấy danh sách CV của ứng viên
//   let cvs: any[] = []
//   if (applicantProfile?.id) {
//     const { data: cvData } = await supabase
//       .from("applicant_cvs")
//       .select("id, name, is_default, created_at, updated_at")
//       .eq("applicant_id", applicantProfile.id)
//       .order("is_default", { ascending: false })
//       .order("created_at", { ascending: false })
//       .limit(3) // Chỉ hiển thị 3 CV gần nhất

//     cvs = cvData || []
//   }

//   const { count: activeJobsCount } = await supabase
//     .from("job_postings")
//     .select("*", { count: "exact", head: true })
//     .eq("is_active", true)

//   return (

//     <div className="space-y-8">
//       <div>
//         <h1 className="text-3xl font-bold">Tổng quan</h1>
//         <p className="text-muted-foreground">Chào mừng trở lại!</p>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Đơn ứng tuyển</CardTitle>
//             <FileText className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{applicationsCount}</div>
//             <p className="text-xs text-muted-foreground">Tổng số đơn đã nộp</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Việc làm đã lưu</CardTitle>
//             <BookmarkIcon className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{savedJobsCount}</div>
//             <p className="text-xs text-muted-foreground">Công việc quan tâm</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Việc làm mới</CardTitle>
//             <Briefcase className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{activeJobsCount || 0}</div>
//             <p className="text-xs text-muted-foreground">Đang tuyển dụng</p>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Số lượng CV</CardTitle>
//             <TrendingUp className="h-4 w-4 text-muted-foreground" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{cvsCount}</div>
//             <p className="text-xs text-muted-foreground">CV đã tạo</p>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         {/* CV Management Section */}
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between">
//             <div>
//               <CardTitle>Quản lý CV</CardTitle>
//               <CardDescription>
//                 {cvsCount > 0
//                   ? `Bạn có ${cvsCount} CV - ${cvs.filter(cv => cv.is_default).length} CV mặc định`
//                   : "Tạo CV đầu tiên để bắt đầu ứng tuyển"}
//               </CardDescription>
//             </div>
//             <Button asChild size="sm">
//               <Link href="/applicant/cvs/new">
//                 <Plus className="h-4 w-4 mr-1" />
//                 Tạo CV mới
//               </Link>
//             </Button>
//           </CardHeader>
//           <CardContent>
//             {cvs.length > 0 ? (
//               <div className="space-y-3">
//                 {cvs.map((cv) => (
//                   <div key={cv.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
//                     <div className="flex items-center gap-3">
//                       <FileText className="h-5 w-5 text-muted-foreground" />
//                       <div>
//                         <p className="font-medium text-sm">{cv.name}</p>
//                         <div className="flex items-center gap-2 mt-1">
//                           {cv.is_default && (
//                             <Badge variant="secondary" className="text-xs">
//                               <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
//                               Mặc định
//                             </Badge>
//                           )}
//                           <p className="text-xs text-muted-foreground">
//                             Cập nhật: {new Date(cv.updated_at).toLocaleDateString("vi-VN")}
//                           </p>
//                         </div>
//                       </div>
//                     </div>
//                     <div className="flex gap-1">
//                       <Button asChild variant="ghost" size="sm">
//                         <Link href={`/applicant/cvs/${cv.id}/edit`}>
//                           <Eye className="h-4 w-4" />
//                         </Link>
//                       </Button>
//                     </div>
//                   </div>
//                 ))}

//                 {cvsCount >= 3 && (
//                   <Button asChild variant="outline" className="w-full mt-2">
//                     <Link href="/applicant/cvs">
//                       Xem tất cả CV
//                     </Link>
//                   </Button>
//                 )}
//               </div>
//             ) : (
//               <div className="text-center py-6 space-y-4">
//                 <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
//                 <div>
//                   <p className="text-muted-foreground mb-2">Bạn chưa có CV nào</p>
//                   <p className="text-sm text-muted-foreground mb-4">
//                     Tạo CV chuyên nghiệp để tăng cơ hội được tuyển dụng
//                   </p>
//                 </div>
//                 <Button asChild>
//                   <Link href="/applicant/cvs/new">
//                     <Plus className="h-4 w-4 mr-2" />
//                     Tạo CV đầu tiên
//                   </Link>
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>

//         {/* Profile Completion */}
//         {!applicantProfile ? (
//           <Card className="border-yellow-200 bg-yellow-50">
//             <CardHeader>
//               <CardTitle>Hoàn thiện hồ sơ</CardTitle>
//               <CardDescription>
//                 Hồ sơ của bạn chưa được tạo. Vui lòng hoàn thiện để tăng cơ hội tìm việc.
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <Button asChild>
//                 <Link href="/applicant/profile">Tạo hồ sơ ngay</Link>
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           <Card>
//             <CardHeader>
//               <CardTitle>Điểm CV & AI Phân tích</CardTitle>
//               <CardDescription>
//                 {applicantProfile.resume_score
//                   ? `CV của bạn đạt ${applicantProfile.resume_score}/100 điểm`
//                   : "Nhận phân tích AI để cải thiện CV"}
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {applicantProfile.resume_score ? (
//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm font-medium">Điểm chất lượng CV</span>
//                     <span className="text-2xl font-bold text-primary">{applicantProfile.resume_score}/100</span>
//                   </div>
//                   <div className="w-full bg-secondary rounded-full h-2">
//                     <div
//                       className="bg-primary h-2 rounded-full transition-all"
//                       style={{ width: `${applicantProfile.resume_score}%` }}
//                     />
//                   </div>
//                   <p className="text-xs text-muted-foreground">
//                     {applicantProfile.resume_score >= 80
//                       ? "CV của bạn rất tốt! Tiếp tục duy trì"
//                       : applicantProfile.resume_score >= 60
//                       ? "CV khá tốt, có thể cải thiện thêm"
//                       : "Cần cải thiện CV để tăng cơ hội"}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="text-center py-2">
//                   <p className="text-sm text-muted-foreground mb-3">
//                     Sử dụng AI để phân tích và cải thiện CV của bạn
//                   </p>
//                 </div>
//               )}

//               <div className="grid grid-cols-2 gap-2">
//                 <Button asChild variant="outline" size="sm">
//                   <Link href="/applicant/profile">
//                     <TrendingUp className="h-4 w-4 mr-1" />
//                     Phân tích CV
//                   </Link>
//                 </Button>
//                 <Button asChild size="sm">
//                   <Link href="/applicant/cvs/new">
//                     <Plus className="h-4 w-4 mr-1" />
//                     Tạo CV mới
//                   </Link>
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         )}
//       </div>

//       {/* Recent Applications */}
//       <Card>
//         <CardHeader>
//           <CardTitle>Đơn ứng tuyển gần đây</CardTitle>
//           <CardDescription>Theo dõi trạng thái đơn ứng tuyển của bạn</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {recentApplications && recentApplications.length > 0 ? (
//             <div className="space-y-4">
//               {recentApplications.map((app: any) => (
//                 <div key={app.id} className="flex items-center justify-between border-b pb-4 last:border-0">
//                   <div>
//                     <p className="font-medium">{app.job_postings?.title}</p>
//                     <p className="text-sm text-muted-foreground">{app.job_postings?.employer_profiles?.company_name}</p>
//                   </div>
//                   <div className="text-right">
//                     <span
//                       className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
//                         app.status === "pending"
//                           ? "bg-yellow-100 text-yellow-800"
//                           : app.status === "reviewing"
//                             ? "bg-blue-100 text-blue-800"
//                             : app.status === "interview"
//                               ? "bg-purple-100 text-purple-800"
//                               : app.status === "offered"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-gray-100 text-gray-800"
//                       }`}
//                     >
//                       {app.status === "pending"
//                         ? "Chờ xử lý"
//                         : app.status === "reviewing"
//                           ? "Đang xem xét"
//                           : app.status === "interview"
//                             ? "Phỏng vấn"
//                             : app.status === "offered"
//                               ? "Nhận offer"
//                               : app.status}
//                     </span>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {new Date(app.applied_at).toLocaleDateString("vi-VN")}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//               <Button asChild variant="outline" className="w-full bg-transparent">
//                 <Link href="/applicant/applications">Xem tất cả</Link>
//               </Button>
//             </div>
//           ) : (
//             <div className="text-center py-8">
//               <p className="text-muted-foreground mb-4">Bạn chưa có đơn ứng tuyển nào</p>
//               <Button asChild>
//                 <Link href="/applicant/jobs">Tìm việc ngay</Link>
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>

//   )
// }

import { createClient } from "@/lib/supabase/server";
import {
  Briefcase,
  FileText,
  BookmarkIcon,
  TrendingUp,
  Plus,
  Star,
  Eye,
} from "lucide-react";
import Link from "next/link";
import styles from "../../../styles/ApplicantDashboard.module.css";
import { AIJobRecommendations } from "@/components/applicant/ai-job-recommendations";

export default async function ApplicantDashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Get applicant profile
  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  // Get statistics
  let applicationsCount = 0;
  let savedJobsCount = 0;
  let recentApplications: any[] = [];
  let cvsCount = 0;

  if (applicantProfile?.id) {
    const { count: appCount } = await supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", applicantProfile.id);

    const { count: savedCount } = await supabase
      .from("saved_jobs")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", applicantProfile.id);

    const { count: cvCount } = await supabase
      .from("applicant_cvs")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", applicantProfile.id);

    applicationsCount = appCount || 0;
    savedJobsCount = savedCount || 0;
    cvsCount = cvCount || 0;

    // Get recent applications
    const { data: apps } = await supabase
      .from("job_applications")
      .select(
        `
        *,
        job_postings (
          title,
          employer_profiles (
            company_name
          )
        )
      `
      )
      .eq("applicant_id", applicantProfile.id)
      .order("applied_at", { ascending: false })
      .limit(5);

    recentApplications = apps || [];
  }

  // Lấy danh sách CV của ứng viên
  let cvs: any[] = [];
  if (applicantProfile?.id) {
    const { data: cvData } = await supabase
      .from("applicant_cvs")
      .select("id, name, is_default, created_at, updated_at")
      .eq("applicant_id", applicantProfile.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(3);

    cvs = cvData || [];
  }

  const { count: activeJobsCount } = await supabase
    .from("job_postings")
    .select("*", { count: "exact", head: true })
    .eq("is_active", true);

  return (
    <>
      <section className={styles.sectionBox}>
        <div className="container">
       
          {/* <div className={styles.boxHeading}>
            <h3 className="text-32">Tổng quan</h3>
            <p className="text-md color-text-paragraph">Chào mừng trở lại!</p>
          </div> */}

          {/* ==== Thống kê ==== */}
          <div className="row mt-30">
            <div className="col-lg-3 col-md-6">
              <div className={styles.cardGrid}>
                <div className={styles.cardIcon}>
                  <FileText size={28} />
                </div>
                <h4 className={styles.cardTitle}>{applicationsCount}</h4>
                <p className={styles.cardSubtitle}>Đơn ứng tuyển</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className={styles.cardGrid}>
                <div className={styles.cardIcon}>
                  <BookmarkIcon size={28} />
                </div>
                <h4 className={styles.cardTitle}>{savedJobsCount}</h4>
                <p className={styles.cardSubtitle}>Việc làm đã lưu</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className={styles.cardGrid}>
                <div className={styles.cardIcon}>
                  <Briefcase size={28} />
                </div>
                <h4 className={styles.cardTitle}>{activeJobsCount || 0}</h4>
                <p className={styles.cardSubtitle}>Việc làm mới</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-6">
              <div className={styles.cardGrid}>
                <div className={styles.cardIcon}>
                  <TrendingUp size={28} />
                </div>
                <h4 className={styles.cardTitle}>{cvsCount}</h4>
                <p className={styles.cardSubtitle}>Số lượng CV</p>
              </div>
            </div>
          </div>
             <AIJobRecommendations 
        applicantId={applicantProfile.id} 
        autoLoad={true}
        limit={6}
      />
          {/* ==== Quản lý CV ==== */}
          <div className="row mt-40">
            <div className="col-lg-6">
              <div className={styles.cardGrid}>
                <div className="d-flex justify-between items-center mb-20">
                  <div>
                    <h5>Quản lý CV</h5>
                    <p className="text-sm color-text-mutted">
                      {cvsCount > 0
                        ? `Bạn có ${cvsCount} CV - ${
                            cvs.filter((cv) => cv.is_default).length
                          } CV mặc định`
                        : "Tạo CV đầu tiên để bắt đầu ứng tuyển"}
                    </p>
                  </div>
                  <Link href="/applicant/cvs/new" className={styles.btnPrimary}>
                    <Plus size={16} className="mr-5" /> Tạo CV mới
                  </Link>
                </div>

                {cvs.length > 0 ? (
                  <div className={styles.cvList}>
                    {cvs.map((cv) => (
                      <div key={cv.id} className={styles.cvItem}>
                        <div>
                          <h6 className={styles.cvName}>{cv.name}</h6>
                          <p className={styles.cvDate}>
                            Cập nhật:{" "}
                            {new Date(cv.updated_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {cv.is_default && (
                            <span className={styles.btnTag}>
                              <Star size={12} /> Mặc định
                            </span>
                          )}
                          <Link
                            href={`/applicant/cvs/${cv.id}/edit`}
                            className={styles.btnOutline}
                          >
                            <Eye size={14} className="mr-5" /> Xem
                          </Link>
                        </div>
                      </div>
                    ))}

                    {cvsCount >= 3 && (
                      <div className="text-center mt-20">
                        <Link
                          href="/applicant/cvs"
                          className={styles.btnOutline}
                        >
                          Xem tất cả CV
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <FileText size={40} className="text-gray-400 mb-10" />
                    <p className="text-sm text-gray-500 mb-15">
                      Bạn chưa có CV nào. Hãy tạo CV đầu tiên của bạn.
                    </p>
                    <Link
                      href="/applicant/cvs/new"
                      className={styles.btnPrimary}
                    >
                      <Plus size={16} className="mr-5" /> Tạo CV đầu tiên
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* ==== Điểm CV & Hồ sơ ==== */}
            <div className="col-lg-6">
              <div className={styles.cardGrid}>
                <h5>Điểm CV & Phân tích AI</h5>
                <p className="text-sm text-gray-500 mb-15">
                  {applicantProfile?.resume_score
                    ? `CV của bạn đạt ${applicantProfile.resume_score}/100 điểm`
                    : "Chưa có điểm. Hãy để AI phân tích CV của bạn."}
                </p>

                {applicantProfile?.resume_score && (
                  <div className={styles.progressWrapper}>
                    <div className="d-flex justify-between mb-10">
                      <span className="text-sm">Điểm CV</span>
                      <span className="text-20 font-bold color-brand-2">
                        {applicantProfile.resume_score}/100
                      </span>
                    </div>
                    <div className={styles.progressOuter}>
                      <div
                        className={styles.progressInner}
                        style={{ width: `${applicantProfile.resume_score}%` }}
                      >
                        {applicantProfile.resume_score}%
                      </div>
                    </div>
                  </div>
                )}

                <div className="d-flex justify-between mt-20 gap-2">
                  <Link href="/applicant/profile" className={styles.btnOutline}>
                    <TrendingUp size={16} className="mr-5" />
                    Phân tích CV
                  </Link>
                  <Link href="/applicant/cvs/new" className={styles.btnPrimary}>
                    <Plus size={16} className="mr-5" />
                    Tạo CV mới
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ==== Đơn ứng tuyển gần đây ==== */}
          <div className="row mt-40">
            <div className="col-lg-12">
              <div className={styles.cardGrid}>
                <h5 className="text-lg font-semibold mb-4">
                  Đơn ứng tuyển gần đây
                </h5>

                {recentApplications?.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {recentApplications.map((app) => (
                      <div key={app.id} className={styles.appItem}>
                        <div>
                          <h6 className={styles.appTitle}>
                            {app.job_postings?.title}
                          </h6>
                          <p className={styles.appCompany}>
                            {app.job_postings?.employer_profiles?.company_name}
                          </p>
                        </div>

                        <div className="mt-3 flex flex-col items-end">
                          <span
                            className={`${styles.appStatus} ${
                              app.status === "pending"
                                ? styles.statusPending
                                : app.status === "reviewing"
                                ? styles.statusReviewing
                                : app.status === "interview"
                                ? styles.statusInterview
                                : app.status === "offered"
                                ? styles.statusOffered
                                : styles.statusDefault
                            }`}
                          >
                            {app.status === "pending"
                              ? "Chờ xử lý"
                              : app.status === "reviewing"
                              ? "Đang xem xét"
                              : app.status === "interview"
                              ? "Phỏng vấn"
                              : app.status === "offered"
                              ? "Nhận offer"
                              : app.status}
                          </span>
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(app.applied_at).toLocaleDateString(
                              "vi-VN"
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-30">
                    <p className="text-md text-gray-500 mb-20">
                      Bạn chưa có đơn ứng tuyển nào
                    </p>
                    <Link href="/applicant/jobs" className={styles.btnPrimary}>
                      Tìm việc ngay
                    </Link>
                  </div>
                )}

                {recentApplications?.length > 0 && (
                  <div className="text-center mt-10">
                    <Link
                      href="/applicant/applications"
                      className={styles.btnOutline}
                    >
                      Xem tất cả đơn ứng tuyển
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
