import { useState, useEffect } from "react";
import './BookMain.css'
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


function Navigation() {
  const [isAllNavOpen, setIsAllNavOpen] = useState(false);
  const [navMenu, setNavMenu] = useState(null);

  const NAV_LIST = [
    {
      title: "도서검색",
      items: ["통합검색"],
    },
    {
      title: "종류별",
      items: ["장르별", "태그별", "좋아요순"],
    },
    {
      title: "지원",
      items: ["공지사항", "자주 묻는 질문"],
    },
  ];

  return (
    <nav className="nav-wrap">
      <div className="nav-bar">
        <button
          className="nav-menu-btn"
          onClick={() => setIsAllNavOpen(!isAllNavOpen)}
        >
          ☰
        </button>

        <div className="nav-menu-area">
          {NAV_LIST.map((menu) => (
            <div
              key={menu.title}
              className="nav-item-wrap"
              onMouseEnter={() => setNavMenu(menu.title)}
              onMouseLeave={() => setNavMenu(null)}
            >
              <button
                className={`nav-item ${navMenu === menu.title ? "active" : ""
                  }`}
              >
                {menu.title}
              </button>

              {!isAllNavOpen && navMenu === menu.title && (
                <div className="single-dropdown">
                  {menu.items.map((item) => (
                    <p key={item}>{item}</p>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {isAllNavOpen && (
        <div className="all-dropdown">
          {NAV_LIST.map((menu) => (
            <div className="all-column" key={menu.title}>
              {menu.items.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          ))}
        </div>
      )}
    </nav>
  );
}

/*
function SlideSection() {
  const [slide, setSlide] = useState(0);
  const slides = ["#d9d9d9", "#cfcfcf", "#bfbfbf", "#a9a9a9"];

  const movePrev = () => {
    setSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const moveNext = () => {
    setSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 2000);

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="slide-section">
      <div className="slide-box">
        <button className="slide-btn left" onClick={movePrev}>
          ‹
        </button>

        <div
          className="slide-img"
          style={{ backgroundColor: slides[slide] }}
        >
          <h1>{slide + 1}</h1>
        </div>

        <button className="slide-btn right" onClick={moveNext}>
          ›
        </button>
      </div>

      <div className="slide-control">
        <div className="dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={slide === index ? "dot active" : "dot"}
              onClick={() => setSlide(index)}
            />
          ))}
        </div>

        <div className="count">
          {slide + 1} / {slides.length}
        </div>
      </div>
    </section>
  );
}
*/

function BookSection() {
  const visibleCount = 4;

  const [popularIndex, setPopularIndex] = useState(0);
  const [suggestIndex, setSuggestIndex] = useState(0);

  const popularBooks = [
    { title: "도서명1", author: "저자명" },
    { title: "도서명2", author: "저자명" },
    { title: "도서명3", author: "저자명" },
    { title: "도서명4", author: "저자명" },
    { title: "도서명5", author: "저자명" },
  ];

  const suggestBooks = [
    { title: "도서명1", author: "저자명" },
    { title: "도서명2", author: "저자명" },
    { title: "도서명3", author: "저자명" },
    { title: "도서명4", author: "저자명" },
    { title: "도서명5", author: "저자명" },
  ];

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

  const suggestVisibleBooks = suggestBooks.slice(
    suggestIndex,
    suggestIndex + visibleCount
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
                <div className="likes-book-thumbnail"></div>
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

      <section className="likes-book-section">
        <div className="likes-book-header">
          <h2>AI 추천</h2>
        </div>

        <div className="likes-book-slider">
          <div className="likes-book-list">
            {suggestVisibleBooks.map((book, index) => (
              <div className="likes-book-card" key={`${book.title}-${index}`}>
                <div className="likes-book-thumbnail"></div>
                <h3>{book.title}</h3>
                <p className="likes-book-author">{book.author}</p>
              </div>
            ))}
          </div>
          <button
            className="likes-book-btn left"
            onClick={() =>
              movePrev(suggestBooks, suggestIndex, setSuggestIndex)
            }
          >
            ‹
          </button>
          <button
            className="likes-book-btn right"
            onClick={() =>
              moveNext(suggestBooks, suggestIndex, setSuggestIndex)
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

  const books = [
    { title: "도서명1", genre: "소설", tag: ["추천도서", "한국문학"], likes: 120 },
    { title: "도서명2", genre: "고전", tag: ["개발/프로그래밍", "베스트셀러"], likes: 95 },
    { title: "도서명3", genre: "역사", tag: ["과학기술"], likes: 180 },
    { title: "도서명4", genre: "IT", tag: ["고전문학"], likes: 70 },
    { title: "도서명5", genre: "과학", tag: ["고전/동화", "고전문학"], likes: 210 },
  ];

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
      book.tag.forEach((tag) => {
        result[tag] = (result[tag] || 0) + book.likes;
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

function BookMain() {
  return (
    <>
      <Navigation />
      <BookSection />
      <StatisticsSection />
    </>
  );
}

export default BookMain;