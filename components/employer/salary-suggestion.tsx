"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, TrendingUp } from "lucide-react"

interface SalarySuggestionProps {
  jobTitle: string
  jobLevel: string
  city: string
  skills?: string[]
  experience?: number
  onSuggestionReceived?: (min: number, max: number) => void
}

export function SalarySuggestion({
  jobTitle,
  jobLevel,
  city,
  skills,
  experience,
  onSuggestionReceived,
}: SalarySuggestionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [suggestion, setSuggestion] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGetSuggestion = async () => {
    if (!jobTitle || !jobLevel || !city) {
      setError("Vui lòng điền đầy đủ thông tin công việc")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/ai/suggest-salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobTitle, jobLevel, city, skills, experience }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Failed to get suggestion")
      }

      setSuggestion(result.data)
      if (onSuggestionReceived) {
        onSuggestionReceived(result.data.min, result.data.max)
      }
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
          <TrendingUp className="w-5 h-5" />
          Gợi ý mức lương AI
        </CardTitle>
        <CardDescription>AI phân tích thị trường và đề xuất mức lương phù hợp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button onClick={handleGetSuggestion} disabled={isLoading || !jobTitle || !jobLevel || !city}>
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? "Đang phân tích..." : "Lấy gợi ý mức lương"}
        </Button>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {suggestion && (
          <div className="space-y-3 p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm font-medium mb-1">Mức lương đề xuất:</p>
              <p className="text-2xl font-bold text-primary">
                {suggestion.min?.toLocaleString("vi-VN")} - {suggestion.max?.toLocaleString("vi-VN")}{" "}
                {suggestion.currency}
              </p>
            </div>
            {suggestion.analysis && (
              <div>
                <p className="text-sm font-medium mb-1">Phân tích:</p>
                <p className="text-sm text-muted-foreground">{suggestion.analysis}</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
