import { createClient } from "@/lib/supabase/server"

export interface CVQualityResult {
  quality: 'high' | 'medium' | 'low' | 'spam'
  score: number
  reasons: string[]
  metadata: {
    fileSize: number
    pageCount: number
    textLength: number
    hasSkills: boolean
    hasExperience: boolean
    hasEducation: boolean
    relevanceScore: number
    isDuplicate: boolean
  }
}

export async function checkCVQuality(params: {
  cvUrl: string
  cvText?: string
  jobId?: string
  applicantId?: string
  userId?: string
}): Promise<CVQualityResult> {
  const { cvUrl, cvText, jobId, applicantId, userId } = params
  const reasons: string[] = []
  let score = 100
  
  const metadata = {
    fileSize: 0,
    pageCount: 0,
    textLength: 0,
    hasSkills: false,
    hasExperience: false,
    hasEducation: false,
    relevanceScore: 0,
    isDuplicate: false
  }

  const supabase = await createClient()

  try {
    // 1. KIỂM TRA KỸ THUẬT FILE
    // Lấy thông tin file từ URL
    const fileResponse = await fetch(cvUrl, { method: 'HEAD' })
    if (!fileResponse.ok) {
      reasons.push('Không thể truy cập file CV')
      score -= 50
    } else {
      const fileSize = parseInt(fileResponse.headers.get('content-length') || '0')
      metadata.fileSize = fileSize
      
      // Kiểm tra dung lượng file
      if (fileSize < 10240) { // < 10KB
        reasons.push('File quá nhỏ (< 10KB) - Có thể là file trống')
        score -= 40
      }
      
      if (fileSize > 10 * 1024 * 1024) { // > 10MB
        reasons.push('File quá lớn (> 10MB) - Có thể chứa mã độc')
        score -= 30
      }
    }

    // 2. KIỂM TRA NỘI DUNG (nếu có text)
    if (cvText) {
      metadata.textLength = cvText.length
      
      // Kiểm tra độ dài văn bản
      if (cvText.length < 300) {
        reasons.push('CV quá ngắn (dưới 300 ký tự)')
        score -= 40
      }
      
      if (cvText.length > 50000) {
        reasons.push('CV quá dài (> 50,000 ký tự) - Có thể là spam')
        score -= 20
      }

      // Chuyển về chữ thường để tìm kiếm
      const lowerText = cvText.toLowerCase()
      
      // Kiểm tra các phần quan trọng
      const hasSkills = lowerText.includes('kỹ năng') || 
                       lowerText.includes('skill') ||
                       lowerText.includes('công nghệ') ||
                       lowerText.includes('technology')
      
      const hasExperience = lowerText.includes('kinh nghiệm') || 
                           lowerText.includes('experience') ||
                           lowerText.includes('công việc') ||
                           lowerText.includes('work')
      
      const hasEducation = lowerText.includes('học vấn') || 
                          lowerText.includes('education') ||
                          lowerText.includes('bằng cấp') ||
                          lowerText.includes('trình độ')

      metadata.hasSkills = hasSkills
      metadata.hasExperience = hasExperience
      metadata.hasEducation = hasEducation

      if (!hasSkills) {
        reasons.push('Thiếu phần kỹ năng')
        score -= 20
      }
      
      if (!hasExperience) {
        reasons.push('Thiếu phần kinh nghiệm')
        score -= 20
      }
      
      if (!hasEducation) {
        reasons.push('Thiếu phần học vấn')
        score -= 15
      }

      // Kiểm tra nội dung rác
      const spamPatterns = [
        /test\s+cv/i,
        /cv\s+mẫu/i,
        /sample\s+cv/i,
        /trống|blank/i,
        /lorem\s+ipsum/i,
        /\bxxx\b/i,
        /\b123\b.*\b456\b/i
      ]
      
      for (const pattern of spamPatterns) {
        if (pattern.test(cvText)) {
          reasons.push('CV chứa nội dung mẫu hoặc rác')
          score -= 50
          break
        }
      }

      // Kiểm tra nội dung copy-paste (quá nhiều ký tự giống nhau)
      if (cvText.length > 1000) {
        const sampleText = cvText.substring(0, 1000)
        const duplicateRatio = calculateDuplicateRatio(sampleText)
        if (duplicateRatio > 0.8) {
          reasons.push('CV có nội dung lặp lại nhiều (copy-paste)')
          score -= 30
        }
      }
    }

    // 3. KIỂM TRA SPAM ỨNG TUYỂN
    if (applicantId) {
      // Kiểm tra số lần nộp trong 5 phút gần đây
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString()
      
      const { count } = await supabase
        .from('job_applications')
        .select('*', { count: 'exact', head: true })
        .eq('applicant_id', applicantId)
        .gte('applied_at', fiveMinutesAgo)
      
      if (count && count > 5) {
        reasons.push(`Ứng viên nộp ${count} đơn trong 5 phút - Có thể là spam`)
        score -= 60
        metadata.isDuplicate = true
      }
    }

    if (userId) {
      // Kiểm tra CV trùng lặp với các CV khác
      const { data: existingCVs } = await supabase
        .from('applicant_cvs')
        .select('cv_data')
        .eq('applicant_id', applicantId)
        .limit(5)

      if (existingCVs && existingCVs.length > 0 && cvText) {
        // Đơn giản: kiểm tra độ dài tương tự
        const similarCV = existingCVs.find(cv => {
          const existingText = JSON.stringify(cv.cv_data)
          return Math.abs(existingText.length - cvText.length) < 100
        })
        
        if (similarCV) {
          reasons.push('CV tương tự đã tồn tại trong hệ thống')
          score -= 20
        }
      }
    }

    // 4. KIỂM TRA ĐỘ LIÊN QUAN (nếu có jobId)
    if (jobId && cvText) {
      const { data: job } = await supabase
        .from('job_postings')
        .select('skills_required, title')
        .eq('id', jobId)
        .single()

      if (job?.skills_required) {
        const requiredSkills = job.skills_required
        const cvSkills = extractSkillsFromText(cvText)
        
        const matchingSkills = cvSkills.filter(skill => 
          requiredSkills.some((req: string) => 
            skill.toLowerCase().includes(req.toLowerCase()) || 
            req.toLowerCase().includes(skill.toLowerCase())
          )
        )
        
        const relevanceScore = requiredSkills.length > 0 
          ? (matchingSkills.length / requiredSkills.length) * 100 
          : 0
        
        metadata.relevanceScore = relevanceScore
        
        if (relevanceScore < 20) {
          reasons.push(`CV không liên quan đến vị trí (chỉ ${relevanceScore.toFixed(0)}% khớp)`)
          score -= 40
        }
      }
    }

    // 5. XÁC ĐỊNH CHẤT LƯỢNG CUỐI CÙNG
    let quality: 'high' | 'medium' | 'low' | 'spam' = 'medium'
    
    if (score >= 80) {
      quality = 'high'
    } else if (score >= 50) {
      quality = 'medium'
    } else if (score >= 20) {
      quality = 'low'
    } else {
      quality = 'spam'
    }

    // 6. Nếu là spam, thêm cờ tự động
    if (quality === 'spam') {
      reasons.push('ĐÃ TỰ ĐỘNG ĐÁNH DẤU SPAM')
    }

    return {
      quality,
      score: Math.max(0, Math.min(100, score)),
      reasons,
      metadata
    }

  } catch (error) {
    console.error('Error checking CV quality:', error)
    
    // Mặc định là chất lượng thấp nếu có lỗi
    return {
      quality: 'low',
      score: 10,
      reasons: ['Không thể phân tích CV tự động'],
      metadata
    }
  }
}

// Hàm hỗ trợ: Tính tỷ lệ trùng lặp
function calculateDuplicateRatio(text: string): number {
  if (text.length < 10) return 0
  
  const chunkSize = Math.floor(text.length / 10)
  const chunks: string[] = []
  
  for (let i = 0; i < 10; i++) {
    const start = i * chunkSize
    const chunk = text.substring(start, Math.min(start + chunkSize, text.length))
    chunks.push(chunk)
  }
  
  let duplicateCount = 0
  const uniqueChunks = new Set(chunks.map(chunk => chunk.trim()))
  
  return 1 - (uniqueChunks.size / chunks.length)
}

// Hàm hỗ trợ: Trích xuất kỹ năng từ text
function extractSkillsFromText(text: string): string[] {
  const skills: string[] = []
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'node', 'python', 'java',
    'html', 'css', 'sql', 'mongodb', 'postgresql', 'aws', 'docker',
    'git', 'rest api', 'graphql', 'redux', 'vue', 'angular'
  ]
  
  const lowerText = text.toLowerCase()
  
  skillKeywords.forEach(skill => {
    if (lowerText.includes(skill)) {
      skills.push(skill.charAt(0).toUpperCase() + skill.slice(1))
    }
  })
  
  return skills
}

// Hàm xử lý CV khi ứng viên nộp
export async function processCVOnApply(params: {
  applicationId: string
  cvUrl: string
  jobId: string
  applicantId: string
  userId: string
}) {
  const supabase = await createClient()
  
  try {
    // Lấy text từ CV (trong thực tế cần OCR/PDF parsing)
    // Ở đây giả sử đã có cv_parsed_data
    const { data: applicantProfile } = await supabase
      .from('applicant_profiles')
      .select('cv_parsed_data')
      .eq('id', params.applicantId)
      .single()
    
    let cvText = ''
    if (applicantProfile?.cv_parsed_data) {
      // Trích xuất text từ parsed data
      const data = applicantProfile.cv_parsed_data
      cvText = [
        data.summary || '',
        data.skills?.join(' ') || '',
        data.experience?.map((exp: any) => exp.description).join(' ') || '',
        data.education?.map((edu: any) => edu.school + ' ' + edu.degree).join(' ') || ''
      ].join(' ')
    }

    // Kiểm tra chất lượng CV
    const qualityResult = await checkCVQuality({
      cvUrl: params.cvUrl,
      cvText,
      jobId: params.jobId,
      applicantId: params.applicantId,
      userId: params.userId
    })

    // Cập nhật application với kết quả chất lượng
    await supabase
      .from('job_applications')
      .update({
        cv_quality: qualityResult.quality,
        is_spam: qualityResult.quality === 'spam',
        match_analysis: {
          ...(await supabase
            .from('job_applications')
            .select('match_analysis')
            .eq('id', params.applicationId)
            .single()
          ).data?.match_analysis,
          cv_quality_check: {
            score: qualityResult.score,
            reasons: qualityResult.reasons,
            metadata: qualityResult.metadata,
            checked_at: new Date().toISOString()
          }
        },
        // Nếu là spam, tự động reject
        ...(qualityResult.quality === 'spam' && {
          status: 'rejected',
          notes: 'Tự động từ chối: CV được đánh dấu là spam'
        })
      })
      .eq('id', params.applicationId)

    // Ghi log kiểm tra CV
    await supabase.from('cv_quality_logs').insert({
      application_id: params.applicationId,
      quality_score: qualityResult.score,
      quality_level: qualityResult.quality,
      reasons: qualityResult.reasons,
      metadata: qualityResult.metadata,
      checked_at: new Date().toISOString()
    })

    // Nếu là spam, gửi cảnh báo cho admin
    if (qualityResult.quality === 'spam') {
      await sendSpamAlert({
        applicationId: params.applicationId,
        applicantId: params.applicantId,
        reasons: qualityResult.reasons,
        score: qualityResult.score
      })
    }

    return qualityResult

  } catch (error) {
    console.error('Error processing CV on apply:', error)
    throw error
  }
}

// Hàm gửi cảnh báo spam
async function sendSpamAlert(params: {
  applicationId: string
  applicantId: string
  reasons: string[]
  score: number
}) {
  // Gửi email/notification cho admin về CV spam
  // Có thể tích hợp với hệ thống notification
  console.log('SPAM ALERT:', params)
}