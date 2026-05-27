import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';
import { GENRE_LIST, TAG_LIST } from "../bookOption";
import Add from '../img/Add.png'
import Search from '../img/Search.png'
import List from '../img/List.png'
import Chart from '../img/Chart.png'
import Trash from '../img/Trash.png'

function BookMain() {
  const navigate = useNavigate();
  const bookUrl = 'http://localhost:3000/books';

  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const PAGE_SIZE = 3;

  const [detailPage, setDetailPage] = useState(1);
  const DETAIL_PAGE_SIZE = 5;

  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch(bookUrl);
        if (!res.ok) throw new Error('도서 불러오기 실패');
        const data = await res.json();
        setBooks(data.filter((book) => !book.deletedAt));
      } catch (err) {
        console.error(err);
      }
    };
    loadBooks();
  }, []);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    setDetailPage(1);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
    setDetailPage(1);
  };

  const filteredBooks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query && selectedGenres.length === 0 && selectedTags.length === 0) return [];

    return books.filter((book) => {
      const title = String(book.title ?? '').toLowerCase();
      const author = String(book.author ?? '').toLowerCase();
      const matchesKeyword = !query || title.includes(query) || author.includes(query);
      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.includes('전체') ||
        selectedGenres.includes(book.genre);
      const bookTags = String(book.tag ?? '').split(',').map((t) => t.trim());
      const matchesTag =
        selectedTags.length === 0 || selectedTags.some((tag) => bookTags.includes(tag));
      return matchesKeyword && matchesGenre && matchesTag;
    });
  }, [books, searchQuery, selectedGenres, selectedTags]);

  return (
    <>
      {/* 검색창 + 메뉴 */}
      <div className='book-main-section'>
        <BookSearch
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchPage={searchPage}
          setSearchPage={setSearchPage}
          PAGE_SIZE={PAGE_SIZE}
          filteredBooks={filteredBooks}
          isDetailOpen={isDetailOpen}
          setIsDetailOpen={setIsDetailOpen}
          selectedGenres={selectedGenres}
          selectedTags={selectedTags}
          toggleGenre={toggleGenre}
          toggleTag={toggleTag}
          navigate={navigate}
        />
        <BookMenu />
      </div>

      {/* 상세검색 결과 — book-main-section 밖 */}
      {(selectedGenres.length > 0 || selectedTags.length > 0) && (
        <section className="detail-result-section">
          <div className="detail-result-header">
            <h3>검색 결과</h3>
            <p>총 {filteredBooks.length}권</p>
          </div>
          {filteredBooks.length === 0 ? (
            <div className="detail-empty">조건에 맞는 도서가 없습니다.</div>
          ) : (
            <>
              <div className="detail-book-grid">
                {filteredBooks
                  .slice((detailPage - 1) * DETAIL_PAGE_SIZE, detailPage * DETAIL_PAGE_SIZE)
                  .map((book) => (
                    <div
                      key={book.id}
                      className="detail-book-card"
                      onClick={() => navigate(`/books/${book.id}`)}
                    >
                      <div className="detail-book-image">
                        <img
                          src={book.coverImageUrl?.trim() ? book.coverImageUrl : noCover}
                          alt={book.title}
                          onError={(e) => { e.target.src = noCover; }}
                        />
                      </div>
                      <div className="detail-book-info">
                        <h4>{book.title}</h4>
                        <p>{book.author}</p>
                        <span>{book.genre}</span>
                      </div>
                    </div>
                  ))}
              </div>

              {/* 페이지네이션 */}
              {Math.ceil(filteredBooks.length / DETAIL_PAGE_SIZE) > 1 && (
                <div className="detail-pagination">
                  {Array.from({ length: Math.ceil(filteredBooks.length / DETAIL_PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      className={`detail-page-btn ${detailPage === page ? 'active' : ''}`}
                      onClick={() => setDetailPage(page)}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </section>
      )}

      <BookSection />
    </>
  );
}

/* ============================================================
   왼쪽 검색
   ============================================================ */

function BookSearch({
  searchQuery, setSearchQuery,
  searchPage, setSearchPage,
  PAGE_SIZE, filteredBooks,
  isDetailOpen, setIsDetailOpen,
  selectedGenres, selectedTags,
  toggleGenre, toggleTag,
  navigate,
}) {
  return (
    <div className='book-search'>
      <div className='search-title'>
        <p>AIVLE School</p>
        <h1>걷기가 서재</h1>
      </div>

      <div className="search-area">
        <h1 className="search-type">
          자료검색
        </h1>

        <div className="search-input-wrap">
          <input
            className="search-input"
            placeholder="도서명 또는 저자를 입력하세요."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchPage(1);
            }}
          />

          {/* 일반 검색 드롭다운 */}
          {searchQuery.trim() && selectedGenres.length === 0 && selectedTags.length === 0 && (
            <div className="search-dropdown">
              {filteredBooks.length === 0 ? (
                <div className="search-item empty">검색 결과가 없습니다.</div>
              ) : (
                <>
                  {filteredBooks
                    .slice((searchPage - 1) * PAGE_SIZE, searchPage * PAGE_SIZE)
                    .map((book) => (
                      <div
                        key={book.id}
                        className="search-item"
                        onClick={() => navigate(`/books/${book.id}`)}
                      >
                        <img
                          className="search-item-cover"
                          src={book.coverImageUrl?.trim() ? book.coverImageUrl : noCover}
                          alt={book.title}
                          onError={(e) => { e.target.src = noCover; }}
                        />
                        <div className="search-item-info">
                          <span className="search-title">{book.title}</span>
                          <span className="search-author">{book.author} · {book.genre}</span>
                        </div>
                      </div>
                    ))}
                  {Math.ceil(filteredBooks.length / PAGE_SIZE) > 1 && (
                    <div className="search-pagination">
                      {Array.from({ length: Math.ceil(filteredBooks.length / PAGE_SIZE) }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          className={`search-page-btn ${searchPage === page ? 'active' : ''}`}
                          onClick={(e) => { e.stopPropagation(); setSearchPage(page); }}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        <button className="icon-btn">🔍</button>
        <button
          className="detail-btn"
          onClick={() => setIsDetailOpen(!isDetailOpen)}
        >
          상세검색
        </button>
      </div>

      {/* 상세검색 패널 — search-area 바로 아래 */}
      {isDetailOpen && (
        <div className="detail-search-panel">
          <div className="detail-section">
            <h4>장르</h4>
            <div className="detail-button-wrap">
              {GENRE_LIST.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  className={selectedGenres.includes(genre) ? 'detail-chip active' : 'detail-chip'}
                  onClick={() => toggleGenre(genre)}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
          <div className="detail-section">
            <h4>태그</h4>
            <div className="detail-button-wrap">
              {TAG_LIST.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  className={selectedTags.includes(tag) ? 'detail-chip active' : 'detail-chip'}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   왼쪽 메뉴
   ============================================================ */

function BookMenu() {
  const navigate = useNavigate();

  const MENU_LIST = [
    { icon: Add, name: "새도서등록", path: '/books/register' },
    { icon: Search, name: "도서검색", path: "/books/search" },
    { icon: List, name: "도서목록", path: '/books' },
    { icon: Chart, name: "사용자통계", path: 'books/chart' },
    { icon: Trash, name: "휴지통", path: '/books/deleted' },
  ];

  return (
    <div className="book-menu">
      {MENU_LIST.map((menu, index) => (
        <button
          key={index}
          className="book-menu-item"
          onClick={() => navigate(menu.path)}
        >
          <div className="book-menu-icon">
            <img src={menu.icon} alt={menu.name} />
          </div>
          <span className="book-menu-name">
            {menu.name}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ============================================================
   인기 도서
   ============================================================ */

function BookSection() {
  const navigate = useNavigate();
  const visibleCount = 5;
  const bookUrl = 'http://localhost:3000/books';

  const [popularIndex, setPopularIndex] = useState(0);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(bookUrl);
        if (!res.ok) throw new Error('서버 응답 오류');
        const data = await res.json();
        const sorted = data
          .filter((book) => !book.deletedAt)
          .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
          .slice(0, 10);
        setPopularBooks(sorted);
      } catch (err) {
        console.error('도서 목록 불러오기 실패:', err);
        setError('도서 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const trackRef = useRef(null);
  const moveNextRef = useRef(null);

  // 앞 visibleCount개를 뒤에 복제 → 끝에서 처음으로 자연스럽게 이어짐
  const extendedBooks = [...popularBooks, ...popularBooks.slice(0, visibleCount)];

  const disableTransition = () => {
    if (trackRef.current) trackRef.current.style.transition = 'none';
  };
  const enableTransition = () => {
    if (trackRef.current) trackRef.current.style.transition = '';
  };

  const moveNext = () => {
    setPopularIndex((prev) => prev + 1);
  };

  const movePrev = () => {
    if (popularIndex === 0) {
      disableTransition();
      setPopularIndex(popularBooks.length - visibleCount);
      requestAnimationFrame(() => requestAnimationFrame(enableTransition));
    } else {
      setPopularIndex((prev) => prev - 1);
    }
  };

  // 복제 구간에 도달하면 transition 끝난 후 조용히 처음으로 점프
  const handleTransitionEnd = () => {
    if (popularIndex >= popularBooks.length) {
      disableTransition();
      setPopularIndex(popularIndex - popularBooks.length);
      requestAnimationFrame(() => requestAnimationFrame(enableTransition));
    }
  };

  useEffect(() => {
    moveNextRef.current = moveNext;
  });

  useEffect(() => {
    if (isPaused || popularBooks.length <= visibleCount) return;
    const timer = setInterval(() => moveNextRef.current?.(), 3000);
    return () => clearInterval(timer);
  }, [isPaused, popularBooks.length]);

  if (loading || error || popularBooks.length === 0) return null;

  return (
    <div className="likes-book-wrap">
      <section className="likes-book-section">
        <div className="likes-book-header">
          <h2>인기 도서</h2>
        </div>

        <div
          className="likes-book-slider"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="likes-book-track-wrap">
            <div
              ref={trackRef}
              className="likes-book-track"
              style={{
                transform: `translateX(calc(-${popularIndex} * 100% / ${visibleCount}))`,
              }}
              onTransitionEnd={handleTransitionEnd}
            >
              {extendedBooks.map((book, index) => (
                <div className="likes-book-card" key={`${book.id}-${index}`}>
                  <div
                    className="likes-book-thumbnail"
                    onClick={() => navigate(`/books/${book.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img
                      src={book.coverImageUrl || noCover}
                      alt={book.title}
                      className="likes-book-cover"
                    />
                  </div>
                  <h3>{book.title}</h3>
                  <p className="likes-book-author">{book.author}</p>
                </div>
              ))}
            </div>
          </div>

          <button className="likes-book-btn left" onClick={movePrev}>‹</button>
          <button className="likes-book-btn right" onClick={moveNext}>›</button>
        </div>
      </section>
    </div>
  );
}

export default BookMain;
