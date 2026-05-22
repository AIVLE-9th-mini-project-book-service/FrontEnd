import { useState } from 'react'
import { generateBookCover } from '../components/api/openai'
import '../App.css'

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

  // 사용자가 [저장] 버튼을 눌렀을 때 작동할 핸들러
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    
    alert('도서 정보가 저장되었습니다.');
  };

  // 🎨 현재 입력된 도서 정보 기반으로 OpenAI 이미지 생성 후 저장
  async function handleGenerateCover() {
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.')
      return
    }

    setLoading(true)

    try {
      // 현재 수정 중인 최신 데이터 기반으로 이미지 생성 요청
      const editedBook = { title, author, content, tag, genre: book.genre }
      const imageSrc = await generateBookCover(editedBook, apiKey, quality)

      // 표지 미리보기 업데이트
      setCoverPreview(imageSrc)

      // 상위 컴포넌트의 이미지 저장 통로 호출 (json-server PATCH)
      await onCoverUpdate(book.id, imageSrc)
      alert(`"${title}" 표지가 생성되었습니다!`)

    } catch (err) {
      if (err.message === '401')          alert('API Key가 올바르지 않습니다.')
      else if (err.message === '429')     alert('요청 한도 초과. 잠시 후 다시 시도해주세요.')
      else if (err.message === 'PARSE_ERROR') alert('응답 형식 오류가 발생했습니다.')
      else                                alert(`오류: ${err.message}`)
    } finally {
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

        {/* 오른쪽: 수정 폼 (form 태그 내부 순서 변경) */}
        <form className="edit-form" onSubmit={handleFinalSubmit}>

          {/* 1. 도서 정보 수정 입력 필드 */}
          <div className="form-group">
            <label>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="도서 제목을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>작가</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="작가 이름을 입력하세요"
            />
          </div>

          <div className="form-group">
            <label>내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="도서 내용을 입력하세요"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>태그</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="태그를 입력하세요"
            />
          </div>

          {/* [저장] 버튼 */}
          <div className="submit-section">
            <button type="submit" className="save-btn" disabled={loading}>
              저장
            </button>
          </div>

          {/* 2. AI 표지 생성 섹션 */}
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
              type="button"
              className="generate-btn"
              onClick={handleGenerateCover}
              disabled={loading}
            >
              {loading ? '⏳ 생성 중...' : '🎨 AI 표지 생성'}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default BookEdit