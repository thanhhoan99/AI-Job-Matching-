import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { TemplateList } from "@/components/applicant/template-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function TemplatesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: templates } = await supabase
    .from("cv_templates")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Thư viện Template CV</h1>
        <p className="text-muted-foreground">
          Khám phá tất cả các template CV có sẵn và chọn phong cách phù hợp với bạn
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Tổng quan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Số lượng template:</span>
                <span className="font-semibold">{templates?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>Template hiện đại:</span>
                <span className="font-semibold">
                  {templates?.filter(t => t.template_data.layout === 'modern').length || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Template cổ điển:</span>
                <span className="font-semibold">
                  {templates?.filter(t => t.template_data.layout === 'classic').length || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tất cả Templates</CardTitle>
            <CardDescription>
              Click vào template để xem chi tiết và sử dụng
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateList 
              templates={templates || []} 
              mode="preview"
              showActions={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}