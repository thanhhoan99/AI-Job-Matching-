
// "use client"

// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Eye, Check, Palette, Layout, Sparkles } from "lucide-react"
// import Link from "next/link"
// import { useState } from "react"
// import { TemplatePreviewModal } from "./template-preview-modal"
// import Image from "next/image"
// import styles from '../../styles/TemplateList.module.css'

// interface CVTemplate {
//   id: string
//   name: string
//   description: string
//   thumbnail_url: string
//   template_data: {
//     colors: {
//       primary: string
//       secondary: string
//     }
//     layout: string
//     sections: string[]
//   }
//   is_active: boolean
//   created_at: string
// }

// interface TemplateListProps {
//   templates: CVTemplate[]
//   selectedTemplate?: CVTemplate | null
//   onSelectTemplate?: (template: CVTemplate) => void
//   showActions?: boolean
//   mode?: "selection" | "preview"
// }

// export function TemplateList({ 
//   templates, 
//   selectedTemplate, 
//   onSelectTemplate, 
//   showActions = true,
//   mode = "selection"
// }: TemplateListProps) {

//   const getSectionLabel = (section: string) => {
//     const sectionLabels: Record<string, string> = {
//       "header": "Tiêu đề",
//       "summary": "Tóm tắt",
//       "experience": "Kinh nghiệm",
//       "education": "Học vấn",
//       "skills": "Kỹ năng",
//       "portfolio": "Portfolio",
//       "objective": "Mục tiêu",
//       "certifications": "Chứng chỉ",
//       "languages": "Ngôn ngữ",
//       "contact": "Liên hệ",
//       "projects": "Dự án"
//     }
//     return sectionLabels[section] || section
//   }

//   const getLayoutLabel = (layout: string) => {
//     const layoutLabels: Record<string, string> = {
//       "modern": "Hiện đại",
//       "classic": "Cổ điển",
//       "creative": "Sáng tạo",
//       "minimalist": "Tối giản",
//       "two-column": "2 Cột",
//       "executive": "Executive",
//       "tech": "Công nghệ",
//       "fresh": "Fresh Graduate",
//       "corporate": "Corporate"
//     }
//     return layoutLabels[layout] || layout
//   }

//   const getLayoutColor = (layout: string) => {
//     const colorMap: Record<string, string> = {
//       "modern": "bg-blue-100 text-blue-800",
//       "classic": "bg-gray-100 text-gray-800",
//       "creative": "bg-purple-100 text-purple-800",
//       "minimalist": "bg-green-100 text-green-800",
//       "two-column": "bg-orange-100 text-orange-800",
//       "executive": "bg-red-100 text-red-800",
//       "tech": "bg-indigo-100 text-indigo-800",
//       "fresh": "bg-cyan-100 text-cyan-800",
//       "corporate": "bg-slate-100 text-slate-800"
//     }
//     return colorMap[layout] || "bg-gray-100 text-gray-800"
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {templates.map((template) => (
//           <Card
//             key={template.id}
//             className={`cursor-pointer transition-all hover:shadow-lg ${
//               selectedTemplate?.id === template.id 
//                 ? "border-2 border-primary shadow-md" 
//                 : "border border-gray-200"
//             }`}
//             onClick={() => mode === "selection" && onSelectTemplate?.(template)}
//           >
//             <CardHeader className="pb-3">
//               <div className="flex items-start justify-between">
//                 <CardTitle className="text-lg">{template.name}</CardTitle>
//                 {selectedTemplate?.id === template.id && (
//                   <Check className="w-5 h-5 text-primary flex-shrink-0" />
//                 )}
//               </div>
//               <CardDescription className="text-sm line-clamp-2">
//                 {template.description}
//               </CardDescription>
//             </CardHeader>
            
//             <CardContent className="space-y-4">
//               {/* Template Preview Thumbnail */}
//               <div className="aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border relative overflow-hidden group">
//                 {template.thumbnail_url ? (
//                   <Image
//                     src={template.thumbnail_url}
//                     alt={template.name}
//                     width={300}
//                     height={300}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full flex items-center justify-center p-4">
//                     <div 
//                       className="w-full h-full rounded border-2 shadow-inner flex flex-col p-4"
//                       style={{ 
//                         borderColor: template.template_data.colors.primary,
//                         backgroundColor: `${template.template_data.colors.primary}10`
//                       }}
//                     >
//                       {/* Mock CV Preview */}
//                       <div className="flex-1 flex flex-col space-y-3">
//                         {/* Header */}
//                         <div 
//                           className="h-4 rounded-full"
//                           style={{ backgroundColor: template.template_data.colors.primary }}
//                         ></div>
                        
//                         {/* Sections */}
//                         {template.template_data.sections.slice(0, 4).map((section, index) => (
//                           <div key={section} className="space-y-2">
//                             <div 
//                               className="h-3 rounded-full w-3/4"
//                               style={{ backgroundColor: template.template_data.colors.secondary }}
//                             ></div>
//                             <div className="h-2 rounded-full bg-gray-200 w-full"></div>
//                             <div className="h-2 rounded-full bg-gray-200 w-5/6"></div>
//                             {index < 2 && (
//                               <div className="h-2 rounded-full bg-gray-200 w-4/6"></div>
//                             )}
//                           </div>
//                         ))}
//                       </div>
                      
//                       {/* Color Indicator */}
//                       <div className="flex justify-center space-x-1 mt-2">
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: template.template_data.colors.primary }}
//                         ></div>
//                         <div
//                           className="w-3 h-3 rounded-full"
//                           style={{ backgroundColor: template.template_data.colors.secondary }}
//                         ></div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {/* Overlay with quick actions */}
//                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                   <div className="flex gap-2">
//                     <TemplatePreviewModal template={template}>
//                       <Button size="sm" variant="secondary">
//                         <Eye className="w-4 h-4 mr-1" />
//                         Xem trước
//                       </Button>
//                     </TemplatePreviewModal>
//                     {mode === "selection" && (
//                       <Button 
//                         size="sm"
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           onSelectTemplate?.(template)
//                         }}
//                       >
//                         <Check className="w-4 h-4 mr-1" />
//                         Chọn
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </div>

//               {/* Template Info */}
//               <div className="space-y-3">
//                 {/* Layout and Sections */}
//                 <div className="flex items-center justify-between text-xs text-muted-foreground">
//                   <div className="flex items-center gap-1">
//                     <Layout className="w-3 h-3" />
//                     <Badge variant="secondary" className={getLayoutColor(template.template_data.layout)}>
//                       {getLayoutLabel(template.template_data.layout)}
//                     </Badge>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     <Palette className="w-3 h-3" />
//                     <span className="flex gap-1">
//                       <div 
//                         className="w-3 h-3 rounded-full border"
//                         style={{ backgroundColor: template.template_data.colors.primary }}
//                       ></div>
//                       <div 
//                         className="w-3 h-3 rounded-full border"
//                         style={{ backgroundColor: template.template_data.colors.secondary }}
//                       ></div>
//                     </span>
//                   </div>
//                 </div>

//                 {/* Sections Badges */}
//                 <div className="flex flex-wrap gap-1">
//                   {template.template_data.sections.slice(0, 3).map((section) => (
//                     <Badge 
//                       key={section} 
//                       variant="secondary" 
//                       className="text-xs px-2 py-0"
//                     >
//                       {getSectionLabel(section)}
//                     </Badge>
//                   ))}
//                   {template.template_data.sections.length > 3 && (
//                     <Badge variant="outline" className="text-xs px-2 py-0">
//                       +{template.template_data.sections.length - 3}
//                     </Badge>
//                   )}
//                 </div>

//                 {/* Actions */}
//                 {showActions && (
//                   <div className="flex gap-2 pt-2">
//                     <TemplatePreviewModal 
//                       template={template}
//                       showSelectButton={mode === "preview"}
//                       onSelectTemplate={mode === "preview" ? onSelectTemplate : undefined}
//                     >
//                       <Button
//                         type="button"
//                         variant="outline"
//                         size="sm"
//                         className="flex-1"
//                       >
//                         <Eye className="w-3 h-3 mr-1" />
//                         Xem trước
//                       </Button>
//                     </TemplatePreviewModal>
                    
//                     {mode === "selection" ? (
//                       <Button
//                         size="sm"
//                         className="flex-1"
//                         onClick={(e) => {
//                           e.stopPropagation()
//                           onSelectTemplate?.(template)
//                         }}
//                       >
//                         <Check className="w-3 h-3 mr-1" />
//                         Chọn
//                       </Button>
//                     ) : (
//                       <Button asChild size="sm" className="flex-1">
//                         <Link href={`/applicant/cvs/create?template=${template.id}`}>
//                           <Sparkles className="w-3 h-3 mr-1" />
//                           Sử dụng
//                         </Link>
//                       </Button>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   )
// }


"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Check, Palette, Layout, Sparkles } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { TemplatePreviewModal } from "./template-preview-modal"
import Image from "next/image"
import styles from '../../styles/TemplateList.module.css'

interface CVTemplate {
  id: string
  name: string
  description: string
  thumbnail_url: string
  template_data: {
    colors: {
      primary: string
      secondary: string
    }
    layout: string
    sections: string[]
  }
  is_active: boolean
  created_at: string
}

interface TemplateListProps {
  templates: CVTemplate[]
  selectedTemplate?: CVTemplate | null
  onSelectTemplate?: (template: CVTemplate) => void
  showActions?: boolean
  mode?: "selection" | "preview"
}

export function TemplateList({ 
  templates, 
  selectedTemplate, 
  onSelectTemplate, 
  showActions = true,
  mode = "selection"
}: TemplateListProps) {

  const getSectionLabel = (section: string) => {
    const sectionLabels: Record<string, string> = {
      "header": "Tiêu đề",
      "summary": "Tóm tắt",
      "experience": "Kinh nghiệm",
      "education": "Học vấn",
      "skills": "Kỹ năng",
      "portfolio": "Portfolio",
      "objective": "Mục tiêu",
      "certifications": "Chứng chỉ",
      "languages": "Ngôn ngữ",
      "contact": "Liên hệ",
      "projects": "Dự án"
    }
    return sectionLabels[section] || section
  }

  const getLayoutLabel = (layout: string) => {
    const layoutLabels: Record<string, string> = {
      "modern": "Hiện đại",
      "classic": "Cổ điển",
      "creative": "Sáng tạo",
      "minimalist": "Tối giản",
      "two-column": "2 Cột",
      "executive": "Executive",
      "tech": "Công nghệ",
      "fresh": "Fresh Graduate",
      "corporate": "Corporate"
    }
    return layoutLabels[layout] || layout
  }

  const getLayoutColor = (layout: string) => {
    const colorMap: Record<string, string> = {
      "modern": styles.modernBadge,
      "classic": styles.classicBadge,
      "creative": styles.creativeBadge,
      "minimalist": styles.minimalistBadge,
      "two-column": styles.twoColumnBadge,
      "executive": styles.executiveBadge,
      "tech": styles.techBadge,
      "fresh": styles.freshBadge,
      "corporate": styles.corporateBadge
    }
    return colorMap[layout] || styles.defaultBadge
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`${styles.card} ${
              selectedTemplate?.id === template.id ? styles.selected : ''
            }`}
            onClick={() => mode === "selection" && onSelectTemplate?.(template)}
          >
            <CardHeader className={styles.cardHeader}>
              <div className={styles.headerContent}>
                <CardTitle className={styles.cardTitle}>{template.name}</CardTitle>
                {selectedTemplate?.id === template.id && (
                  <div className={styles.checkIndicator}>
                    <Check className={styles.checkIcon} />
                  </div>
                )}
              </div>
              <CardDescription className={styles.cardDescription}>
                {template.description}
              </CardDescription>
            </CardHeader>
            
            <CardContent className={styles.cardContent}>
              {/* Template Preview Thumbnail */}
              <div className={styles.thumbnailContainer}>
                {template.thumbnail_url ? (
                  <Image
                    src={template.thumbnail_url}
                    alt={template.name}
                    width={300}
                    height={400}
                    className={styles.thumbnail}
                    priority
                  />
                ) : (
                  <div className={styles.thumbnailFallback}>
                    <div 
                      className={styles.mockCV}
                      style={{ 
                        borderColor: template.template_data.colors.primary,
                        backgroundColor: `${template.template_data.colors.primary}08`
                      }}
                    >
                      {/* Mock CV Preview */}
                      <div className={styles.mockContent}>
                        {/* Header */}
                        <div 
                          className={styles.mockHeader}
                          style={{ backgroundColor: template.template_data.colors.primary }}
                        ></div>
                        
                        {/* Sections */}
                        {template.template_data.sections.slice(0, 4).map((section, index) => (
                          <div key={section} className={styles.mockSection}>
                            <div 
                              className={styles.mockSectionTitle}
                              style={{ backgroundColor: template.template_data.colors.secondary }}
                            ></div>
                            <div className={styles.mockText}></div>
                            <div className={styles.mockText}></div>
                            {index < 2 && (
                              <div className={styles.mockText}></div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* Color Indicator */}
                      <div className={styles.colorIndicator}>
                        <div
                          className={styles.colorDot}
                          style={{ backgroundColor: template.template_data.colors.primary }}
                        ></div>
                        <div
                          className={styles.colorDot}
                          style={{ backgroundColor: template.template_data.colors.secondary }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Overlay with quick actions */}
                <div className={styles.thumbnailOverlay}>
                  <div className={styles.quickActions}>
                    <TemplatePreviewModal template={template}>
                      <Button size="sm" className={styles.quickButton}>
                        <Eye className={styles.buttonIcon} />
                        Xem trước
                      </Button>
                    </TemplatePreviewModal>
                    {mode === "selection" && (
                      <Button 
                        size="sm"
                        className={styles.quickSelect}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectTemplate?.(template)
                        }}
                      >
                        <Check className={styles.buttonIcon} />
                        Chọn
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Template Info */}
              <div className={styles.templateInfo}>
                {/* Layout and Sections */}
                <div className={styles.metaInfo}>
                  <div className={styles.metaItem}>
                    <Layout className={styles.metaIcon} />
                    <Badge className={`${styles.layoutBadge} ${getLayoutColor(template.template_data.layout)}`}>
                      {getLayoutLabel(template.template_data.layout)}
                    </Badge>
                  </div>
                  <div className={styles.metaItem}>
                    <Palette className={styles.metaIcon} />
                    <span className={styles.colorPalette}>
                      <div 
                        className={styles.colorDotSmall}
                        style={{ backgroundColor: template.template_data.colors.primary }}
                      ></div>
                      <div 
                        className={styles.colorDotSmall}
                        style={{ backgroundColor: template.template_data.colors.secondary }}
                      ></div>
                    </span>
                  </div>
                </div>

                {/* Sections Badges */}
                <div className={styles.sectionsContainer}>
                  {template.template_data.sections.slice(0, 3).map((section) => (
                    <Badge 
                      key={section} 
                      className={styles.sectionBadge}
                    >
                      {getSectionLabel(section)}
                    </Badge>
                  ))}
                  {template.template_data.sections.length > 3 && (
                    <Badge className={styles.moreBadge}>
                      +{template.template_data.sections.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                {showActions && (
                  <div className={styles.actions}>
                    <TemplatePreviewModal 
                      template={template}
                      showSelectButton={mode === "preview"}
                      onSelectTemplate={mode === "preview" ? onSelectTemplate : undefined}
                    >
                      <Button
                        type="button"
                        className={styles.previewButton}
                        size="sm"
                      >
                        <Eye className={styles.buttonIcon} />
                        Xem trước
                      </Button>
                    </TemplatePreviewModal>
                    
                    {mode === "selection" ? (
                      <Button
                        size="sm"
                        className={styles.selectButton}
                        onClick={(e) => {
                          e.stopPropagation()
                          onSelectTemplate?.(template)
                        }}
                      >
                        <Check className={styles.buttonIcon} />
                        Chọn
                      </Button>
                    ) : (
                      <Button asChild size="sm" className={styles.useButton}>
                        <Link href={`/applicant/cvs/create?template=${template.id}`}>
                          <Sparkles className={styles.buttonIcon} />
                          Sử dụng
                        </Link>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}