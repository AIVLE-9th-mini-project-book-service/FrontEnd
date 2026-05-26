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


function Navigation({ onGoToList, onGoToRegister, onGoToDeleted }) {
  const NAV_LIST = [
    {
      title: "도서목록",
      onClick: onGoToList,
    },
    {
      title: "새 도서 등록",
      onClick: onGoToRegister,
    },
    {
      title: "휴지통",
      onClick: onGoToDeleted,
    },
  ];

  return (
    <nav className="nav-wrap">
      <div className="nav-bar">
        <div className="nav-menu-area">
          {NAV_LIST.map((menu) => (
            <button
              key={menu.title}
              className="nav-item"
              onClick={menu.onClick}
            >
              {menu.title}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

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
  const [bookCountType, setBookCountType] = useState("genre");
  const [likeCountType, setLikeCountType] = useState("genre");

  const [bookChartType, setBookChartType] = useState("pie");
  const [likeChartType, setLikeChartType] = useState("pie");

  const [books, setBooks] = useState([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [statsError, setStatsError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/books")
      .then((res) => {
        if (!res.ok) throw new Error("서버 연결 실패");
        return res.json();
      })
      .then((data) => {
        setBooks(data.filter((book) => !book.deletedAt));
        setStatsLoading(false);
      })
      .catch((err) => {
        console.error("통계 데이터 불러오기 실패:", err);
        setStatsError("통계 데이터를 불러오지 못했습니다.");
        setStatsLoading(false);
      });
  }, []);

  const colors = ["#3ba4f6", "#6b4fd6", "#a78bfa", "#2f5673", "#f5a623"];

  const getTags = (tag) => {
    if (Array.isArray(tag)) return tag;
    if (typeof tag === "string" && tag.trim()) return tag.split(",");
    return [];
  };

  const getBookCountByGenre = () => {
    const result = {};

    books.forEach((book) => {
      result[book.genre] = (result[book.genre] || 0) + 1;
    });

    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const getBookCountByTag = () => {
    const result = {};

    books.forEach((book) => {
      getTags(book.tag).forEach((tag) => {
        const trimTag = tag.trim();
        result[trimTag] = (result[trimTag] || 0) + 1;
      });
    });

    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const getLikeCountByGenre = () => {
    const result = {};

    books.forEach((book) => {
      result[book.genre] = (result[book.genre] || 0) + (book.likes ?? 0);
    });

    return Object.entries(result).map(([name, value]) => ({ name, value }));
  };

  const getLikeCountByTag = () => {
    const result = {};

    books.forEach((book) => {
      getTags(book.tag).forEach((tag) => {
        const trimTag = tag.trim();
        result[trimTag] = (result[trimTag] || 0) + (book.likes ?? 0);
      });
    });

    return Object.entries(result).map(([name, value]) => ({ name, value }));
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
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return (
      <div className="chart-card">
        <div className="chart-top">
          <div>
            <h3>{title}</h3>
            <p>
              총 <strong>{total.toLocaleString()}</strong>{unit}
            </p>
          </div>

          <div className="chart-buttons">
            <button
              type="button"
              className={selectedType === "genre" ? "active" : ""}
              onClick={() => setSelectedType("genre")}
            >
              장르
            </button>

            <button
              type="button"
              className={selectedType === "tag" ? "active" : ""}
              onClick={() => setSelectedType("tag")}
            >
              태그
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
              <ResponsiveContainer width="100%" height={220}>
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
    bookCountType === "genre" ? getBookCountByGenre() : getBookCountByTag();

  const likeCountData =
    likeCountType === "genre" ? getLikeCountByGenre() : getLikeCountByTag();

  if (statsLoading) {
    return (
      <section className="stats-section">
        <h2>도서 통계</h2>
        <p>통계 데이터를 불러오는 중...</p>
      </section>
    );
  }

  if (statsError) {
    return (
      <section className="stats-section">
        <h2>도서 통계</h2>
        <p>{statsError}</p>
      </section>
    );
  }

  return (
    <section className="stats-section">
      <h2>도서 통계</h2>

      <div className="stats-chart-wrap">
        {ChartCard(
          "도서 수",
          bookCountData,
          bookChartType,
          setBookChartType,
          "권",
          bookCountType,
          setBookCountType
        )}

        {ChartCard(
          "좋아요 수",
          likeCountData,
          likeChartType,
          setLikeChartType,
          "건",
          likeCountType,
          setLikeCountType
        )}
      </div>
    </section>
  );
}

function BookMain({onGoToList, onGoToRegister, onGoToDeleted, onSelectBook}) {
  return (
        <>
          <Navigation onGoToList={onGoToList} onGoToRegister={onGoToRegister} onGoToDeleted={onGoToDeleted} />
          <BookSection onSelectBook={onSelectBook} />
          <StatisticsSection />
        </>
        );
}

export default BookMain;