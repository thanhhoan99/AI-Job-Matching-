import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, Users, Globe, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function CompanyBrandingPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: employerProfile } = await supabase.from("employer_profiles").select("*").eq("user_id", user.id).single()

  if (!employerProfile) {
    redirect("/employer/profile")
  }

  // Get company reviews
  const { data: reviews } = await supabase
    .from("company_reviews")
    .select("*")
    .eq("employer_id", employerProfile.id)
    .eq("is_approved", true)
    .order("created_at", { ascending: false })
    .limit(10)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Trang công ty</h1>
          <p className="text-muted-foreground">Quản lý thương hiệu tuyển dụng của bạn</p>
        </div>
        <Button asChild>
          <Link href="/employer/profile">Chỉnh sửa thông tin</Link>
        </Button>
      </div>

      {/* Company Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            {employerProfile.logo_url ? (
              <img
                src={employerProfile.logo_url || "/placeholder.svg"}
                alt={employerProfile.company_name}
                className="w-24 h-24 rounded-lg object-cover border"
              />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center">
                <Building2 className="w-12 h-12 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{employerProfile.company_name}</h2>
                {employerProfile.verification_status === "verified" && <Badge variant="default">Đã xác minh</Badge>}
                {employerProfile.is_premium && (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Premium
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-3">
                {employerProfile.industry && (
                  <div className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {employerProfile.industry}
                  </div>
                )}
                {employerProfile.company_size && (
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {employerProfile.company_size}
                  </div>
                )}
                {employerProfile.city && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {employerProfile.city}
                  </div>
                )}
                {employerProfile.website && (
                  <a
                    href={employerProfile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>

              {employerProfile.company_rating > 0 && (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{employerProfile.company_rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({employerProfile.total_reviews} đánh giá)</span>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Company Description */}
      {employerProfile.description && (
        <Card>
          <CardHeader>
            <CardTitle>Giới thiệu công ty</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground whitespace-pre-wrap">{employerProfile.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Culture & Benefits */}
      {(employerProfile.culture_description || employerProfile.benefits_list) && (
        <div className="grid gap-6 md:grid-cols-2">
          {employerProfile.culture_description && (
            <Card>
              <CardHeader>
                <CardTitle>Văn hóa công ty</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">{employerProfile.culture_description}</p>
              </CardContent>
            </Card>
          )}

          {employerProfile.benefits_list && employerProfile.benefits_list.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Phúc lợi</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {employerProfile.benefits_list.map((benefit: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Company Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Đánh giá từ nhân viên</CardTitle>
          <CardDescription>
            {reviews && reviews.length > 0 ? `${reviews.length} đánh giá được phê duyệt` : "Chưa có đánh giá nào"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reviews && reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review: any) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium">{review.reviewer_name || "Ẩn danh"}</p>
                      {review.position && <p className="text-sm text-muted-foreground">{review.position}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{review.rating}</span>
                    </div>
                  </div>
                  {review.title && <p className="font-medium mb-1">{review.title}</p>}
                  {review.review_text && <p className="text-sm text-muted-foreground">{review.review_text}</p>}
                  <p className="text-xs text-muted-foreground mt-2">
                    {new Date(review.created_at).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              Chưa có đánh giá nào. Khuyến khích nhân viên và ứng viên đánh giá công ty của bạn.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
