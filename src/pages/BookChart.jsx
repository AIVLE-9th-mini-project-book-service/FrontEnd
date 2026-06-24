import { useState, useEffect, useMemo } from 'react';

import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';


function BookChart() {
    const [books, setBooks] = useState([]);

    // Dashboard
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    // Chart
    const [bookCountType, setBookCountType] = useState('genre');
    const [likesCountType, setLikesCountType] = useState('genre');
    const [countData, setCountData] = useState({});
    const [likesData, setLikesData] = useState({});

    const bookUrl = '/api/books';
    const bookCountUrl = '/api/books/statistics/count';
    const likesCountUrl = '/api/books/statistics/likes';

    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const years = [2025, 2026, 2027, 2028];

    const colors = ['#3ba4f6', '#6b4fd6', '#a78bfa', '#2f5673', '#f5a623'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setStatsLoading(true);

                const [bookRes, countRes, likesRes] = await Promise.all([
                    fetch(bookUrl),
                    fetch(bookCountUrl),
                    fetch(likesCountUrl),
                ]);

                if (!bookRes.ok || !countRes.ok || !likesRes.ok) {
                    throw new Error('서버 연결 실패');
                }

                const [bookList, countStats, likesStats] = await Promise.all([
                    bookRes.json(),
                    countRes.json(),
                    likesRes.json(),
                ]);

                const activeBooks = bookList.filter((book) => !book.deletedAt);

                setBooks(activeBooks);
                setCountData(countStats);
                setLikesData(likesStats);
                setStatsError(null);
            } catch (err) {
                console.error('통계 데이터 불러오기 실패:', err);
                setStatsError('통계 데이터를 불러오지 못했습니다.');
            } finally {
                setStatsLoading(false);
            }
        };

        fetchData();
    }, []);

    const getDateKey = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    };

    const getTags = (tag) => {
        if (Array.isArray(tag)) return tag;
        if (typeof tag === 'string' && tag.trim()) return tag.split(',');
        return [];
    };

    const makeChartData = (data, type) => {
        const selectedData = data[type] || {};

        return Object.entries(selectedData).map(([name, value]) => ({name, value: Number(value) || 0,}));
    };

    const selectedMonthKey = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}`;

    const selectedMonthBooks = useMemo(() => {
        return books.filter((book) => {
            return book.createdAt?.slice(0, 7) === selectedMonthKey;
        });
    }, [books, selectedMonthKey]);

    const dailyData = useMemo(() => {
        const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

        return Array.from({ length: daysInMonth }, (_, index) => {
            const day = index + 1;
            const dateKey = `${selectedMonthKey}-${String(day).padStart(2, '0')}`;
            const count = selectedMonthBooks.filter((book) => {
                return book.createdAt?.slice(0, 10) === dateKey;
            }).length;

            return {day, count,};
        });
    }, [selectedYear, selectedMonth, selectedMonthKey, selectedMonthBooks]);

    const todayKey = getDateKey(new Date());
    const totalCount = books.length;
    const monthlyCount = selectedMonthBooks.length;
    const todayCount = books.filter((book) => {
        return book.createdAt?.slice(0, 10) === todayKey;
    }).length;

    const popularGenre = useMemo(() => {
        const genreCount = {};

        selectedMonthBooks.forEach((book) => {
            if (!book.genre) return;

            genreCount[book.genre] = (genreCount[book.genre] || 0) + 1;
        });

        const sortedGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1]);

        return sortedGenre.length > 0 ? sortedGenre[0][0] : '-';
    }, [selectedMonthBooks]);

    const bookCountData = makeChartData(countData, bookCountType);
    const likesCountData = makeChartData(likesData, likesCountType);

    const ChartCard = (title, data, unit, selectedType, setSelectedType) => {
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
                            className={selectedType === 'genre' ? 'active' : ''}
                            onClick={() => setSelectedType('genre')}
                        >
                        장르
                        </button>

                        <button
                            type="button"
                            className={selectedType === 'tag' ? 'active' : ''}
                            onClick={() => setSelectedType('tag')}
                        >
                        태그
                        </button>
                    </div>
                </div>

                <div className="chart-content">
                    <div className="chart-box">
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
                    </div>

                    <ul className="chart-list">
                        {[...data]
                            .sort((a, b) => b.value - a.value)
                            .map((item, index) => (
                                <li key={item.name}>
                                    <span>
                                        <b className={`chart-dot color-${index % colors.length}`}>•</b>
                                        {item.name}
                                    </span>
                                    <strong>{item.value.toLocaleString()}{unit}</strong>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="dashboard">
                <section className="dashboard-chart-card">
                    <div className="dashboard-header">
                        <h2>대시보드</h2>

                        <div className="dashboard-select-box">
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                            >
                                {months.map((month, index) => (
                                    <option key={month} value={index}>
                                        {month}
                                    </option>
                                ))}
                            </select>

                            <select
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(Number(e.target.value))}
                            >
                                {years.map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <h3 className="chart-title">
                        {selectedYear}년 {months[selectedMonth]}월
                    </h3>

                    <div className="dashboard-chart-wrap">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={dailyData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="day" />
                                <YAxis allowDecimals={false} tick={false} axisLine={false} />
                                <Tooltip
                                    formatter={(value) => [`${value}권`, '등록 도서 수']}
                                    labelFormatter={(label) =>
                                        `${selectedYear}년 ${selectedMonth + 1}월 ${label}일`
                                    }
                                />
                                <Bar
                                    dataKey="count"
                                    name="등록 도서 수"
                                    fill="#1b3a5c"
                                    barSize={20}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </section>

                <section className="summary-card-list">
                    <div className="summary-card">
                        <p>총 등록 도서</p>
                        <h2>{totalCount}</h2>
                    </div>

                    <div className="summary-card">
                        <p>이번 달 등록 도서</p>
                        <h2>{monthlyCount}</h2>
                    </div>

                    <div className="summary-card">
                        <p>오늘 등록 도서</p>
                        <h2>{todayCount}</h2>
                    </div>

                    <div className="summary-card">
                        <p>인기 장르</p>
                        <h2>{popularGenre}</h2>
                    </div>
                </section>
            </div>


            <div className="stats-section">
                {statsLoading && (
                    <p className="stats-message">
                        📊 통계 데이터를 불러오는 중...
                    </p>
                )}

                {statsError && (
                    <p className="stats-message error">
                        ⚠️ {statsError}
                    </p>
                )}

                {!statsLoading && !statsError && books.length === 0 && (
                    <p className="stats-message">
                        📭 통계를 표시할 도서가 없습니다.
                    </p>
                )}

                {!statsLoading && !statsError && books.length > 0 && (
                    <div className="stats-chart-wrap">
                        {ChartCard(
                            '도서 수',
                            bookCountData,
                            '권',
                            bookCountType,
                            setBookCountType
                        )}

                        {ChartCard(
                            '좋아요 수',
                            likesCountData,
                            '건',
                            likesCountType,
                            setLikesCountType
                        )}
                    </div>
                )}
            </div>
        </>
    );
}


export default BookChart;

