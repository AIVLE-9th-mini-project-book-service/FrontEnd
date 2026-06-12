import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';
import { GENRE_LIST, TAG_LIST } from '../bookOption';
import { getPopularBooks, searchBooksByFilters } from '../components/api/bookSearchApi';
import Add from '../img/Add.png';
import Search from '../img/Search.png';
import List from '../img/List.png';
import Chart from '../img/Chart.png';
import Trash from '../img/Trash.png';

const SEARCH_DROPDOWN_PAGE_SIZE = 3;
const DETAIL_PAGE_SIZE = 5;
const MAIN_SEARCH_SIZE = 50;
const POPULAR_VISIBLE_COUNT = 5;
const POPULAR_FETCH_LIMIT = 10;

function BookMain() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchPage, setSearchPage] = useState(1);
  const [detailPage, setDetailPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    async function loadSearchResults() {
      const keyword = searchQuery.trim();
      const genres = selectedGenres.filter((genre) => genre !== GENRE_LIST[0]);
      const tags = selectedTags;
      const hasSearchCondition = keyword || genres.length > 0 || tags.length > 0;

      if (!hasSearchCondition) {
        setFilteredBooks([]);
        return;
      }

      try {
        const data = await searchBooksByFilters({
          keyword,
          genres,
          tags,
          size: MAIN_SEARCH_SIZE,
        });

        if (!cancelled) {
          setFilteredBooks(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Book main search request failed:', err);
          setFilteredBooks([]);
        }
      }
    }

    loadSearchResults();

    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedGenres, selectedTags]);

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
        prev.includes(genre) ? prev.filter((item) => item !== genre) : [...prev, genre]
    );
    setDetailPage(1);
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
        prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]
    );
    setDetailPage(1);
  };

  const hasDetailFilter = selectedGenres.length > 0 || selectedTags.length > 0;
  const detailTotalPages = Math.ceil(filteredBooks.length / DETAIL_PAGE_SIZE);
  const detailBooks = filteredBooks.slice(
      (detailPage - 1) * DETAIL_PAGE_SIZE,
      detailPage * DETAIL_PAGE_SIZE
  );

  return (
      <>
        <div className={isDetailOpen ? 'book-main-section book-main-section--detail-open' : 'book-main-section'}>
          <BookSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchPage={searchPage}
              setSearchPage={setSearchPage}
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

        {hasDetailFilter && (
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
                      {detailBooks.map((book) => (
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

                    {detailTotalPages > 1 && (
                        <div className="detail-pagination">
                          {Array.from({ length: detailTotalPages }, (_, i) => i + 1).map((page) => (
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

function BookSearch({
                      searchQuery,
                      setSearchQuery,
                      searchPage,
                      setSearchPage,
                      filteredBooks,
                      isDetailOpen,
                      setIsDetailOpen,
                      selectedGenres,
                      selectedTags,
                      toggleGenre,
                      toggleTag,
                      navigate,
                    }) {
  const dropdownTotalPages = Math.ceil(filteredBooks.length / SEARCH_DROPDOWN_PAGE_SIZE);
  const dropdownBooks = filteredBooks.slice(
      (searchPage - 1) * SEARCH_DROPDOWN_PAGE_SIZE,
      searchPage * SEARCH_DROPDOWN_PAGE_SIZE
  );
  const showSearchDropdown =
      searchQuery.trim() && selectedGenres.length === 0 && selectedTags.length === 0;

  return (
      <div className={isDetailOpen ? 'book-search book-search--detail-open' : 'book-search'}>
        <div className="search-title">
          <p>AIVLE School</p>
          <h1>걸어서 서재 속으로</h1>
        </div>

        <div className="search-area">
          <h1 className="search-type">자료검색</h1>

          <div className="search-input-wrap">
            <input
                className="search-input"
                placeholder="도서명 또는 저자를 입력하세요"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchPage(1);
                }}
            />

            {showSearchDropdown && (
                <div className="search-dropdown">
                  {filteredBooks.length === 0 ? (
                      <div className="search-item empty">검색 결과가 없습니다.</div>
                  ) : (
                      <>
                        {dropdownBooks.map((book) => (
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

                        {dropdownTotalPages > 1 && (
                            <div className="search-pagination">
                              {Array.from({ length: dropdownTotalPages }, (_, i) => i + 1).map((page) => (
                                  <button
                                      key={page}
                                      className={`search-page-btn ${searchPage === page ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSearchPage(page);
                                      }}
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

          <button className="icon-btn">🔎</button>
          <button
              className="detail-btn"
              onClick={() => setIsDetailOpen(!isDetailOpen)}
          >
            상세검색
          </button>
        </div>

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

function BookMenu() {
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');

  // JWT payload에서 role 추출
  const getRole = () => {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role ?? null;
    } catch {
      return null;
    }
  };

  const role = getRole();
  const isAdmin = role === 'ADMIN';

  const baseMenuList = [
    { icon: Add, name: '신규도서등록', path: '/books/register' },
    { icon: Search, name: '도서검색', path: '/books/search' },
    { icon: List, name: '도서목록', path: '/books' },
    { icon: Chart, name: '사용자통계', path: '/books/chart' },
    { icon: Trash, name: '휴지통', path: '/books/deleted' },
  ];

  return (
      <div className="book-menu">
        {baseMenuList.map((menu) => (
            <button
                key={menu.path}
                className="book-menu-item"
                onClick={() => navigate(menu.path)}
            >
              <div className="book-menu-icon">
                <img src={menu.icon} alt={menu.name} />
              </div>
              <span className="book-menu-name">{menu.name}</span>
            </button>
        ))}

        {token && !isAdmin && (
            <button
                className="book-menu-item"
                onClick={() => navigate('/mypage')}
            >
              <div className="book-menu-icon" style={{ fontSize: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                👤
              </div>
              <span className="book-menu-name">마이페이지</span>
            </button>
        )}
      </div>
  );
}

function BookSection() {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const moveNextRef = useRef(null);
  const [popularIndex, setPopularIndex] = useState(0);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadPopularBooks() {
      try {
        setLoading(true);
        const data = await getPopularBooks(POPULAR_FETCH_LIMIT);

        if (!cancelled) {
          setPopularBooks(data);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Popular books request failed:', err);
          setError('인기 도서를 불러오지 못했습니다.');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPopularBooks();

    return () => {
      cancelled = true;
    };
  }, []);

  const extendedBooks = [
    ...popularBooks,
    ...popularBooks.slice(0, POPULAR_VISIBLE_COUNT),
  ];

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
      setPopularIndex(popularBooks.length - POPULAR_VISIBLE_COUNT);
      requestAnimationFrame(() => requestAnimationFrame(enableTransition));
    } else {
      setPopularIndex((prev) => prev - 1);
    }
  };

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
    if (isPaused || popularBooks.length <= POPULAR_VISIBLE_COUNT) return undefined;
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
                    transform: `translateX(calc(-${popularIndex} * 100% / ${POPULAR_VISIBLE_COUNT}))`,
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