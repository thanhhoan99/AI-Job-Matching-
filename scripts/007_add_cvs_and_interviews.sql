-- Create CV templates table
CREATE TABLE IF NOT EXISTS public.cv_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  template_data JSONB NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create CVs table for multiple CVs per user
CREATE TABLE IF NOT EXISTS public.applicant_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  applicant_id UUID NOT NULL REFERENCES public.applicant_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template_id UUID REFERENCES public.cv_templates(id),
  is_default BOOLEAN DEFAULT FALSE,
  cv_data JSONB NOT NULL,
  pdf_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create interviews table
CREATE TABLE IF NOT EXISTS public.interviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  application_id UUID NOT NULL REFERENCES public.job_applications(id) ON DELETE CASCADE,
  interview_type TEXT NOT NULL, -- 'online', 'offline', 'phone'
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  location TEXT,
  meeting_link TEXT,
  notes TEXT,
  status TEXT DEFAULT 'scheduled', -- 'scheduled', 'completed', 'cancelled', 'rescheduled'
  reminder_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update job_applications to include selected CV
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS cv_id UUID REFERENCES public.applicant_cvs(id);

-- Create indexes
CREATE INDEX idx_applicant_cvs_applicant_id ON public.applicant_cvs(applicant_id);
CREATE INDEX idx_applicant_cvs_is_default ON public.applicant_cvs(is_default);
CREATE INDEX idx_interviews_application_id ON public.interviews(application_id);
CREATE INDEX idx_interviews_scheduled_at ON public.interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON public.interviews(status);

-- Insert default CV templates
INSERT INTO public.cv_templates (name, description, thumbnail_url, template_data) VALUES
('Modern Professional', 'Thiết kế hiện đại, chuyên nghiệp phù hợp với mọi ngành nghề', '/templates/modern.png', '{"layout": "modern", "colors": {"primary": "#2563eb", "secondary": "#64748b"}, "sections": ["header", "summary", "experience", "education", "skills"]}'),
('Classic ATS', 'Định dạng chuẩn ATS, dễ đọc cho hệ thống tự động', '/templates/classic.png', '{"layout": "classic", "colors": {"primary": "#000000", "secondary": "#666666"}, "sections": ["header", "objective", "experience", "education", "skills", "certifications"]}'),
('Creative Design', 'Thiết kế sáng tạo cho ngành thiết kế, marketing', '/templates/creative.png', '{"layout": "creative", "colors": {"primary": "#8b5cf6", "secondary": "#ec4899"}, "sections": ["header", "portfolio", "experience", "skills", "education"]}'),
('Minimalist', 'Phong cách tối giản, tập trung vào nội dung', '/templates/minimalist.png', '{"layout": "minimalist", "colors": {"primary": "#1f2937", "secondary": "#9ca3af"}, "sections": ["header", "summary", "experience", "education", "skills"]}');
