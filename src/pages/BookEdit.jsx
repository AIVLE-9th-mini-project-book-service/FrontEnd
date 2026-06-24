import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GENRE_LIST, TAG_LIST } from "../bookOption";
import { useAuth } from '../context/useAuth';
import './BookEdit.css';

const BASE_URL = '/api';

function BookEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const { user } = useAuth();

  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagError, setTagError] = useState(false);
  const [apiKey, setApiKey] = useState('')
  const [quality, setQuality] = useState('low')
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [coverPreview, setCoverPreview] = useState('')
  const [summary, setSummary] = useState('')
  const [oneLinerLoading, setOneLinerLoading] = useState(false)

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(`${BASE_URL}/books/${id}`);
        if (!res.ok) throw new Error('도서 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setBook(data);
        setTitle(data.title);
        setAuthor(data.author);
        setContent(data.content);
        setSelectedTags(data.tag ? data.tag.split(',').map((t) => t.trim()).filter((t) => TAG_LIST.includes(t)) : []);
        setCoverPreview(data.coverImageUrl || '');
        setSummary(data.summary || '');
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

  const handleTagSelect = (t) => {
    setSelectedTags((prev) => {
      const next = prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t];
      if (next.length > 0) setTagError(false);
      return next;
    });
  };

  async function handleSave() {
    if (selectedTags.length === 0) {
      setTagError(true);
      return;
    }
    setSaving(true);
    try {
      const endpoint = user?.isAdmin ? `/api/admin/books/${id}` : `${BASE_URL}/books/${id}`;
      const method = 'PATCH';
      const res = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          author,
          content,
          tag: selectedTags.join(','),
          coverImageUrl: coverPreview,
          summary,
        }),
      });
      if (!res.ok) throw new Error('저장 실패');
      alert('도서 정보가 저장되었습니다!');
      
    } catch (err) {
      alert(`저장 오류: ${err.message}`);
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerateOneLiner() {
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.');
      return
    }
    if (!window.confirm('수정 사항이 있으시면 저장 버튼을 누른 뒤 한줄평을 생성해주세요!\nAI 한줄평 생성 시 OpenAI API 비용이 발생합니다. 계속하시겠습니까?')) return
    setOneLinerLoading(true)
    try {
      
      const res = await fetch(`${BASE_URL}/books/${id}/summary/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ apiKey }),
      })
      if (res.status === 401) {
         alert('API Key가 올바르지 않습니다.'); 
         return;
         }
      if (res.status === 429) { 
        alert('요청 한도 초과. 잠시 후 다시 시도해주세요.');
        return; 
        }
      if (!res.ok) {
        const err = await res.json();
        alert(`오류: ${err.message}`);
        return;
        }
      const data = await res.json();
      setSummary(data.summary);
      alert(`"${title}" 한줄평이 생성되었습니다! 저장 버튼을 눌러 저장하세요.`)
    } catch (err) {
      alert(`오류: ${err.message}`);
    } finally {
      setOneLinerLoading(false);
    }
  }

  async function handleGenerateCover() {
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.');
      return;
    }
    if (!window.confirm('AI 표지 생성 시 OpenAI API 비용이 발생합니다. 계속하시겠습니까?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/books/${id}/cover/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ apiKey, quality }),
      });
      if (res.status === 401) { alert('API Key가 올바르지 않습니다.'); return; }
      if (res.status === 429) { alert('요청 한도 초과. 잠시 후 다시 시도해주세요.'); return; }
      if (!res.ok) {
        const err = await res.json();
        alert(`오류: ${err.message}`);
        return;
      }
      const data = await res.json();
      setCoverPreview(data.coverImageUrl);
      alert(`"${title}" 표지가 생성되었습니다! 저장 버튼을 눌러 저장하세요.`);
    } catch (err) {
      alert(`오류: ${err.message}`);
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
        <button className="back-btn" onClick={() => navigate(`/books/${id}`)}>← 뒤로 가기</button>
        <h2>📝 도서 수정</h2>

        <div className="edit-layout">
          <div className="cover-preview">
            {coverPreview ? (
                <img src={coverPreview} alt="표지 미리보기" />
            ) : (
                <div className="no-cover">🖼️ 표지 없음</div>
            )}
          </div>

          <div className="edit-form">
            <div className="form-group">
              <label>제목</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="form-group">
              <label>작가</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} />
            </div>

            <div className="form-group">
              <label>내용</label>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={4} />
            </div>

            <div className="form-group">
              <label>태그 <span className="tag-required">* 최소 1개 선택</span></label>
              <div className={`tag-chip-container${tagError ? ' tag-error' : ''}`}>
                {TAG_LIST.map((t) => (
                    <span key={t} className={`tag-chip${selectedTags.includes(t) ? ' selected' : ''}`}
                          onClick={() => handleTagSelect(t)}>
                  {t} {selectedTags.includes(t) && '×'}
                </span>
                ))}
              </div>
              {tagError && <p className="tag-error-msg">태그를 최소 1개 선택해주세요.</p>}
            </div>

            <div className="form-group">
              <label>API Key</label>
              <input type="password" placeholder="sk-..." value={apiKey}
                     onChange={(e) => setApiKey(e.target.value)} />
            </div>

            <button className="save-btn" onClick={handleSave} disabled={saving}>
              {saving ? '💾 저장 중...' : '💾 저장'}
            </button>

            <div className="ai-section">
              <h3>✏️ AI 한줄평 생성</h3>
              <button className="generate-btn" onClick={handleGenerateOneLiner} disabled={oneLinerLoading}>
                {oneLinerLoading ? '⏳ 생성 중...' : '✏️ 한줄평 생성'}
              </button>
              {summary && (
                  <div className="form-group" style={{ marginTop: '8px' }}>
                    <label>한줄평</label>
                    <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
                  </div>
              )}
            </div>

            <div className="ai-section">
              <h3>🎨 AI 표지 생성</h3>
              <div className="form-group">
                <label>품질</label>
                <select value={quality} onChange={(e) => setQuality(e.target.value)} disabled={loading}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <button className="generate-btn" onClick={handleGenerateCover} disabled={loading}>
                {loading ? '⏳ 생성 중...' : '🎨 AI 표지 생성'}
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

export default BookEdit;