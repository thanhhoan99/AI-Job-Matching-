import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, FileText, Star } from "lucide-react"
import Link from "next/link"
import { CVActions } from "@/components/applicant/cv-actions"

export default async function CVsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: applicantProfile } = await supabase
    .from("applicant_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single()

  if (!applicantProfile) {
    redirect("/applicant/profile")
  }

  const { data: cvs } = await supabase
    .from("applicant_cvs")
    .select("*, cv_templates(name)")
    .eq("applicant_id", applicantProfile.id)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  const { data: templates } = await supabase.from("cv_templates").select("*").eq("is_active", true)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý CV</h1>
          <p className="text-muted-foreground">Tạo và quản lý nhiều phiên bản CV cho các vị trí khác nhau</p>
        </div>
        <Link href="/applicant/cvs/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Tạo CV mới
          </Button>
        </Link>
      </div>

      {cvs && cvs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {cvs.map((cv) => (
            <Card key={cv.id} className="relative">
              {cv.is_default && (
                <div className="absolute top-2 right-2">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                </div>
              )}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {cv.name}
                </CardTitle>
                <CardDescription>
                  {cv.cv_templates?.name || "Custom Template"}
                  {cv.is_default && " • CV mặc định"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Cập nhật: {new Date(cv.updated_at).toLocaleDateString("vi-VN")}
                </div>
                <CVActions cvId={cv.id} isDefault={cv.is_default} pdfUrl={cv.pdf_url} />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Chưa có CV nào</h3>
            <p className="text-muted-foreground text-center mb-4">
              Tạo CV đầu tiên của bạn từ hồ sơ hoặc chọn template có sẵn
            </p>
            <Link href="/applicant/cvs/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Tạo CV ngay
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Templates có sẵn</CardTitle>
          <CardDescription>Chọn template phù hợp để tạo CV chuyên nghiệp</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {templates?.map((template) => (
              <Link key={template.id} href={`/applicant/cvs/new?template=${template.id}`}>
                <Card className="cursor-pointer hover:border-primary transition-colors">
                  <CardHeader>
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <CardDescription className="text-xs">{template.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
