-- Add verification fields to employer_profiles
ALTER TABLE public.employer_profiles
ADD COLUMN IF NOT EXISTS verification_status verification_status DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS verification_notes TEXT,
ADD COLUMN IF NOT EXISTS verified_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS verified_by UUID REFERENCES public.profiles(id);

-- Add status field to job_postings
CREATE TYPE job_status AS ENUM ('draft', 'published', 'closed', 'expired');

ALTER TABLE public.job_postings
ADD COLUMN IF NOT EXISTS status job_status DEFAULT 'draft',
ADD COLUMN IF NOT EXISTS published_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS closed_at TIMESTAMPTZ;

-- Add company branding fields to employer_profiles
ALTER TABLE public.employer_profiles
ADD COLUMN IF NOT EXISTS cover_image_url TEXT,
ADD COLUMN IF NOT EXISTS gallery_images TEXT[],
ADD COLUMN IF NOT EXISTS video_url TEXT,
ADD COLUMN IF NOT EXISTS culture_description TEXT,
ADD COLUMN IF NOT EXISTS benefits_list TEXT[],
ADD COLUMN IF NOT EXISTS company_rating DECIMAL(3, 2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Create company reviews table
CREATE TABLE IF NOT EXISTS public.company_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  employer_id UUID NOT NULL REFERENCES public.employer_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reviewer_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  review_text TEXT,
  position TEXT,
  is_current_employee BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add indexes
CREATE INDEX idx_employer_profiles_verification_status ON public.employer_profiles(verification_status);
CREATE INDEX idx_job_postings_status ON public.job_postings(status);
CREATE INDEX idx_company_reviews_employer_id ON public.company_reviews(employer_id);
CREATE INDEX idx_company_reviews_is_approved ON public.company_reviews(is_approved);

-- Update existing jobs to published status if they are active
UPDATE public.job_postings 
SET status = 'published', published_at = created_at 
WHERE is_active = TRUE AND status = 'draft';

-- Function to check if employer can post jobs
CREATE OR REPLACE FUNCTION can_employer_post_jobs(employer_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_status verification_status;
BEGIN
  SELECT verification_status INTO v_status
  FROM public.employer_profiles
  WHERE user_id = employer_user_id;
  
  RETURN v_status = 'verified';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update company rating
CREATE OR REPLACE FUNCTION update_company_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.employer_profiles
  SET 
    company_rating = (
      SELECT AVG(rating)::DECIMAL(3,2)
      FROM public.company_reviews
      WHERE employer_id = NEW.employer_id AND is_approved = TRUE
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM public.company_reviews
      WHERE employer_id = NEW.employer_id AND is_approved = TRUE
    )
  WHERE id = NEW.employer_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_company_rating
AFTER INSERT OR UPDATE ON public.company_reviews
FOR EACH ROW
EXECUTE FUNCTION update_company_rating();
