"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { Loader2, Sparkles, Upload, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { TemplatePreview } from "./template-preview"
import { TemplateList } from "./template-list"

interface CVBuilderProps {
  profile: any
  applicantProfile: any
  template: any
   templates: any[] // Thêm prop templates
}

export function CVBuilderProfile({ profile, applicantProfile, template ,templates}: CVBuilderProps) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [cvText, setCvText] = useState("")
  const [parsedData, setParsedData] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const router = useRouter()
  const supabase = createClient()
  const [selectedTemplate, setSelectedTemplate] = useState(template)

  // 1. AI PHÂN TÍCH CV TỰ ĐỘNG
  const handleParseCV = async () => {
    if (!cvText.trim()) {
      alert("Vui lòng nhập nội dung CV")
      return
    }

    setAiLoading(true)
    try {
      const response = await fetch("/api/ai/parse-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cvText }),
      })

      const result = await response.json()

      if (result.data) {
        setParsedData(result.data)
        alert(`CV đã được phân tích! Điểm: ${result.data.resume_score}/100`)
        
        // Tự động điền thông tin vào form
        if (result.data.skills) {
          setSuggestions(result.data.skills)
        }
      }
    } catch (error: any) {
      alert("Lỗi phân tích CV: " + error.message)
    } finally {
      setAiLoading(false)
    }
  }

  // 2. AI GỢI Ý KỸ NĂNG BỔ SUNG
  const handleGetAISuggestions = async () => {
    setAiLoading(true)
    try {
      const response = await fetch("/api/ai/suggest-skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSkills: applicantProfile?.skills || [],
          industry: applicantProfile?.current_position || "",
          experience: applicantProfile?.work_experience || [],
        }),
      })

      const data = await response.json()
      setSuggestions(data.suggestions || [])
    } catch (error) {
      console.error("Error getting AI suggestions:", error)
    } finally {
      setAiLoading(false)
    }
  }

  // 3. AI TẠO CV TỰ ĐỘNG
  const handleGenerateCV = async () => {
    setAiLoading(true)
    try {
      const response = await fetch("/api/ai/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileData: {
            ...profile,
            ...applicantProfile
          },
          templateType: template?.name || "professional",
          targetJob: applicantProfile?.current_position || ""
        }),
      })

      const result = await response.json()
      
      if (result.data?.cvContent) {
        setCvText(result.data.cvContent)
        alert("CV đã được tạo tự động! Hãy kiểm tra và chỉnh sửa nếu cần.")
      }
    } catch (error: any) {
      alert("Lỗi tạo CV: " + error.message)
    } finally {
      setAiLoading(false)
    }
  }
// Tạo PDF và lưu CV
  const handleCreateCV = async () => {
    if (!name.trim()) {
      alert("Vui lòng nhập tên cho CV");
      return;
    }

    if (!name.trim()) {
      alert("Vui lòng nhập tên cho CV");
      return;
    }

    if (!profile.full_name.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    setLoading(true);
    try {
      // 1. Chuẩn bị dữ liệu CV
     const cvData = {
        personal: {
          full_name: profile.full_name,
          email: profile.email,
          phone: profile.phone,
          address: applicantProfile?.address,
          city: applicantProfile?.city,
        },
        summary: applicantProfile?.bio,
        experience: applicantProfile?.work_experience,
        education: applicantProfile?.education,
        skills: applicantProfile?.skills || [],
        languages: applicantProfile?.languages,
        certifications: applicantProfile?.certifications,
        // Thêm dữ liệu từ AI phân tích
        ...(parsedData && { ai_analysis: parsedData })
      }

      console.log("Creating CV with data:", cvData);

      // Validate dữ liệu trước khi gửi
      if (cvData.experience.length === 0) {
        throw new Error("Vui lòng thêm ít nhất một kinh nghiệm làm việc");
      }

      if (cvData.education.length === 0) {
        throw new Error("Vui lòng thêm ít nhất một thông tin học vấn");
      }
     
      let pdfUrl = "";
      try {
        console.log("Calling PDF generation API...");
        const pdfResponse = await fetch("/api/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cvData: cvData,
            template: selectedTemplate?.template_data,
            templateId: selectedTemplate?.id,
          }),
        });

        console.log("PDF response status:", pdfResponse.status);

        if (!pdfResponse.ok) {
          const errorData = await pdfResponse.json();
          throw new Error(errorData.error || "PDF generation failed");
        }

        const pdfResult = await pdfResponse.json();
        pdfUrl = pdfResult.pdfUrl;
        console.log("PDF created and uploaded:", pdfUrl);
      } catch (pdfError: any) {
        console.error("PDF generation error:", pdfError);
        throw new Error(`Lỗi tạo PDF: ${pdfError.message}`);
      }
//  const { error } = await supabase.from("applicant_cvs").insert({
//         applicant_id: applicantProfile.id,
//         name: name.trim(),
//         template_id: selectedTemplate?.id,
//         cv_data: cvData,
//         pdf_url: pdfUrl,
//         is_default: false,
//       })
      // 3. Lưu CV vào database
      const { data: cv, error: cvError } = await supabase
        .from("applicant_cvs")
        .insert({
          applicant_id: applicantProfile.id,
          name: name.trim(),
          template_id: selectedTemplate?.id,
          cv_data: cvData,
          pdf_url: pdfUrl,
          is_default: false,
        })
        .select()
        .single();

      if (cvError) {
        console.error("CV save error:", cvError);
        throw new Error(`Lỗi lưu CV: ${cvError.message}`);
      }

      console.log("CV saved successfully:", cv);

      // Refresh để cập nhật danh sách CV
      router.refresh();
      router.push("/applicant/cvs")
    } catch (err: any) {
      console.error("Error creating CV:", err);
      alert(err.message);
     
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        {/* PHẦN PHÂN TÍCH CV VỚI AI */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Phân Tích & Tạo CV Tự Động
            </CardTitle>
            <CardDescription>
              Tải lên CV có sẵn để AI phân tích hoặc để AI tạo CV mới tự động
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Tạo CV tự động */}
            <div className="space-y-3">
              <Label>AI Tạo CV Tự Động</Label>
              <Button
                onClick={handleGenerateCV}
                disabled={aiLoading}
                variant="outline"
                className="w-full"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang tạo CV...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    AI Tạo CV Tự Động
                  </>
                )}
              </Button>
            </div>

            {/* Phân tích CV */}
            <div className="space-y-3">
              <Label>Hoặc dán CV có sẵn để AI phân tích</Label>
              <Textarea
                placeholder="Dán toàn bộ nội dung CV của bạn vào đây..."
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                rows={8}
              />
              <Button
                onClick={handleParseCV}
                disabled={aiLoading || !cvText.trim()}
                variant="outline"
                className="w-full"
              >
                {aiLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang phân tích...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    AI Phân Tích CV
                  </>
                )}
              </Button>
            </div>

            {/* Hiển thị kết quả phân tích */}
            {parsedData && (
              <div className="p-4 border rounded-lg bg-green-50">
                <h4 className="font-semibold mb-2">Kết quả phân tích AI:</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Điểm CV:</strong> {parsedData.resume_score}/100</p>
                  <p><strong>Kỹ năng phát hiện:</strong> {parsedData.skills?.join(", ")}</p>
                  <p><strong>Kinh nghiệm:</strong> {parsedData.years_of_experience} năm</p>
                  {parsedData.suggested_improvements && (
                    <div>
                      <strong>Gợi ý cải thiện:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {parsedData.suggested_improvements.map((item: string, idx: number) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* PHẦN THÔNG TIN CV CƠ BẢN */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin CV</CardTitle>
            <CardDescription>Đặt tên và chọn template cho CV của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên CV *</Label>
              <Input
                id="name"
                placeholder="VD: CV Frontend Developer - Công ty ABC"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {template && (
              <div className="space-y-2">
                <Label>Template đã chọn</Label>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold">{template.name}</h4>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI GỢI Ý KỸ NĂNG */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              AI Gợi Ý Kỹ Năng Bổ Sung
            </CardTitle>
            <CardDescription>AI phân tích hồ sơ và gợi ý kỹ năng theo ngành nghề</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={handleGetAISuggestions}
              disabled={aiLoading}
              variant="outline"
              className="w-full"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang phân tích...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Nhận gợi ý kỹ năng từ AI
                </>
              )}
            </Button>

            {suggestions.length > 0 && (
              <div className="space-y-3">
                <Label>Kỹ năng được gợi ý:</Label>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Thêm các kỹ năng này vào hồ sơ để tăng cơ hội được tuyển dụng
                </p>
              </div>
            )}
          </CardContent>
           <div>
              {!selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Chọn Template CV</CardTitle>
            <CardDescription>
              Chọn template phù hợp cho CV của bạn. Mỗi template có thiết kế và bố cục khác nhau.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateList
              templates={templates}
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
              mode="selection"
            />
          </CardContent>
        </Card>
      )}

      {/* Hiển thị form tạo CV khi đã chọn template */}
      {selectedTemplate && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Template đã chọn: {selectedTemplate.name}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedTemplate(null)}
                >
                  Thay đổi template
                </Button>
              </CardTitle>
              <CardDescription>
                {selectedTemplate.description}
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Các phần form nhập thông tin CV */}
          {/* ... rest of your CV form */}
        </>
      )}
      </div>
        </Card>
      </div>
            
      {/* SIDEBAR - XEM TRƯỚC VÀ TẠO CV */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Xem trước dữ liệu</CardTitle>
            <CardDescription>Thông tin từ hồ sơ của bạn</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-1">Thông tin cá nhân</h4>
              <p className="text-muted-foreground">{profile?.full_name || "Chưa có"}</p>
              <p className="text-muted-foreground">{profile?.email || "Chưa có"}</p>
              <p className="text-muted-foreground">{profile?.phone || "Chưa có"}</p>
            </div>

            {applicantProfile && (
              <>
                <div>
                  <h4 className="font-semibold mb-1">Kinh nghiệm</h4>
                  <p className="text-muted-foreground">
                    {applicantProfile.years_of_experience || 0} năm - {applicantProfile.current_position || "Chưa cập nhật"}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold mb-1">Kỹ năng hiện tại</h4>
                  <div className="flex flex-wrap gap-1">
                    {applicantProfile.skills?.slice(0, 5).map((skill: string, index: number) => (
                      <span key={index} className="px-2 py-0.5 bg-secondary text-xs rounded">
                        {skill}
                      </span>
                    ))}
                    {applicantProfile.skills?.length > 5 && (
                      <span className="px-2 py-0.5 text-xs text-muted-foreground">
                        +{applicantProfile.skills.length - 5} kỹ năng khác
                      </span>
                    )}
                    {(!applicantProfile.skills || applicantProfile.skills.length === 0) && (
                      <span className="text-xs text-muted-foreground">Chưa có kỹ năng</span>
                    )}
                  </div>
                </div>
              </>
            )}
          </CardContent>
          
        </Card>

        <Button onClick={handleCreateCV} disabled={loading} className="w-full" size="lg">
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Đang tạo...
            </>
          ) : (
            "Tạo CV"
          )}
        </Button>
      </div>
    
    </div>
  )
}