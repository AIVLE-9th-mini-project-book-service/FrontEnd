// BookRegister.jsx
import { generateBookCover } from '../components/api/Openapi';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import { GENRE_LIST, TAG_LIST } from "../bookOption";

function BookRegister() {
  const navigate = useNavigate();
  const bookUrl = 'http://localhost:3000/books';

  const [form, setForm] = useState({
    title: '',
    author: '',
    genre: '',
    likes: 0,
    content: '',
    tag: '',
    coverImageUrl: '', 
  });

  const [selectedTags, setSelectedTags] = useState([]);
  const [errors, setErrors] = useState({});

  // AI 관련 로컬 상태
  const [apiKey, setApiKey] = useState('');
  const [quality, setQuality] = useState('auto');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreSelect = (genre) => {
    setForm((prev) => ({ ...prev, genre: prev.genre === genre ? '' : genre }));
  };

  const handleTagSelect = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // 💡 BookRegister 스타일(화살표 함수)로 변경된 AI 표지 생성 함수
  const handleGenerateCover = async () => {
    if (!form.title.trim() || !form.author.trim() || !form.genre) {
      alert('AI 표지를 생성하려면 도서 제목, 저자명, 장르를 먼저 입력/선택해주세요.');
      return;
    }
    if (!apiKey.trim()) {
      alert('OpenAI API Key를 입력해주세요.');
      return;
    }

    if (!window.confirm('AI 표지 생성 시 OpenAI API 비용이 발생합니다. 계속하시겠습니까?')) {
      alert('표지 생성이 취소되었습니다.');
      return;
    }

    setLoading(true);
    try {
      const registerBook = {
        title: form.title,
        author: form.author,
        content: form.content,
        tag: selectedTags.join(','),
        genre: form.genre
      };

      const imageSrc = await generateBookCover(registerBook, apiKey, quality);
      
      // 💡 기존 setForm 패턴 유지
      setForm((prev) => ({ ...prev, coverImageUrl: imageSrc }));
      alert(`"${form.title}" 표지가 생성되었습니다! 하단의 등록하기 버튼을 눌러야 최종 저장됩니다.`);
    } catch (err) {
      if (err.message === '401')           alert('API Key가 올바르지 않습니다.');
      else if (err.message === '429')      alert('요청 한도 초과. 잠시 후 다시 시도해주세요.');
      else if (err.message === 'PARSE_ERROR') alert('응답 형식 오류가 발생했습니다.');
      else                                 alert(`오류: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = '도서 제목을 입력해주세요.';
    if (!form.author.trim()) newErrors.author = '저자 이름을 입력해주세요.';
    if (!form.genre) newErrors.genre = '장르를 선택해주세요.';
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    const newBook = {
      ...form,
      tag: selectedTags.join(','),
      likes: Number(form.likes),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(bookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (!res.ok) throw new Error('서버 응답 오류');
      alert('도서가 등록되었습니다!');
      navigate('/books');
    } catch (error) {
      console.error('도서 등록 중 에러 발생:', error);
      alert('등록 실패! json-server 실행 확인 및 네트워크 상태를 확인해주세요.');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>새 도서 등록하기</h2>

      {form.coverImageUrl && (
        <div style={styles.previewContainer}>
          <p style={styles.previewLabel}>생성된 표지 미리보기</p>
          <img src={form.coverImageUrl} alt="표지 미리보기" style={styles.previewImage} />
        </div>
      )}

      <div style={styles.formGroup}>
        <label style={styles.label}>도서 제목 <span style={styles.required}>*</span></label>
        <Input
          name="title"
          placeholder="도서 제목을 입력하세요"
          value={form.title}
          onChange={(e) => { handleChange(e); setErrors((prev) => ({ ...prev, title: '' })); }}
          style={{ ...styles.input, ...(errors.title ? styles.inputError : {}) }}
        />
        {errors.title && <p style={styles.errorMsg}>{errors.title}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>저자명 <span style={styles.required}>*</span></label>
        <Input
          name="author"
          placeholder="저자 이름을 입력하세요"
          value={form.author}
          onChange={(e) => { handleChange(e); setErrors((prev) => ({ ...prev, author: '' })); }}
          style={{ ...styles.input, ...(errors.author ? styles.inputError : {}) }}
        />
        {errors.author && <p style={styles.errorMsg}>{errors.author}</p>}
      </div>

      <div style={styles.formGroup}>
        <p style={styles.label}>장르 선택 <span style={styles.required}>*</span></p>
        <div style={{ ...styles.chipContainer, ...(errors.genre ? styles.chipContainerError : {}) }}>
          {GENRE_LIST.map((g) => (
            <span
              key={g}
              onClick={() => { handleGenreSelect(g); setErrors((prev) => ({ ...prev, genre: '' })); }}
              style={{
                ...styles.chip,
                border: `1px solid ${form.genre === g ? '#1D9E75' : '#ccc'}`,
                background: form.genre === g ? '#E1F5EE' : 'transparent',
                color: form.genre === g ? '#085041' : '#555',
                fontWeight: form.genre === g ? 'bold' : 'normal',
              }}
            >
              {g}
            </span>
          ))}
        </div>
        {errors.genre && <p style={styles.errorMsg}>{errors.genre}</p>}
      </div>

      <div style={styles.formGroup}>
        <p style={styles.label}>태그 선택 (복수 선택 가능)</p>
        <div style={styles.chipContainer}>
          {TAG_LIST.map((t) => (
            <span
              key={t}
              onClick={() => handleTagSelect(t)}
              style={{
                ...styles.chip,
                border: `1px solid ${selectedTags.includes(t) ? '#1D9E75' : '#ccc'}`,
                background: selectedTags.includes(t) ? '#E1F5EE' : 'transparent',
                color: selectedTags.includes(t) ? '#085041' : '#555',
                fontWeight: selectedTags.includes(t) ? 'bold' : 'normal',
              }}
            >
              {t} {selectedTags.includes(t) && '×'}
            </span>
          ))}
        </div>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>도서 소개 / 내용</label>
        <TextArea
          name="content"
          placeholder="도서의 주요 내용이나 첫 문장을 입력해 주세요."
          value={form.content}
          onChange={handleChange}
          rows={5}
          style={styles.textarea}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>API Key</label>
        <Input
          type="password"
          placeholder="sk-..."
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          style={styles.input}
        />
      </div>

      <div style={styles.aiSection}>
        <h3 style={styles.aiTitle}>🎨 AI 표지 생성</h3>

        <div style={styles.formGroup}>
          <label style={styles.label}>품질</label>
          <select
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={loading}
            style={styles.select}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="auto">Auto</option>
          </select>
        </div>

        <Button
          label={loading ? '⏳ 표지 그리는 중...' : '🎨 AI 표지 생성'}
          onClick={handleGenerateCover}
          disabled={loading}
          style={{ 
            ...styles.aiButton,
            backgroundColor: loading ? '#94d3be' : '#1D9E75'
          }}
        />
      </div>

      <Button
        label="등록하기"
        onClick={handleSubmit}
        style={styles.submitButton}
      />
    </div>
  );
}

const styles = {
  container: { padding: '30px', maxWidth: '550px', margin: '40px auto', fontFamily: 'sans-serif', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', border: '1px solid #eee', boxSizing: 'border-box' },
  pageTitle: { textAlign: 'center', marginBottom: '30px', color: '#222', fontSize: '24px', fontWeight: 'bold' },
  formGroup: { marginBottom: '22px' },
  label: { display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#444', fontSize: '14px' },
  input: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px' },
  select: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', backgroundColor: '#fff' },
  textarea: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', resize: 'none' },
  chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' },
  chip: { padding: '6px 14px', borderRadius: '99px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s ease', userSelect: 'none' },
  submitButton: { width: '100%', padding: '14px', backgroundColor: '#222', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '25px' },
  required: { color: '#e53e3e', marginLeft: '2px' },
  inputError: { border: '1px solid #e53e3e', backgroundColor: '#fff5f5' },
  chipContainerError: { padding: '8px', borderRadius: '6px', border: '1px solid #e53e3e', backgroundColor: '#fff5f5' },
  errorMsg: { margin: '5px 0 0 2px', fontSize: '12px', color: '#e53e3e' },
  
  aiSection: { marginTop: '10px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '10px', border: '1px dashed #1D9E75' },
  aiTitle: { fontSize: '16px', fontWeight: 'bold', color: '#1D9E75', marginBottom: '15px', marginTop: 0 },
  aiButton: { width: '100%', padding: '12px', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' },
  previewContainer: { marginBottom: '25px', textAlign: 'center', backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #eee' },
  previewLabel: { fontSize: '13px', fontWeight: 'bold', color: '#555', marginBottom: '10px', marginTop: 0 },
  previewImage: { maxWidth: '180px', height: 'auto', borderRadius: '6px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }
};

export default BookRegister;