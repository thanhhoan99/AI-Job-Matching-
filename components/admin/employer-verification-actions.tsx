"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
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
import { CheckCircle, XCircle, Sparkles, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { verifyEmployer } from "@/app/employer/actions/employer-verification"

interface EmployerVerificationActionsProps {
  employerId: string
  currentStatus: string
   employerData: any
}

interface AIReview {
  recommendation: "approve" | "reject" | "needs_review"
  confidence: number
  reasons: string[]
  concerns: string[]
  suggestedNotes: string
}

export function EmployerVerificationActions({ employerId, currentStatus: initialCurrentStatus , employerData }: EmployerVerificationActionsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [notes, setNotes] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [action, setAction] = useState<"verify" | "reject">("verify")
  const [aiReview, setAiReview] = useState<AIReview | null>(null)
  const [isAiReviewing, setIsAiReviewing] = useState(false)
  const [showAiDialog, setShowAiDialog] = useState(false)

   const [currentStatus, setCurrentStatus] = useState(initialCurrentStatus)
    // Đồng bộ state khi prop thay đổi
  useEffect(() => {
    setCurrentStatus(initialCurrentStatus)
  }, [initialCurrentStatus])

  const handleAiReview = async () => {
    setIsAiReviewing(true)
    try {
      const response = await fetch("/api/admin/ai-review-employer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employerId }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI review")
      }

      const data = await response.json()
      setAiReview(data.review)
      setShowAiDialog(true)
      // Auto-fill notes with AI suggestion
      setNotes(data.review.suggestedNotes)
    } catch (err: any) {
      alert("Lỗi AI review: " + err.message)
    } finally {
      setIsAiReviewing(false)
    }
  }
  // Trong component, thay thế hàm handleVerification:
const handleVerification = async () => {
  setIsLoading(true)
  try {
    const result = await verifyEmployer(
      employerId, 
      action === "verify" ? "verified" : "rejected", 
      notes
    )

    if (result.success) {
      // Cập nhật state local ngay lập tức
      setCurrentStatus(action === "verify" ? "verified" : "rejected")
      
      // Hiển thị thông báo thành công
      alert(result.message)
      
      // Đóng tất cả dialog
      setDialogOpen(false)
      setShowAiDialog(false)
      setNotes("")
      setAiReview(null)
      
      // Làm mới dữ liệu
      router.refresh()
    }
  } catch (err: any) {
    console.error("Error in handleVerification:", err)
    alert("Lỗi: " + err.message)
  } finally {
    setIsLoading(false)
  }
}

  // const handleVerification = async () => {
  //   setIsLoading(true)
  //   try {
  //     const {
  //       data: { user },
  //     } = await supabase.auth.getUser()
      
      

  //     const updateData = {
  //       verification_status: action === "verify" ? "verified" : "rejected",
  //       verification_notes: notes || null,
  //       verified_at: action === "verify" ? new Date().toISOString() : null,
  //       verified_by: user?.id || null,
  //     }

  //     const { error } = await supabase.from("employer_profiles").update(updateData).eq("id", employerId)

  //     if (error) throw error
  //       // Cập nhật state local ngay lập tức
  //     setCurrentStatus(updateData.verification_status)

  //     alert(action === "verify" ? "Đã xác minh doanh nghiệp!" : "Đã từ chối xác minh!")
  //     setDialogOpen(false)
  //     setShowAiDialog(false)
  //     setNotes("")
  //     // setAiReview(null)
  //     router.refresh()
  //   } catch (err: any) {
  //     alert("Lỗi: " + err.message)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  if (currentStatus === "verified") {
    return (
      <div className="flex gap-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" onClick={() => setAction("reject")}>
              <XCircle className="w-4 h-4 mr-1" />
              Thu hồi xác minh
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thu hồi xác minh doanh nghiệp</DialogTitle>
              <DialogDescription>
                Bạn có chắc muốn thu hồi xác minh? Doanh nghiệp sẽ không thể đăng tin tuyển dụng.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="notes">Lý do (tùy chọn)</Label>
              <Textarea
                id="notes"
                placeholder="Nhập lý do thu hồi xác minh..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Hủy
              </Button>
              <Button variant="destructive" onClick={handleVerification} disabled={isLoading}>
                {isLoading ? "Đang xử lý..." : "Thu hồi"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={handleAiReview} disabled={isAiReviewing}>
        <Sparkles className="w-4 h-4 mr-1" />
        {isAiReviewing ? "Đang phân tích..." : "AI Review"}
      </Button>

      <Dialog open={showAiDialog} onOpenChange={setShowAiDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              Kết quả phân tích AI
            </DialogTitle>
            <DialogDescription>AI đã phân tích thông tin công ty và đưa ra đề xuất</DialogDescription>
          </DialogHeader>

          {aiReview && (
            <div className="space-y-4">
              {/* Recommendation */}
              <div className="flex items-center gap-3">
                <span className="font-semibold">Đề xuất:</span>
                <Badge
                  variant={
                    aiReview.recommendation === "approve"
                      ? "default"
                      : aiReview.recommendation === "reject"
                        ? "destructive"
                        : "secondary"
                  }
                  className="text-sm"
                >
                  {aiReview.recommendation === "approve"
                    ? "✓ Duyệt"
                    : aiReview.recommendation === "reject"
                      ? "✗ Từ chối"
                      : "⚠ Cần xem xét"}
                </Badge>
                <span className="text-sm text-muted-foreground">Độ tin cậy: {aiReview.confidence}%</span>
              </div>

              {/* Reasons */}
              <div>
                <h4 className="font-semibold mb-2">Lý do:</h4>
                <ul className="list-disc list-inside space-y-1">
                  {aiReview.reasons.map((reason, idx) => (
                    <li key={idx} className="text-sm">
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concerns */}
              {aiReview.concerns.length > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Vấn đề cần lưu ý</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1 mt-2">
                      {aiReview.concerns.map((concern, idx) => (
                        <li key={idx} className="text-sm">
                          {concern}
                        </li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {/* Suggested Notes */}
              <div className="space-y-2">
                <Label htmlFor="ai-notes">Ghi chú đề xuất</Label>
                <Textarea
                  id="ai-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="bg-muted"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAiDialog(false)}>
              Đóng
            </Button>
            {aiReview?.recommendation === "approve" && (
              <Button
                onClick={() => {
                  setAction("verify")
                  setShowAiDialog(false)
                  setDialogOpen(true)
                }}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Duyệt theo AI
              </Button>
            )}
            {aiReview?.recommendation === "reject" && (
              <Button
                variant="destructive"
                onClick={() => {
                  setAction("reject")
                  setShowAiDialog(false)
                  setDialogOpen(true)
                }}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Từ chối theo AI
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen && action === "verify"}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (open) setAction("verify")
        }}
      >
        <DialogTrigger asChild>
          <Button variant="default" size="sm" onClick={() => setAction("verify")}>
            <CheckCircle className="w-4 h-4 mr-1" />
            Xác minh
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác minh doanh nghiệp</DialogTitle>
            <DialogDescription>
              Xác nhận doanh nghiệp này đã được kiểm tra và đủ điều kiện đăng tin tuyển dụng.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú (tùy chọn)</Label>
            <Textarea
              id="notes"
              placeholder="Thêm ghi chú về quá trình xác minh..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleVerification} disabled={isLoading}>
              {isLoading ? "Đang xử lý..." : "Xác minh"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogOpen && action === "reject"}
        onOpenChange={(open) => {
          setDialogOpen(open)
          if (open) setAction("reject")
        }}
      >
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm" onClick={() => setAction("reject")}>
            <XCircle className="w-4 h-4 mr-1" />
            Từ chối
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối xác minh</DialogTitle>
            <DialogDescription>Từ chối xác minh doanh nghiệp này. Vui lòng cung cấp lý do.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="notes">Lý do từ chối *</Label>
            <Textarea
              id="notes"
              placeholder="Nhập lý do từ chối xác minh..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              required
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleVerification} disabled={isLoading || !notes.trim()}>
              {isLoading ? "Đang xử lý..." : "Từ chối"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
