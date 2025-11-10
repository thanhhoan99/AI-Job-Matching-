"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Loader2 } from "lucide-react"

export function JDGenerator() {
  const [jobTitle, setJobTitle] = useState("")
  const [jobLevel, setJobLevel] = useState("junior")
  const [skills, setSkills] = useState("")
  const [experience, setExperience] = useState("0")
  const [generatedJD, setGeneratedJD] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleGenerate = async () => {
    if (!jobTitle) {
      alert("Vui lòng nhập tiêu đề công việc")
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/generate-jd", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobTitle,
          jobLevel,
          skills: skills.split(",").map((s) => s.trim()),
          experience: Number(experience),
        }),
      })

      const result = await response.json()
      if (result.data?.description) {
        setGeneratedJD(result.data.description)
      }
    } catch (error) {
      alert("Không thể tạo mô tả công việc")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5" />
          Tạo Mô Tả Công Việc với AI
        </CardTitle>
        <CardDescription>AI sẽ giúp bạn tạo bản mô tả công việc chuyên nghiệp</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="jd-title">Tiêu đề công việc</Label>
            <Input
              id="jd-title"
              placeholder="VD: Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jd-level">Cấp bậc</Label>
            <Select value={jobLevel} onValueChange={setJobLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="intern">Thực tập sinh</SelectItem>
                <SelectItem value="junior">Junior</SelectItem>
                <SelectItem value="middle">Middle</SelectItem>
                <SelectItem value="senior">Senior</SelectItem>
                <SelectItem value="lead">Team Lead</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="jd-skills">Kỹ năng (phân cách bằng dấu phẩy)</Label>
            <Input
              id="jd-skills"
              placeholder="VD: React, TypeScript, Node.js"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="jd-experience">Số năm kinh nghiệm</Label>
            <Input
              id="jd-experience"
              type="number"
              min="0"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang tạo...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Tạo mô tả công việc
            </>
          )}
        </Button>

        {generatedJD && (
          <div className="space-y-2">
            <Label>Mô tả công việc được tạo</Label>
            <Textarea rows={12} value={generatedJD} readOnly className="font-mono text-sm" />
            <Button
              variant="outline"
              onClick={() => {
                navigator.clipboard.writeText(generatedJD)
                alert("Đã sao chép vào clipboard!")
              }}
              className="w-full"
            >
              Sao chép
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
