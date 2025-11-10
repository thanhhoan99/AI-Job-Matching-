import { generateEmbedding } from "@/lib/ai/embedding-service"
import { createClient } from "@/lib/supabase/server"

// app/api/ai/generate-job-embedding/route.ts
export async function POST(request: Response) {
  console.log('🚀 START: generate-job-embedding API called')
  
  try {
    const body = await request.json()
    console.log('📦 Request body:', body)
    
    const { jobId } = body
    
    if (!jobId) {
      console.error('❌ Missing jobId')
      return Response.json({ error: 'Missing jobId' }, { status: 400 })
    }

    const supabase = await createClient()
    console.log('🔗 Connected to Supabase')
    
    // Lấy thông tin job
    console.log('📋 Fetching job data for ID:', jobId)
    const { data: job, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        categories(name),
        employer_profiles(company_name, industry)
      `)
      .eq('id', jobId)
      .single()

    if (error) {
      console.error('❌ Error fetching job:', error)
      return Response.json({ error: `Job not found: ${error.message}` }, { status: 404 })
    }

    if (!job) {
      console.error('❌ Job not found')
      return Response.json({ error: 'Job not found' }, { status: 404 })
    }

    console.log('✅ Job found:', job.title)

    // Chuẩn hóa dữ liệu job thành text
    const jobText = `
      Vị trí: ${job.title}
      Mô tả: ${job.description}
      Yêu cầu: ${job.requirements || ''}
      Kỹ năng: ${job.skills_required?.join(', ') || ''}
      Loại công việc: ${job.job_type}
      Cấp độ: ${job.job_level}
      Kinh nghiệm tối thiểu: ${job.experience_years_min} năm
      Ngành nghề: ${job.employer_profiles?.industry || ''}
      Danh mục: ${job.categories?.name || ''}
      Địa điểm: ${job.city || ''} ${job.location || ''}
    `.replace(/\s+/g, ' ').trim()

    console.log('📝 Job text length:', jobText.length)

    // Tạo embedding với Google AI (đã có retry logic)
    console.log('🤖 Generating embedding...')
    const embedding = await generateEmbedding(jobText)
    
    console.log('✅ Embedding generated, length:', embedding?.length)

    // Kiểm tra dimensions trước khi lưu
    if (embedding.length !== 768) {
      console.warn(`⚠️ Embedding dimensions mismatch: expected 768, got ${embedding.length}`)
    }

    // Lưu embedding vào database
    console.log('💾 Saving embedding to database...')
    const { error: upsertError } = await supabase
      .from('job_embeddings')
      .upsert({
        job_id: jobId,
        embedding: embedding,
        updated_at: new Date().toISOString()
      })

    if (upsertError) {
      console.error('❌ Error saving embedding:', upsertError)
      
      // Kiểm tra nếu lỗi là dimension mismatch
      if (upsertError.message.includes('dimensions')) {
        return Response.json({ 
          error: 'Database dimension mismatch',
          message: `Expected 768 dimensions but embedding has ${embedding.length}. Please check database schema.`,
          details: upsertError.message
        }, { status: 500 })
      }
      
      return Response.json({ 
        error: `Failed to save embedding: ${upsertError.message}`,
        details: upsertError 
      }, { status: 500 })
    }

    console.log('🎉 Embedding saved successfully!')
    
    return Response.json({ 
      success: true, 
      embeddingLength: embedding.length,
      jobTitle: job.title,
      dimensions: embedding.length
    })
    
  } catch (error: any) {
    console.error('💥 UNEXPECTED ERROR in generate-job-embedding:', error)
    return Response.json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 })
  }
}