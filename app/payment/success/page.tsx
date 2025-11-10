import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default async function PaymentSuccessPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: subscription } = await supabase
    .from("user_subscriptions")
    .select("*, package:payment_packages(*)")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .single()

  const { data: userRole } = await supabase.from("users").select("role").eq("id", user.id).single()

  const dashboardUrl = userRole?.role === "employer" ? "/employer/dashboard" : "/applicant/dashboard"

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl">Thanh toán thành công!</CardTitle>
          <CardDescription>Cảm ơn bạn đã nâng cấp tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {subscription && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gói dịch vụ:</span>
                <span className="font-semibold">{subscription.package.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Thời hạn:</span>
                <span className="font-semibold">{new Date(subscription.end_date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">AI Credits:</span>
                <span className="font-semibold">{subscription.package.ai_credits}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <Button asChild className="w-full">
              <Link href={dashboardUrl}>Về Dashboard</Link>
            </Button>
            <Button asChild variant="outline" className="w-full bg-transparent">
              <Link href="/pricing">Xem các gói khác</Link>
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">Hóa đơn đã được gửi đến email của bạn</p>
        </CardContent>
      </Card>
    </div>
  )
}
