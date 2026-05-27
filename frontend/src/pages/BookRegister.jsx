import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import { GENRE_LIST, TAG_LIST } from "../bookOption";

const GENRE_LIST = ['소설', '고전', '역사', 'IT', '동화', '자기계발', '과학', '경제', '철학', '예술', '인문', 'SF'];
const TAG_LIST = ['한국문학', '고전문학', '개발/프로그래밍', '역사/인문', '고전/동화', '베스트셀러', '추천도서', '과학/기술', '투자/재태크'];

function BookRegister() {
  const navigate = useNavigate();

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
      const res = await fetch('http://localhost:3000/books', {
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
  textarea: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', boxSizing: 'border-box', fontSize: '14px', resize: 'none' },
  chipContainer: { display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' },
  chip: { padding: '6px 14px', borderRadius: '99px', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s ease', userSelect: 'none' },
  submitButton: { width: '100%', padding: '14px', backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', boxShadow: '0 2px 6px rgba(29, 158, 117, 0.2)', transition: 'background-color 0.2s' },
  required: { color: '#e53e3e', marginLeft: '2px' },
  inputError: { border: '1px solid #e53e3e', backgroundColor: '#fff5f5' },
  chipContainerError: { padding: '8px', borderRadius: '6px', border: '1px solid #e53e3e', backgroundColor: '#fff5f5' },
  errorMsg: { margin: '5px 0 0 2px', fontSize: '12px', color: '#e53e3e' },
};

export default BookRegister;