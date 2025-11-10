import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserRoleSelect } from "@/components/admin/user-role-select"
import { UserStatusToggle } from "@/components/admin/user-status-toggle"

export default async function AdminUsersPage() {
  const supabase = await createClient()

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quản lý người dùng</h1>
        <p className="text-muted-foreground">Xem và quản lý tất cả người dùng trong hệ thống</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng</CardTitle>
          <CardDescription>Tổng số: {users?.length || 0} người dùng</CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between border-b pb-4 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium">{user.full_name || "Chưa có tên"}</p>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>{user.role}</Badge>
                      {!user.is_active && <Badge variant="destructive">Bị khóa</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    {user.phone && <p className="text-sm text-muted-foreground">SĐT: {user.phone}</p>}
                    <p className="text-xs text-muted-foreground mt-1">
                      Đăng ký: {new Date(user.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserRoleSelect userId={user.id} currentRole={user.role} />
                    <UserStatusToggle userId={user.id} isActive={user.is_active} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">Chưa có người dùng</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
