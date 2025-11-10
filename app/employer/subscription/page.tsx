import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, Zap, Briefcase } from "lucide-react"
import Link from "next/link"

export default async function EmployerSubscriptionPage() {
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

  const { data: transactions } = await supabase
    .from("transactions")
    .select("*, package:payment_packages(name)")
    .eq("user_id", user.id)
    .order("transaction_date", { ascending: false })
    .limit(10)

  const { data: userData } = await supabase.from("users").select("ai_credits").eq("id", user.id).single()

  const { data: jobStats } = await supabase.from("job_postings").select("id, status").eq("employer_id", user.id)

  const activeJobs = jobStats?.filter((j) => j.status === "active").length || 0
  const totalJobs = jobStats?.length || 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gói dịch vụ</h1>
        <p className="text-muted-foreground">Quản lý gói dịch vụ và lịch sử thanh toán</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gói hiện tại</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subscription?.package.name || "Miễn phí"}</div>
            <p className="text-xs text-muted-foreground">
              {subscription ? "Gói đang hoạt động" : "Nâng cấp để đăng nhiều tin hơn"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ngày hết hạn</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subscription ? new Date(subscription.end_date).toLocaleDateString("vi-VN") : "--"}
            </div>
            <p className="text-xs text-muted-foreground">
              {subscription
                ? `Còn ${Math.ceil((new Date(subscription.end_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} ngày`
                : "Chưa có gói"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Credits</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.ai_credits || 0}</div>
            <p className="text-xs text-muted-foreground">Credits còn lại</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tin tuyển dụng</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activeJobs}/{subscription?.package.job_posts_limit || 5}
            </div>
            <p className="text-xs text-muted-foreground">Tin đang hoạt động</p>
          </CardContent>
        </Card>
      </div>

      {subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Chi tiết gói dịch vụ</CardTitle>
            <CardDescription>Thông tin về gói dịch vụ hiện tại của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{subscription.package.name}</span>
              <Badge>Đang hoạt động</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày bắt đầu:</span>
                <span>{new Date(subscription.start_date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ngày hết hạn:</span>
                <span>{new Date(subscription.end_date).toLocaleDateString("vi-VN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">AI Credits:</span>
                <span>{subscription.package.ai_credits}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Số tin tuyển dụng:</span>
                <span>{subscription.package.job_posts_limit || "Không giới hạn"}</span>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/pricing">Nâng cấp gói</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {!subscription && (
        <Card>
          <CardHeader>
            <CardTitle>Nâng cấp tài khoản</CardTitle>
            <CardDescription>Đăng nhiều tin tuyển dụng hơn và sử dụng AI để tạo JD chuyên nghiệp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-2">Gói miễn phí hiện tại:</p>
                <ul className="text-sm space-y-1">
                  <li>• Tối đa 5 tin tuyển dụng</li>
                  <li>• 10 AI credits</li>
                  <li>• Tính năng cơ bản</li>
                </ul>
              </div>
              <Button asChild className="w-full">
                <Link href="/pricing">Xem các gói dịch vụ</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lịch sử thanh toán</CardTitle>
          <CardDescription>Các giao dịch gần đây của bạn</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions && transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div>
                    <p className="font-medium">{transaction.package.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.transaction_date).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{transaction.amount.toLocaleString("vi-VN")}đ</p>
                    <Badge
                      variant={
                        transaction.status === "completed"
                          ? "default"
                          : transaction.status === "pending"
                            ? "secondary"
                            : transaction.status === "failed"
                              ? "destructive"
                              : "outline"
                      }
                    >
                      {transaction.status === "completed"
                        ? "Thành công"
                        : transaction.status === "pending"
                          ? "Đang xử lý"
                          : transaction.status === "failed"
                            ? "Thất bại"
                            : "Hoàn tiền"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">Chưa có giao dịch nào</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
