// "use client";

// import { useState } from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Eye, Check, X, ZoomIn, ZoomOut } from "lucide-react";
// import { generateHTMLFromTemplate } from "@/lib/cv-template";

// interface TemplatePreviewModalProps {
//   template: any;
//   children?: React.ReactNode;
//   onSelectTemplate?: (template: any) => void;
//   showSelectButton?: boolean;
// }

// // Dữ liệu mẫu cho preview
// const mockCVData = {
//   personal: {
//     full_name: "Nguyễn Văn A",
//     email: "nguyenvana@example.com",
//     phone: "0123 456 789",
//     city: "Hà Nội",
//     address: "123 Đường ABC, Quận 1",
//   },
//   summary:
//     "Chuyên gia phát triển phần mềm với 5 năm kinh nghiệm trong lĩnh vực công nghệ. Có đam mê với việc xây dựng các sản phẩm chất lượng cao và luôn tìm kiếm cơ hội để học hỏi và phát triển bản thân.",
//   experience: [
//     {
//       position: "Senior Frontend Developer",
//       company: "Công ty Công nghệ ABC",
//       duration: "01/2020 - Hiện tại",
//       description:
//         "Phát triển và bảo trì các ứng dụng web sử dụng React và TypeScript. Tối ưu hóa hiệu suất và trải nghiệm người dùng.",
//     },
//     {
//       position: "Junior Developer",
//       company: "Công ty Phần mềm XYZ",
//       duration: "06/2018 - 12/2019",
//       description:
//         "Tham gia phát triển các dự án web theo yêu cầu của khách hàng. Hỗ trợ testing và triển khai sản phẩm.",
//     },
//   ],
//   education: [
//     {
//       degree: "Cử nhân Công nghệ thông tin",
//       school: "Đại học Bách Khoa Hà Nội",
//       year: "2014 - 2018",
//       gpa: "3.5/4",
//     },
//   ],
//   skills: [
//     "JavaScript",
//     "React",
//     "TypeScript",
//     "Node.js",
//     "HTML/CSS",
//     "Git",
//     "SQL",
//     "AWS",
//   ],
//   languages: [
//     { language: "Tiếng Anh", proficiency: "Thành thạo" },
//     { language: "Tiếng Nhật", proficiency: "Trung bình" },
//   ],
//   certifications: [
//     "AWS Certified Developer",
//     "Google Cloud Associate",
//     "React Professional Certificate",
//   ],
//   current_position: "Senior Frontend Developer",
// };

// export function TemplatePreviewModal({
//   template,
//   children,
//   onSelectTemplate,
//   showSelectButton = true,
// }: TemplatePreviewModalProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const [zoom, setZoom] = useState(0.8);

//   const htmlContent = generateHTMLFromTemplate(
//     mockCVData,
//     template?.template_data
//   );

//   const handleZoomIn = () => {
//     setZoom((prev) => Math.min(prev + 0.1, 1.2));
//   };

//   const handleZoomOut = () => {
//     setZoom((prev) => Math.max(prev - 0.1, 0.5));
//   };

//   const handleSelect = () => {
//     onSelectTemplate?.(template);
//     setIsOpen(false);
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger asChild>
//         {children || (
//           <Button variant="outline" size="sm">
//             <Eye className="w-4 h-4 mr-2" />
//             Xem trước
//           </Button>
//         )}
//       </DialogTrigger>
//       <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
//         <DialogHeader className="flex flex-row items-center justify-between p-6 border-b">
//           <div>
//             <DialogTitle className="text-xl">{template.name}</DialogTitle>
//             {/* <p className="text-sm text-muted-foreground mt-1">{template.description}</p> */}
//           </div>
//           <div className="flex items-center gap-2">
//             {/* Zoom Controls */}
//             <div className="flex items-center gap-1 mr-4">
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleZoomOut}
//                 disabled={zoom <= 0.5}
//               >
//                 <ZoomOut className="w-4 h-4" />
//               </Button>
//               <span className="text-sm text-muted-foreground min-w-12 text-center">
//                 {Math.round(zoom * 100)}%
//               </span>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleZoomIn}
//                 disabled={zoom >= 1.2}
//               >
//                 <ZoomIn className="w-4 h-4" />
//               </Button>
//             </div>

//             {/* {showSelectButton && (
//               <Button onClick={handleSelect}>
//                 <Check className="w-4 h-4 mr-2" />
             
//               </Button>
//             )} */}
//             {/* <Button variant="outline" onClick={() => setIsOpen(false)}>
//               <X className="w-4 h-4" />
//             </Button> */}
//           </div>
//         </DialogHeader>

//         <div className="flex-1 relative overflow-hidden bg-gray-100">
//           <div className="absolute inset-0 flex items-center justify-center p-4">
//             <div
//               className="bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-200"
//               style={{
//                 transform: `scale(${zoom})`,
//                 transformOrigin: "top center", // quan trọng để scale từ trên xuống
//                 width: "100%",
//                 height: "100%",
//                 maxWidth: "900px", // chiều rộng tối đa (giống khổ A4 dọc)
//                 maxHeight: "1200px", // chiều cao tối đa
//               }}
//             >
//               <iframe
//                 srcDoc={htmlContent}
//                 className="w-full h-full border-0"
//                 title="Template Preview"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Template Info Footer */}
//         <div className="p-4 border-t bg-background">
//           <div className="grid grid-cols-4 gap-4 text-sm">
//             <div>
//               <span className="font-medium">Layout:</span>
//               <span className="ml-2 text-muted-foreground capitalize">
//                 {template.template_data?.layout || "modern"}
//               </span>
//             </div>
//             <div>
//               <span className="font-medium">Màu chính:</span>
//               <div className="flex items-center gap-2 mt-1">
//                 <div
//                   className="w-4 h-4 rounded border"
//                   style={{
//                     backgroundColor: template.template_data?.colors?.primary,
//                   }}
//                 />
//                 <span className="text-muted-foreground">
//                   {template.template_data?.colors?.primary}
//                 </span>
//               </div>
//             </div>
//             <div>
//               <span className="font-medium">Số section:</span>
//               <span className="ml-2 text-muted-foreground">
//                 {template.template_data?.sections?.length || 0}
//               </span>
//             </div>
//             <div>
//               <span className="font-medium">Phù hợp:</span>
//               <span className="ml-2 text-muted-foreground">
//                 {getSuitableFor(template.template_data?.layout)}
//               </span>
//             </div>
//           </div>
//         </div>
//       </DialogContent>
//     </Dialog>
//   );
// }

// function getSuitableFor(layout: string): string {
//   const suitableMap: Record<string, string> = {
//     modern: "Mọi ngành nghề",
//     classic: "Doanh nghiệp lớn",
//     creative: "Creative & Design",
//     minimalist: "Startup & Tech",
//     "two-column": "Developer & IT",
//     executive: "Quản lý cấp cao",
//     tech: "Công nghệ",
//     fresh: "Sinh viên mới tốt nghiệp",
//     corporate: "Môi trường công sở",
//   };
//   return suitableMap[layout] || "Mọi ngành nghề";
// }


"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Check, X, ZoomIn, ZoomOut, Loader2, AlertCircle, Palette, Layout } from "lucide-react";
import { generateHTMLFromTemplate } from "@/lib/cv-template";
import styles from '../../styles/TemplatePreviewModal.module.css';

interface TemplatePreviewModalProps {
  template: any;
  children?: React.ReactNode;
  onSelectTemplate?: (template: any) => void;
  showSelectButton?: boolean;
}

const mockCVData = {
  personal: {
    full_name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    phone: "0123 456 789",
    city: "Hà Nội",
    address: "123 Đường ABC, Quận 1",
  },
  summary:
    "Chuyên gia phát triển phần mềm với 5 năm kinh nghiệm trong lĩnh vực công nghệ. Có đam mê với việc xây dựng các sản phẩm chất lượng cao và luôn tìm kiếm cơ hội để học hỏi và phát triển bản thân.",
  experience: [
    {
      position: "Senior Frontend Developer",
      company: "Công ty Công nghệ ABC",
      duration: "01/2020 - Hiện tại",
      description:
        "Phát triển và bảo trì các ứng dụng web sử dụng React và TypeScript. Tối ưu hóa hiệu suất và trải nghiệm người dùng.",
    },
    {
      position: "Junior Developer",
      company: "Công ty Phần mềm XYZ",
      duration: "06/2018 - 12/2019",
      description:
        "Tham gia phát triển các dự án web theo yêu cầu của khách hàng. Hỗ trợ testing và triển khai sản phẩm.",
    },
  ],
  education: [
    {
      degree: "Cử nhân Công nghệ thông tin",
      school: "Đại học Bách Khoa Hà Nội",
      year: "2014 - 2018",
      gpa: "3.5/4",
    },
  ],
  skills: [
    "JavaScript",
    "React",
    "TypeScript",
    "Node.js",
    "HTML/CSS",
    "Git",
    "SQL",
    "AWS",
  ],
  languages: [
    { language: "Tiếng Anh", proficiency: "Thành thạo" },
    { language: "Tiếng Nhật", proficiency: "Trung bình" },
  ],
  certifications: [
    "AWS Certified Developer",
    "Google Cloud Associate",
    "React Professional Certificate",
  ],
  current_position: "Senior Frontend Developer",
};

export function TemplatePreviewModal({
  template,
  children,
  onSelectTemplate,
  showSelectButton = true,
}: TemplatePreviewModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [zoom, setZoom] = useState(0.8);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const htmlContent = generateHTMLFromTemplate(
    mockCVData,
    template?.template_data
  );

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.1, 1.2));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.1, 0.5));
  };

  const handleSelect = () => {
    onSelectTemplate?.(template);
    setIsOpen(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Eye className="w-4 h-4 mr-2" />
            Xem trước
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader className={styles.dialogHeader}>
          <div>
            <DialogTitle className={styles.dialogTitle}>{template.name}</DialogTitle>
          </div>
          <div className={styles.controlsContainer}>
            <div className={styles.zoomControls}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoom <= 0.5}
                className={styles.zoomButton}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className={styles.zoomPercentage}>
                {Math.round(zoom * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoom >= 1.2}
                className={styles.zoomButton}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {showSelectButton && (
                <Button onClick={handleSelect} className={styles.actionButton}>
                  <Check className="w-4 h-4 mr-2" />
                  Chọn Mẫu
                </Button>
              )}
              <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className={styles.closeButton}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className={styles.previewContainer}>
          <div className={styles.previewContent}>
            {isLoading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner} />
              </div>
            )}
            
            {hasError && (
              <div className={styles.errorState}>
                <AlertCircle className="w-12 h-12 mb-4" />
                <h3 className="text-lg font-semibold mb-2">Lỗi tải template</h3>
                <p className="text-sm opacity-80">
                  Không thể tải xem trước template. Vui lòng thử lại.
                </p>
              </div>
            )}

            <div
              className={styles.cvFrameWrapper}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
                width: "700px",
                height: "300px",
                // maxWidth: "900px",
                // maxHeight: "1200px",
                opacity: isLoading || hasError ? 0 : 1,
              }}
            >
              <iframe
              style={{
              
                width: "500px",
                height: "400px",
              
              }}
                srcDoc={htmlContent}
                className={styles.cvFrame}
                title="Template Preview"
                onLoad={handleIframeLoad}
                onError={handleIframeError}
              />
            </div>
          </div>
        </div>

        {/* Template Info Footer */}
        {/* <div className={styles.footer}>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <Layout className="w-4 h-4" />
                Layout
              </span>
              <span className={styles.infoValue}>
                {template.template_data?.layout || "modern"}
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                <Palette className="w-4 h-4" />
                Màu chính
              </span>
              <div className={styles.colorDisplay}>
                <div
                  className={styles.colorDot}
                  style={{
                    backgroundColor: template.template_data?.colors?.primary,
                  }}
                />
                <span className={styles.infoValue}>
                  {template.template_data?.colors?.primary}
                </span>
              </div>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                Sections
              </span>
              <span className={styles.infoValue}>
                {template.template_data?.sections?.length || 0} sections
              </span>
            </div>
            
            <div className={styles.infoItem}>
              <span className={styles.infoLabel}>
                Phù hợp
              </span>
              <span className={styles.suitableBadge}>
                {getSuitableFor(template.template_data?.layout)}
              </span>
            </div>
          </div>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}

function getSuitableFor(layout: string): string {
  const suitableMap: Record<string, string> = {
    modern: "Mọi ngành nghề",
    classic: "Doanh nghiệp lớn",
    creative: "Creative & Design",
    minimalist: "Startup & Tech",
    "two-column": "Developer & IT",
    executive: "Quản lý cấp cao",
    tech: "Công nghệ",
    fresh: "Sinh viên mới tốt nghiệp",
    corporate: "Môi trường công sở",
  };
  return suitableMap[layout] || "Mọi ngành nghề";
}