const OPENAI_CHAT_API_URL = 'https://api.openai.com/v1/chat/completions'

export async function generateOneLiner(book, userApiKey) {
  const res = await fetch(OPENAI_CHAT_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userApiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: '당신은 도서 편집자입니다. 주어진 도서 정보를 바탕으로 책의 핵심을 담은 매력적인 한줄평을 작성합니다. 반드시 한 문장으로만 답하세요.',
        },
        {
          role: 'user',
          content: `제목: ${book.title}\n저자: ${book.author}\n장르: ${book.genre || ''}\n태그: ${book.tag}\n내용: ${book.content}\n\n위 도서의 한줄평을 작성해주세요.`,
        },
      ],
      max_tokens: 100,
      temperature: 0.7,
    }),
  })

  if (res.status === 401) throw new Error('401')
  if (res.status === 429) throw new Error('429')
  if (!res.ok) throw new Error(`FAIL:${res.status}`)

  const data = await res.json()
  const oneLiner = data.choices?.[0]?.message?.content?.trim()
  if (!oneLiner) throw new Error('PARSE_ERROR')
  return oneLiner
}
