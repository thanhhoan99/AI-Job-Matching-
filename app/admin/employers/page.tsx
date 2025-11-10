import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmployerVerificationActions } from "@/components/admin/employer-verification-actions";

export default async function AdminEmployersPage() {
  const supabase = await createClient();

  const { data: employers, error } = await supabase
    .from("employer_profiles")
    .select(
      `
      *,
      user:profiles!user_id (
        id,
        email,
        full_name,
        created_at
      )
    `
    )
    .order("created_at", { ascending: false });

  console.log("[v0] Admin employers query result:", {
    count: employers?.length,
    error: error?.message,
    employers: employers,
  });

  if (error) {
    console.error("[v0] Error fetching employers:", error);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý nhà tuyển dụng</h1>
        <p className="text-muted-foreground">
          Xác minh và quản lý các doanh nghiệp
        </p>
      </div>

      {error && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Lỗi tải dữ liệu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{error.message}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Danh sách nhà tuyển dụng</CardTitle>
          <CardDescription>
            Tổng số: {employers?.length || 0} doanh nghiệp
          </CardDescription>
        </CardHeader>
        <CardContent>
          {employers && employers.length > 0 ? (
            <div className="space-y-4">
              {employers.map((employer: any) => (
                <div key={employer.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">
                          {employer.company_name}
                        </h3>
                        <Badge
                          variant={
                            employer.verification_status === "verified"
                              ? "default"
                              : employer.verification_status === "rejected"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {employer.verification_status === "verified"
                            ? "Đã xác minh"
                            : employer.verification_status === "rejected"
                            ? "Từ chối"
                            : "Chờ xác minh"}
                        </Badge>
                        {employer.is_premium && (
                          <Badge variant="outline">Premium</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Người đại diện: {employer.user?.full_name || "Chưa có"}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Email: {employer.user?.email}
                      </p>
                      {employer.tax_code && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Mã số thuế: {employer.tax_code}
                        </p>
                      )}
                      <p className="text-sm text-muted-foreground mb-1">
                        Ngành: {employer.industry || "Chưa cập nhật"}
                      </p>
                      <p className="text-sm text-muted-foreground mb-1">
                        Quy mô: {employer.company_size || "Chưa cập nhật"}
                      </p>
                      {employer.website && (
                        <p className="text-sm text-muted-foreground mb-1">
                          Website:{" "}
                          <a
                            href={employer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {employer.website}
                          </a>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">
                        Đăng ký:{" "}
                        {new Date(employer.created_at).toLocaleDateString(
                          "vi-VN"
                        )}
                      </p>
                      {employer.verification_notes && (
                        <p className="text-sm text-yellow-600 mt-2 p-2 bg-yellow-50 rounded">
                          Ghi chú: {employer.verification_notes}
                        </p>
                      )}
                    </div>

                    <EmployerVerificationActions
                      key={`${employer.id}-${employer.verification_status}`} // Thêm key động
                      employerId={employer.id}
                      currentStatus={employer.verification_status}
                      employerData={employer}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">
              Chưa có nhà tuyển dụng
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
