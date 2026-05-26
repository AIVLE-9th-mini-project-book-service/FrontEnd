import { useState, useEffect } from "react";
import noCover from "../img/no-cover.svg";
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
} from "recharts";

function BookSection({ onSelectBook }) {
  const visibleCount = 5;

  const [popularIndex, setPopularIndex] = useState(0);
  const [popularBooks, setPopularBooks] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/books')
      .then((res) => res.json())
      .then((data) => {
        const sorted = data
          .filter((book) => !book.deletedAt)
          .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
        setPopularBooks(sorted);
      })
      .catch((err) => console.error('도서 목록 불러오기 실패:', err));
  }, []);

  const movePrev = (books, startIndex, setStartIndex) => {
    setStartIndex(
      startIndex === 0 ? books.length - visibleCount : startIndex - 1
    );
  };

  const moveNext = (books, startIndex, setStartIndex) => {
    setStartIndex(
      startIndex >= books.length - visibleCount ? 0 : startIndex + 1
    );
  };

  const popularVisibleBooks = popularBooks.slice(
    popularIndex,
    popularIndex + visibleCount
  );

  return (
    <div className="likes-book-wrap">
      <section className="likes-book-section">
        <div className="likes-book-header">
          <h2>좋아요 높은 순</h2>
        </div>

        <div className="likes-book-slider">
          <div className="likes-book-list">
            {popularVisibleBooks.map((book, index) => (
              <div className="likes-book-card" key={`${book.title}-${index}`}>
                <div className="likes-book-thumbnail" onClick={() => onSelectBook(book.id)} style={{ cursor: "pointer" }}>
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

          <button
            className="likes-book-btn left"
            onClick={() =>
              movePrev(popularBooks, popularIndex, setPopularIndex)
            }
          >
            ‹
          </button>

          <button
            className="likes-book-btn right"
            onClick={() =>
              moveNext(popularBooks, popularIndex, setPopularIndex)
            }
          >
            ›
          </button>
        </div>
      </section>
    </div>
  );
}


function StatisticsSection() {
  const [genreChartType, setGenreChartType] = useState("pie");
  const [tagChartType, setTagChartType] = useState("pie");

  const [books, setBooks] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/books')
      .then((res) => {
        if (!res.ok) throw new Error('서버 연결 실패');
        return res.json();
      })
      .then((data) => {
        setBooks(data.filter((book) => !book.deletedAt));
        setStatsLoading(false);
      })
      .catch((err) => {
        console.error('통계 데이터 불러오기 실패:', err);
        setStatsError('통계 데이터를 불러오지 못했습니다.');
        setStatsLoading(false);
      });
  }, []);

  const colors = ["#3ba4f6", "#6b4fd6", "#a78bfa", "#2f5673", "#f5a623"];

  const GenreStats = () => {
    const result = {};

    books.forEach((book) => {
      result[book.genre] = (result[book.genre] || 0) + book.likes;
    });

    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const TagStats = () => {
    const result = {};

    books.forEach((book) => {
      const tags = Array.isArray(book.tag)
        ? book.tag
        : typeof book.tag === 'string' && book.tag.trim()
          ? [book.tag]
          : [];

      tags.forEach((tag) => {
        result[tag] = (result[tag] || 0) + (book.likes ?? 0);
      });
    });

    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const ChartCard = (title, data, chartType, setChartType) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="chart-card">
        <div className="chart-top">
          <div>
            <h3>{title}</h3>
            <p>
              총 <strong>{total.toLocaleString()}</strong>건
            </p>
          </div>

          <div className="chart-buttons">
            <button
              type="button"
              className={chartType === "pie" ? "active" : ""}
              onClick={() => setChartType("pie")}
            >
              원형
            </button>

            <button
              type="button"
              className={chartType === "bar" ? "active" : ""}
              onClick={() => setChartType("bar")}
            >
              막대
            </button>
          </div>
        </div>

        <div className="chart-content">
          <div className="chart-box">
            {chartType === "pie" ? (
              <div className="pie-bg">
                <ResponsiveContainer width="100%" height={220}>
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
                          fill={colors[index % colors.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1b3a5c" radius={[6, 6, 0, 0]} />
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
                    <b style={{ color: colors[index % colors.length] }}>•</b>
                    {item.name}
                  </span>

                  <strong>{item.value.toLocaleString()}건</strong>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  };

  const genreStats = GenreStats();
  const tagStats = TagStats();

  if (statsLoading) return (
    <section className="stats-section">
      <h2>도서 통계</h2>
      <p>통계 데이터를 불러오는 중...</p>
    </section>
  );

  if (statsError) return (
    <section className="stats-section">
      <h2>도서 통계</h2>
      <p>{statsError}</p>
    </section>
  );

  return (
    <section className="stats-section">
      <h2>도서 통계</h2>

      <div className="stats-chart-wrap">
        {ChartCard(
          "장르별 좋아요 수",
          genreStats,
          genreChartType,
          setGenreChartType
        )}

        {ChartCard(
          "태그별 좋아요 수",
          tagStats,
          tagChartType,
          setTagChartType
        )}
      </div>
    </section>
  );
}

function BookMain({ onSelectBook }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isHeaderOpen, setIsHeaderOpen] = useState(false);

  const handleSearch = () => {
    alert(`'${searchTerm}' 검색 기능 작동 예정`);
  };

  return (
    <div className="main-container" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="search-area">
        <button
          className="search-type-btn"
          onClick={() => setIsHeaderOpen(!isHeaderOpen)}
        >
          자료검색
        </button>

        <input
          className="search-input"
          placeholder="도서명 또는 저자를 입력하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />

        <button className="icon-btn" onClick={handleSearch}>🔍</button>
        <button className="detail-btn">상세검색</button>
      </div>

      <BookSection onSelectBook={onSelectBook} />
      <StatisticsSection />
    </div>
  );
}

export default BookMain;