// app/api/jobs/simple-recommendations/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { applicantId, limit = 10 } = await req.json();

    if (!applicantId) {
      return NextResponse.json({ error: "applicantId is required" }, { status: 400 });
    }

    // Lấy thông tin applicant profile
    const { data: applicantProfile, error: profileError } = await supabase
      .from("applicant_profiles")
      .select("skills, years_of_experience, current_position, preferred_locations, preferred_job_types, city")
      .eq("id", applicantId)
      .single();

    if (profileError || !applicantProfile) {
      return NextResponse.json({ error: "Applicant profile not found" }, { status: 404 });
    }

    console.log("🔍 [Simple Recommendations] Applicant profile:", applicantProfile);

    // Lấy tất cả jobs active
    let query = supabase
      .from("job_postings")
      .select(`
        *,
        employer_profiles (
          company_name,
          logo_url,
          city
        )
      `)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      throw jobsError;
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ data: [] });
    }

    // Tính điểm phù hợp cho mỗi job
    const jobsWithScores = jobs.map(job => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Matching skills (quan trọng nhất - 40 điểm)
      const applicantSkills: string[] = applicantProfile.skills || [];
      const jobSkills: string[] = job.skills_required || [];
      
      // SỬA: Thêm kiểu cho jobSkill
      const matchingSkills = applicantSkills.filter(skill => 
        jobSkills.some((jobSkill: string) => 
          jobSkill.toLowerCase().includes(skill.toLowerCase()) || 
          skill.toLowerCase().includes(jobSkill.toLowerCase())
        )
      );

      if (matchingSkills.length > 0) {
        const skillScore = (matchingSkills.length / Math.max(jobSkills.length, 1)) * 40;
        score += skillScore;
        reasons.push(`Phù hợp ${matchingSkills.length} kỹ năng: ${matchingSkills.slice(0, 3).join(', ')}`);
      }

      // 2. Kinh nghiệm (20 điểm)
      const applicantExperience = applicantProfile.years_of_experience || 0;
      const jobMinExperience = job.experience_years_min || 0;
      
      if (applicantExperience >= jobMinExperience) {
        score += 20;
        reasons.push(`Đáp ứng kinh nghiệm: ${applicantExperience} năm`);
      } else if (applicantExperience >= jobMinExperience * 0.7) {
        score += 10;
        reasons.push(`Gần đáp ứng kinh nghiệm: ${applicantExperience}/${jobMinExperience} năm`);
      }

      // 3. Địa điểm (15 điểm)
      const applicantCity = applicantProfile.city;
      const applicantPreferredLocations: string[] = applicantProfile.preferred_locations || [];
      const jobCity = job.city;
      
      if (applicantCity === jobCity) {
        score += 15;
        reasons.push(`Cùng thành phố: ${jobCity}`);
      } else if (applicantPreferredLocations.includes(jobCity)) {
        score += 10;
        reasons.push(`Thuộc khu vực ưa thích: ${jobCity}`);
      }

      // 4. Loại công việc (15 điểm)
      const applicantPreferredTypes: string[] = applicantProfile.preferred_job_types || [];
      if (applicantPreferredTypes.includes(job.job_type)) {
        score += 15;
        reasons.push(`Loại hình ưa thích: ${job.job_type}`);
      }

      // 5. Cấp bậc (10 điểm) - dựa trên current_position và job_level
      const applicantPosition = (applicantProfile.current_position || '').toLowerCase();
      const jobLevel = job.job_level;
      
      // Simple level matching logic
      const levelWeights: { [key: string]: number } = {
        'intern': 1, 'junior': 2, 'middle': 3, 'senior': 4, 'lead': 5, 'manager': 6, 'director': 7
      };
      
      const applicantLevelWeight = Object.entries(levelWeights).find(([level]) => 
        applicantPosition.includes(level)
      )?.[1] || 2; // default to junior
      
      const jobLevelWeight = levelWeights[jobLevel] || 2;
      
      if (Math.abs(applicantLevelWeight - jobLevelWeight) <= 1) {
        score += 10;
        reasons.push(`Cấp bậc phù hợp`);
      }

      // Đảm bảo score không vượt quá 100
      score = Math.min(score, 100);

      // SỬA: Thêm kiểu cho missing_skills
      const missingSkills: string[] = jobSkills.filter((jobSkill: string) => 
        !applicantSkills.some((appSkill: string) => 
          appSkill.toLowerCase().includes(jobSkill.toLowerCase()) ||
          jobSkill.toLowerCase().includes(appSkill.toLowerCase())
        )
      );

      return {
        ...job,
        match_score: Math.round(score),
        reasons: reasons.slice(0, 3), // Giới hạn 3 lý do
        matching_skills: matchingSkills,
        missing_skills: missingSkills
      };
    });

    // Sắp xếp theo điểm và giới hạn số lượng
    const recommendedJobs = jobsWithScores
      .filter(job => job.match_score >= 30) // Chỉ lấy jobs có điểm >= 30
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, limit);

    console.log(`✅ [Simple Recommendations] Found ${recommendedJobs.length} recommended jobs`);

    return NextResponse.json({ data: recommendedJobs });
  } catch (error: any) {
    console.error("Simple job recommendations error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to get job recommendations" },
      { status: 500 }
    );
  }
}