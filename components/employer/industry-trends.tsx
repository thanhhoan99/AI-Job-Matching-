"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, BarChart3 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export function IndustryTrends() {
  const [isLoading, setIsLoading] = useState(false)
  const [trends, setTrends] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [industry, setIndustry] = useState("Công nghệ thông tin")
  const [city, setCity] = useState("all")

  const handleGetTrends = async () => {
    if (!industry) {
      setError("Vui lòng chọn ngành nghề")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/industry-trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ industry, city: city === "all" ? "" : city }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to get trends")
      }

      setTrends(result.data.analysis)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Phân tích xu hướng ngành nghề
        </CardTitle>
        <CardDescription>AI phân tích xu hướng tuyển dụng và thị trường lao động</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Ngành nghề *</Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngành nghề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Công nghệ thông tin">Công nghệ thông tin</SelectItem>
                <SelectItem value="Tài chính - Ngân hàng">Tài chính - Ngân hàng</SelectItem>
                <SelectItem value="Marketing - Truyền thông">Marketing - Truyền thông</SelectItem>
                <SelectItem value="Bán hàng - Kinh doanh">Bán hàng - Kinh doanh</SelectItem>
                <SelectItem value="Sản xuất - Vận hành">Sản xuất - Vận hành</SelectItem>
                <SelectItem value="Y tế - Dược phẩm">Y tế - Dược phẩm</SelectItem>
                <SelectItem value="Giáo dục - Đào tạo">Giáo dục - Đào tạo</SelectItem>
                <SelectItem value="Xây dựng - Bất động sản">Xây dựng - Bất động sản</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Khu vực</Label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger>
                <SelectValue placeholder="Toàn quốc" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toàn quốc</SelectItem>
                <SelectItem value="Hà Nội">Hà Nội</SelectItem>
                <SelectItem value="Hồ Chí Minh">Hồ Chí Minh</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                <SelectItem value="Hải Phòng">Hải Phòng</SelectItem>
                <SelectItem value="Cần Thơ">Cần Thơ</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button onClick={handleGetTrends} disabled={isLoading || !industry}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Đang phân tích..." : "Xem xu hướng"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {trends && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-sm">{trends}</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
