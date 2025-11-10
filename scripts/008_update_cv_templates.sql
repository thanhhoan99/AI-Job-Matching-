[file name]: 008_update_cv_templates.sql
[file content begin]
-- Update existing CV templates with more modern and distinct designs

-- 1. Modern Professional - Template hiện đại, chuyên nghiệp (2 cột)
UPDATE public.cv_templates SET 
  name = 'Modern Pro - 2 Columns',
  description = 'Thiết kế 2 cột hiện đại, cân bằng tốt giữa thông tin và không gian trắng',
  thumbnail_url = '/templates/modern-pro.png',
  template_data = '{
    "layout": "two-column",
    "colors": {
      "primary": "#2563eb",
      "secondary": "#64748b",
      "accent": "#3b82f6",
      "background": "#ffffff",
      "text": "#1f2937"
    },
    "sections": ["header", "contact", "skills", "languages", "certifications", "summary", "experience", "education"],
    "styles": {
      "header": "gradient",
      "font": "inter",
      "spacing": "comfortable"
    },
    "features": ["two-column", "skill-bars", "progress-circles", "icon-support"]
  }'
WHERE id = '05111b06-e042-4cf2-8974-28042abf9bec';

-- 2. Classic ATS - Template chuẩn ATS với thiết kế tối ưu
UPDATE public.cv_templates SET 
  name = 'ATS Optimized',
  description = 'Định dạng chuẩn ATS với bố cục một cột, tối ưu cho hệ thống quét CV tự động',
  thumbnail_url = '/templates/ats-optimized.png',
  template_data = '{
    "layout": "single-column",
    "colors": {
      "primary": "#000000",
      "secondary": "#374151",
      "accent": "#6b7280",
      "background": "#ffffff",
      "text": "#111827"
    },
    "sections": ["header", "summary", "experience", "education", "skills", "certifications", "languages"],
    "styles": {
      "header": "minimal",
      "font": "roboto",
      "spacing": "standard"
    },
    "features": ["ats-friendly", "clean-typography", "keyword-optimized", "single-column"]
  }'
WHERE id = 'a6777069-e795-44cd-b4a2-4af14b1cb369';

-- 3. Creative Design - Template sáng tạo cho designer
UPDATE public.cv_templates SET 
  name = 'Creative Portfolio',
  description = 'Thiết kế sáng tạo với màu sắc nổi bật, phù hợp cho designer và creative professionals',
  thumbnail_url = '/templates/creative-portfolio.png',
  template_data = '{
    "layout": "creative",
    "colors": {
      "primary": "#8b5cf6",
      "secondary": "#ec4899",
      "accent": "#f59e0b",
      "background": "#f8fafc",
      "text": "#1e293b"
    },
    "sections": ["header", "portfolio", "skills", "experience", "education", "certifications", "personal-project"],
    "styles": {
      "header": "creative",
      "font": "poppins",
      "spacing": "generous"
    },
    "features": ["colorful", "portfolio-showcase", "project-gallery", "creative-layout"]
  }'
WHERE id = '51158997-ce9c-44ac-a07a-70ba96027476';

-- 4. Minimalist - Template tối giản thanh lịch
UPDATE public.cv_templates SET 
  name = 'Minimal Elegance',
  description = 'Phong cách tối giản với typography tinh tế, tập trung vào nội dung chất lượng',
  thumbnail_url = '/templates/minimal-elegance.png',
  template_data = '{
    "layout": "minimalist",
    "colors": {
      "primary": "#1f2937",
      "secondary": "#9ca3af",
      "accent": "#6b7280",
      "background": "#ffffff",
      "text": "#374151"
    },
    "sections": ["header", "summary", "experience", "education", "skills", "languages"],
    "styles": {
      "header": "elegant",
      "font": "system-ui",
      "spacing": "minimal"
    },
    "features": ["minimal-design", "elegant-typography", "focus-content", "clean-lines"]
  }'
WHERE id = 'dd3bc848-c4e5-4e59-9dfe-60b90b06e32f';

-- 5. Add new template: Executive - Cho quản lý cấp cao
INSERT INTO public.cv_templates (id, name, description, thumbnail_url, template_data, is_active) VALUES (
  uuid_generate_v4(),
  'Executive Premium',
  'Template cao cấp dành cho quản lý và giám đốc, thể hiện sự chuyên nghiệp và uy tín',
  '/templates/executive-premium.png',
  '{
    "layout": "executive",
    "colors": {
      "primary": "#059669",
      "secondary": "#047857",
      "accent": "#10b981",
      "background": "#f9fafb",
      "text": "#1f2937"
    },
    "sections": ["header", "executive-summary", "achievements", "experience", "education", "skills", "board-positions", "publications"],
    "styles": {
      "header": "premium",
      "font": "georgia",
      "spacing": "executive"
    },
    "features": ["premium-design", "achievement-focused", "leadership-sections", "corporate-ready"]
  }',
  true
);

-- 6. Add new template: Tech Modern - Cho developer và tech professionals
INSERT INTO public.cv_templates (id, name, description, thumbnail_url, template_data, is_active) VALUES (
  uuid_generate_v4(),
  'Tech Modern',
  'Template hiện đại cho developer và tech professionals với layout tối ưu cho technical skills',
  '/templates/tech-modern.png',
  '{
    "layout": "tech",
    "colors": {
      "primary": "#dc2626",
      "secondary": "#ea580c",
      "accent": "#dc2626",
      "background": "#0f172a",
      "text": "#f8fafc"
    },
    "sections": ["header", "technical-summary", "tech-skills", "experience", "projects", "education", "certifications"],
    "styles": {
      "header": "tech",
      "font": "monospace",
      "spacing": "tech"
    },
    "features": ["dark-mode", "tech-skills-display", "project-showcase", "code-friendly"]
  }',
  true
);

-- 7. Add new template: Fresh Graduate - Cho sinh viên mới ra trường
INSERT INTO public.cv_templates (id, name, description, thumbnail_url, template_data, is_active) VALUES (
  uuid_generate_v4(),
  'Fresh Graduate',
  'Template tươi sáng cho sinh viên mới tốt nghiệp, tập trung vào học vấn và tiềm năng',
  '/templates/fresh-graduate.png',
  '{
    "layout": "fresh",
    "colors": {
      "primary": "#0369a1",
      "secondary": "#0ea5e9",
      "accent": "#38bdf8",
      "background": "#f0f9ff",
      "text": "#0c4a6e"
    },
    "sections": ["header", "objective", "education", "internships", "university-projects", "skills", "extracurricular", "achievements"],
    "styles": {
      "header": "fresh",
      "font": "inter",
      "spacing": "youthful"
    },
    "features": ["youthful-design", "education-focused", "internship-highlight", "project-showcase"]
  }',
  true
);

-- 8. Add new template: Corporate Classic - Cho môi trường doanh nghiệp
INSERT INTO public.cv_templates (id, name, description, thumbnail_url, template_data, is_active) VALUES (
  uuid_generate_v4(),
  'Corporate Classic',
  'Template cổ điển phù hợp với môi trường doanh nghiệp truyền thống và tập đoàn',
  '/templates/corporate-classic.png',
  '{
    "layout": "corporate",
    "colors": {
      "primary": "#1e40af",
      "secondary": "#3730a3",
      "accent": "#6366f1",
      "background": "#ffffff",
      "text": "#1e293b"
    },
    "sections": ["header", "professional-summary", "work-experience", "education", "core-competencies", "achievements", "professional-development"],
    "styles": {
      "header": "corporate",
      "font": "times-new-roman",
      "spacing": "professional"
    },
    "features": ["corporate-formal", "achievement-oriented", "professional-development", "traditional-layout"]
  }',
  true
);
[file content end]