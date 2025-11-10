-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applicant_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_simulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Applicant profiles policies
CREATE POLICY "Applicants can view their own profile" ON public.applicant_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Employers can view applicant profiles" ON public.applicant_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'employer'
    )
  );

CREATE POLICY "Applicants can update their own profile" ON public.applicant_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Applicants can insert their own profile" ON public.applicant_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Employer profiles policies
CREATE POLICY "Employers can view their own profile" ON public.employer_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view employer profiles" ON public.employer_profiles
  FOR SELECT USING (true);

CREATE POLICY "Employers can update their own profile" ON public.employer_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert their own profile" ON public.employer_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Job postings policies
CREATE POLICY "Anyone can view active job postings" ON public.job_postings
  FOR SELECT USING (is_active = true);

CREATE POLICY "Employers can view their own job postings" ON public.job_postings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.employer_profiles
      WHERE employer_profiles.id = job_postings.employer_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can create job postings" ON public.job_postings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.employer_profiles
      WHERE employer_profiles.id = employer_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update their own job postings" ON public.job_postings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.employer_profiles
      WHERE employer_profiles.id = job_postings.employer_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can delete their own job postings" ON public.job_postings
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.employer_profiles
      WHERE employer_profiles.id = job_postings.employer_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

-- Job applications policies
CREATE POLICY "Applicants can view their own applications" ON public.job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = job_applications.applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can view applications for their jobs" ON public.job_applications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.job_postings
      JOIN public.employer_profiles ON employer_profiles.id = job_postings.employer_id
      WHERE job_postings.id = job_applications.job_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can create applications" ON public.job_applications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can update their own applications" ON public.job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = job_applications.applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Employers can update applications for their jobs" ON public.job_applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.job_postings
      JOIN public.employer_profiles ON employer_profiles.id = job_postings.employer_id
      WHERE job_postings.id = job_applications.job_id
      AND employer_profiles.user_id = auth.uid()
    )
  );

-- Saved jobs policies
CREATE POLICY "Applicants can view their saved jobs" ON public.saved_jobs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = saved_jobs.applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can save jobs" ON public.saved_jobs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can delete their saved jobs" ON public.saved_jobs
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = saved_jobs.applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

-- AI chat history policies
CREATE POLICY "Users can view their own chat history" ON public.ai_chat_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat history" ON public.ai_chat_history
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AI logs policies (admin only for viewing)
CREATE POLICY "Users can insert their own AI logs" ON public.ai_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Interview simulations policies
CREATE POLICY "Applicants can view their own simulations" ON public.interview_simulations
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = interview_simulations.applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can create simulations" ON public.interview_simulations
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

CREATE POLICY "Applicants can update their own simulations" ON public.interview_simulations
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.applicant_profiles
      WHERE applicant_profiles.id = interview_simulations.applicant_id
      AND applicant_profiles.user_id = auth.uid()
    )
  );

-- Payments policies
CREATE POLICY "Users can view their own payments" ON public.payments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own payments" ON public.payments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (auth.uid() = user_id);
