import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  RefreshCw, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Clock,
  AlertCircle
} from "lucide-react"

export default async function EmailQueueDebugPage() {
  const supabase = await createClient()
  
  const { data: emailQueue, error } = await supabase
    .from("email_queue")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50)

  const { data: applications } = await supabase
    .from("job_applications")
    .select("id, status, applied_at")
    .order("applied_at", { ascending: false })
    .limit(10)

  const stats = {
    total: emailQueue?.length || 0,
    pending: emailQueue?.filter(e => e.status === 'pending').length || 0,
    sent: emailQueue?.filter(e => e.status === 'sent').length || 0,
    failed: emailQueue?.filter(e => e.status === 'failed').length || 0
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Email Queue Debug</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng số email</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Mail className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang chờ</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã gửi</p>
                <p className="text-2xl font-bold">{stats.sent}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Lỗi</p>
                <p className="text-2xl font-bold">{stats.failed}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Email Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Email Queue (50 mới nhất)</span>
              <form action="/api/process-emails" method="POST">
                <input type="hidden" name="cron_secret" value={process.env.CRON_SECRET} />
                <Button type="submit" size="sm" variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Xử lý ngay
                </Button>
              </form>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto">
              {emailQueue?.map((email) => (
                <div key={email.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Badge variant={
                        email.status === 'sent' ? 'default' :
                        email.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {email.status}
                      </Badge>
                      <Badge variant="outline" className="ml-2">
                        {email.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(email.created_at).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  
                  <div className="text-sm">
                    <p><strong>To:</strong> {email.data?.to || <span className="text-red-500">NULL</span>}</p>
                    <p><strong>Application ID:</strong> {email.application_id}</p>
                    {email.sent_at && (
                      <p><strong>Sent at:</strong> {new Date(email.sent_at).toLocaleString('vi-VN')}</p>
                    )}
                    {email.error_message && (
                      <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-xs">
                        <AlertCircle className="w-4 h-4 inline mr-1" />
                        {email.error_message}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Ứng tuyển gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {applications?.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{app.id.substring(0, 8)}...</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(app.applied_at).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  <Badge>{app.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}