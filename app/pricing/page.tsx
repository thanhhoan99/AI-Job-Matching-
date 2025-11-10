import { createServerClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import Link from "next/link"

export default async function PricingPage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: packages } = await supabase
    .from("payment_packages")
    .select("*")
    .eq("is_active", true)
    .order("price", { ascending: true })

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-balance">Chọn gói dịch vụ phù hợp với bạn</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Nâng cấp tài khoản để trải nghiệm đầy đủ tính năng AI
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {packages?.map((pkg) => (
            <Card key={pkg.id} className={pkg.type === "premium" ? "border-primary shadow-lg scale-105" : ""}>
              <CardHeader>
                {pkg.type === "premium" && <Badge className="w-fit mb-2">Phổ biến nhất</Badge>}
                <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{pkg.price.toLocaleString("vi-VN")}đ</span>
                  <span className="text-muted-foreground">/{pkg.duration_days} ngày</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {pkg.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm">{pkg.ai_credits} AI credits</span>
                  </li>
                  {pkg.job_posts_limit && (
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{pkg.job_posts_limit} tin tuyển dụng</span>
                    </li>
                  )}
                  {pkg.applications_limit && (
                    <li className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{pkg.applications_limit} đơn ứng tuyển</span>
                    </li>
                  )}
                </ul>
              </CardContent>
              <CardFooter>
                {user ? (
                  <Button asChild className="w-full" variant={pkg.type === "premium" ? "default" : "outline"}>
                    <Link href={`/payment/checkout?package=${pkg.id}`}>Chọn gói này</Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full bg-transparent" variant="outline">
                    <Link href="/auth/login">Đăng nhập để mua</Link>
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground">
            Tất cả gói đều bao gồm hỗ trợ khách hàng 24/7 và cập nhật tính năng miễn phí
          </p>
        </div>
      </div>
    </div>
  )
}
