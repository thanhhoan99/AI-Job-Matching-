

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


// Hàm generate HTML từ template với styling đẹp
export function generateHTMLFromTemplate(cvData: any, template: any): string {
  const { personal, summary, experience, education, skills, languages, certifications } = cvData;
  
  // Lấy thông tin màu sắc từ template
  const primaryColor = template?.colors?.primary || '#2563eb';
  const secondaryColor = template?.colors?.secondary || '#64748b';
  const accentColor = template?.colors?.accent || '#3b82f6';
  const backgroundColor = template?.colors?.background || '#ffffff';
  const textColor = template?.colors?.text || '#1f2937';

  // Xác định layout dựa trên template
  const layout = template?.layout || 'modern';
  
  let html = '';
  
  switch (layout) {
    case 'modern':
      html = generateModernTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
      break;
    case 'classic':
      html = generateClassicTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
      break;
    case 'creative':
      html = generateCreativeTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
      break;
    case 'minimalist':
      html = generateMinimalistTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
      break;
    default:
      html = generateModernTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
  }

  return html;
}

// Template Modern - Layout 2 cột
export function generateModernTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
  const { personal, summary, experience, education, skills, languages, certifications } = cvData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CV - ${personal.full_name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: ${text};
      background: ${background};
      max-width: 210mm;
      margin: 0 auto;
      padding: 15mm;
    }
    
    .cv-container {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 30px;
    }
    
    /* Sidebar */
    .sidebar {
      background: linear-gradient(135deg, ${primary}20, ${accent}20);
      padding: 30px 20px;
      border-radius: 12px;
    }
    
    .profile-header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .name {
      font-size: 24px;
      font-weight: 700;
      color: ${primary};
      margin-bottom: 5px;
    }
    
    .title {
      font-size: 16px;
      color: ${secondary};
      font-weight: 500;
    }
    
    .contact-info {
      margin-bottom: 25px;
    }
    
    .contact-item {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      font-size: 14px;
    }
    
    .contact-item i {
      width: 20px;
      margin-right: 10px;
      color: ${primary};
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 16px;
      font-weight: 600;
      color: ${primary};
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid ${primary}30;
    }
    
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    
    .skill-tag {
      background: ${primary}15;
      color: ${primary};
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 12px;
      border: 1px solid ${primary}30;
    }
    
    /* Main Content */
    .main-content {
      padding: 10px 0;
    }
    
    .summary {
      background: ${accent}10;
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid ${accent};
      margin-bottom: 30px;
    }
    
    .experience-item, .education-item {
      margin-bottom: 20px;
      padding-bottom: 20px;
      border-bottom: 1px solid #e5e7eb;
    }
    
    .experience-item:last-child, .education-item:last-child {
      border-bottom: none;
    }
    
    .job-title {
      font-size: 16px;
      font-weight: 600;
      color: ${text};
      margin-bottom: 5px;
    }
    
    .company {
      font-size: 14px;
      color: ${primary};
      font-weight: 500;
      margin-bottom: 5px;
    }
    
    .duration {
      font-size: 12px;
      color: ${secondary};
      margin-bottom: 8px;
    }
    
    .description {
      font-size: 14px;
      color: ${text};
      opacity: 0.8;
    }
    
    .education-title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .school {
      font-size: 14px;
      color: ${primary};
      margin-bottom: 5px;
    }
    
    .language-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .certification-item {
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    @media print {
      body {
        padding: 10mm;
      }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="cv-container">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="profile-header">
        <div class="name">${personal.full_name}</div>
        <div class="title">${cvData.current_position || 'Professional'}</div>
      </div>
      
      <div class="contact-info">
        <div class="section-title">Thông tin liên hệ</div>
        ${personal.email ? `<div class="contact-item">📧 ${personal.email}</div>` : ''}
        ${personal.phone ? `<div class="contact-item">📱 ${personal.phone}</div>` : ''}
        ${personal.city ? `<div class="contact-item">📍 ${personal.city}</div>` : ''}
        ${personal.address ? `<div class="contact-item">🏠 ${personal.address}</div>` : ''}
      </div>
      
      ${skills && skills.length > 0 ? `
      <div class="section">
        <div class="section-title">Kỹ năng</div>
        <div class="skills">
          ${skills.map((skill: string) => `
            <div class="skill-tag">${skill}</div>
          `).join('')}
        </div>
      </div>
      ` : ''}
      
      ${languages && languages.length > 0 ? `
      <div class="section">
        <div class="section-title">Ngôn ngữ</div>
        ${languages.map((lang: any) => `
          <div class="language-item">
            <span>${lang.language}</span>
            <span>${lang.proficiency}</span>
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${certifications && certifications.length > 0 ? `
      <div class="section">
        <div class="section-title">Chứng chỉ</div>
        ${certifications.map((cert: string) => `
          <div class="certification-item">• ${cert}</div>
        `).join('')}
      </div>
      ` : ''}
    </div>
    
    <!-- Main Content -->
    <div class="main-content">
      ${summary ? `
      <div class="summary">
        <div class="section-title">Giới thiệu</div>
        <div>${summary}</div>
      </div>
      ` : ''}
      
      ${experience && experience.length > 0 ? `
      <div class="section">
        <div class="section-title">Kinh nghiệm làm việc</div>
        ${experience.map((exp: any) => `
          <div class="experience-item">
            <div class="job-title">${exp.position}</div>
            <div class="company">${exp.company}</div>
            <div class="duration">${exp.duration}</div>
            ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
          </div>
        `).join('')}
      </div>
      ` : ''}
      
      ${education && education.length > 0 ? `
      <div class="section">
        <div class="section-title">Học vấn</div>
        ${education.map((edu: any) => `
          <div class="education-item">
            <div class="education-title">${edu.degree}</div>
            <div class="school">${edu.school}</div>
            <div class="duration">${edu.year} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
          </div>
        `).join('')}
      </div>
      ` : ''}
    </div>
  </div>
  
  <div class="no-print" style="text-align: center; margin-top: 40px; color: #888; font-size: 12px;">
    Generated by CareerAI - ${new Date().toLocaleDateString('vi-VN')}
  </div>
</body>
</html>`;
}

// Các template khác (Classic, Creative, Minimalist) có thể được thêm tương tự
function generateClassicTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
  // Template cổ điển - 1 cột
  const { personal, summary, experience, education, skills, languages, certifications } = cvData;
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>CV - ${personal.full_name}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Times+New+Roman&display=swap');
    
    body {
      font-family: 'Times New Roman', serif;
      line-height: 1.4;
      color: ${text};
      max-width: 210mm;
      margin: 0 auto;
      padding: 20mm;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
      border-bottom: 2px solid ${primary};
      padding-bottom: 20px;
    }
    
    .name {
      font-size: 28px;
      font-weight: bold;
      color: ${primary};
      margin-bottom: 5px;
    }
    
    .title {
      font-size: 18px;
      color: ${secondary};
    }
    
    .contact-info {
      margin-top: 10px;
      font-size: 14px;
    }
    
    .section {
      margin-bottom: 25px;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: ${primary};
      margin-bottom: 15px;
      border-bottom: 1px solid #ccc;
      padding-bottom: 5px;
    }
    
    .experience-item, .education-item {
      margin-bottom: 15px;
    }
    
    .job-title {
      font-weight: bold;
    }
    
    .company {
      font-style: italic;
      color: ${secondary};
    }
    
    .duration {
      color: #666;
      font-size: 14px;
    }
    
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }
    
    .skill-tag {
      background: ${primary}10;
      padding: 2px 8px;
      border-radius: 3px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="name">${personal.full_name}</div>
    <div class="title">${cvData.current_position || 'Professional'}</div>
    <div class="contact-info">
      ${personal.email ? `Email: ${personal.email} | ` : ''}
      ${personal.phone ? `Phone: ${personal.phone} | ` : ''}
      ${personal.city ? `Location: ${personal.city}` : ''}
    </div>
  </div>
  
  ${summary ? `
  <div class="section">
    <div class="section-title">Tóm tắt</div>
    <div>${summary}</div>
  </div>
  ` : ''}
  
  ${experience && experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Kinh nghiệm làm việc</div>
    ${experience.map((exp: any) => `
      <div class="experience-item">
        <div class="job-title">${exp.position}</div>
        <div class="company">${exp.company} | ${exp.duration}</div>
        ${exp.description ? `<div>${exp.description}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${education && education.length > 0 ? `
  <div class="section">
    <div class="section-title">Học vấn</div>
    ${education.map((edu: any) => `
      <div class="education-item">
        <div class="job-title">${edu.degree}</div>
        <div class="company">${edu.school} | ${edu.year}</div>
        ${edu.gpa ? `<div>GPA: ${edu.gpa}</div>` : ''}
      </div>
    `).join('')}
  </div>
  ` : ''}
  
  ${skills && skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Kỹ năng</div>
    <div class="skills">
      ${skills.map((skill: string) => `
        <span class="skill-tag">${skill}</span>
      `).join('')}
    </div>
  </div>
  ` : ''}
</body>
</html>`;
}

function generateCreativeTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
  // Template sáng tạo với màu sắc nổi bật
  return generateModernTemplate(cvData, primary, secondary, accent, background, text);
}

function generateMinimalistTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
  // Template tối giản
  return generateClassicTemplate(cvData, primary, secondary, accent, background, text);
}

// Hàm tạo PDF từ HTML (sử dụng external service hoặc library)
async function generatePDFFromHTML(htmlContent: string): Promise<Buffer> {
  try {
    // TRONG PRODUCTION: Sử dụng service thật như Puppeteer, PDFShift, etc.
    // Ở đây chúng ta tạo mock PDF có chứa HTML content để test
    
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 500
>>
stream
BT
/F1 16 Tf
72 720 Td
(CV Document - Generated with Template) Tj
ET
BT
/F1 12 Tf
72 680 Td
(This is a mock PDF. In production, use Puppeteer or PDF service) Tj
ET
BT
/F1 10 Tf
72 660 Td
(HTML Content Length: ${htmlContent.length} characters) Tj
ET
BT
/F1 10 Tf
72 640 Td
(Generated by CareerAI - ${new Date().toLocaleDateString('vi-VN')}) Tj
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000234 00000 n 
0000000344 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
444
%%EOF`;

    return Buffer.from(pdfContent);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    // Fallback: tạo PDF đơn giản
    return Buffer.from(`%PDF-1.4 minimal PDF for ${new Date().toISOString()}`);
  }
}

// Hàm generate HTML từ template với styling đẹp
// export function generateHTMLFromTemplate(cvData: any, template: any): string {
//   const { personal, summary, experience, education, skills, languages, certifications } = cvData;
  
//   // Lấy thông tin màu sắc từ template
//   const primaryColor = template?.colors?.primary || '#2563eb';
//   const secondaryColor = template?.colors?.secondary || '#64748b';
//   const accentColor = template?.colors?.accent || '#3b82f6';
//   const backgroundColor = template?.colors?.background || '#ffffff';
//   const textColor = template?.colors?.text || '#1f2937';

//   // Xác định layout dựa trên template
//   const layout = template?.layout || 'modern';
  
//   let html = '';
  
//   switch (layout) {
//     case 'modern':
//       html = generateModernTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
//       break;
//     case 'classic':
//       html = generateClassicTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
//       break;
//     case 'creative':
//       html = generateCreativeTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
//       break;
//     case 'minimalist':
//       html = generateMinimalistTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
//       break;
//     case 'two-column':
//       html = generateTwoColumnTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
//       break;
//     default:
//       html = generateModernTemplate(cvData, primaryColor, secondaryColor, accentColor, backgroundColor, textColor);
//   }

//   return html;
// }

// // Template Modern - Layout hiện đại
// function generateModernTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
//   const { personal, summary, experience, education, skills, languages, certifications } = cvData;
  
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>CV - ${personal.full_name}</title>
//   <style>
//     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }
    
//     body {
//       font-family: 'Inter', sans-serif;
//       line-height: 1.6;
//       color: ${text};
//       background: ${background};
//       max-width: 210mm;
//       margin: 0 auto;
//       padding: 20mm;
//     }
    
//     .cv-container {
//       display: grid;
//       grid-template-columns: 1fr 2fr;
//       gap: 30px;
//     }
    
//     /* Sidebar */
//     .sidebar {
//       background: linear-gradient(135deg, ${primary}20, ${accent}20);
//       padding: 30px 20px;
//       border-radius: 12px;
//     }
    
//     .profile-header {
//       text-align: center;
//       margin-bottom: 30px;
//     }
    
//     .name {
//       font-size: 24px;
//       font-weight: 700;
//       color: ${primary};
//       margin-bottom: 5px;
//     }
    
//     .title {
//       font-size: 16px;
//       color: ${secondary};
//       font-weight: 500;
//     }
    
//     .contact-info {
//       margin-bottom: 25px;
//     }
    
//     .contact-item {
//       display: flex;
//       align-items: center;
//       margin-bottom: 10px;
//       font-size: 14px;
//     }
    
//     .contact-item i {
//       width: 20px;
//       margin-right: 10px;
//       color: ${primary};
//     }
    
//     .section {
//       margin-bottom: 25px;
//     }
    
//     .section-title {
//       font-size: 16px;
//       font-weight: 600;
//       color: ${primary};
//       margin-bottom: 15px;
//       padding-bottom: 8px;
//       border-bottom: 2px solid ${primary}30;
//     }
    
//     .skills {
//       display: flex;
//       flex-wrap: wrap;
//       gap: 8px;
//     }
    
//     .skill-tag {
//       background: ${primary}15;
//       color: ${primary};
//       padding: 6px 12px;
//       border-radius: 20px;
//       font-size: 12px;
//       border: 1px solid ${primary}30;
//     }
    
//     /* Main Content */
//     .main-content {
//       padding: 10px 0;
//     }
    
//     .summary {
//       background: ${accent}10;
//       padding: 20px;
//       border-radius: 8px;
//       border-left: 4px solid ${accent};
//       margin-bottom: 30px;
//     }
    
//     .experience-item, .education-item {
//       margin-bottom: 20px;
//       padding-bottom: 20px;
//       border-bottom: 1px solid #e5e7eb;
//     }
    
//     .experience-item:last-child, .education-item:last-child {
//       border-bottom: none;
//     }
    
//     .job-title {
//       font-size: 16px;
//       font-weight: 600;
//       color: ${text};
//       margin-bottom: 5px;
//     }
    
//     .company {
//       font-size: 14px;
//       color: ${primary};
//       font-weight: 500;
//       margin-bottom: 5px;
//     }
    
//     .duration {
//       font-size: 12px;
//       color: ${secondary};
//       margin-bottom: 8px;
//     }
    
//     .description {
//       font-size: 14px;
//       color: ${text};
//       opacity: 0.8;
//     }
    
//     .education-title {
//       font-size: 16px;
//       font-weight: 600;
//       margin-bottom: 5px;
//     }
    
//     .school {
//       font-size: 14px;
//       color: ${primary};
//       margin-bottom: 5px;
//     }
    
//     .language-item {
//       display: flex;
//       justify-content: space-between;
//       margin-bottom: 8px;
//       font-size: 14px;
//     }
    
//     .certification-item {
//       margin-bottom: 8px;
//       font-size: 14px;
//     }
    
//     @media print {
//       body {
//         padding: 15mm;
//       }
//       .no-print { display: none; }
//     }
    
//     /* Screen specific styles */
//     @media screen {
//       body {
//         box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
//         margin: 20px auto;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="cv-container">
//     <!-- Sidebar -->
//     <div class="sidebar">
//       <div class="profile-header">
//         <div class="name">${personal.full_name}</div>
//         <div class="title">${cvData.current_position || 'Professional'}</div>
//       </div>
      
//       <div class="contact-info">
//         <div class="section-title">Thông tin liên hệ</div>
//         ${personal.email ? `<div class="contact-item">📧 ${personal.email}</div>` : ''}
//         ${personal.phone ? `<div class="contact-item">📱 ${personal.phone}</div>` : ''}
//         ${personal.city ? `<div class="contact-item">📍 ${personal.city}</div>` : ''}
//         ${personal.address ? `<div class="contact-item">🏠 ${personal.address}</div>` : ''}
//       </div>
      
//       ${skills && skills.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Kỹ năng</div>
//         <div class="skills">
//           ${skills.map((skill: string) => `
//             <div class="skill-tag">${skill}</div>
//           `).join('')}
//         </div>
//       </div>
//       ` : ''}
      
//       ${languages && languages.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Ngôn ngữ</div>
//         ${languages.map((lang: any) => `
//           <div class="language-item">
//             <span>${lang.language}</span>
//             <span>${lang.proficiency}</span>
//           </div>
//         `).join('')}
//       </div>
//       ` : ''}
      
//       ${certifications && certifications.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Chứng chỉ</div>
//         ${certifications.map((cert: string) => `
//           <div class="certification-item">• ${cert}</div>
//         `).join('')}
//       </div>
//       ` : ''}
//     </div>
    
//     <!-- Main Content -->
//     <div class="main-content">
//       ${summary ? `
//       <div class="summary">
//         <div class="section-title">Giới thiệu</div>
//         <div>${summary}</div>
//       </div>
//       ` : ''}
      
//       ${experience && experience.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Kinh nghiệm làm việc</div>
//         ${experience.map((exp: any) => `
//           <div class="experience-item">
//             <div class="job-title">${exp.position}</div>
//             <div class="company">${exp.company}</div>
//             <div class="duration">${exp.duration}</div>
//             ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
//           </div>
//         `).join('')}
//       </div>
//       ` : ''}
      
//       ${education && education.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Học vấn</div>
//         ${education.map((edu: any) => `
//           <div class="education-item">
//             <div class="education-title">${edu.degree}</div>
//             <div class="school">${edu.school}</div>
//             <div class="duration">${edu.year} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
//           </div>
//         `).join('')}
//       </div>
//       ` : ''}
//     </div>
//   </div>
  
//   <div class="no-print" style="text-align: center; margin-top: 40px; color: #888; font-size: 12px;">
//     Generated by CareerAI - ${new Date().toLocaleDateString('vi-VN')}
//   </div>
// </body>
// </html>`;
// }

// // Template Two Column - Layout 2 cột cân bằng
// function generateTwoColumnTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
//   const { personal, summary, experience, education, skills, languages, certifications } = cvData;
  
//   return `
// <!DOCTYPE html>
// <html>
// <head>
//   <meta charset="UTF-8">
//   <title>CV - ${personal.full_name}</title>
//   <style>
//     @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
    
//     * {
//       margin: 0;
//       padding: 0;
//       box-sizing: border-box;
//     }
    
//     body {
//       font-family: 'Inter', sans-serif;
//       line-height: 1.6;
//       color: ${text};
//       background: ${background};
//       max-width: 210mm;
//       margin: 0 auto;
//       padding: 15mm;
//     }
    
//     .header {
//       background: linear-gradient(135deg, ${primary}, ${accent});
//       color: white;
//       padding: 40px;
//       border-radius: 12px;
//       margin-bottom: 30px;
//       text-align: center;
//     }
    
//     .name {
//       font-size: 32px;
//       font-weight: 700;
//       margin-bottom: 8px;
//     }
    
//     .title {
//       font-size: 18px;
//       opacity: 0.9;
//     }
    
//     .two-column {
//       display: grid;
//       grid-template-columns: 1fr 1fr;
//       gap: 30px;
//     }
    
//     .column {
//       display: flex;
//       flex-direction: column;
//       gap: 25px;
//     }
    
//     .section {
//       margin-bottom: 0;
//     }
    
//     .section-title {
//       font-size: 18px;
//       font-weight: 600;
//       color: ${primary};
//       margin-bottom: 15px;
//       padding-bottom: 8px;
//       border-bottom: 2px solid ${primary}30;
//     }
    
//     .contact-grid {
//       display: grid;
//       gap: 10px;
//     }
    
//     .contact-item {
//       display: flex;
//       align-items: center;
//       font-size: 14px;
//     }
    
//     .skills-grid {
//       display: grid;
//       gap: 8px;
//     }
    
//     .skill-item {
//       display: flex;
//       align-items: center;
//       gap: 8px;
//     }
    
//     .skill-bar {
//       flex: 1;
//       height: 8px;
//       background: #e5e7eb;
//       border-radius: 4px;
//       overflow: hidden;
//     }
    
//     .skill-level {
//       height: 100%;
//       background: ${primary};
//       border-radius: 4px;
//     }
    
//     .experience-item, .education-item {
//       margin-bottom: 20px;
//     }
    
//     .job-title {
//       font-size: 16px;
//       font-weight: 600;
//       color: ${text};
//       margin-bottom: 5px;
//     }
    
//     .company {
//       font-size: 14px;
//       color: ${primary};
//       font-weight: 500;
//       margin-bottom: 5px;
//     }
    
//     .duration {
//       font-size: 12px;
//       color: ${secondary};
//       margin-bottom: 8px;
//     }
    
//     .description {
//       font-size: 14px;
//       color: ${text};
//       opacity: 0.8;
//     }
    
//     @media print {
//       body {
//         padding: 10mm;
//       }
//     }
    
//     @media screen {
//       body {
//         box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
//         margin: 20px auto;
//       }
//     }
//   </style>
// </head>
// <body>
//   <div class="header">
//     <div class="name">${personal.full_name}</div>
//     <div class="title">${cvData.current_position || 'Professional'}</div>
//   </div>
  
//   <div class="two-column">
//     <div class="column">
//       <!-- Left Column -->
//       <div class="section">
//         <div class="section-title">Thông tin liên hệ</div>
//         <div class="contact-grid">
//           ${personal.email ? `<div class="contact-item">📧 ${personal.email}</div>` : ''}
//           ${personal.phone ? `<div class="contact-item">📱 ${personal.phone}</div>` : ''}
//           ${personal.city ? `<div class="contact-item">📍 ${personal.city}</div>` : ''}
//           ${personal.address ? `<div class="contact-item">🏠 ${personal.address}</div>` : ''}
//         </div>
//       </div>
      
//       ${skills && skills.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Kỹ năng chuyên môn</div>
//         <div class="skills-grid">
//           ${skills.map((skill: string, index: number) => `
//             <div class="skill-item">
//               <span>${skill}</span>
//               <div class="skill-bar">
//                 <div class="skill-level" style="width: ${85 - (index * 5)}%"></div>
//               </div>
//             </div>
//           `).join('')}
//         </div>
//       </div>
//       ` : ''}
      
//       ${languages && languages.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Ngôn ngữ</div>
//         ${languages.map((lang: any) => `
//           <div class="skill-item">
//             <span>${lang.language}</span>
//             <div class="skill-bar">
//               <div class="skill-level" style="width: ${
//                 lang.proficiency === 'Bản ngữ' ? '100%' :
//                 lang.proficiency === 'Thành thạo' ? '90%' :
//                 lang.proficiency === 'Trung bình' ? '70%' : '50%'
//               }"></div>
//             </div>
//           </div>
//         `).join('')}
//       </div>
//       ` : ''}
//     </div>
    
//     <div class="column">
//       <!-- Right Column -->
//       ${summary ? `
//       <div class="section">
//         <div class="section-title">Giới thiệu</div>
//         <div>${summary}</div>
//       </div>
//       ` : ''}
      
//       ${experience && experience.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Kinh nghiệm làm việc</div>
//         ${experience.map((exp: any) => `
//           <div class="experience-item">
//             <div class="job-title">${exp.position}</div>
//             <div class="company">${exp.company}</div>
//             <div class="duration">${exp.duration}</div>
//             ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
//           </div>
//         `).join('')}
//       </div>
//       ` : ''}
      
//       ${education && education.length > 0 ? `
//       <div class="section">
//         <div class="section-title">Học vấn</div>
//         ${education.map((edu: any) => `
//           <div class="education-item">
//             <div class="job-title">${edu.degree}</div>
//             <div class="company">${edu.school}</div>
//             <div class="duration">${edu.year} ${edu.gpa ? `• GPA: ${edu.gpa}` : ''}</div>
//           </div>
//         `).join('')}
//       </div>
//       ` : ''}
//     </div>
//   </div>
// </body>
// </html>`;
// }

// // Các template khác (Classic, Creative, Minimalist)
// function generateClassicTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
//   // Implementation tương tự...
//   return generateModernTemplate(cvData, primary, secondary, accent, background, text);
// }

// function generateCreativeTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
//   // Implementation tương tự...
//   return generateModernTemplate(cvData, primary, secondary, accent, background, text);
// }

// function generateMinimalistTemplate(cvData: any, primary: string, secondary: string, accent: string, background: string, text: string): string {
//   // Implementation tương tự...
//   return generateModernTemplate(cvData, primary, secondary, accent, background, text);
// }
