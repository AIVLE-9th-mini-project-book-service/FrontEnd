const OPENAI_IMAGE_API_URL = 'https://api.openai.com/v1/images/generations'

export async function generateBookCover(book, userApiKey, quality = 'auto') {
  // 도서 정보(제목, 저자, 장르, 태그, 내용)와 장르별 무드를 조합해 이미지 생성 프롬프트 구성
  const prompt = `
A high-quality, professional book cover design for a book titled "${book.title}" by ${book.author}.
Genre: ${book.genre}. Tags: ${book.tag}.
Visual concept based on the story: ${book.content}
---
Visual direction:
- Genre-specific mood: ${getGenreMood(book.genre)}
- Composition: cinematic, full-bleed illustration with strong focal point
- Color palette: rich and thematic, matching the genre and emotional tone
- Lighting: dramatic and atmospheric
---
Text layout:
- Title "${book.title}" displayed prominently at the top in elegant, genre-appropriate font
- Author name "${book.author}" at the bottom in smaller clean serif font
- Text should be clearly legible and well-integrated into the design
---
Style: professional publishing quality, award-winning book cover art
  `.trim()

  // API
  const res = await fetch(OPENAI_IMAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-2',
      prompt,
      n: 1,
      size: '1024x1536',
      quality,
      output_format: 'png',
    }),
  })
  // HTTP 에러 처리
  if (res.status === 401) throw new Error('401')  // API Key 인증 실패
  if (res.status === 429) throw new Error('429')  // 요청 한도 초과 (Rate Limit)
  if (!res.ok) throw new Error(`FAIL:${res.status}`) // 그 외 서버 오류
  
  // 응답 JSON 파싱 후 b64_json 추출
  const data = await res.json()
  const b64Json = data.data?.[0]?.b64_json
  if (!b64Json) throw new Error('PARSE_ERROR')

  // Data URL 형태로 변환 후 반환
  return `data:image/png;base64,${b64Json}`
}

// 장르별 무드 설정
function getGenreMood(genre) {
  const moods = {
    'SF': 'cyberpunk, dystopian, neon lights, futuristic cityscape',
    '판타지': 'epic fantasy, magical atmosphere, mystical lighting, ancient world',
    '소설': 'literary, emotional, human drama, warm and deep tones',
    '로맨스': 'soft warm colors, dreamy atmosphere, romantic and tender mood',
    '에세이': 'cozy, analog warmth, everyday life, handwritten feel',
    '스릴러': 'dark, suspenseful, high contrast shadows, tension',
    '미스터리': 'moody, mysterious, foggy atmosphere, noir style',
  }
  // 매핑된 장르가 없으면 기본 무드 반환
  return moods[genre] || 'artistic, expressive, visually compelling'
}