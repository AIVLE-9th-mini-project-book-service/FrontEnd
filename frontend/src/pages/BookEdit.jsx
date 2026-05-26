import { useState } from 'react'
import { generateBookCover } from '../components/api/Openapi'
import { generateOneLiner } from '../components/api/Openapi_text'
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateBookCover } from '../components/api/Openapi';

const JSON_SERVER_URL = 'http://localhost:3000';

function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);

  // 도서 수정 필드 상태
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('');

  // AI 표지 생성 관련 상태
  const [apiKey, setApiKey] = useState('')
  const [quality, setQuality] = useState('low')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)  // 저장 상태
  const [coverPreview, setCoverPreview] = useState(book.coverImageUrl || '')
  const [summary, setSummary] = useState(book.summary || '')
  const [oneLinerLoading, setOneLinerLoading] = useState(false)

  // 도서 데이터 fetch
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${JSON_SERVER_URL}/books/${id}`);
        if (!res.ok) throw new Error('도서 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setBook(data);
        setTitle(data.title);
        setAuthor(data.author);
        setContent(data.content);
        setTag(data.tag);
        setCoverPreview(data.coverImageUrl || '');
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate('/books');
      } finally {
        setBookLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  // 저장
  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`${JSON_SERVER_URL}/books/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          author,
          content,
          tag,
          coverImageUrl: coverPreview,
          summary,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('저장 실패');
      navigate(`/books/${id}`);
    } catch (err) {
      alert(`저장 오류: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }


  async function handleGenerateOneLiner() {
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.')
      return
    }
    setOneLinerLoading(true)
    try {
      const editedBook = { title, author, content, tag, genre: book.genre }
      const result = await generateOneLiner(editedBook, apiKey)
      setSummary(result)
    } catch (err) {
      if (err.message === '401')           alert('API Key가 올바르지 않습니다.')
      else if (err.message === '429')      alert('요청 한도 초과. 잠시 후 다시 시도해주세요.')
      else if (err.message === 'PARSE_ERROR') alert('응답 형식 오류가 발생했습니다.')
      else                                 alert(`오류: ${err.message}`)
    } finally {
      setOneLinerLoading(false)
    }
  }

  // AI 표지 생성 버튼
  async function handleGenerateCover() {
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.');
      return;
    }
    setLoading(true);
    try {
      const editedBook = { title, author, content, tag, genre: book.genre };
      const imageSrc = await generateBookCover(editedBook, apiKey, quality);
      setCoverPreview(imageSrc);
      alert(`"${title}" 표지가 생성되었습니다! 저장 버튼을 눌러 저장하세요.`);
    } catch (err) {
      if (err.message === '401')              alert('API Key가 올바르지 않습니다.');
      else if (err.message === '429')         alert('요청 한도 초과. 잠시 후 다시 시도해주세요.');
      else if (err.message === 'PARSE_ERROR') alert('응답 형식 오류가 발생했습니다.');
      else                                    alert(`오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  if (bookLoading) return (
    <p style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
      도서 정보를 불러오는 중...
    </p>
  );
  if (!book) return null;

  return (
    <div className="book-edit">
      <button onClick={() => navigate(-1)}>← 뒤로 가기</button>
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

          <button
            className="save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? '💾 저장 중...' : '💾 저장'}
          </button>

          {/* 한줄평 섹션 */}
          <div className="ai-section">
            <h3>✏️ AI 한줄평 생성</h3>
            <button
              className="generate-btn"
              onClick={handleGenerateOneLiner}
              disabled={oneLinerLoading}
            >
              {oneLinerLoading ? '⏳ 생성 중...' : '✏️ 한줄평 생성'}
            </button>
            {summary && (
              <div className="form-group" style={{ marginTop: '8px' }}>
                <label>한줄평</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                />
              </div>
            )}
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
  );
}

export default BookEdit;