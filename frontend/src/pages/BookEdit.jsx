import { useState } from 'react'
import { generateBookCover } from '../components/api/openai'


// 도서 수정 페이지 
function BookEdit({ book, onCoverUpdate }) {
  // 도서 수정 필드 상태
  const [title, setTitle] = useState(book.title)
  const [author, setAuthor] = useState(book.author)
  const [content, setContent] = useState(book.content)
  const [tag, setTag] = useState(book.tag)

  // AI 표지 생성 관련 상태
  const [apiKey, setApiKey] = useState('')
  const [quality, setQuality] = useState('low')
  const [loading, setLoading] = useState(false)
  const [coverPreview, setCoverPreview] = useState(book.coverImageUrl || '')


   // 현재 입력된 도서 정보 기반으로 OpenAI 이미지 생성 후 저장
  async function handleGenerateCover() {
    // ① API Key 유효성 검사
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.')
      return
    }

    // ② 로딩 상태 ON
    setLoading(true)

    try {
      // ③ 현재 수정 중인 데이터 기반으로 이미지 생성 요청
      const editedBook = { title, author, content, tag, genre: book.genre }
      const imageSrc = await generateBookCover(editedBook, apiKey, quality)

      // ④ 표지 미리보기 업데이트
      setCoverPreview(imageSrc)

      // ⑤ json-server PATCH 저장
      await onCoverUpdate(book.id, imageSrc)
      alert(`"${title}" 표지가 생성되었습니다!`)

    } catch (err) {
      // 에러 코드별 사용자 알림
      if (err.message === '401')          alert('API Key가 올바르지 않습니다.')
      else if (err.message === '429')     alert('요청 한도 초과. 잠시 후 다시 시도해주세요.')
      else if (err.message === 'PARSE_ERROR') alert('응답 형식 오류가 발생했습니다.')
      else                                alert(`오류: ${err.message}`)
    } finally {
      // 성공/실패 관계없이 로딩 상태 OFF
      setLoading(false)
    }
  }

  return (
    <div className="book-edit">
      <h2>📝 도서 수정</h2>

      <div className="edit-layout">
        {/* 왼쪽: 표지 미리보기 */}
        <div className="cover-preview">
          {coverPreview ? (
            <img src={coverPreview} alt="표지 미리보기" />
          ) : (
            <div className="no-cover">🖼️ 표지 없음</div>
          )}
        </div>

        {/* 오른쪽: 수정 폼 + AI 생성 */}
        <div className="edit-form">

          {/* 도서 정보 수정 */}
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>작가</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>태그</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </div>

          {/* AI 표지 생성 섹션 */}
          <div className="ai-section">
            <h3>🎨 AI 표지 생성</h3>

            <div className="form-group">
              <label>API Key</label>
              <input
                type="password"
                placeholder="sk-..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>품질</label>
              <select
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

            <button
              className="generate-btn"
              onClick={handleGenerateCover}
              disabled={loading}
            >
              {loading ? '⏳ 생성 중...' : '🎨 AI 표지 생성'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookEdit