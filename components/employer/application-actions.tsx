// "use client"

// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import { 
//   Eye, 
//   MessageSquare, 
//   Mail, 
//   FileText,
//   Download,
//   MoreVertical,
//   Calendar,
//   Star,
//   Share2
// } from "lucide-react"
// import { createClient } from "@/lib/supabase/client"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"
// import Link from "next/link"

// export function ApplicationActions({ 
//   application,
//   employerId 
// }: { 
//   application: any
//   employerId: string
// }) {
//   const router = useRouter()
//   const supabase = createClient()

//   const handleViewCV = async () => {
//     // Ghi log xem CV
//     await supabase.from("application_logs").insert({
//       application_id: application.id,
//       action: "view_cv",
//       actor_id: employerId,
//       metadata: {
//         timestamp: new Date().toISOString(),
//         cv_url: application.cv_url
//       }
//     })

//     // Cập nhật trạng thái nếu đang là pending
//     if (application.status === "pending") {
//       await supabase
//         .from("job_applications")
//         .update({ 
//           status: "reviewing",
//           updated_at: new Date().toISOString()
//         })
//         .eq("id", application.id)
      
//       router.refresh()
//     }

//     window.open(application.cv_url, '_blank')
//   }

//   const handleSendEmail = async (type: string) => {
//     try {
//       await supabase.from("email_queue").insert({
//         type,
//         application_id: application.id,
//         data: {
//           applicant_name: application.profiles.full_name,
//           applicant_email: application.profiles.email,
//           job_title: application.job_postings.title
//         },
//         status: "pending"
//       })

//       toast.success("Email đã được thêm vào hàng đợi")
//     } catch (error) {
//       toast.error("Có lỗi xảy ra")
//     }
//   }

//   const handleBookmark = async () => {
//     try {
//       const { error } = await supabase
//         .from("bookmarked_applications")
//         .upsert({
//           application_id: application.id,
//           employer_id: employerId,
//           bookmarked_at: new Date().toISOString()
//         })

//       if (error) throw error
//       toast.success("Đã lưu ứng viên vào danh sách yêu thích")
//     } catch (error) {
//       toast.error("Có lỗi xảy ra")
//     }
//   }

//   return (
//     <div className="flex flex-wrap gap-2">
//       {/* Nút chính */}
//       <Button 
//         variant="default" 
//         size="sm"
//         onClick={handleViewCV}
//         className="gap-2"
//       >
//         <Eye className="w-4 h-4" />
//         Xem CV
//       </Button>

//       <Button 
//         variant="outline" 
//         size="sm"
//         asChild
//         className="gap-2"
//       >
//         <Link href={`/employer/applications/${application.id}`}>
//           <FileText className="w-4 h-4" />
//           Chi tiết
//         </Link>
//       </Button>

//       <Button 
//         variant="outline" 
//         size="sm"
//         asChild
//         className="gap-2"
//       >
//         <Link href={`/employer/messages?applicant=${application.applicant_id}`}>
//           <MessageSquare className="w-4 h-4" />
//           Nhắn tin
//         </Link>
//       </Button>

//       {/* Dropdown menu cho các hành động khác */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button variant="ghost" size="sm">
//             <MoreVertical className="w-4 h-4" />
//           </Button>
//         </DropdownMenuTrigger>
        
//         <DropdownMenuContent align="end">
//           <DropdownMenuItem onClick={() => handleSendEmail("interview_invitation")}>
//             <Mail className="w-4 h-4 mr-2" />
//             Gửi email mời phỏng vấn
//           </DropdownMenuItem>
          
//           <DropdownMenuItem onClick={() => handleSendEmail("test_assignment")}>
//             <FileText className="w-4 h-4 mr-2" />
//             Gửi bài test
//           </DropdownMenuItem>
          
//           <DropdownMenuItem onClick={handleBookmark}>
//             <Star className="w-4 h-4 mr-2" />
//             Lưu vào yêu thích
//           </DropdownMenuItem>
          
//           <DropdownMenuItem onClick={() => window.open(application.cv_url, '_blank')}>
//             <Download className="w-4 h-4 mr-2" />
//             Tải CV về
//           </DropdownMenuItem>
          
//           <DropdownMenuItem>
//             <Share2 className="w-4 h-4 mr-2" />
//             Chia sẻ với đồng nghiệp
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   )
// }

"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Eye, 
  MessageSquare, 
  Mail, 
  FileText,
  Download,
  MoreVertical,
  Calendar,
  Star,
  Share2,
  ShieldAlert
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Link from "next/link"

export function ApplicationActions({ 
  application,
  employerId,
  isSpam = false // Thêm prop isSpam với giá trị mặc định
}: { 
  application: any
  employerId: string
  isSpam?: boolean // Khai báo prop isSpam là optional
}) {
  const router = useRouter()
  const supabase = createClient()

  const handleViewCV = async () => {
    // Ghi log xem CV
    await supabase.from("application_logs").insert({
      application_id: application.id,
      action: "view_cv",
      actor_id: employerId,
      metadata: {
        timestamp: new Date().toISOString(),
        cv_url: application.cv_url
      }
    })

    // Cập nhật trạng thái nếu đang là pending
    if (application.status === "pending") {
      await supabase
        .from("job_applications")
        .update({ 
          status: "reviewing",
          updated_at: new Date().toISOString()
        })
        .eq("id", application.id)
      
      router.refresh()
    }

    window.open(application.cv_url, '_blank')
  }

  const handleSendEmail = async (type: string) => {
    try {
      // Lấy thông tin ứng viên
      const applicantName = application.profiles?.full_name || 
                           application.applicant_profiles?.cv_parsed_data?.full_name || 
                           "Ứng viên"
      const applicantEmail = application.profiles?.email || 
                            application.applicant_profiles?.cv_parsed_data?.email || 
                            ""
      
      await supabase.from("email_queue").insert({
        type,
        application_id: application.id,
        data: {
          applicant_name: applicantName,
          applicant_email: applicantEmail,
          job_title: application.job_postings?.title || "Công việc"
        },
        status: "pending"
      })

      toast.success("Email đã được thêm vào hàng đợi")
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleBookmark = async () => {
    try {
      const { error } = await supabase
        .from("bookmarked_applications")
        .upsert({
          application_id: application.id,
          employer_id: employerId,
          bookmarked_at: new Date().toISOString()
        })

      if (error) throw error
      toast.success("Đã lưu ứng viên vào danh sách yêu thích")
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  // Nếu là spam, hiển thị các hành động khác
  if (isSpam) {
    return (
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2"
          onClick={() => {
            // Hành động xem lại CV spam
            window.open(application.cv_url, '_blank')
          }}
        >
          <ShieldAlert className="w-4 h-4" />
          Xem CV (Spam)
        </Button>

        <Button 
          variant="destructive" 
          size="sm"
          className="gap-2"
          onClick={async () => {
            try {
              const { error } = await supabase
                .from("job_applications")
                .update({ 
                  is_spam: false,
                  cv_quality: 'medium',
                  updated_at: new Date().toISOString()
                })
                .eq("id", application.id)

              if (error) throw error
              toast.success("Đã bỏ đánh dấu spam")
              router.refresh()
            } catch (error) {
              toast.error("Có lỗi xảy ra")
            }
          }}
        >
          <ShieldAlert className="w-4 h-4" />
          Bỏ đánh dấu spam
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* Nút chính */}
      <Button 
        variant="default" 
        size="sm"
        onClick={handleViewCV}
        className="gap-2"
      >
        <Eye className="w-4 h-4" />
        Xem CV
      </Button>

      <Button 
        variant="outline" 
        size="sm"
        asChild
        className="gap-2"
      >
        <Link href={`/employer/applications/${application.id}`}>
          <FileText className="w-4 h-4" />
          Chi tiết
        </Link>
      </Button>

      <Button 
        variant="outline" 
        size="sm"
        asChild
        className="gap-2"
      >
        <Link href={`/employer/messages?applicant=${application.applicant_id}`}>
          <MessageSquare className="w-4 h-4" />
          Nhắn tin
        </Link>
      </Button>

      {/* Dropdown menu cho các hành động khác */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleSendEmail("interview_invitation")}>
            <Mail className="w-4 h-4 mr-2" />
            Gửi email mời phỏng vấn
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => handleSendEmail("test_assignment")}>
            <FileText className="w-4 h-4 mr-2" />
            Gửi bài test
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleBookmark}>
            <Star className="w-4 h-4 mr-2" />
            Lưu vào yêu thích
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => window.open(application.cv_url, '_blank')}>
            <Download className="w-4 h-4 mr-2" />
            Tải CV về
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Share2 className="w-4 h-4 mr-2" />
            Chia sẻ với đồng nghiệp
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}