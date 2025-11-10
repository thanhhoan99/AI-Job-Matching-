"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Clock, XCircle } from "lucide-react"

interface VerificationBannerProps {
  status: "pending" | "verified" | "rejected"
  notes?: string | null
}

export function VerificationBanner({ status, notes }: VerificationBannerProps) {
  if (status === "verified") {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertTitle className="text-green-900">Đã xác minh</AlertTitle>
        <AlertDescription className="text-green-800">
          Công ty của bạn đã được xác minh. Bạn có thể đăng tin tuyển dụng.
        </AlertDescription>
      </Alert>
    )
  }

  if (status === "rejected") {
    return (
      <Alert variant="destructive">
        <XCircle className="h-4 w-4" />
        <AlertTitle>Xác minh bị từ chối</AlertTitle>
        <AlertDescription>
          {notes || "Thông tin công ty chưa đủ điều kiện. Vui lòng cập nhật và gửi lại yêu cầu xác minh."}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="border-yellow-200 bg-yellow-50">
      <Clock className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-900">Đang chờ xác minh</AlertTitle>
      <AlertDescription className="text-yellow-800">
        Thông tin công ty của bạn đang được xem xét. Bạn chỉ có thể chỉnh sửa hồ sơ, chưa thể đăng tin tuyển dụng.
      </AlertDescription>
    </Alert>
  )
}
