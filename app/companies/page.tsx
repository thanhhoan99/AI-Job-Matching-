// app/companies/page.tsx
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, MapPin, Users, Globe } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default async function CompaniesPage() {
  const supabase = await createClient()

  const { data: companies } = await supabase
    .from("employer_profiles")
    .select(`
      *,
      job_postings!inner (
        id
      )
    `)
    .eq("verification_status", "verified")
    .order("company_name")

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Các Công Ty Tuyển Dụng</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá các công ty hàng đầu đang tuyển dụng trên nền tảng của chúng tôi
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {companies?.map((company) => (
            <Card key={company.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  {company.logo_url ? (
                    <img
                      src={company.logo_url}
                      alt={company.company_name}
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="w-8 h-8 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1">
                    <CardTitle className="text-xl">{company.company_name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {company.city}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {company.industry && (
                    <Badge variant="secondary">{company.industry}</Badge>
                  )}
                  {company.is_premium && (
                    <Badge variant="default">Premium</Badge>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  {company.company_size && (
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {company.company_size}
                    </div>
                  )}
                  <div className="text-sm">
                    {company.job_postings?.length || 0} vị trí
                  </div>
                </div>

                {company.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {company.description}
                  </p>
                )}

                <div className="flex gap-2 pt-2">
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link href={`/companies/${company.id}`}>
                      Xem công ty
                    </Link>
                  </Button>
                  <Button asChild size="sm" className="flex-1">
                    <Link href={`/?search=${encodeURIComponent(company.company_name)}`}>
                      Việc làm
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {(!companies || companies.length === 0) && (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Chưa có công ty nào</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}