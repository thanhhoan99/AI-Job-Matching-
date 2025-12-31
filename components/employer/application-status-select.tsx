// "use client"

// import { useState } from "react"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { createClient } from "@/lib/supabase/client"
// import { useRouter } from "next/navigation"

// interface ApplicationStatusSelectProps {
//   applicationId: string
//   currentStatus: string
// }

// export function ApplicationStatusSelect({ applicationId, currentStatus }: ApplicationStatusSelectProps) {
//   const [status, setStatus] = useState(currentStatus)
//   const [isLoading, setIsLoading] = useState(false)
//   const router = useRouter()
//   const supabase = createClient()

//   const handleStatusChange = async (newStatus: string) => {
//     setIsLoading(true)
//     try {
//       const { error } = await supabase.from("job_applications").update({ status: newStatus }).eq("id", applicationId)

//       if (error) throw error

//       setStatus(newStatus)
//       router.refresh()
//     } catch (error: any) {
//       alert(error.message)
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const getStatusLabel = (status: string) => {
//     const labels: Record<string, string> = {
//       pending: "Chờ xử lý",
//       reviewing: "Đang xem xét",
//       interview: "Phỏng vấn",
//       offered: "Đã offer",
//       rejected: "Từ chối",
//       accepted: "Đã chấp nhận",
//       withdrawn: "Đã rút",
//     }
//     return labels[status] || status
//   }

//   return (
//     <Select value={status} onValueChange={handleStatusChange} disabled={isLoading}>
//       <SelectTrigger className="w-[180px]">
//         <SelectValue>{getStatusLabel(status)}</SelectValue>
//       </SelectTrigger>
//       <SelectContent>
//         <SelectItem value="pending">Chờ xử lý</SelectItem>
//         <SelectItem value="reviewing">Đang xem xét</SelectItem>
//         <SelectItem value="interview">Phỏng vấn</SelectItem>
//         <SelectItem value="offered">Đã offer</SelectItem>
//         <SelectItem value="rejected">Từ chối</SelectItem>
//         <SelectItem value="accepted">Đã chấp nhận</SelectItem>
//       </SelectContent>
//     </Select>
//   )
// }



// "use client"

// import { useState } from "react"
// import { 
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
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
// import { Textarea } from "@/components/ui/textarea"
// import { Label } from "@/components/ui/label"
// import { 
//   Clock, 
//   Eye, 
//   MessageSquare, 
//   CheckCircle, 
//   XCircle,
//   Send,
//   Calendar,
//   Mail
// } from "lucide-react"
// import { createClient } from "@/lib/supabase/client"
// import { useRouter } from "next/navigation"
// import { toast } from "sonner"

// const statusOptions = [
//   { value: "pending", label: "Mới nộp", icon: Clock, color: "bg-gray-100 text-gray-800" },
//   { value: "reviewing", label: "Đang xem xét", icon: Eye, color: "bg-blue-100 text-blue-800" },
//   { value: "interview", label: "Mời phỏng vấn", icon: MessageSquare, color: "bg-purple-100 text-purple-800" },
//   { value: "offered", label: "Đề nghị", icon: Send, color: "bg-green-100 text-green-800" },
//   { value: "accepted", label: "Đã nhận", icon: CheckCircle, color: "bg-green-100 text-green-800" },
//   { value: "rejected", label: "Không phù hợp", icon: XCircle, color: "bg-red-100 text-red-800" },
//   { value: "withdrawn", label: "Đã rút", icon: XCircle, color: "bg-yellow-100 text-yellow-800" },
// ]

// export function ApplicationStatusSelect({ 
//   applicationId, 
//   currentStatus,
//   employerId 
// }: { 
//   applicationId: string
//   currentStatus: string
//   employerId: string
// }) {
//   const [status, setStatus] = useState(currentStatus)
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [interviewDate, setInterviewDate] = useState("")
//   const [interviewTime, setInterviewTime] = useState("")
//   const [notes, setNotes] = useState("")
//   const [sendEmail, setSendEmail] = useState(true)
  
//   const router = useRouter()
//   const supabase = createClient()

//   const currentStatusOption = statusOptions.find(opt => opt.value === status)
//   const Icon = currentStatusOption?.icon || Clock

//   const handleStatusChange = async (newStatus: string) => {
//     setLoading(true)
    
//     try {
//       const { error } = await supabase
//         .from("job_applications")
//         .update({ 
//           status: newStatus,
//           updated_at: new Date().toISOString(),
//           notes: notes ? notes : undefined
//         })
//         .eq("id", applicationId)

//       if (error) throw error

//       // Ghi log hành động
//       await supabase.from("application_logs").insert({
//         application_id: applicationId,
//         action: `status_changed_to_${newStatus}`,
//         actor_id: employerId,
//         metadata: {
//           old_status: status,
//           new_status: newStatus,
//           notes,
//           timestamp: new Date().toISOString()
//         }
//       })

//       // Nếu là mời phỏng vấn và có chọn gửi email
//       if (newStatus === "interview" && sendEmail) {
//         await sendInterviewEmail()
//       }

//       // Nếu là từ chối và có ghi chú
//       if (newStatus === "rejected" && notes) {
//         await sendRejectionEmail()
//       }

//       setStatus(newStatus)
//       toast.success("Cập nhật trạng thái thành công")
      
//       // Refresh data
//       router.refresh()
//       setOpen(false)
      
//     } catch (error) {
//       console.error("Error updating status:", error)
//       toast.error("Có lỗi xảy ra khi cập nhật trạng thái")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const sendInterviewEmail = async () => {
//     // Logic gửi email mời phỏng vấn
//     const interviewDateTime = `${interviewDate} ${interviewTime}`
    
//     await supabase.from("email_queue").insert({
//       type: "interview_invitation",
//       application_id: applicationId,
//       data: {
//         interview_date: interviewDateTime,
//         location: "Công ty hoặc Online",
//         notes: notes
//       },
//       status: "pending"
//     })

//     toast.success("Email mời phỏng vấn đã được gửi")
//   }

//   const sendRejectionEmail = async () => {
//     // Logic gửi email từ chối
//     await supabase.from("email_queue").insert({
//       type: "rejection",
//       application_id: applicationId,
//       data: {
//         rejection_reason: notes
//       },
//       status: "pending"
//     })

//     toast.success("Email thông báo đã được gửi")
//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button variant="outline" className="gap-2">
//           <Icon className="w-4 h-4" />
//           <span>{currentStatusOption?.label}</span>
//         </Button>
//       </DialogTrigger>
      
//       <DialogContent className="sm:max-w-[500px]">
//         <DialogHeader>
//           <DialogTitle>Thay đổi trạng thái ứng viên</DialogTitle>
//           <DialogDescription>
//             Cập nhật trạng thái và thực hiện các hành động tiếp theo
//           </DialogDescription>
//         </DialogHeader>

//         <div className="space-y-4 py-4">
//           {/* Chọn trạng thái mới */}
//           <div className="space-y-2">
//             <Label>Trạng thái mới</Label>
//             <Select value={status} onValueChange={setStatus}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Chọn trạng thái" />
//               </SelectTrigger>
//               <SelectContent>
//                 {statusOptions.map((option) => (
//                   <SelectItem key={option.value} value={option.value}>
//                     <div className="flex items-center gap-2">
//                       <option.icon className="w-4 h-4" />
//                       <span>{option.label}</span>
//                     </div>
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Ghi chú */}
//           <div className="space-y-2">
//             <Label>Ghi chú nội bộ</Label>
//             <Textarea 
//               placeholder="Ghi chú về ứng viên (chỉ HR thấy)"
//               value={notes}
//               onChange={(e) => setNotes(e.target.value)}
//               rows={3}
//             />
//           </div>

//           {/* Các trường bổ sung theo trạng thái */}
//           {status === "interview" && (
//             <div className="space-y-4 p-4 border rounded-lg">
//               <h4 className="font-medium flex items-center gap-2">
//                 <Calendar className="w-4 h-4" />
//                 Thông tin phỏng vấn
//               </h4>
              
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <Label>Ngày phỏng vấn</Label>
//                   <input
//                     type="date"
//                     value={interviewDate}
//                     onChange={(e) => setInterviewDate(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md"
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label>Giờ phỏng vấn</Label>
//                   <input
//                     type="time"
//                     value={interviewTime}
//                     onChange={(e) => setInterviewTime(e.target.value)}
//                     className="w-full px-3 py-2 border rounded-md"
//                   />
//                 </div>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="send-email"
//                   checked={sendEmail}
//                   onChange={(e) => setSendEmail(e.target.checked)}
//                   className="rounded"
//                 />
//                 <Label htmlFor="send-email" className="flex items-center gap-2">
//                   <Mail className="w-4 h-4" />
//                   Gửi email mời phỏng vấn
//                 </Label>
//               </div>
//             </div>
//           )}

//           {status === "rejected" && (
//             <div className="flex items-center gap-2 p-4 border rounded-lg">
//               <input
//                 type="checkbox"
//                 id="send-rejection-email"
//                 checked={sendEmail}
//                 onChange={(e) => setSendEmail(e.target.checked)}
//                 className="rounded"
//               />
//               <Label htmlFor="send-rejection-email" className="flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 Gửi email thông báo từ chối
//               </Label>
//             </div>
//           )}
//         </div>

//         <DialogFooter>
//           <Button variant="outline" onClick={() => setOpen(false)}>
//             Hủy
//           </Button>
//           <Button 
//             onClick={() => handleStatusChange(status)}
//             disabled={loading}
//           >
//             {loading ? "Đang xử lý..." : "Xác nhận"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   )
// }



"use client"

import { useState, useEffect } from "react"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { 
  Clock, 
  Eye, 
  MessageSquare, 
  CheckCircle, 
  XCircle,
  Send,
  Calendar,
  Mail,
  History,
  User,
  Clock4,
  MapPin,
  Video,
  Building,
  UserCircle,
  Clock3,
  AlertCircle
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const statusOptions = [
  { value: "pending", label: "Mới nộp", icon: Clock, color: "bg-gray-100 text-gray-800", sequence: 1 },
  { value: "reviewing", label: "Đang xem xét", icon: Eye, color: "bg-blue-100 text-blue-800", sequence: 2 },
  { value: "interview", label: "Mời phỏng vấn", icon: MessageSquare, color: "bg-purple-100 text-purple-800", sequence: 3 },
  { value: "offered", label: "Đề nghị", icon: Send, color: "bg-green-100 text-green-800", sequence: 4 },
  { value: "accepted", label: "Đã nhận", icon: CheckCircle, color: "bg-green-100 text-green-800", sequence: 5 },
  { value: "rejected", label: "Không phù hợp", icon: XCircle, color: "bg-red-100 text-red-800", sequence: 0 },
  { value: "withdrawn", label: "Đã rút", icon: XCircle, color: "bg-yellow-100 text-yellow-800", sequence: 0 },
]

const validTransitions: Record<string, string[]> = {
  pending: ["reviewing", "rejected"],
  reviewing: ["interview", "rejected"],
  interview: ["offered", "rejected"],
  offered: ["accepted", "rejected"],
  accepted: [],
  rejected: [],
  withdrawn: []
}

const cannotRejectFrom = ["accepted", "withdrawn"]

interface StatusHistory {
  id: string
  old_status: string
  new_status: string
  notes: string | null
  changed_by: string | null
  created_at: string
  profile?: {
    full_name: string | null
    email: string
  } | null
}

interface InterviewFormData {
  interview_date: string
  interview_time: string
  interview_location: string
  interview_type: "online" | "offline"
  interview_link: string
  interview_duration: number
  interview_notes: string
  interviewer_name: string
  interviewer_position: string
}

export function ApplicationStatusSelect({ 
  applicationId, 
  currentStatus,
  employerId 
}: { 
  applicationId: string
  currentStatus: string
  employerId: string
}) {
  const [status, setStatus] = useState(currentStatus)
  const [open, setOpen] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([])
  const [sendEmail, setSendEmail] = useState(true)
  const [notes, setNotes] = useState("") // THÊM DÒNG NÀY
  
  const router = useRouter()
  const supabase = createClient()

  const form = useForm<InterviewFormData>({
    defaultValues: {
      interview_date: "",
      interview_time: "09:00",
      interview_location: "",
      interview_type: "online",
      interview_link: "",
      interview_duration: 60,
      interview_notes: "",
      interviewer_name: "",
      interviewer_position: "Nhà tuyển dụng"
    }
  })

  const currentStatusOption = statusOptions.find(opt => opt.value === status)
  const Icon = currentStatusOption?.icon || Clock

  useEffect(() => {
    if (historyOpen) {
      fetchStatusHistory()
    }
  }, [historyOpen])

  const fetchStatusHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("application_status_history")
        .select(`
          *,
          profile:profiles(full_name, email)
        `)
        .eq("application_id", applicationId)
        .order("created_at", { ascending: false })

      if (error) throw error
      setStatusHistory(data || [])
    } catch (error) {
      console.error("Error fetching status history:", error)
    }
  }

  const getNextValidStatuses = (current: string) => {
    const nextStatuses = validTransitions[current] || []
    
    if (cannotRejectFrom.includes(current)) {
      return nextStatuses.filter(s => s !== "rejected")
    }
    
    return nextStatuses
  }

  const handleStatusChange = async (newStatus: string) => {
    const allowedStatuses = getNextValidStatuses(currentStatus)
    if (!allowedStatuses.includes(newStatus)) {
      toast.error(`Không thể chuyển từ "${getStatusLabel(currentStatus)}" sang "${getStatusLabel(newStatus)}"`)
      return
    }

    setLoading(true)
    
    try {
      const updates: any = {
        status: newStatus,
        updated_at: new Date().toISOString(),
        status_sequence: statusOptions.find(s => s.value === newStatus)?.sequence || 0
      }

      // Thêm notes nếu có
      if (notes) {
        updates.notes = notes
      }

      // Thêm thông tin phỏng vấn nếu là mời phỏng vấn
      if (newStatus === "interview") {
        const interviewData = form.getValues()
        Object.assign(updates, {
          interview_date: interviewData.interview_date,
          interview_time: interviewData.interview_time,
          interview_location: interviewData.interview_location,
          interview_type: interviewData.interview_type,
          interview_link: interviewData.interview_link,
          interview_duration: interviewData.interview_duration,
          interview_notes: interviewData.interview_notes,
          interviewer_name: interviewData.interviewer_name,
          interviewer_position: interviewData.interviewer_position
        })
      }

      // Thêm lý do từ chối nếu cần
      if (newStatus === "rejected") {
        updates.rejection_reason = notes || "Không phù hợp với yêu cầu công việc"
      }

      const { error } = await supabase
        .from("job_applications")
        .update(updates)
        .eq("id", applicationId)

      if (error) throw error

      // Ghi log hành động
      await supabase.from("application_logs").insert({
        application_id: applicationId,
        action: `status_changed_to_${newStatus}`,
        actor_id: employerId,
        metadata: {
          old_status: currentStatus,
          new_status: newStatus,
          interview_data: newStatus === "interview" ? form.getValues() : null,
          rejection_reason: newStatus === "rejected" ? updates.rejection_reason : null,
          timestamp: new Date().toISOString()
        }
      })

      // Gửi email trực tiếp
      if (sendEmail) {
        await sendEmailDirectly(newStatus)
      }

      setStatus(newStatus)
      toast.success("Cập nhật trạng thái thành công")
      
      // Refresh data
      router.refresh()
      setOpen(false)
      form.reset()
      setNotes("") // Reset notes
      
    } catch (error) {
      console.error("Error updating status:", error)
      toast.error("Có lỗi xảy ra khi cập nhật trạng thái")
    } finally {
      setLoading(false)
    }
  }

  const sendEmailDirectly = async (newStatus: string) => {
    try {
      // Lấy thông tin ứng viên và job
      const { data: application, error } = await supabase
        .from("job_applications")
        .select(`
          *,
          job_postings (
            title,
            employer_profiles (
              company_name,
              contact_email,
              user_id
            )
          ),
          applicant_profiles (
            user_id,
            cv_parsed_data,
            profiles (
              email,
              full_name
            )
          )
        `)
        .eq("id", applicationId)
        .single()

      if (error) throw error

      const applicantEmail = application.applicant_profiles?.profiles?.email || 
                            application.applicant_profiles?.cv_parsed_data?.email;
      const applicantName = application.applicant_profiles?.profiles?.full_name || 
                           application.applicant_profiles?.cv_parsed_data?.full_name || 
                           'Ứng viên';
      const jobTitle = application.job_postings?.title || 'Công việc';
      const companyName = application.job_postings?.employer_profiles?.company_name || 'Công ty';

      if (!applicantEmail) {
        console.error('No applicant email found');
        toast.error('Không tìm thấy email ứng viên');
        return;
      }

       // Gọi API gửi email qua SMTP
    const response = await fetch('/api/send-email-direct', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: applicantEmail,
        type: 'status_change',
        data: {
          applicant_name: applicantName,
          job_title: jobTitle,
          company_name: companyName,
          old_status: currentStatus,
          new_status: newStatus,
          application_id: applicationId,
          notes: notes,
          changed_at: new Date().toISOString()
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to send email');
    }

    toast.success('Email đã được gửi đến ứng viên');
      
    } catch (error: any) {
      console.error('Error sending direct email:', error);
      toast.error(`Lỗi gửi email: ${error.message}`);
    }
  }

  const getStatusLabel = (statusValue: string) => {
    const option = statusOptions.find(opt => opt.value === statusValue)
    return option?.label || statusValue
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const nextStatuses = getNextValidStatuses(currentStatus)

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Icon className="w-4 h-4" />
            <span>{currentStatusOption?.label}</span>
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thay đổi trạng thái ứng viên</DialogTitle>
            <DialogDescription>
              Cập nhật trạng thái và thực hiện các hành động tiếp theo
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Chọn trạng thái mới */}
            <div className="space-y-2">
              <Label>Trạng thái mới</Label>
              <div className="flex flex-wrap gap-2">
                {nextStatuses.map((nextStatus) => {
                  const option = statusOptions.find(opt => opt.value === nextStatus)
                  if (!option) return null
                  
                  const Icon = option.icon
                  return (
                    <Button
                      key={nextStatus}
                      type="button"
                      variant={status === nextStatus ? "default" : "outline"}
                      className="gap-2"
                      onClick={() => setStatus(nextStatus)}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              
              {nextStatuses.length === 0 && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-700">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Không thể thay đổi trạng thái từ trạng thái hiện tại</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ghi chú cho tất cả trạng thái */}
            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea 
                placeholder={
                  status === "rejected" ? "Lý do từ chối (sẽ được gửi cho ứng viên)" :
                  status === "reviewing" ? "Ghi chú nội bộ" :
                  status === "offered" ? "Thông tin đề nghị (sẽ được gửi cho ứng viên)" :
                  status === "interview" ? "Ghi chú cho ứng viên" :
                  "Ghi chú nội bộ"
                }
                rows={3}
                value={notes} // Sử dụng state notes
                onChange={(e) => setNotes(e.target.value)} // Cập nhật state notes
              />
            </div>

            {/* Form phỏng vấn (chỉ hiển thị khi chọn mời phỏng vấn) */}
            {status === "interview" && (
              <Form {...form}>
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Thông tin phỏng vấn
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="interview_date"
                      rules={{ required: "Vui lòng chọn ngày phỏng vấn" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ngày phỏng vấn *</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interview_time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Giờ phỏng vấn</FormLabel>
                          <FormControl>
                            <Input type="time" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="interview_type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hình thức phỏng vấn</FormLabel>
                        <div className="flex gap-4">
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="online"
                                value="online"
                                checked={field.value === "online"}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="rounded"
                              />
                              <Label htmlFor="online" className="flex items-center gap-1 cursor-pointer">
                                <Video className="w-4 h-4" />
                                Online
                              </Label>
                            </div>
                          </FormControl>
                          <FormControl>
                            <div className="flex items-center gap-2">
                              <input
                                type="radio"
                                id="offline"
                                value="offline"
                                checked={field.value === "offline"}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="rounded"
                              />
                              <Label htmlFor="offline" className="flex items-center gap-1 cursor-pointer">
                                <Building className="w-4 h-4" />
                                Offline
                              </Label>
                            </div>
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />

                  {form.watch("interview_type") === "online" ? (
                    <FormField
                      control={form.control}
                      name="interview_link"
                      rules={{ required: "Vui lòng nhập link phỏng vấn" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Video className="w-4 h-4" />
                            Link phỏng vấn *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="https://meet.google.com/..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Google Meet, Zoom, Microsoft Teams, etc.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="interview_location"
                      rules={{ required: "Vui lòng nhập địa điểm phỏng vấn" }}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            Địa điểm phỏng vấn *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Tòa nhà ABC, 123 Đường XYZ, Quận 1, TP.HCM" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="interview_duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <Clock3 className="w-4 h-4" />
                            Thời lượng (phút)
                          </FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="15"
                              max="180"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value))}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="interviewer_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1">
                            <UserCircle className="w-4 h-4" />
                            Người phỏng vấn
                          </FormLabel>
                          <FormControl>
                            <Input placeholder="Nguyễn Văn A" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="interviewer_position"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chức vụ người phỏng vấn</FormLabel>
                        <FormControl>
                          <Input placeholder="Trưởng phòng Nhân sự" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            )}

            {/* Tùy chọn gửi email */}
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <input
                type="checkbox"
                id="send-email"
                checked={sendEmail}
                onChange={(e) => setSendEmail(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="send-email" className="flex items-center gap-2 cursor-pointer">
                <Mail className="w-4 h-4" />
                Gửi email thông báo cho ứng viên
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setOpen(false)
              form.reset()
              setNotes("")
            }}>
              Hủy
            </Button>
            <Button 
              onClick={() => handleStatusChange(status)}
              disabled={loading || !nextStatuses.includes(status)}
            >
              {loading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Nút xem lịch sử */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setHistoryOpen(true)}
        title="Xem lịch sử thay đổi"
      >
        <History className="w-4 h-4" />
      </Button>

      {/* Dialog hiển thị lịch sử */}
      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock4 className="w-5 h-5" />
              Lịch sử thay đổi trạng thái
            </DialogTitle>
            <DialogDescription>
              Dòng thời gian các thay đổi trạng thái của đơn ứng tuyển này
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {statusHistory.length > 0 ? (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {statusHistory.map((item, index) => (
                  <div key={item.id} className="relative flex items-start gap-4 mb-6">
                    {/* Timeline dot */}
                    <div className="relative z-10 w-12 h-12 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center">
                      {item.new_status === "interview" ? (
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      ) : item.new_status === "rejected" ? (
                        <XCircle className="w-5 h-5 text-red-600" />
                      ) : item.new_status === "accepted" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Clock className="w-5 h-5 text-blue-600" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium">
                            Chuyển từ <span className="text-red-600">{getStatusLabel(item.old_status)}</span> 
                            {" → "}
                            <span className="text-green-600">{getStatusLabel(item.new_status)}</span>
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {formatDateTime(item.created_at)}
                          </p>
                          {item.profile && (
                            <div className="flex items-center gap-2 mt-2 text-sm">
                              <User className="w-4 h-4" />
                              <span className="font-medium">{item.profile.full_name || item.profile.email}</span>
                            </div>
                          )}
                        </div>
                        <Badge variant="outline">
                          {getStatusLabel(item.new_status)}
                        </Badge>
                      </div>
                      
                      {item.notes && (
                        <div className="mt-3 p-3 bg-white rounded border">
                          <p className="text-sm">{item.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock4 className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">Chưa có lịch sử thay đổi</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}