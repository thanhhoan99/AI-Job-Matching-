// lib/ai/recommendation-service.ts
import { generateText } from 'ai';
import { google } from "@ai-sdk/google"

export async function analyzeJobMatch(job: any, applicantData: any): Promise<{
  matchScore: number
  reasons: string[]
  matchingSkills: string[]
  missingSkills: string[]
}> {
  let rawResponse: string = '';

  try {
    console.log('🤖 Starting job match analysis with Gemini...');
    
    const { text } = await generateText({
      model: google("gemini-2.0-flash"), // Hoặc "gemini-2.5-flash"
      prompt: `
        PHÂN TÍCH MỨC ĐỘ PHÙ HỢP CÔNG VIỆC
        
        THÔNG TIN ỨNG VIÊN:
        - Kỹ năng: ${applicantData.skills?.join(', ') || 'Chưa có'}
        - Số năm kinh nghiệm: ${applicantData.years_of_experience || 0}
        - Vị trí hiện tại: ${applicantData.current_position || 'Chưa có'}
        - Kinh nghiệm làm việc: ${applicantData.experiences?.length || 0} vị trí
        - Mô tả: ${applicantData.summary || 'Chưa có'}
        
        THÔNG TIN CÔNG VIỆC:
        - Tiêu đề: ${job.title}
        - Yêu cầu kỹ năng: ${job.skills_required?.join(', ') || 'Không có'}
        - Kinh nghiệm yêu cầu: ${job.experience_years_min} năm
        - Cấp độ: ${job.job_level}
        - Loại công việc: ${job.job_type}
        - Mô tả: ${job.description.substring(0, 500)}...
        
        HÃY PHÂN TÍCH VÀ TRẢ VỀ KẾT QUẢ JSON:
        {
          "matchScore": số_điểm_từ_0_100,
          "reasons": ["lý do 1", "lý do 2", "lý do 3"],
          "matchingSkills": ["kỹ năng khớp 1", "kỹ năng khớp 2"],
          "missingSkills": ["kỹ năng thiếu 1", "kỹ năng thiếu 2"]
        }
        
        QUAN TRỌNG: CHỈ TRẢ VỀ JSON, KHÔNG THÊM BẤT KỲ TEXT NÀO KHÁC.
        KHÔNG DÙNG MARKDOWN, KHÔNG DÙNG CODE BLOCKS.
      `
    });

    rawResponse = text;
    console.log('📨 Raw response from Gemini:', rawResponse);

    // 🎯 QUAN TRỌNG: Xử lý response để loại bỏ markdown
    const cleanedResponse = cleanGeminiResponse(rawResponse);
    console.log('🧹 Cleaned response:', cleanedResponse);

    const result = JSON.parse(cleanedResponse);
    
    // Validate result structure
    if (typeof result.matchScore !== 'number' || !Array.isArray(result.reasons)) {
      throw new Error('Invalid response structure from Gemini');
    }

    console.log('✅ Successfully parsed Gemini response');
    return result;

  } catch (error) {
    console.error('❌ Error analyzing job match with Gemini:', error);
    console.log('🔍 Raw response that failed:', rawResponse);
    
    // Fallback analysis
    return {
      matchScore: calculateBasicMatchScore(job, applicantData),
      reasons: getFallbackReasons(job, applicantData),
      matchingSkills: findMatchingSkills(job, applicantData),
      missingSkills: findMissingSkills(job, applicantData)
    };
  }
}

// Hàm làm sạch response từ Gemini
function cleanGeminiResponse(response: string): string {
  if (!response) return '{}';
  
  let cleaned = response.trim();
  
  // Loại bỏ markdown code blocks
  cleaned = cleaned.replace(/^```json\s*/i, '');
  cleaned = cleaned.replace(/\s*```$/i, '');
  cleaned = cleaned.replace(/^```\s*/i, '');
  
  // Loại bỏ các ký tự đặc biệt ở đầu/cuối
  cleaned = cleaned.replace(/^[`'"\s]+/, '');
  cleaned = cleaned.replace(/[`'"\s]+$/, '');
  
  // Kiểm tra nếu response không phải JSON hợp lệ
  if (!cleaned.startsWith('{') && !cleaned.startsWith('[')) {
    console.warn('⚠️ Response is not valid JSON, attempting to extract JSON...');
    
    // Thử extract JSON từ response
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    } else {
      // Fallback: tạo JSON cơ bản
      cleaned = '{"matchScore": 50, "reasons": ["Không thể phân tích tự động"], "matchingSkills": [], "missingSkills": []}';
    }
  }
  
  return cleaned;
}

// Hàm tạo reasons fallback
function getFallbackReasons(job: any, applicantData: any): string[] {
  const reasons: string[] = [];
  
  const matchingSkills = findMatchingSkills(job, applicantData);
  if (matchingSkills.length > 0) {
    reasons.push(`Có ${matchingSkills.length} kỹ năng phù hợp: ${matchingSkills.slice(0, 3).join(', ')}`);
  }
  
  const applicantExp = applicantData.years_of_experience || 0;
  const requiredExp = job.experience_years_min || 0;
  
  if (applicantExp >= requiredExp) {
    reasons.push(`Kinh nghiệm đáp ứng yêu cầu (${applicantExp} năm)`);
  } else if (requiredExp > 0) {
    reasons.push(`Kinh nghiệm cần bổ sung: ${requiredExp - applicantExp} năm`);
  }
  
  if (reasons.length === 0) {
    reasons.push('Cần phân tích thêm để đánh giá chi tiết');
  }
  
  return reasons;
}

// Các hàm helper giữ nguyên
function calculateBasicMatchScore(job: any, applicantData: any): number {
  let score = 0;
  
  // Match skills
  const jobSkills = job.skills_required || [];
  const applicantSkills = applicantData.skills || [];
  const matchingSkills = jobSkills.filter((skill: string) => 
    applicantSkills.some((appSkill: string) => 
      appSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(appSkill.toLowerCase())
    )
  );
  
  if (jobSkills.length > 0) {
    score += (matchingSkills.length / jobSkills.length) * 50;
  }
  
  // Match experience
  const requiredExp = job.experience_years_min || 0;
  const candidateExp = applicantData.years_of_experience || 0;
  if (candidateExp >= requiredExp) {
    score += 30;
  } else if (requiredExp > 0) {
    score += (candidateExp / requiredExp) * 30;
  }
  
  // Other factors
  score += 20;
  
  return Math.min(Math.round(score), 100);
}

function findMatchingSkills(job: any, applicantData: any): string[] {
  const jobSkills = job.skills_required || [];
  const applicantSkills = applicantData.skills || [];
  return jobSkills.filter((skill: string) => 
    applicantSkills.some((appSkill: string) => 
      appSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(appSkill.toLowerCase())
    )
  ).slice(0, 5);
}

function findMissingSkills(job: any, applicantData: any): string[] {
  const jobSkills = job.skills_required || [];
  const applicantSkills = applicantData.skills || [];
  return jobSkills.filter((skill: string) => 
    !applicantSkills.some((appSkill: string) => 
      appSkill.toLowerCase().includes(skill.toLowerCase()) || 
      skill.toLowerCase().includes(appSkill.toLowerCase())
    )
  ).slice(0, 5);
}