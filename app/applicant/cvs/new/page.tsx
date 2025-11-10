
// import { createClient } from "@/lib/supabase/server"
// import { redirect } from "next/navigation"
// import { TemplateList } from "@/components/applicant/template-list"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { ArrowLeft, Sparkles } from "lucide-react"
// import Link from "next/link"

// export default async function NewCVPage({
//   searchParams,
// }: {
//   searchParams: Promise<{ template?: string }>
// }) {
//   const { template } = await searchParams
//   const supabase = await createClient()
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (!user) {
//     redirect("/auth/login")
//   }

//   const { data: applicantProfile } = await supabase
//     .from("applicant_profiles")
//     .select("*")
//     .eq("user_id", user.id)
//     .single()

//   if (!applicantProfile) {
//     redirect("/applicant/profile")
//   }

//   // Lấy tất cả templates
//   const { data: templates } = await supabase
//     .from("cv_templates")
//     .select("*")
//     .eq("is_active", true)
//     .order("created_at", { ascending: true })

//   // Lấy template được chọn (nếu có)
//   const { data: selectedTemplate } = template
//     ? await supabase.from("cv_templates").select("*").eq("id", template).single()
//     : { data: null }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button asChild variant="outline" size="sm">
//           <Link href="/applicant/cvs">
//             <ArrowLeft className="w-4 h-4 mr-2" />
//             Quay lại
//           </Link>
//         </Button>
//         <div>
//           <h1 className="text-3xl font-bold flex items-center gap-2">
//             <Sparkles className="w-8 h-8 text-primary" />
//             Chọn Template CV
//           </h1>
//           <p className="text-muted-foreground">
//             {selectedTemplate 
//               ? `Đã chọn: ${selectedTemplate.name}` 
//               : "Chọn template phù hợp để tạo CV chuyên nghiệp. Bấm vào template để xem trước chi tiết."
//             }
//           </p>
//         </div>
//       </div>

//       {selectedTemplate ? (
//         <div className="grid gap-6 lg:grid-cols-3">
//           <div className="lg:col-span-2">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Bắt đầu tạo CV với {selectedTemplate.name}</CardTitle>
//                 <CardDescription>
//                   {selectedTemplate.description}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="flex gap-4">
//                   <Button asChild>
//                     <Link href={`/applicant/cvs/create?template=${selectedTemplate.id}`}>
//                       Tạo CV với template này
//                     </Link>
//                   </Button>
//                   <Button asChild variant="outline">
//                     <Link href="/applicant/cvs/new">
//                       Chọn template khác
//                     </Link>
//                   </Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//           <div>
//             <Card>
//               <CardHeader>
//                 <CardTitle>Thông tin template</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-3">
//                 <div>
//                   <span className="font-medium">Layout:</span>
//                   <span className="ml-2 text-muted-foreground capitalize">
//                     {selectedTemplate.template_data?.layout}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="font-medium">Màu sắc:</span>
//                   <div className="flex gap-2 mt-1">
//                     <div
//                       className="w-6 h-6 rounded border"
//                       style={{ backgroundColor: selectedTemplate.template_data?.colors?.primary }}
//                     />
//                     <div
//                       className="w-6 h-6 rounded border"
//                       style={{ backgroundColor: selectedTemplate.template_data?.colors?.secondary }}
//                     />
//                   </div>
//                 </div>
//                 <div>
//                   <span className="font-medium">Số section:</span>
//                   <span className="ml-2 text-muted-foreground">
//                     {selectedTemplate.template_data?.sections?.length}
//                   </span>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       ) : (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Sparkles className="w-5 h-5 text-primary" />
//               Templates có sẵn
//             </CardTitle>
//             <CardDescription>
//               Chọn template phù hợp với ngành nghề và phong cách của bạn. 
//               Bấm vào "Xem trước" để xem template với dữ liệu mẫu.
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <TemplateList 
//               templates={templates || []} 
//               mode="preview"
//               showActions={true}
//             />
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }


// app/applicant/cvs/new/page.tsx
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateList } from "@/components/applicant/template-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import styles from '../../../../styles/NewCVPage.module.css'

export default async function NewCVPage({
  searchParams,
}: {
  searchParams: Promise<{ template?: string }>
}) {
  const { template } = await searchParams
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single()

  if (!applicantProfile) {
    redirect("/applicant/profile")
  }

  // Lấy tất cả templates
  const { data: templates } = await supabase
    .from("cv_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  // Lấy template được chọn (nếu có)
  const { data: selectedTemplate } = template
    ? await supabase.from("cv_templates").select("*").eq("id", template).single()
    : { data: null }

  return (
    <div className={styles.container}>
        <div className="breadcrumbs">
            <ul>
              <li>
                <Link  style={{  fontSize: "12px" }} href="/applicant/dashboard" className="home-icon">
                  Dashboard
                </Link>
              </li>
              <li>
                <span style={{  fontSize: "12px" }}>Select Template </span>
              </li>
            </ul>
          </div>
      {/* <div className={styles.headerSection}>
        <Link href="/applicant/cvs" className={styles.backButton}>
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Link>
        <div className={styles.titleSection}>
          <h1 className={styles.mainTitle}>
            <Sparkles className={styles.titleIcon} />
            Chọn Template CV
          </h1>
          <p className={styles.subtitle}>
            {selectedTemplate 
              ? `Đã chọn: ${selectedTemplate.name}` 
              : "Chọn template phù hợp để tạo CV chuyên nghiệp. Bấm vào template để xem trước chi tiết."
            }
          </p>
        </div>
      </div> */}

      {selectedTemplate ? (
        <div className={styles.selectedTemplateLayout}>
          <div className={styles.templatePreviewCard}>
            <div className={styles.templatePreviewHeader}>
              <h2 className={styles.templatePreviewTitle}>Bắt đầu tạo CV với {selectedTemplate.name}</h2>
              <p className={styles.templatePreviewDescription}>
                {selectedTemplate.description}
              </p>
            </div>
            <div className={styles.templatePreviewContent}>
              <div className={styles.actionButtons}>
                <Link 
                  href={`/applicant/cvs/create?template=${selectedTemplate.id}`}
                  className={styles.primaryButton}
                >
                  Tạo CV với template này
                </Link>
                <Link 
                  href="/applicant/cvs/new"
                  className={styles.secondaryButton}
                >
                  Chọn template khác
                </Link>
              </div>
            </div>
          </div>
          
          <div className={styles.templateInfoCard}>
            <div className={styles.templateInfoHeader}>
              <h3 className={styles.templateInfoTitle}>Thông tin template</h3>
            </div>
            <div className={styles.templateInfoContent}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Layout:</span>
                <span className={styles.infoValue}>
                  {selectedTemplate.template_data?.layout || "Chưa xác định"}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Màu sắc:</span>
                <div className={styles.colorPreview}>
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: selectedTemplate.template_data?.colors?.primary || "#3c65f5" }}
                  />
                  <div
                    className={styles.colorSwatch}
                    style={{ backgroundColor: selectedTemplate.template_data?.colors?.secondary || "#05264e" }}
                  />
                </div>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Số section:</span>
                <span className={styles.infoValue}>
                  {selectedTemplate.template_data?.sections?.length || 0}
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Độ khó:</span>
                <span className={styles.infoValue}>
                  {selectedTemplate.template_data?.difficulty || "Trung bình"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.templateListLayout}>
          <div className={styles.templateListHeader}>
            <h2 className={styles.templateListTitle}>
              <Sparkles className="w-5 h-5" />
              Templates có sẵn
            </h2>
            <p className={styles.templateListDescription}>
              Chọn template phù hợp với ngành nghề và phong cách của bạn. 
              Bấm vào "Xem trước" để xem template với dữ liệu mẫu.
            </p>
          </div>
          <div className={styles.templateListContent}>
            <TemplateList 
              templates={templates || []} 
              mode="preview"
              showActions={true}
            />
          </div>
        </div>
      )}
    </div>
  )
}