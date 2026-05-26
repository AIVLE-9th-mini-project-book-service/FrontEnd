import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import TextArea from '../components/TextArea';
import '../style.css';

const GENRE_LIST = ['소설', '고전', '역사', 'IT', '동화', '자기계발', '과학', '경제', '철학', '예술'];
const TAG_LIST = ['한국문학', '고전문학', '개발/프로그래밍', '역사/인문', '고전/동화', '베스트셀러', '추천도서', '과학/기술'];

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

  const handleSubmit = async () => {
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
    <div className="register-container">
      <h2 className="register-title">새 도서 등록하기</h2>

      <div className="register-form-group">
        <label className="register-label">도서 제목</label>
        <Input
          name="title"
          placeholder="도서 제목을 입력하세요"
          value={form.title}
          onChange={handleChange}
        />
      </div>

      <div className="register-form-group">
        <label className="register-label">저자명</label>
        <Input
          name="author"
          placeholder="저자 이름을 입력하세요"
          value={form.author}
          onChange={handleChange}
        />
      </div>

      <div className="register-form-group">
        <p className="register-label">장르 선택</p>
        <div className="register-chip-container">
          {GENRE_LIST.map((g) => (
            <span
              key={g}
              onClick={() => handleGenreSelect(g)}
              className="register-chip"
              style={{
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
      </div>

      <div className="register-form-group">
        <p className="register-label">태그 선택 (복수 선택 가능)</p>
        <div className="register-chip-container">
          {TAG_LIST.map((t) => (
            <span
              key={t}
              onClick={() => handleTagSelect(t)}
              className="register-chip"
              style={{
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

      <div className="register-form-group">
        <label className="register-label">도서 소개 / 내용</label>
        <TextArea
          name="content"
          placeholder="도서의 주요 내용이나 첫 문장을 입력해 주세요."
          value={form.content}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <Button
        label="등록하기"
        onClick={handleSubmit}
        className="register-submit-btn"
      />
    </div>
  );
}

export default BookRegister;