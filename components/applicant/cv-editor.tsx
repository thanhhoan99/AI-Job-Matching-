"use client";

import { Key, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Download, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface Experience {
  position: string;
  company: string;
  duration: string;
  description: string;
  achievements: string[];
}

interface Education {
  degree: string;
  school: string;
  year: string;
  gpa: string;
}

interface Language {
  language: string;
  proficiency: string;
}

interface PersonalInfo {
  full_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
}

interface FormData {
  name: string;
  personal: PersonalInfo;
  summary: string;
  experiences: Experience[];
  educations: Education[];
  skills: string[];
  languages: Language[];
  certifications: string[];
}

interface CVEditorProps {
  cvData: any;
}

export function CVEditor({ cvData }: CVEditorProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: cvData.name,
    personal: cvData.cv_data.personal || {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    },
    summary: cvData.cv_data.summary || "",
    experiences: cvData.cv_data.experience || [
      {
        position: "",
        company: "",
        duration: "",
        description: "",
        achievements: [""],
      },
    ],
    educations: cvData.cv_data.education || [
      {
        degree: "",
        school: "",
        year: "",
        gpa: "",
      },
    ],
    skills: cvData.cv_data.skills || [""],
    languages: cvData.cv_data.languages || [
      {
        language: "",
        proficiency: "Cơ bản",
      },
    ],
    certifications: cvData.cv_data.certifications || [""],
  });

  // Các hàm xử lý form tương tự như CVBuilder...

  const handleUpdateCV = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Chuẩn bị dữ liệu CV
      const updatedCVData = {
        personal: formData.personal,
        summary: formData.summary,
        experience: formData.experiences.filter(
          (exp: { position: any; company: any }) => exp.position && exp.company
        ),
        education: formData.educations.filter(
          (edu: { degree: any; school: any }) => edu.degree && edu.school
        ),
        skills: formData.skills.filter((skill: string) => skill.trim()),
        languages: formData.languages.filter(
          (lang: { language: any }) => lang.language
        ),
        certifications: formData.certifications.filter((cert: string) =>
          cert.trim()
        ),
      };
      console.log("Dữ liệu CV cập nhật:", updatedCVData);
      // Gọi API để tạo PDF mới
      const pdfResponse = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvData: updatedCVData,
          template: "professional",
        }),
      });

      if (!pdfResponse.ok) {
        throw new Error("Không thể tạo PDF");
      }

      const pdfResult = await pdfResponse.json();

      if (!pdfResult.pdfUrl) {
        throw new Error("Không nhận được URL PDF");
      }

      // Cập nhật CV trong database
      const { error: updateError } = await supabase
        .from("applicant_cvs")
        .update({
          name: formData.name,
          cv_data: updatedCVData,
          pdf_url: pdfResult.pdfUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", cvData.id);

      if (updateError) {
        throw new Error(`Lỗi cập nhật CV: ${updateError.message}`);
      }

      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {success && (
        <Alert className="bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">
            ✅ Cập nhật CV thành công!
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className="bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-4 mb-6">
        <Button asChild variant="outline">
          <a href={cvData.pdf_url} target="_blank" rel="noopener noreferrer">
            <Eye className="w-4 h-4 mr-2" />
            Xem PDF hiện tại
          </a>
        </Button>
        <Button asChild variant="outline">
          <a href={cvData.pdf_url} download>
            <Download className="w-4 h-4 mr-2" />
            Tải PDF hiện tại
          </a>
        </Button>
      </div>

      {/* Form tương tự như CVBuilder nhưng với dữ liệu hiện có */}

          {/* Thông tin CV */}
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
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* {template && (
                <div className="space-y-2">
                  <Label>Template đã chọn</Label>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                </div>
              )} */}
            </CardContent>
          </Card>

          {/* Thông tin cá nhân */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Thông tin cơ bản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Họ và tên *</Label>
                  <Input
                    id="full_name"
                    value={formData.personal.full_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, full_name: e.target.value } }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, email: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input
                    id="phone"
                    value={formData.personal.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, phone: e.target.value } }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Thành phố</Label>
                  <Input
                    id="city"
                    value={formData.personal.city}
                    onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, city: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ</Label>
                <Input
                  id="address"
                  value={formData.personal.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, personal: { ...prev.personal, address: e.target.value } }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Giới thiệu bản thân</Label>
                <Textarea
                  id="summary"
                  rows={4}
                  placeholder="Mô tả ngắn gọn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                  value={formData.summary}
                  onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Kinh nghiệm làm việc */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kinh nghiệm làm việc</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, experiences: [...prev.experiences, { position: '', company: '', duration: '', description: '' }] }))}>
                  + Thêm kinh nghiệm
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.experiences.map((exp: Experience, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Vị trí *</Label>
                      <Input
                        value={exp.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, experiences: [...prev.experiences.slice(0, index), { ...prev.experiences[index], position: e.target.value }, ...prev.experiences.slice(index + 1)] }))}
                        placeholder="VD: Frontend Developer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Công ty *</Label>
                      <Input
                        value={exp.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, experiences: [...prev.experiences.slice(0, index), { ...prev.experiences[index], company: e.target.value }, ...prev.experiences.slice(index + 1)] }))}
                        placeholder="VD: Công ty ABC"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Thời gian</Label>
                    <Input
                      value={exp.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, experiences: [...prev.experiences.slice(0, index), { ...prev.experiences[index], duration: e.target.value }, ...prev.experiences.slice(index + 1)] }))}
                      placeholder="VD: 01/2020 - 12/2023"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Mô tả công việc</Label>
                    <Textarea
                      value={exp.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, experiences: [...prev.experiences.slice(0, index), { ...prev.experiences[index], description: e.target.value }, ...prev.experiences.slice(index + 1)] }))}
                      placeholder="Mô tả nhiệm vụ và trách nhiệm..."
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Học vấn */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Học vấn</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, educations: [...prev.educations, { degree: '', school: '', year: '', gpa: '' }] }))}>
                  + Thêm học vấn
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.educations.map((edu: Education, index: number) => (
                <div key={index} className="p-4 border rounded-lg space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Bằng cấp *</Label>
                      <Input
                        value={edu.degree}
                        onChange={(e) => setFormData(prev => ({ ...prev, educations: [...prev.educations.slice(0, index), { ...prev.educations[index], degree: e.target.value }, ...prev.educations.slice(index + 1)] }))}
                        placeholder="VD: Cử nhân Công nghệ thông tin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Trường *</Label>
                      <Input
                        value={edu.school}
                        onChange={(e) => setFormData(prev => ({ ...prev, educations: [...prev.educations.slice(0, index), { ...prev.educations[index], school: e.target.value }, ...prev.educations.slice(index + 1)] }))}
                        placeholder="VD: Đại học Bách Khoa"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Năm tốt nghiệp</Label>
                      <Input
                        value={edu.year}
                        onChange={(e) => setFormData(prev => ({ ...prev, educations: [...prev.educations.slice(0, index), { ...prev.educations[index], year: e.target.value }, ...prev.educations.slice(index + 1)] }))}
                        placeholder="VD: 2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>GPA</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => setFormData(prev => ({ ...prev, educations: [...prev.educations.slice(0, index), { ...prev.educations[index], gpa: e.target.value }, ...prev.educations.slice(index + 1)] }))}
                        placeholder="VD: 3.5/4"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Kỹ năng */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kỹ năng</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, skills: [...prev.skills, ''] }))}>
                  + Thêm kỹ năng
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.skills.map((skill: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={skill}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: [...prev.skills.slice(0, index), e.target.value, ...prev.skills.slice(index + 1)] }))}
                    placeholder="VD: JavaScript, React, Node.js..."
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Ngôn ngữ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Ngôn ngữ</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, languages: [...prev.languages, { language: '', proficiency: '' }] }))}>
                  + Thêm ngôn ngữ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.languages.map((lang: Language, index: number) => (
                <div key={index} className="grid gap-4 md:grid-cols-2">
                  <Input
                    value={lang.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, languages: [...prev.languages.slice(0, index), { ...prev.languages[index], language: e.target.value }, ...prev.languages.slice(index + 1)] }))}
                    placeholder="VD: Tiếng Anh"
                  />
                  <Select 
                    value={lang.proficiency} 
                    onValueChange={(value) => setFormData(prev => ({ ...prev, languages: [...prev.languages.slice(0, index), { ...prev.languages[index], proficiency: value }, ...prev.languages.slice(index + 1)] }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Trình độ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                      <SelectItem value="Trung bình">Trung bình</SelectItem>
                      <SelectItem value="Thành thạo">Thành thạo</SelectItem>
                      <SelectItem value="Bản ngữ">Bản ngữ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Chứng chỉ */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chứng chỉ</CardTitle>
                <Button type="button" variant="outline" size="sm" onClick={() => setFormData(prev => ({ ...prev, certifications: [...prev.certifications, ''] }))}>
                  + Thêm chứng chỉ
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.certifications.map((cert: string, index: number) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={cert}
                    onChange={(e) => setFormData(prev => ({ ...prev, certifications: [...prev.certifications.slice(0, index), e.target.value, ...prev.certifications.slice(index + 1)] }))}
                    placeholder="VD: AWS Certified Developer, Google Analytics..."
                  />
                </div>
              ))}
            </CardContent>
          </Card>
      

      <Button onClick={handleUpdateCV} disabled={isLoading} size="lg">
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang cập nhật...
          </>
        ) : (
          "Cập nhật CV & Tạo PDF mới"
        )}
      </Button>
    </div>
  );
}
