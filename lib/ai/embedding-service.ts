// lib/ai/embedding-service.ts
export async function generateEmbedding(text: string): Promise<number[]> {
  console.log('🔧 generateEmbedding called with text length:', text.length)
  
  const maxRetries = 3;
  const baseDelay = 2000; // 2 seconds
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Kiểm tra API key
      if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        console.error('❌ GOOGLE_GENERATIVE_AI_API_KEY is missing')
        throw new Error('GOOGLE_GENERATIVE_AI_API_KEY environment variable is not set')
      }

      // Giảm độ dài text để tránh token limit
      const shortenedText = text.length > 3000 ? text.substring(0, 3000) : text
      console.log(`📝 Attempt ${attempt}: Using shortened text length:`, shortenedText.length)
      
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/embedding-001:embedContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`
      
      console.log('🌐 Calling Google AI API...')
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "models/embedding-001",
          content: {
            parts: [{
              text: shortenedText
            }]
          }
        })
      })

      console.log('📡 API Response status:', response.status)
      
      if (response.status === 429) {
        // Rate limited - wait and retry
        const delay = baseDelay * Math.pow(2, attempt - 1); // Exponential backoff
        console.log(`⏳ Rate limited. Waiting ${delay}ms before retry ${attempt}/${maxRetries}...`)
        await new Promise(resolve => setTimeout(resolve, delay))
        continue
      }
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Google AI API error details:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        })
        throw new Error(`Google AI API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('✅ Google AI API response received')
      
      if (!data.embedding || !data.embedding.values) {
        console.error('❌ Invalid response format from Google AI API:', data)
        throw new Error('Invalid response format from Google AI API: missing embedding values')
      }
      
      const embedding = data.embedding.values
      console.log('🎯 Embedding vector length:', embedding.length)
      
      // Đảm bảo embedding có độ dài phù hợp với database
      return ensureEmbeddingDimensions(embedding, 768) // Google embedding-001 returns 768 dimensions
      
    } catch (error) {
      console.error(`💥 Attempt ${attempt} failed:`, error)
      
      if (attempt === maxRetries) {
        console.log('🔄 All attempts failed, using fallback embedding...')
        return createSimpleEmbedding(text, 768) // Fallback với 768 dimensions
      }
      
      // Wait before retry
      const delay = baseDelay * Math.pow(2, attempt - 1)
      console.log(`⏳ Waiting ${delay}ms before retry...`)
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  
  // This should never be reached, but just in case
  return createSimpleEmbedding(text, 768)
}

// Hàm đảm bảo embedding có đúng số dimensions
function ensureEmbeddingDimensions(embedding: number[], targetDimensions: number): number[] {
  if (embedding.length === targetDimensions) {
    return embedding
  }
  
  console.log(`🔄 Adjusting embedding dimensions from ${embedding.length} to ${targetDimensions}`)
  
  if (embedding.length > targetDimensions) {
    // Cắt bớt nếu quá dài
    return embedding.slice(0, targetDimensions)
  } else {
    // Thêm padding (zeros) nếu quá ngắn
    const paddedEmbedding = [...embedding]
    while (paddedEmbedding.length < targetDimensions) {
      paddedEmbedding.push(0)
    }
    return paddedEmbedding
  }
}

// Cập nhật fallback embedding
function createSimpleEmbedding(text: string, dimensions: number = 768): number[] {
  console.log(`🔄 Creating simple embedding with ${dimensions} dimensions`)
  
  const words = text.toLowerCase().split(/\s+/).filter(word => word.length > 2)
  const uniqueWords = [...new Set(words)]
  const embedding = new Array(dimensions).fill(0)
  
  uniqueWords.forEach((word) => {
    const hash = simpleHash(word)
    const position = hash % dimensions
    embedding[position] += 1
  })
  
  // Normalize
  const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
  const normalizedEmbedding = magnitude > 0 ? embedding.map(val => val / magnitude) : embedding
  
  console.log(`✅ Fallback embedding created with ${normalizedEmbedding.length} dimensions`)
  return normalizedEmbedding
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}