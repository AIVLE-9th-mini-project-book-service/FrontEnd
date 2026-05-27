import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function BookMain() {
  const navigate = useNavigate();

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('');
  const [books, setBooks] = useState([]);

  // 상세검색 상태
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  const GENRE_LIST = [
    "소설",
    "고전",
    "역사",
    "IT",
    "동화",
    "자기계발",
    "과학",
    "경제",
    "철학",
    "예술"
  ];

  const TAG_LIST = [
    "한국문학",
    "고전문학",
    "개발/프로그래밍",
    "역사/인문",
    "고전/동화",
    "베스트셀러",
    "추천도서",
    "과학/기술"
  ];

  // 도서 불러오기
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const res = await fetch('http://localhost:3000/books');

        if (!res.ok) {
          throw new Error('도서 불러오기 실패');
        }

        const data = await res.json();

        setBooks(
          data.filter((book) => !book.deletedAt)
        );

      } catch (err) {
        console.error(err);
      }
    };

    loadBooks();
  }, []);

  // 상세검색 토글
  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre)
        ? prev.filter((item) => item !== genre)
        : [...prev, genre]
    );
  };

  const toggleTag = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((item) => item !== tag)
        : [...prev, tag]
    );
  };

  // 검색 필터
  const filteredBooks = useMemo(() => {

    const query =
      searchQuery.trim().toLowerCase();

    if (
      !query &&
      selectedGenres.length === 0 &&
      selectedTags.length === 0
    ) {
      return [];
    }

    return books.filter((book) => {

      const title =
        String(book.title ?? '').toLowerCase();

      const author =
        String(book.author ?? '').toLowerCase();

      const matchesKeyword =
        !query ||
        title.includes(query) ||
        author.includes(query);

      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.includes(book.genre);

      const bookTags =
        String(book.tag ?? '')
          .split(',')
          .map((tag) => tag.trim());

      const matchesTag =
        selectedTags.length === 0 ||
        selectedTags.some((tag) =>
          bookTags.includes(tag)
        );

      return (
        matchesKeyword &&
        matchesGenre &&
        matchesTag
      );
    });

  }, [
    books,
    searchQuery,
    selectedGenres,
    selectedTags
  ]);

  return (
    <>
      {/* 검색창 */}
      <div className="search-area">

        <button
          className="search-type-btn"
        >
          자료검색
        </button>

        <div className="search-input-wrap">

          <input
            className="search-input"
            placeholder="도서명 또는 저자를 입력하세요."
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
          />

          {/* 일반 검색 자동완성 */}
          {searchQuery.trim() &&
            selectedGenres.length === 0 &&
            selectedTags.length === 0 && (

              <div className="search-dropdown">

                {filteredBooks.length === 0 ? (

                  <div className="search-item empty">
                    검색 결과가 없습니다.
                  </div>

                ) : (

                  filteredBooks
                    .slice(0, 8)
                    .map((book) => (

                      <div
                        key={book.id}
                        className="search-item"
                        onClick={() =>
                          navigate(`/books/${book.id}`)
                        }
                      >
                        <span className="search-title">
                          {book.title}
                        </span>

                        <span className="search-author">
                          {book.author}
                        </span>
                      </div>
                    ))
                )}
              </div>
          )}
        </div>

        <button className="icon-btn">
          🔍
        </button>

        <button
          className="detail-btn"
          onClick={() =>
            setIsDetailOpen(!isDetailOpen)
          }
        >
          상세검색
        </button>

      </div>

      {/* 상세검색 */}
      {isDetailOpen && (

        <div className="detail-search-panel">

          <div className="detail-section">

            <h4>장르</h4>

            <div className="detail-button-wrap">

              {GENRE_LIST.map((genre) => (

                <button
                  key={genre}
                  type="button"
                  className={
                    selectedGenres.includes(genre)
                      ? 'detail-chip active'
                      : 'detail-chip'
                  }
                  onClick={() =>
                    toggleGenre(genre)
                  }
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
                  className={
                    selectedTags.includes(tag)
                      ? 'detail-chip active'
                      : 'detail-chip'
                  }
                  onClick={() =>
                    toggleTag(tag)
                  }
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 상세검색 결과 */}
      {(selectedGenres.length > 0 ||
        selectedTags.length > 0) && (

        <section className="detail-result-section">

          <div className="detail-result-header">

            <h3>
              검색 결과
            </h3>

            <p>
              총 {filteredBooks.length}권
            </p>
          </div>

          {filteredBooks.length === 0 ? (

            <div className="detail-empty">
              조건에 맞는 도서가 없습니다.
            </div>

          ) : (

            <div className="detail-book-grid">

              {filteredBooks.map((book) => (

                <div
                  key={book.id}
                  className="detail-book-card"
                  onClick={() =>
                    navigate(`/books/${book.id}`)
                  }
                >

                  <div className="detail-book-image">

                    <img
                      src={
                        book.coverImageUrl?.trim()
                          ? book.coverImageUrl
                          : noCover
                      }
                      alt={book.title}
                      onError={(e) => {
                        e.target.src = noCover;
                      }}
                    />
                  </div>

                  <div className="detail-book-info">

                    <h4>{book.title}</h4>

                    <p>{book.author}</p>

                    <span>
                      {book.genre}
                    </span>

                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <BookSection />
      <StatisticsSection />
    </>
  );
}

/* ============================================================
   인기 도서
   ============================================================ */

function BookSection() {
  const navigate = useNavigate();
  const visibleCount = 5;

  const [popularIndex, setPopularIndex] = useState(0);
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const res = await fetch('http://localhost:3000/books');

        if (!res.ok) {
          throw new Error('서버 응답 오류');
        }

        const data = await res.json();

        const sorted = data
          .filter((book) => !book.deletedAt)
          .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0))
          .slice(0, 10);
        setPopularBooks(sorted);

      } catch (err) {
        console.error(
          '도서 목록 불러오기 실패:',
          err
        );

        setError(
          '도서 목록을 불러오지 못했습니다.'
        );

      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const trackRef = useRef(null);
  const moveNextRef = useRef(null);

  const disableTransition = () => {
    if (trackRef.current) trackRef.current.style.transition = 'none';
  };
  const enableTransition = () => {
    if (trackRef.current) trackRef.current.style.transition = '';
  };

  const moveNext = () => {
    const isLast = popularIndex >= popularBooks.length - visibleCount;
    if (isLast) {
      disableTransition();
      setPopularIndex(0);
      requestAnimationFrame(() => requestAnimationFrame(enableTransition));
    } else {
      setPopularIndex((prev) => prev + 1);
    }
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

  // moveNext 최신 버전을 ref에 저장 (stale closure 방지)
  useEffect(() => {
    moveNextRef.current = moveNext;
  });

  // 3초마다 자동 슬라이드, 호버 중엔 멈춤
  useEffect(() => {
    if (isPaused || popularBooks.length <= visibleCount) return;
    const timer = setInterval(() => moveNextRef.current?.(), 3000);
    return () => clearInterval(timer);
  }, [isPaused, popularBooks.length]);

  if (
    loading ||
    error ||
    popularBooks.length === 0
  ) {
    return null;
  }

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
                transform: `translateX(calc(-${popularIndex} * 100% / ${popularBooks.length}))`,
              }}
            >
              {popularBooks.map((book, index) => (
                <div className="likes-book-card" key={book.id || index}>
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

function StatisticsSection() {
  const [bookCountType, setBookCountType] = useState('genre');
  const [likeCountType, setLikeCountType] = useState('genre');
  const [bookChartType, setBookChartType] = useState('pie');
  const [likeChartType, setLikeChartType] = useState('pie');

  const [books, setBooks] = useState([]);

  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/books')
      .then((res) => {
        if (!res.ok) {
          throw new Error('서버 연결 실패');
        }

        return res.json();
      })
      .then((data) => {

        setBooks(
          data.filter((book) => !book.deletedAt)
        );

        setStatsLoading(false);
      })
      .catch((err) => {

        console.error(
          '통계 데이터 불러오기 실패:',
          err
        );

        setStatsError(
          '통계 데이터를 불러오지 못했습니다.'
        );

        setStatsLoading(false);
      });
  }, []);

  const colors = [
    '#3ba4f6',
    '#6b4fd6',
    '#a78bfa',
    '#2f5673',
    '#f5a623'
  ];

  const getTags = (tag) => {

    if (Array.isArray(tag)) {
      return tag;
    }

    if (
      typeof tag === 'string' &&
      tag.trim()
    ) {
      return tag.split(',');
    }

    return [];
  };

  const getBookCountByGenre = () => {

    const result = {};

    books.forEach((book) => {

      result[book.genre] =
        (result[book.genre] || 0) + 1;
    });

    return Object.entries(result).map(
      ([name, value]) => ({
        name,
        value
      })
    );
  };

  const getBookCountByTag = () => {

    const result = {};

    books.forEach((book) => {

      getTags(book.tag).forEach((tag) => {

        const trimTag = tag.trim();

        result[trimTag] =
          (result[trimTag] || 0) + 1;
      });
    });

    return Object.entries(result).map(
      ([name, value]) => ({
        name,
        value
      })
    );
  };

  const getLikeCountByGenre = () => {

    const result = {};

    books.forEach((book) => {

      result[book.genre] =
        (result[book.genre] || 0) +
        (Number(book.likes) || 0);
    });

    return Object.entries(result).map(
      ([name, value]) => ({
        name,
        value
      })
    );
  };

  const getLikeCountByTag = () => {

    const result = {};

    books.forEach((book) => {

      getTags(book.tag).forEach((tag) => {

        const trimTag = tag.trim();

        result[trimTag] =
          (result[trimTag] || 0) +
          (Number(book.likes) || 0);
      });
    });

    return Object.entries(result).map(
      ([name, value]) => ({
        name,
        value
      })
    );
  };

  const ChartCard = (
    title,
    data,
    chartType,
    setChartType,
    unit,
    selectedType,
    setSelectedType
  ) => {

    const total = data.reduce(
      (sum, item) => sum + item.value,
      0
    );

    return (
      <div className="chart-card">

        <div className="chart-top">

          <div>
            <h3>{title}</h3>

            <p>
              총{' '}
              <strong>
                {total.toLocaleString()}
              </strong>
              {unit}
            </p>
          </div>

          <div className="chart-buttons">

            <button
              type="button"
              className={
                selectedType === 'genre'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setSelectedType('genre')
              }
            >
              장르
            </button>

            <button
              type="button"
              className={
                selectedType === 'tag'
                  ? 'active'
                  : ''
              }
              onClick={() =>
                setSelectedType('tag')
              }
            >
              태그
            </button>

          </div>
        </div>

        <div className="chart-content">

          <div className="chart-box">

            {chartType === 'pie' ? (

              <div className="pie-bg">

                <ResponsiveContainer
                  width="100%"
                  height={220}
                >
                  <PieChart>

                    <Pie
                      data={data}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={80}
                    >

                      {data.map((_, index) => (

                        <Cell
                          key={index}
                          fill={
                            colors[
                              index %
                              colors.length
                            ]
                          }
                        />
                      ))}
                    </Pie>

                    <Tooltip />

                  </PieChart>
                </ResponsiveContainer>
              </div>

            ) : (

              <ResponsiveContainer
                width="100%"
                height={220}
              >
                <BarChart data={data}>

                  <CartesianGrid
                    strokeDasharray="3 3"
                  />

                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />

                  <Bar
                    dataKey="value"
                    fill="#1b3a5c"
                    radius={[6, 6, 0, 0]}
                  />

                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          <ul className="chart-list">

            {[...data]
              .sort((a, b) => b.value - a.value)
              .map((item, index) => (

                <li key={item.name}>

                  <span>
                    <b
                      style={{
                        color:
                          colors[
                            index %
                            colors.length
                          ]
                      }}
                    >
                      •
                    </b>

                    {item.name}
                  </span>

                  <strong>
                    {item.value.toLocaleString()}
                    {unit}
                  </strong>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  };

  const bookCountData =
    bookCountType === 'genre'
      ? getBookCountByGenre()
      : getBookCountByTag();

  const likeCountData =
    likeCountType === 'genre'
      ? getLikeCountByGenre()
      : getLikeCountByTag();

  if (statsLoading) {
    return (
      <section className="stats-section">
        <h2>도서 통계</h2>

        <p
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#888'
          }}
        >
          📊 통계 데이터를 불러오는 중...
        </p>
      </section>
    );
  }

  if (statsError) {
    return (
      <section className="stats-section">
        <h2>도서 통계</h2>

        <p
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#c53030'
          }}
        >
          ⚠️ {statsError}
        </p>
      </section>
    );
  }

  if (books.length === 0) {
    return (
      <section className="stats-section">
        <h2>도서 통계</h2>

        <p
          style={{
            textAlign: 'center',
            padding: '40px 0',
            color: '#888'
          }}
        >
          📭 통계를 표시할 도서가 없습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="stats-section">

      <h2>도서 통계</h2>

      <div className="stats-chart-wrap">

        {ChartCard(
          '도서 수',
          bookCountData,
          bookChartType,
          setBookChartType,
          '권',
          bookCountType,
          setBookCountType
        )}

        {ChartCard(
          '좋아요 수',
          likeCountData,
          likeChartType,
          setLikeChartType,
          '건',
          likeCountType,
          setLikeCountType
        )}

      </div>
    </section>
  );
}

export default BookMain;