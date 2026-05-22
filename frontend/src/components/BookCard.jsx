import { useState } from 'react'
import { generateBookCover } from '../api/OpenAi'

function BookCard({ book, userApiKey, onCoverUpdate }) {
  const [loading, setLoading] = useState(false)
  const [quality, setQuality] = useState('low')

  // API Key 유효성 검사
  async function handleGenerateCover() {
    if (!userApiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      // OpenAI 이미지 생성 → json-server PATCH 저장
      const imageSrc = await generateBookCover(book, userApiKey, quality)
      await onCoverUpdate(book.id, imageSrc)
      alert(`"${book.title}" 표지가 생성되었습니다!`)
    } catch (err) {
      // 에러 코드별 사용자 알림  
      if (err.message === '401') alert('API Key가 올바르지 않습니다.')
      else if (err.message === '429') alert('요청 한도 초과. 잠시 후 다시 시도해주세요.')
      else if (err.message === 'PARSE_ERROR') alert('응답 형식 오류가 발생했습니다.')
      else alert(`오류: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="book-card">
      {/* 표지 이미지 */}
      <div className="cover-area">
        {book.coverImageUrl ? (
          <img src={book.coverImageUrl} alt={`${book.title} 표지`} />
        ) : (
          <div className="no-cover">🖼️ 표지 없음</div>
        )}
      </div>

      {/* 도서 정보 */}
      <div className="book-info">
        <h2>{book.title}</h2>
        <p>✍️ <strong>저자:</strong> {book.author}</p>
        <p>📖 <strong>장르:</strong> {book.genre}</p>
        <p>❤️ <strong>추천:</strong> {book.likes}</p>
        <p className="tag">{book.tag}</p>
        <p className="content">{book.content}</p>
      </div>

      {/* 품질 선택 */}
      <div className="quality-wrap">
        <label htmlFor={`quality-${book.id}`}>품질</label>
        <select
          id={`quality-${book.id}`}
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
          disabled={loading}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="auto">Auto</option>
        </select>
      </div>

      {/* AI 표지 생성 버튼 */}
      <button
        className="generate-btn"
        onClick={handleGenerateCover}
        disabled={loading}
      > 
        {loading ? '⏳ 생성 중...' : '🎨 AI 표지 생성'}
      </button>
    </div>
  )
}

export default BookCard