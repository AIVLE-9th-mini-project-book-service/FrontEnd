import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';
import Button from '../components/Button';
import Input from '../components/Input';

const BOOKS_PER_PAGE = 4;

function Sidebar({ books, selectedGenre, selectedTag, onGenreChange, onTagChange }) {
  const genres = useMemo(() => {
    const set = new Set(books.map((b) => b.genre).filter(Boolean));
    return [...set].sort();
  }, [books]);

  const tags = useMemo(() => {
    const set = new Set();
    books.forEach((b) => {
      if (b.tag) String(b.tag).split(',').forEach((t) => { const v = t.trim(); if (v) set.add(v); });
    });
    return [...set].sort();
  }, [books]);

  return (
    <aside className="book-list-sidebar">
      {/* 장르 필터 */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">장르</h3>
        <ul className="sidebar-list">
          <li>
            <button
              className={`sidebar-item${!selectedGenre ? ' sidebar-item--active' : ''}`}
              onClick={() => onGenreChange(null)}
            >
              전체
            </button>
          </li>
          {genres.map((g) => (
            <li key={g}>
              <button
                className={`sidebar-item${selectedGenre === g ? ' sidebar-item--active' : ''}`}
                onClick={() => onGenreChange(selectedGenre === g ? null : g)}
              >
                {g}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 태그 필터 */}
      <div className="sidebar-section">
        <h3 className="sidebar-title">태그</h3>
        <div className="sidebar-tags">
          {tags.map((t) => (
            <button
              key={t}
              className={`sidebar-tag${selectedTag === t ? ' sidebar-tag--active' : ''}`}
              onClick={() => onTagChange(selectedTag === t ? null : t)}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  // 표시할 페이지 번호 범위 계산 (최대 5개)
  const getPageNumbers = () => {
    const pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);

    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="pagination">
      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="이전 페이지"
      >
        ‹
      </button>

      {pageNumbers[0] > 1 && (
        <>
          <button className="pagination__btn" onClick={() => onPageChange(1)}>1</button>
          {pageNumbers[0] > 2 && <span className="pagination__ellipsis">…</span>}
        </>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`pagination__btn${currentPage === page ? ' pagination__btn--active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="pagination__ellipsis">…</span>
          )}
          <button className="pagination__btn" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className="pagination__btn pagination__btn--arrow"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="다음 페이지"
      >
        ›
      </button>
    </div>
  );
}

function BookList() {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const bookUrl = '/api/books';
  const token = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(bookUrl);
        if (!res.ok) throw new Error('서버 응답 오류');
        const data = await res.json();
        setBooks(data.filter((book) => !book.deletedAt));
      } catch (error) {
        console.error('도서 목록 로딩 실패:', error);
        setError('도서 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const handleLike = async (id) => {
    try {
      const res = await fetch(bookUrl + `/${id}/like`, {
        method: 'PATCH',
                headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('좋아요 반영 실패');
      setBooks((prev) =>
        prev.map((book) =>
          book.id === id ? { ...book, likes: (book.likes ?? 0) + 1 } : book
        )
      );
    } catch (error) {
      console.error(error);
      alert('처리에 실패했습니다.');
    }
  };

  const filteredBooks = useMemo(() =>
    books.filter((book) => {
      const matchesSearch =
        !searchTerm ||
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesGenre = !selectedGenre || book.genre === selectedGenre;
      const matchesTag =
        !selectedTag ||
        String(book.tag ?? '').split(',').map((t) => t.trim()).includes(selectedTag);
      return matchesSearch && matchesGenre && matchesTag;
    }),
    [books, searchTerm, selectedGenre, selectedTag]
  );

  const totalPages = Math.ceil(filteredBooks.length / BOOKS_PER_PAGE);

  const pagedBooks = useMemo(() => {
    const start = (currentPage - 1) * BOOKS_PER_PAGE;
    return filteredBooks.slice(start, start + BOOKS_PER_PAGE);
  }, [filteredBooks, currentPage]);

  // 필터 변경 시 1페이지로 리셋
  const handleSearchChange = (e) => { setSearchTerm(e.target.value); setCurrentPage(1); };
  const handleGenreChange = (g) => { setSelectedGenre(g); setCurrentPage(1); };
  const handleTagChange = (t) => { setSelectedTag(t); setCurrentPage(1); };

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
    <div className="book-list-wrapper">
      <Sidebar
        books={books}
        selectedGenre={selectedGenre}
        selectedTag={selectedTag}
        onGenreChange={handleGenreChange}
        onTagChange={handleTagChange}
      />

      <div className="book-list-container">
        <h1 className="book-list-title">도서 목록 페이지</h1>

        <div className="book-list-search-bar">
          <Input
            name="search"
            placeholder="제목 또는 작가를 입력하세요..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="book-list-search-input"
          />
          <Button
            label="검색"
            onClick={() => {}}
            className="book-list-search-btn"
          />
        </div>

        {/* 활성 필터 / 결과 건수 */}
        {(searchTerm || selectedGenre || selectedTag) && (
          <p className="book-list-result-info">
            {selectedGenre && <span className="book-list-filter-badge">{selectedGenre}</span>}
            {selectedTag && <span className="book-list-filter-badge">#{selectedTag}</span>}
            {searchTerm && <strong>"{searchTerm}"</strong>}
            {' '}검색 결과 {filteredBooks.length}권
          </p>
        )}

        <div className="book-list-grid">
          {pagedBooks.map((book) => (
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
                  <em>{book.summary || book.content || book.firstSentence || '등록된 소개글이 없습니다.'}</em>
                </p>
                <Button
                  label={`👍 추천 (${book.likes || 0})`}
                  onClick={() => handleLike(book.id)}
                  className="book-list-like-btn"
                />
              </div>
            </div>
          ))}
          {filteredBooks.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 0', width: '100%', color: '#888' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</p>
              <p style={{ fontSize: '16px' }}>
                {searchTerm || selectedGenre || selectedTag
                  ? '조건에 맞는 도서가 없습니다.'
                  : '등록된 도서가 없습니다.'}
              </p>
            </div>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}

export default BookList;