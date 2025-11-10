-- Insert sample admin user (you'll need to create this user in Supabase Auth first)
-- This is just a placeholder - actual admin creation happens through signup

-- Insert sample cities for Vietnam
INSERT INTO public.job_postings (id, employer_id, title, description, requirements, benefits, job_type, job_level, salary_min, salary_max, location, city, skills_required, experience_years_min, number_of_positions, deadline, is_active)
VALUES 
  (uuid_generate_v4(), (SELECT id FROM public.employer_profiles LIMIT 1), 'Sample Job', 'This is a sample job posting', 'Sample requirements', 'Sample benefits', 'full_time', 'junior', 10000000, 15000000, 'Ho Chi Minh City', 'Ho Chi Minh', ARRAY['JavaScript', 'React'], 1, 1, CURRENT_DATE + INTERVAL '30 days', true)
ON CONFLICT DO NOTHING;
