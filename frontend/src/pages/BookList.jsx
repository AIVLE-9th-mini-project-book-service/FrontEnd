import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';
import Button from '../components/Button';
import Input from '../components/Input';

function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookUrl = 'http://localhost:3000/books';

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(bookUrl);
        if (!res.ok) throw new Error('서버 응답 오류');
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error('도서 목록 로딩 실패:', error);
        setError('도서 목록을 불러오지 못했습니다. json-server가 실행 중인지 확인해주세요.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleLike = async (id, currentLikes) => {
    try {
      const res = await fetch(bookUrl + `/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ likes: currentLikes + 1 }),
      });
      if (!res.ok) throw new Error('좋아요 반영 실패');
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, likes: book.likes + 1 } : book
        )
      );
    } catch (error) {
      console.error(error);
      alert('처리에 실패했습니다.');
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="book-list-container">
        <h1 className="book-list-title">도서 목록 페이지</h1>
        <p style={{ textAlign: 'center', marginTop: '60px', color: '#888', fontSize: '16px' }}>
          📚 도서 목록을 불러오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-list-container">
        <h1 className="book-list-title">도서 목록 페이지</h1>
        <div style={{
          textAlign: 'center', marginTop: '60px', padding: '24px',
          backgroundColor: '#fff5f5', border: '1px solid #feb2b2',
          borderRadius: '8px', color: '#c53030',
        }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>⚠️ 오류가 발생했습니다</p>
          <p style={{ fontSize: '14px', color: '#742a2a' }}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list-container">
      <h1 className="book-list-title">도서 목록 페이지</h1>

      <div className="book-list-search-bar">
        <Input
          name="search"
          placeholder="제목 또는 작가를 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="book-list-search-input"
        />
        <Button
          label="검색"
          onClick={() => alert(`'${searchTerm}' 검색 결과입니다.`)}
          className="book-list-search-btn"
        />
      </div>

      <div className="book-list-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-list-card">
            <img
              src={book.coverImageUrl || book.coverImage || noCover}
              alt={`${book.title} 표지`}
              className="book-list-cover"
              onClick={() => navigate(`/books/${book.id}`)}
              style={{ cursor: 'pointer' }}
            />
            <div className="book-list-info">
              <h3 className="book-list-name">{book.title}</h3>
              <p className="book-list-author">작가: {book.author}</p>
              <p className="book-list-description">
                <em>{book.summary || book.content || book.firstSentence || "등록된 소개글이 없습니다."}</em>
              </p>
              <Button
                label={`👍 추천 (${book.likes || 0})`}
                onClick={() => handleLike(book.id, book.likes || 0)}
                className="book-list-like-btn"
              />
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', width: '100%', color: '#888' }}>
            <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
            <p style={{ fontSize: '16px' }}>
              {searchTerm
                ? `"${searchTerm}"에 해당하는 도서가 없습니다.`
                : '등록된 도서가 없습니다.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookList;