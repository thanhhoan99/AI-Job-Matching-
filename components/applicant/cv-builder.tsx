
// "use client";

// import { useState, useRef, useEffect } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { createClient } from "@/lib/supabase/client";
// import { useRouter } from "next/navigation";
// import {
//   Loader2,
//   Sparkles,
//   Upload,
//   FileText,
//   Download,
//   Eye,
//   Edit,
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { TemplateList } from "./template-list";
// // import { TemplatePreview } from "./template-preview"

// import { PDFPreview } from "./pdf-preview";
// import { TemplatePreviewModal } from "./template-preview-modal";
// import { CVJobGenerator } from "./cv-job-generator";
// import styles from '../../styles/cv-builder.module.css';

// // Định nghĩa types
// interface Experience {
//   position: string;
//   company: string;
//   duration: string;
//   description: string;
//   achievements: string[];
// }

// interface Education {
//   degree: string;
//   school: string;
//   year: string;
//   gpa: string;
// }

// interface Language {
//   language: string;
//   proficiency: string;
// }

// interface PersonalInfo {
//   full_name: string;
//   email: string;
//   phone: string;
//   address: string;
//   city: string;
// }

// interface FormData {
//   name: string;
//   personal: PersonalInfo;
//   summary: string;
//   experiences: Experience[];
//   educations: Education[];
//   skills: string[];
//   languages: Language[];
//   certifications: string[];
// }

// interface CVBuilderProps {
//   profile: any;
//   applicantProfile: any;
//   template: any;
//   templates: any[];
// }

// export function CVBuilder({
//   profile,
//   applicantProfile,
//   template,
//   templates,
// }: CVBuilderProps) {
//   const router = useRouter();
//   const supabase = createClient();
//   const [isLoading, setIsLoading] = useState(false);
//   const [aiLoading, setAiLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [createdCV, setCreatedCV] = useState<any>(null);

//   const [selectedTemplate, setSelectedTemplate] = useState(template);
//   const [previewOpen, setPreviewOpen] = useState(false);
//   const [generatedCV, setGeneratedCV] = useState<any>(null)

//   // Form state - KHÔNG lấy dữ liệu từ profile
//   const [formData, setFormData] = useState<FormData>({
//     name: "",
//     personal: {
//       full_name: "",
//       email: "",
//       phone: "",
//       address: "",
//       city: "",
//     },
//     summary: "",
//     experiences: [
//       {
//         position: "",
//         company: "",
//         duration: "",
//         description: "",
//         achievements: [""],
//       },
//     ],
//     educations: [
//       {
//         degree: "",
//         school: "",
//         year: "",
//         gpa: "",
//       },
//     ],
//     skills: [""],
//     languages: [
//       {
//         language: "",
//         proficiency: "Cơ bản",
//       },
//     ],
//     certifications: [""],
//   });

//   // Thêm kinh nghiệm
//   const addExperience = () => {
//     setFormData((prev) => ({
//       ...prev,
//       experiences: [
//         ...prev.experiences,
//         {
//           position: "",
//           company: "",
//           duration: "",
//           description: "",
//           achievements: [""],
//         },
//       ],
//     }));
//   };

//   // Thêm học vấn
//   const addEducation = () => {
//     setFormData((prev) => ({
//       ...prev,
//       educations: [
//         ...prev.educations,
//         {
//           degree: "",
//           school: "",
//           year: "",
//           gpa: "",
//         },
//       ],
//     }));
//   };

//   // Thêm kỹ năng
//   const addSkill = () => {
//     setFormData((prev) => ({
//       ...prev,
//       skills: [...prev.skills, ""],
//     }));
//   };

//   // Thêm chứng chỉ
//   const addCertification = () => {
//     setFormData((prev) => ({
//       ...prev,
//       certifications: [...prev.certifications, ""],
//     }));
//   };

//   // Thêm ngôn ngữ
//   const addLanguage = () => {
//     setFormData((prev) => ({
//       ...prev,
//       languages: [
//         ...prev.languages,
//         {
//           language: "",
//           proficiency: "Cơ bản",
//         },
//       ],
//     }));
//   };

//   // Xử lý thay đổi kinh nghiệm - FIX TYPE ERROR
//   const handleExperienceChange = (
//     index: number,
//     field: keyof Experience,
//     value: string
//   ) => {
//     const updatedExperiences = [...formData.experiences];
//     updatedExperiences[index] = {
//       ...updatedExperiences[index],
//       [field]: value,
//     };
//     setFormData((prev) => ({ ...prev, experiences: updatedExperiences }));
//   };

//   // Xử lý thay đổi học vấn - FIX TYPE ERROR
//   const handleEducationChange = (
//     index: number,
//     field: keyof Education,
//     value: string
//   ) => {
//     const updatedEducations = [...formData.educations];
//     updatedEducations[index] = { ...updatedEducations[index], [field]: value };
//     setFormData((prev) => ({ ...prev, educations: updatedEducations }));
//   };

//   // Xử lý thay đổi kỹ năng
//   const handleSkillChange = (index: number, value: string) => {
//     const updatedSkills = [...formData.skills];
//     updatedSkills[index] = value;
//     setFormData((prev) => ({ ...prev, skills: updatedSkills }));
//   };

//   // Xử lý thay đổi ngôn ngữ - FIX TYPE ERROR
//   const handleLanguageChange = (
//     index: number,
//     field: keyof Language,
//     value: string
//   ) => {
//     const updatedLanguages = [...formData.languages];
//     updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
//     setFormData((prev) => ({ ...prev, languages: updatedLanguages }));
//   };

//   // Xử lý thay đổi chứng chỉ
//   const handleCertificationChange = (index: number, value: string) => {
//     const updatedCertifications = [...formData.certifications];
//     updatedCertifications[index] = value;
//     setFormData((prev) => ({ ...prev, certifications: updatedCertifications }));
//   };

//   // Xử lý thay đổi thông tin cá nhân - FIX TYPE ERROR
//   const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
//     setFormData((prev) => ({
//       ...prev,
//       personal: { ...prev.personal, [field]: value },
//     }));
//   };

//   // AI Tạo CV tự động
//   const handleGenerateCV = async () => {
//     setAiLoading(true);
//     try {
//       const response = await fetch("/api/ai/generate-cv", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           targetJob: formData.experiences[0]?.position || "",
//           experienceLevel: "mid",
//         }),
//       });

//       const result = await response.json();

//       if (result.data?.cvContent) {
//         alert("CV đã được tạo tự động! Hãy kiểm tra và chỉnh sửa nếu cần.");
//       }
//     } catch (error: any) {
//       alert("Lỗi tạo CV: " + error.message);
//     } finally {
//       setAiLoading(false);
//     }
//   };
//   const previewCVData = {
//     personal: formData.personal,
//     summary: formData.summary,
//     experience: formData.experiences.filter(
//       (exp) => exp.position && exp.company
//     ),
//     education: formData.educations.filter((edu) => edu.degree && edu.school),
//     skills: formData.skills.filter((skill) => skill.trim()),
//     languages: formData.languages.filter((lang) => lang.language),
//     certifications: formData.certifications.filter((cert) => cert.trim()),
//     current_position: formData.experiences[0]?.position || "",
//   };
//   // Tạo PDF và lưu CV
//   const handleCreateCV = async () => {
//     if (!formData.name.trim()) {
//       alert("Vui lòng nhập tên cho CV");
//       return;
//     }

//     if (!formData.personal.full_name.trim()) {
//       alert("Vui lòng nhập họ tên");
//       return;
//     }

//     setIsLoading(true);
//     setError(null);
//     setSuccess(false);

//     try {
//       // 1. Chuẩn bị dữ liệu CV
//       const cvData = {
//         personal: formData.personal,
//         summary: formData.summary,
//         experience: formData.experiences.filter(
//           (exp) => exp.position && exp.company
//         ),
//         education: formData.educations.filter(
//           (edu) => edu.degree && edu.school
//         ),
//         skills: formData.skills.filter((skill) => skill.trim()),
//         languages: formData.languages.filter((lang) => lang.language),
//         certifications: formData.certifications.filter((cert) => cert.trim()),
//       };
//       console.log("Creating CV with data:", cvData);

//       // Validate dữ liệu trước khi gửi
//       if (cvData.experience.length === 0) {
//         throw new Error("Vui lòng thêm ít nhất một kinh nghiệm làm việc");
//       }

//       if (cvData.education.length === 0) {
//         throw new Error("Vui lòng thêm ít nhất một thông tin học vấn");
//       }
     
//       let pdfUrl = "";
//       try {
//         console.log("Calling PDF generation API...");
//         const pdfResponse = await fetch("/api/generate-pdf", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             cvData: cvData,
//             template: selectedTemplate?.template_data,
//             templateId: selectedTemplate?.id,
//           }),
//         });

//         console.log("PDF response status:", pdfResponse.status);

//         if (!pdfResponse.ok) {
//           const errorData = await pdfResponse.json();
//           throw new Error(errorData.error || "PDF generation failed");
//         }

//         const pdfResult = await pdfResponse.json();
//         pdfUrl = pdfResult.pdfUrl;
//         console.log("PDF created and uploaded:", pdfUrl);
//       } catch (pdfError: any) {
//         console.error("PDF generation error:", pdfError);
//         throw new Error(`Lỗi tạo PDF: ${pdfError.message}`);
//       }

//       // 3. Lưu CV vào database
//       const { data: cv, error: cvError } = await supabase
//         .from("applicant_cvs")
//         .insert({
//           applicant_id: applicantProfile.id,
//           name: formData.name.trim(),
//           template_id: template?.id,
//           cv_data: cvData,
//           pdf_url: pdfUrl,
//           is_default: false,
//         })
//         .select()
//         .single();

//       if (cvError) {
//         console.error("CV save error:", cvError);
//         throw new Error(`Lỗi lưu CV: ${cvError.message}`);
//       }

//       console.log("CV saved successfully:", cv);

//       setCreatedCV(cv);
//       setSuccess(true);
  
//     // 4. TẠO CV EMBEDDING NGAY SAU KHI TẠO CV
//       // if (cv?.id) {
//       //   try {
//       //     console.log("Generating embedding for CV:", cv.id);
//       //     const embeddingResponse = await fetch("/api/ai/generate-cv-embedding", {
//       //       method: "POST",
//       //       headers: { "Content-Type": "application/json" },
//       //       body: JSON.stringify({ cvId: cv.id }),
//       //     });

//       //     if (!embeddingResponse.ok) {
//       //       console.error("Failed to generate CV embedding, but CV was created successfully");
//       //     } else {
//       //       console.log("CV embedding generated successfully");
            
//       //       // Hiển thị thông báo về gợi ý việc làm
//       //       alert("CV đã được tạo thành công! Hệ thống sẽ tự động gợi ý việc làm phù hợp.");
//       //     }
//       //   } catch (embeddingError) {
//       //     console.error("Error generating CV embedding:", embeddingError);
//       //     // Vẫn hiển thị thông báo thành công vì CV đã được tạo
//       //     alert("CV đã được tạo thành công! Có lỗi khi tạo embedding, nhưng bạn vẫn có thể sử dụng CV.");
//       //   }
//       // }

//       // Refresh để cập nhật danh sách CV
//       router.refresh();
//     } catch (err: any) {
//       console.error("Error creating CV:", err);
//       setError(err.message);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   // CẬP NHẬT: Thêm vào CVBuilder component
// useEffect(() => {
//   const generateEmbeddingForCV = async () => {
//     // THÊM KIỂM TRA applicantProfile
//     if (createdCV?.id && success && applicantProfile?.id) {
//       try {
//         console.log("Generating embedding for CV:", createdCV.id);
//         const response = await fetch("/api/ai/generate-cv-embedding", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ cvId: createdCV.id }),
//         });

//         if (!response.ok) {
//           throw new Error("Failed to generate CV embedding");
//         }

//         const result = await response.json();
//         console.log("CV embedding generated successfully:", result);
        
//         // Hiển thị thông báo về gợi ý việc làm
//         alert("CV đã được tạo thành công! Hệ thống sẽ tự động gợi ý việc làm phù hợp.");
        
//       } catch (error) {
//         console.error("Error generating CV embedding:", error);
//       }
//     }
//   };

//   generateEmbeddingForCV();
// }, [createdCV, success, applicantProfile?.id]); // THÊM applicantProfile.id vào dependencies

//   return (
//     <div className="space-y-6">
//       {success && createdCV && (
//         <Alert className="bg-green-50 border-green-200">
//           <AlertDescription className="text-green-800">
//             ✅ Tạo CV thành công!
//             <div className="flex gap-2 mt-2">
//               <Button asChild size="sm">
//                 <a
//                   href={createdCV.pdf_url}
//                   target="_blank"
//                   rel="noopener noreferrer"
//                 >
//                   <Eye className="w-4 h-4 mr-1" />
//                   Xem PDF
//                 </a>
//               </Button>
//               <Button asChild variant="outline" size="sm">
//                 <a href={createdCV.pdf_url} download>
//                   <Download className="w-4 h-4 mr-1" />
//                   Tải PDF
//                 </a>
//               </Button>
//               <Button asChild variant="outline" size="sm">
//                 <a href={`/applicant/cvs/${createdCV.id}/edit`}>
//                   <Edit className="w-4 h-4 mr-1" />
//                   Chỉnh sửa CV
//                 </a>
//               </Button>
//             </div>
//           </AlertDescription>
//         </Alert>
//       )}

//       {error && (
//         <Alert className="bg-red-50 border-red-200">
//           <AlertDescription className="text-red-800">{error}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid gap-6 lg:grid-cols-3">
//         <div className="lg:col-span-2 space-y-6">
//           {/* Thông tin CV */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Thông tin CV</CardTitle>
//               <CardDescription>
//                 Đặt tên và chọn template cho CV của bạn
//               </CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="name">Tên CV *</Label>
//                 <Input
//                   id="name"
//                   placeholder="VD: CV Frontend Developer - Công ty ABC"
//                   value={formData.name}
//                   onChange={(e) =>
//                     setFormData((prev) => ({ ...prev, name: e.target.value }))
//                   }
//                 />
//               </div>

//               {template && (
//                 <div className="space-y-2">
//                   <Label>Template đã chọn</Label>
//                   <div className="p-4 border rounded-lg">
//                     <h4 className="font-semibold">{template.name}</h4>
//                     <p className="text-sm text-muted-foreground">
//                       {template.description}
//                     </p>
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//           {/* <Card>
//         <CardHeader>
//           <CardTitle>Chọn Template CV</CardTitle>
//           <CardDescription>Chọn template phù hợp cho CV của bạn. Bạn có thể xem trước trước khi chọn.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <TemplatePreview
//             templates={template}
//             selectedTemplate={selectedTemplate}
//             onSelectTemplate={setSelectedTemplate}
//           />
//         </CardContent>
//       </Card> */}
//           {!selectedTemplate && (
//             <Card>
//               <CardHeader>
//                 <CardTitle>Chọn Template CV</CardTitle>
//                 <CardDescription>
//                   Chọn template phù hợp cho CV của bạn. Mỗi template có thiết kế
//                   và bố cục khác nhau.
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <TemplateList
//                   templates={templates}
//                   selectedTemplate={selectedTemplate}
//                   onSelectTemplate={setSelectedTemplate}
//                   mode="selection"
//                 />
//               </CardContent>
//             </Card>
//           )}

//           {/* Hiển thị form tạo CV khi đã chọn template */}
//           {/* {selectedTemplate && (
//         <>
//           <Card>
//             <CardHeader>
//               <CardTitle className="flex items-center justify-between">
//                 <span>Template đã chọn: {selectedTemplate.name}</span>
//                 <Button 
//                   variant="outline" 
//                   size="sm"
//                   onClick={() => setSelectedTemplate(null)}
//                 >
//                   Thay đổi template
//                 </Button>
//               </CardTitle>
//               <CardDescription>
//                 {selectedTemplate.description}
//               </CardDescription>
//             </CardHeader>
//           </Card> */}

//           {/* Các phần form nhập thông tin CV */}
//           {/* ... rest of your CV form */}
//           {/* </>
//       )} */}

//           {/* Thông tin cá nhân */}
//           <Card>
//             <CardHeader>
//               <CardTitle>Thông tin cá nhân</CardTitle>
//               <CardDescription>Thông tin cơ bản của bạn</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="full_name">Họ và tên *</Label>
//                   <Input
//                     id="full_name"
//                     value={formData.personal.full_name}
//                     onChange={(e) =>
//                       handlePersonalChange("full_name", e.target.value)
//                     }
//                     required
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="email">Email</Label>
//                   <Input
//                     id="email"
//                     type="email"
//                     value={formData.personal.email}
//                     onChange={(e) =>
//                       handlePersonalChange("email", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="grid gap-4 md:grid-cols-2">
//                 <div className="space-y-2">
//                   <Label htmlFor="phone">Số điện thoại</Label>
//                   <Input
//                     id="phone"
//                     value={formData.personal.phone}
//                     onChange={(e) =>
//                       handlePersonalChange("phone", e.target.value)
//                     }
//                   />
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="city">Thành phố</Label>
//                   <Input
//                     id="city"
//                     value={formData.personal.city}
//                     onChange={(e) =>
//                       handlePersonalChange("city", e.target.value)
//                     }
//                   />
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="address">Địa chỉ</Label>
//                 <Input
//                   id="address"
//                   value={formData.personal.address}
//                   onChange={(e) =>
//                     handlePersonalChange("address", e.target.value)
//                   }
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="summary">Giới thiệu bản thân</Label>
//                 <Textarea
//                   id="summary"
//                   rows={4}
//                   placeholder="Mô tả ngắn gọn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
//                   value={formData.summary}
//                   onChange={(e) =>
//                     setFormData((prev) => ({
//                       ...prev,
//                       summary: e.target.value,
//                     }))
//                   }
//                 />
//               </div>
//             </CardContent>
//           </Card>

//           {/* Kinh nghiệm làm việc */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Kinh nghiệm làm việc</CardTitle>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={addExperience}
//                 >
//                   + Thêm kinh nghiệm
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {formData.experiences.map((exp: Experience, index: number) => (
//                 <div key={index} className="p-4 border rounded-lg space-y-4">
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <Label>Vị trí *</Label>
//                       <Input
//                         value={exp.position}
//                         onChange={(e) =>
//                           handleExperienceChange(
//                             index,
//                             "position",
//                             e.target.value
//                           )
//                         }
//                         placeholder="VD: Frontend Developer"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Công ty *</Label>
//                       <Input
//                         value={exp.company}
//                         onChange={(e) =>
//                           handleExperienceChange(
//                             index,
//                             "company",
//                             e.target.value
//                           )
//                         }
//                         placeholder="VD: Công ty ABC"
//                       />
//                     </div>
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Thời gian</Label>
//                     <Input
//                       value={exp.duration}
//                       onChange={(e) =>
//                         handleExperienceChange(
//                           index,
//                           "duration",
//                           e.target.value
//                         )
//                       }
//                       placeholder="VD: 01/2020 - 12/2023"
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label>Mô tả công việc</Label>
//                     <Textarea
//                       value={exp.description}
//                       onChange={(e) =>
//                         handleExperienceChange(
//                           index,
//                           "description",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Mô tả nhiệm vụ và trách nhiệm..."
//                       rows={3}
//                     />
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Học vấn */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Học vấn</CardTitle>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={addEducation}
//                 >
//                   + Thêm học vấn
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-6">
//               {formData.educations.map((edu: Education, index: number) => (
//                 <div key={index} className="p-4 border rounded-lg space-y-4">
//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <Label>Bằng cấp *</Label>
//                       <Input
//                         value={edu.degree}
//                         onChange={(e) =>
//                           handleEducationChange(index, "degree", e.target.value)
//                         }
//                         placeholder="VD: Cử nhân Công nghệ thông tin"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Trường *</Label>
//                       <Input
//                         value={edu.school}
//                         onChange={(e) =>
//                           handleEducationChange(index, "school", e.target.value)
//                         }
//                         placeholder="VD: Đại học Bách Khoa"
//                       />
//                     </div>
//                   </div>

//                   <div className="grid gap-4 md:grid-cols-2">
//                     <div className="space-y-2">
//                       <Label>Năm tốt nghiệp</Label>
//                       <Input
//                         value={edu.year}
//                         onChange={(e) =>
//                           handleEducationChange(index, "year", e.target.value)
//                         }
//                         placeholder="VD: 2020"
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>GPA</Label>
//                       <Input
//                         value={edu.gpa}
//                         onChange={(e) =>
//                           handleEducationChange(index, "gpa", e.target.value)
//                         }
//                         placeholder="VD: 3.5/4"
//                       />
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Kỹ năng */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Kỹ năng</CardTitle>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={addSkill}
//                 >
//                   + Thêm kỹ năng
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {formData.skills.map((skill: string, index: number) => (
//                 <div key={index} className="flex gap-2">
//                   <Input
//                     value={skill}
//                     onChange={(e) => handleSkillChange(index, e.target.value)}
//                     placeholder="VD: JavaScript, React, Node.js..."
//                   />
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Ngôn ngữ */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Ngôn ngữ</CardTitle>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={addLanguage}
//                 >
//                   + Thêm ngôn ngữ
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {formData.languages.map((lang: Language, index: number) => (
//                 <div key={index} className="grid gap-4 md:grid-cols-2">
//                   <Input
//                     value={lang.language}
//                     onChange={(e) =>
//                       handleLanguageChange(index, "language", e.target.value)
//                     }
//                     placeholder="VD: Tiếng Anh"
//                   />
//                   <Select
//                     value={lang.proficiency}
//                     onValueChange={(value) =>
//                       handleLanguageChange(index, "proficiency", value)
//                     }
//                   >
//                     <SelectTrigger>
//                       <SelectValue placeholder="Trình độ" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="Cơ bản">Cơ bản</SelectItem>
//                       <SelectItem value="Trung bình">Trung bình</SelectItem>
//                       <SelectItem value="Thành thạo">Thành thạo</SelectItem>
//                       <SelectItem value="Bản ngữ">Bản ngữ</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               ))}
//             </CardContent>
//           </Card>

//           {/* Chứng chỉ */}
//           <Card>
//             <CardHeader>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Chứng chỉ</CardTitle>
//                 <Button
//                   type="button"
//                   variant="outline"
//                   size="sm"
//                   onClick={addCertification}
//                 >
//                   + Thêm chứng chỉ
//                 </Button>
//               </div>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               {formData.certifications.map((cert: string, index: number) => (
//                 <div key={index} className="flex gap-2">
//                   <Input
//                     value={cert}
//                     onChange={(e) =>
//                       handleCertificationChange(index, e.target.value)
//                     }
//                     placeholder="VD: AWS Certified Developer, Google Analytics..."
//                   />
//                 </div>
//               ))}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Sidebar */}
//         <div className="space-y-6">
//           {/* <CVJobGenerator 
//   profile={profile}
//   applicantProfile={applicantProfile}
//   onCVGenerated={(cvData) => {
//     setGeneratedCV(cvData)
//     // Tự động điền dữ liệu vào form
//     setFormData(prev => ({
//       ...prev,
//       personal: cvData.personal,
//       summary: cvData.summary,
//       experiences: cvData.experience,
//       educations: cvData.education,
//       skills: cvData.skills,
//       languages: cvData.languages.map((lang: string) => ({ language: lang, proficiency: "Thành thạo" })),
//       certifications: cvData.certifications
//     }))
//   }}
// /> */}
//   {/* AI Tools */}
//   <CVJobGenerator 
//     profile={profile}
//     applicantProfile={applicantProfile}
//     onCVGenerated={(cvData) => {
//       setGeneratedCV(cvData)
//       // Tự động điền dữ liệu vào form
//       setFormData(prev => ({
//         ...prev,
//         personal: {
//           ...prev.personal,
//           ...cvData.personal
//         },
//         summary: cvData.summary,
//         experiences: cvData.experience || [],
//         educations: cvData.education || [],
//         skills: cvData.skills || [],
//         languages: (cvData.languages || []).map((lang: string) => ({ 
//           language: lang, 
//           proficiency: "Thành thạo" 
//         })),
//         certifications: cvData.certifications || []
//       }))
//     }}
//   />

//       <Card>
//   <CardHeader>
//     <CardTitle className="flex items-center gap-2">
//       <Sparkles className="w-5 h-5 text-primary" />
//       Template đã chọn
//     </CardTitle>
//   </CardHeader>
//   <CardContent className="space-y-4">
//     {selectedTemplate && (
//       <>
//         <div className="p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50">
//           <h4 className="font-semibold text-lg">{selectedTemplate.name}</h4>
//           <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
//           <div className="flex items-center gap-2 mt-3">
//             <Badge variant="secondary">
//               {selectedTemplate.template_data?.layout === 'modern' ? 'Hiện đại' : 
//                selectedTemplate.template_data?.layout === 'classic' ? 'Cổ điển' :
//                selectedTemplate.template_data?.layout === 'creative' ? 'Sáng tạo' :
//                selectedTemplate.template_data?.layout === 'minimalist' ? 'Tối giản' : 
//                selectedTemplate.template_data?.layout}
//             </Badge>
//             <div className="flex gap-1">
//               <div 
//                 className="w-4 h-4 rounded-full border"
//                 style={{ backgroundColor: selectedTemplate.template_data?.colors?.primary }}
//               ></div>
//               <div 
//                 className="w-4 h-4 rounded-full border"
//                 style={{ backgroundColor: selectedTemplate.template_data?.colors?.secondary }}
//               ></div>
//             </div>
//           </div>
//         </div>

//         <TemplatePreviewModal template={selectedTemplate}>
//           <Button variant="outline" className="w-full">
//             <Eye className="w-4 h-4 mr-2" />
//             Xem trước template
//           </Button>
//         </TemplatePreviewModal>

//         <PDFPreview 
//           cvData={previewCVData}
//           template={selectedTemplate?.template_data}
//           templateName={selectedTemplate?.name}
//         >
//           <Button variant="outline" className="w-full">
//             <Eye className="w-4 h-4 mr-2" />
//             Xem trước CV của bạn
//           </Button>
//         </PDFPreview>
//       </>
//     )}
    
//     <Button 
//       onClick={handleCreateCV} 
//       disabled={isLoading}
//       className="w-full"
//       size="lg"
//     >
//       {isLoading ? (
//         <>
//           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//           Đang tạo CV và PDF...
//         </>
//       ) : (
//         <>
//           <FileText className="w-4 h-4 mr-2" />
//           Tạo CV & PDF
//         </>
//       )}
//     </Button>
//        <Button
//                 variant="outline"
//                 className="w-full"
//                 onClick={() => router.push("/applicant/cvs")}
//               >
//                 Quay lại danh sách CV
//               </Button>
//   </CardContent>
// </Card>
//         </div>
      
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useRef, useEffect } from "react";
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
import {
  Loader2,
  Sparkles,
  Upload,
  FileText,
  Download,
  Eye,
  Edit,
  CheckCircle,
  AlertCircle,
  Plus,
  Layout,
  Palette,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { TemplateList } from "./template-list";
import { PDFPreview } from "./pdf-preview";
import { TemplatePreviewModal } from "./template-preview-modal";
import { CVJobGenerator } from "./cv-job-generator";
import styles from '../../styles/CVBuilder.module.css';

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

interface CVBuilderProps {
  profile: any;
  applicantProfile: any;
  template: any;
  templates: any[];
}

export function CVBuilder({
  profile,
  applicantProfile,
  template,
  templates,
}: CVBuilderProps) {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdCV, setCreatedCV] = useState<any>(null);

  const [selectedTemplate, setSelectedTemplate] = useState(template);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [generatedCV, setGeneratedCV] = useState<any>(null)

  const [formData, setFormData] = useState<FormData>({
    name: "",
    personal: {
      full_name: "",
      email: "",
      phone: "",
      address: "",
      city: "",
    },
    summary: "",
    experiences: [
      {
        position: "",
        company: "",
        duration: "",
        description: "",
        achievements: [""],
      },
    ],
    educations: [
      {
        degree: "",
        school: "",
        year: "",
        gpa: "",
      },
    ],
    skills: [""],
    languages: [
      {
        language: "",
        proficiency: "Cơ bản",
      },
    ],
    certifications: [""],
  });

  const addExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          position: "",
          company: "",
          duration: "",
          description: "",
          achievements: [""],
        },
      ],
    }));
  };

  const removeExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  const addEducation = () => {
    setFormData((prev) => ({
      ...prev,
      educations: [
        ...prev.educations,
        {
          degree: "",
          school: "",
          year: "",
          gpa: "",
        },
      ],
    }));
  };

  const removeEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      educations: prev.educations.filter((_, i) => i !== index),
    }));
  };

  const addSkill = () => {
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, ""],
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  const addCertification = () => {
    setFormData((prev) => ({
      ...prev,
      certifications: [...prev.certifications, ""],
    }));
  };

  const removeCertification = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index),
    }));
  };

  const addLanguage = () => {
    setFormData((prev) => ({
      ...prev,
      languages: [
        ...prev.languages,
        {
          language: "",
          proficiency: "Cơ bản",
        },
      ],
    }));
  };

  const removeLanguage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  const handleExperienceChange = (
    index: number,
    field: keyof Experience,
    value: string
  ) => {
    const updatedExperiences = [...formData.experiences];
    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };
    setFormData((prev) => ({ ...prev, experiences: updatedExperiences }));
  };

  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducations = [...formData.educations];
    updatedEducations[index] = { ...updatedEducations[index], [field]: value };
    setFormData((prev) => ({ ...prev, educations: updatedEducations }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData((prev) => ({ ...prev, skills: updatedSkills }));
  };

  const handleLanguageChange = (
    index: number,
    field: keyof Language,
    value: string
  ) => {
    const updatedLanguages = [...formData.languages];
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value };
    setFormData((prev) => ({ ...prev, languages: updatedLanguages }));
  };

  const handleCertificationChange = (index: number, value: string) => {
    const updatedCertifications = [...formData.certifications];
    updatedCertifications[index] = value;
    setFormData((prev) => ({ ...prev, certifications: updatedCertifications }));
  };

  const handlePersonalChange = (field: keyof PersonalInfo, value: string) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  const handleGenerateCV = async () => {
    setAiLoading(true);
    try {
      const response = await fetch("/api/ai/generate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetJob: formData.experiences[0]?.position || "",
          experienceLevel: "mid",
        }),
      });

      const result = await response.json();

      if (result.data?.cvContent) {
        alert("CV đã được tạo tự động! Hãy kiểm tra và chỉnh sửa nếu cần.");
      }
    } catch (error: any) {
      alert("Lỗi tạo CV: " + error.message);
    } finally {
      setAiLoading(false);
    }
  };

  const previewCVData = {
    personal: formData.personal,
    summary: formData.summary,
    experience: formData.experiences.filter(
      (exp) => exp.position && exp.company
    ),
    education: formData.educations.filter((edu) => edu.degree && edu.school),
    skills: formData.skills.filter((skill) => skill.trim()),
    languages: formData.languages.filter((lang) => lang.language),
    certifications: formData.certifications.filter((cert) => cert.trim()),
    current_position: formData.experiences[0]?.position || "",
  };

  const handleCreateCV = async () => {
    if (!formData.name.trim()) {
      alert("Vui lòng nhập tên cho CV");
      return;
    }

    if (!formData.personal.full_name.trim()) {
      alert("Vui lòng nhập họ tên");
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const cvData = {
        personal: formData.personal,
        summary: formData.summary,
        experience: formData.experiences.filter(
          (exp) => exp.position && exp.company
        ),
        education: formData.educations.filter(
          (edu) => edu.degree && edu.school
        ),
        skills: formData.skills.filter((skill) => skill.trim()),
        languages: formData.languages.filter((lang) => lang.language),
        certifications: formData.certifications.filter((cert) => cert.trim()),
      };
      console.log("Creating CV with data:", cvData);

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

      const { data: cv, error: cvError } = await supabase
        .from("applicant_cvs")
        .insert({
          applicant_id: applicantProfile.id,
          name: formData.name.trim(),
          template_id: template?.id,
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

      setCreatedCV(cv);
      setSuccess(true);
      router.refresh();
    } catch (err: any) {
      console.error("Error creating CV:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
const triggerJobRecommendations = async () => {
  try {
    const response = await fetch("/api/jobs/ai-recommendations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        applicantId: applicantProfile.id,
        limit: 6 
      }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.data && result.data.length > 0) {
        // Có thể hiển thị thông báo hoặc cập nhật UI
        console.log("Job recommendations ready:", result.data.length);
        
        // Hiển thị thông báo cho user
        alert(`🎉 CV đã được tạo thành công! Hệ thống đã tìm thấy ${result.data.length} công việc phù hợp với bạn.`);
      }
    }
  } catch (error) {
    console.error("Error triggering job recommendations:", error);
  }
};
 // Trong CV Builder - sau khi tạo CV thành công
useEffect(() => {
    const generateEmbeddingForCV = async () => {
      if (createdCV?.id && success && applicantProfile?.id) {
        try {
          console.log("Generating embedding for CV:", createdCV.id);
          const response = await fetch("/api/ai/generate-cv-embedding", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cvId: createdCV.id }),
          });

          if (!response.ok) {
        console.warn("Failed to generate CV embedding, but CV was created successfully");
      } else {
        console.log("CV embedding generated successfully");
        
        // 🎯 TỰ ĐỘNG LẤY GỢI Ý SAU KHI TẠO CV
        setTimeout(() => {
          triggerJobRecommendations();
        }, 3000); // Đợi 3 giây để embedding được xử lý
      }
          
        } catch (error) {
          console.error("Error generating CV embedding:", error);
        }
      }
    };

    generateEmbeddingForCV();
  }, [createdCV, success, applicantProfile?.id]);
  
  
  return (
    <div className={styles.container}>
      {success && createdCV && (
        <Alert className={`${styles.alert} ${styles.alertSuccess}`}>
          <CheckCircle className={`w-5 h-5 ${styles.successCheck}`} />
          <AlertDescription className={styles.alertDescription}>
            ✅ Tạo CV thành công!
            <div className={styles.actionButtons}>
              <Button asChild size="sm" className={styles.buttonPrimary}>
                <a
                  href={createdCV.pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Xem PDF
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className={styles.buttonOutline}>
                <a href={createdCV.pdf_url} download>
                  <Download className="w-4 h-4 mr-1" />
                  Tải PDF
                </a>
              </Button>
              <Button asChild variant="outline" size="sm" className={styles.buttonOutline}>
                <a href={`/applicant/cvs/${createdCV.id}/edit`}>
                  <Edit className="w-4 h-4 mr-1" />
                  Chỉnh sửa CV
                </a>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert className={`${styles.alert} ${styles.alertError}`}>
          <AlertCircle className="w-5 h-5" />
          <AlertDescription className={styles.alertDescription}>
            {error}
          </AlertDescription>
        </Alert>
      )}

      <div className={styles.grid}>
        <div className="space-y-6">
          {/* Thông tin CV */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                <FileText className="w-6 h-6" />
                Thông tin CV
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                Đặt tên và chọn template cho CV của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.formGroup}>
                <Label htmlFor="name" className={styles.label}>
                  Tên CV
                </Label>
                <Input
                  id="name"
                  placeholder="VD: CV Frontend Developer - Công ty ABC"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={styles.input}
                />
              </div>

              {template && (
                <div className={styles.formGroup}>
                  <Label className={styles.label}>Template đã chọn</Label>
                  <div className={styles.templatePreview}>
                    <h4 className={styles.templateName}>{template.name}</h4>
                    <p className={styles.templateDescription}>
                      {template.description}
                    </p>
                    <div className={styles.templateMeta}>
                      <Badge className={styles.badgeSecondary}>
                        <Layout className="w-3 h-3 mr-1" />
                        {template.template_data?.layout === 'modern' ? 'Hiện đại' : 
                         template.template_data?.layout === 'classic' ? 'Cổ điển' :
                         template.template_data?.layout === 'creative' ? 'Sáng tạo' :
                         template.template_data?.layout === 'minimalist' ? 'Tối giản' : 
                         template.template_data?.layout}
                      </Badge>
                      <div className={styles.colorPalette}>
                        <div 
                          className={styles.colorDot}
                          style={{ backgroundColor: template.template_data?.colors?.primary }}
                        ></div>
                        <div 
                          className={styles.colorDot}
                          style={{ backgroundColor: template.template_data?.colors?.secondary }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Thông tin cá nhân */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={styles.cardTitle}>
                👤 Thông tin cá nhân
              </CardTitle>
              <CardDescription className={styles.cardDescription}>
                Thông tin cơ bản của bạn
              </CardDescription>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
                <div className={styles.formGroup}>
                  <Label htmlFor="full_name" className={styles.label}>
                    Họ và tên
                  </Label>
                  <Input
                    id="full_name"
                    value={formData.personal.full_name}
                    onChange={(e) =>
                      handlePersonalChange("full_name", e.target.value)
                    }
                    className={styles.input}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="email" className={`${styles.label} ${styles.labelOptional}`}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.personal.email}
                    onChange={(e) =>
                      handlePersonalChange("email", e.target.value)
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
                <div className={styles.formGroup}>
                  <Label htmlFor="phone" className={`${styles.label} ${styles.labelOptional}`}>
                    Số điện thoại
                  </Label>
                  <Input
                    id="phone"
                    value={formData.personal.phone}
                    onChange={(e) =>
                      handlePersonalChange("phone", e.target.value)
                    }
                    className={styles.input}
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="city" className={`${styles.label} ${styles.labelOptional}`}>
                    Thành phố
                  </Label>
                  <Input
                    id="city"
                    value={formData.personal.city}
                    onChange={(e) =>
                      handlePersonalChange("city", e.target.value)
                    }
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="address" className={`${styles.label} ${styles.labelOptional}`}>
                  Địa chỉ
                </Label>
                <Input
                  id="address"
                  value={formData.personal.address}
                  onChange={(e) =>
                    handlePersonalChange("address", e.target.value)
                  }
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="summary" className={`${styles.label} ${styles.labelOptional}`}>
                  Giới thiệu bản thân
                </Label>
                <Textarea
                  id="summary"
                  rows={4}
                  placeholder="Mô tả ngắn gọn về bản thân, kinh nghiệm và mục tiêu nghề nghiệp..."
                  value={formData.summary}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      summary: e.target.value,
                    }))
                  }
                  className={styles.textarea}
                />
              </div>
            </CardContent>
          </Card>

          {/* Kinh nghiệm làm việc */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.sectionHeader}>
                <CardTitle className={styles.cardTitle}>
                  💼 Kinh nghiệm làm việc
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExperience}
                  className={styles.buttonOutline}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm kinh nghiệm
                </Button>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.sectionContent}>
                {formData.experiences.map((exp: Experience, index: number) => (
                  <div key={index} className={styles.experienceItem}>
                    <div className={styles.formGrid}>
                      <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
                        <div className={styles.formGroup}>
                          <Label>Vị trí *</Label>
                          <Input
                            value={exp.position}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "position",
                                e.target.value
                              )
                            }
                            placeholder="VD: Frontend Developer"
                            className={styles.input}
                          />
                        </div>
                        <div className={styles.formGroup}>
                          <Label>Công ty *</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) =>
                              handleExperienceChange(
                                index,
                                "company",
                                e.target.value
                              )
                            }
                            placeholder="VD: Công ty ABC"
                            className={styles.input}
                          />
                        </div>
                      </div>

                      <div className={styles.formGroup}>
                        <Label>Thời gian</Label>
                        <Input
                          value={exp.duration}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                          placeholder="VD: 01/2020 - 12/2023"
                          className={styles.input}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <Label>Mô tả công việc</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) =>
                            handleExperienceChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          placeholder="Mô tả nhiệm vụ và trách nhiệm..."
                          rows={3}
                          className={styles.textarea}
                        />
                      </div>
                    </div>
                    {formData.experiences.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeExperience(index)}
                        className={styles.removeButton}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Học vấn */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.sectionHeader}>
                <CardTitle className={styles.cardTitle}>
                  🎓 Học vấn
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addEducation}
                  className={styles.buttonOutline}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm học vấn
                </Button>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.sectionContent}>
                {formData.educations.map((edu: Education, index: number) => (
                  <div key={index} className={styles.educationItem}>
                    <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
                      <div className={styles.formGroup}>
                        <Label>Bằng cấp *</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) =>
                            handleEducationChange(index, "degree", e.target.value)
                          }
                          placeholder="VD: Cử nhân Công nghệ thông tin"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <Label>Trường *</Label>
                        <Input
                          value={edu.school}
                          onChange={(e) =>
                            handleEducationChange(index, "school", e.target.value)
                          }
                          placeholder="VD: Đại học Bách Khoa"
                          className={styles.input}
                        />
                      </div>
                    </div>

                    <div className={`${styles.formGrid} ${styles.formGridTwo}`}>
                      <div className={styles.formGroup}>
                        <Label>Năm tốt nghiệp</Label>
                        <Input
                          value={edu.year}
                          onChange={(e) =>
                            handleEducationChange(index, "year", e.target.value)
                          }
                          placeholder="VD: 2020"
                          className={styles.input}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <Label>GPA</Label>
                        <Input
                          value={edu.gpa}
                          onChange={(e) =>
                            handleEducationChange(index, "gpa", e.target.value)
                          }
                          placeholder="VD: 3.5/4"
                          className={styles.input}
                        />
                      </div>
                    </div>
                    {formData.educations.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeEducation(index)}
                        className={styles.removeButton}
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        Xóa
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Kỹ năng */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.sectionHeader}>
                <CardTitle className={styles.cardTitle}>
                  🔧 Kỹ năng
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addSkill}
                  className={styles.buttonOutline}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm kỹ năng
                </Button>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.sectionContent}>
                {formData.skills.map((skill: string, index: number) => (
                  <div key={index} className={styles.skillItem}>
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder="VD: JavaScript, React, Node.js..."
                      className={styles.input}
                    />
                    {formData.skills.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeSkill(index)}
                        className={styles.removeButton}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ngôn ngữ */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.sectionHeader}>
                <CardTitle className={styles.cardTitle}>
                  🌐 Ngôn ngữ
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLanguage}
                  className={styles.buttonOutline}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm ngôn ngữ
                </Button>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.sectionContent}>
                {formData.languages.map((lang: Language, index: number) => (
                  <div key={index} className={styles.languageGrid}>
                    <Input
                      value={lang.language}
                      onChange={(e) =>
                        handleLanguageChange(index, "language", e.target.value)
                      }
                      placeholder="VD: Tiếng Anh"
                      className={styles.input}
                    />
                    <Select
                      value={lang.proficiency}
                      onValueChange={(value) =>
                        handleLanguageChange(index, "proficiency", value)
                      }
                    >
                      <SelectTrigger className={styles.input}>
                        <SelectValue placeholder="Trình độ" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Cơ bản">Cơ bản</SelectItem>
                        <SelectItem value="Trung bình">Trung bình</SelectItem>
                        <SelectItem value="Thành thạo">Thành thạo</SelectItem>
                        <SelectItem value="Bản ngữ">Bản ngữ</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.languages.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeLanguage(index)}
                        className={styles.removeButton}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chứng chỉ */}
          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <div className={styles.sectionHeader}>
                <CardTitle className={styles.cardTitle}>
                  📜 Chứng chỉ
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addCertification}
                  className={styles.buttonOutline}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Thêm chứng chỉ
                </Button>
              </div>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              <div className={styles.sectionContent}>
                {formData.certifications.map((cert: string, index: number) => (
                  <div key={index} className={styles.certificationItem}>
                    <Input
                      value={cert}
                      onChange={(e) =>
                        handleCertificationChange(index, e.target.value)
                      }
                      placeholder="VD: AWS Certified Developer, Google Analytics..."
                      className={styles.input}
                    />
                    {formData.certifications.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeCertification(index)}
                        className={styles.removeButton}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* AI Tools */}
          <CVJobGenerator 
            profile={profile}
            applicantProfile={applicantProfile}
            onCVGenerated={(cvData) => {
              setGeneratedCV(cvData)
              setFormData(prev => ({
                ...prev,
                personal: {
                  ...prev.personal,
                  ...cvData.personal
                },
                summary: cvData.summary,
                experiences: cvData.experience || [],
                educations: cvData.education || [],
                skills: cvData.skills || [],
                languages: (cvData.languages || []).map((lang: string) => ({ 
                  language: lang, 
                  proficiency: "Thành thạo" 
                })),
                certifications: cvData.certifications || []
              }))
            }}
          />

          <Card className={styles.card}>
            <CardHeader className={styles.cardHeader}>
              <CardTitle className={`${styles.cardTitle} ${styles.aiTitle}`}>
                <Sparkles className="w-6 h-6" />
                Template & Actions
              </CardTitle>
            </CardHeader>
            <CardContent className={styles.cardContent}>
              {selectedTemplate && (
                <>
                  <div className={styles.templatePreview}>
                    <h4 className={styles.templateName}>{selectedTemplate.name}</h4>
                    <p className={styles.templateDescription}>
                      {selectedTemplate.description}
                    </p>
                    <div className={styles.templateMeta}>
                      <Badge className={styles.badgeSecondary}>
                        {selectedTemplate.template_data?.layout === 'modern' ? 'Hiện đại' : 
                         selectedTemplate.template_data?.layout === 'classic' ? 'Cổ điển' :
                         selectedTemplate.template_data?.layout === 'creative' ? 'Sáng tạo' :
                         selectedTemplate.template_data?.layout === 'minimalist' ? 'Tối giản' : 
                         selectedTemplate.template_data?.layout}
                      </Badge>
                      <div className={styles.colorPalette}>
                        <div 
                          className={styles.colorDot}
                          style={{ backgroundColor: selectedTemplate.template_data?.colors?.primary }}
                        ></div>
                        <div 
                          className={styles.colorDot}
                          style={{ backgroundColor: selectedTemplate.template_data?.colors?.secondary }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <TemplatePreviewModal template={selectedTemplate}>
                      <Button variant="outline" className={`${styles.button} ${styles.buttonOutline} w-full`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Xem trước template
                      </Button>
                    </TemplatePreviewModal>
                         
                    <PDFPreview 
                      cvData={previewCVData}
                      template={selectedTemplate?.template_data}
                      templateName={selectedTemplate?.name}
                    >
                      <Button variant="outline" className={`${styles.button} ${styles.buttonOutline} w-full`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Xem trước CV của bạn
                      </Button>
                    </PDFPreview>
                  </div>
                </>
              )}
              
              <Button 
                onClick={handleCreateCV} 
                disabled={isLoading}
                className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonLg} w-full mt-4`}
              >
                {isLoading ? (
                  <>
                    <Loader2 className={`w-4 h-4 mr-2 ${styles.loadingSpinner}`} />
                    Đang tạo CV và PDF...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Tạo CV & PDF
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                className={`${styles.button} ${styles.buttonOutline} w-full mt-3`}
                onClick={() => router.push("/applicant/cvs")}
              >
                Quay lại danh sách CV
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}