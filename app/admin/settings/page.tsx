import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Cài đặt hệ thống</h1>
        <p className="text-muted-foreground">Quản lý cấu hình và thiết lập</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tính năng đang phát triển</CardTitle>
          <CardDescription>Các cài đặt hệ thống sẽ sớm được bổ sung</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Trang cài đặt sẽ bao gồm: cấu hình email, thanh toán, AI, và các thiết lập khác.
          </p>
          <Button variant="outline">Quay lại Dashboard</Button>
        </CardContent>
      </Card>
    </div>
  )
}
