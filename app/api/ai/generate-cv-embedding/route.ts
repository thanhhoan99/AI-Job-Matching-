// app/api/ai/generate-cv-embedding/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateEmbedding } from '@/lib/ai/embedding-service'

export async function POST(request: NextRequest) {
  try {
    const { cvId } = await request.json()
    
    const supabase = await createClient()
    
    // Lấy thông tin CV
    const { data: cv, error } = await supabase
      .from('applicant_cvs')
      .select('*')
      .eq('id', cvId)
      .single()

    if (error) throw error

    // Chuẩn hóa dữ liệu CV thành text
    const cvData = cv.cv_data
    const cvText = `
      Họ tên: ${cvData.personal.full_name}
      Vị trí hiện tại: ${cvData.current_position || ''}
      Kinh nghiệm: ${cvData.experience?.length || 0} vị trí
      Kỹ năng: ${cvData.skills?.join(', ') || ''}
      Học vấn: ${cvData.education?.map((edu: any) => `${edu.degree} tại ${edu.school}`).join(', ')}
      Ngôn ngữ: ${cvData.languages?.map((lang: any) => lang.language).join(', ')}
      Chứng chỉ: ${cvData.certifications?.join(', ')}
      Giới thiệu: ${cvData.summary || ''}
    `.replace(/\s+/g, ' ').trim()

    // Tạo embedding
    const embedding = await generateEmbedding(cvText)

    // Lưu embedding vào database
    const { error: upsertError } = await supabase
      .from('cv_embeddings')
      .upsert({
        cv_id: cvId,
        applicant_id: cv.applicant_id,
        embedding: embedding,
        updated_at: new Date().toISOString()
      })

    if (upsertError) throw upsertError

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}