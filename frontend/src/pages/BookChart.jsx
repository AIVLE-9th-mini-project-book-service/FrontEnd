import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';

import {
    PieChart, Pie, Cell,
    BarChart, Bar, XAxis, YAxis,
    CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';

function BookChart() {
    const [bookCountType, setBookCountType] = useState('genre');
    const [likesCountType, setLikesCountType] = useState('genre');
    const [bookChartType, setBookChartType] = useState('pie');
    const [likesChartType, setLikesChartType] = useState('pie');
    const [books, setBooks] = useState([]);
    const [countData, setCountData] = useState({});
    const [likesData, setLikesData] = useState({});
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    const bookUrl = '/books';
    const bookCountUrl = '/books/statistics/count';
    const likesCountUrl = '/books/statistics/likes';

    useEffect(() => {
        fetch(bookUrl)
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

    useEffect(() => {
        fetch(bookCountUrl)
            .then((res) => res.json())
            .then((data) => {
                console.log("countData", data);
                setCountData(data);
            });

        fetch(likesCountUrl)
            .then((res) => res.json())
            .then((data) => {
                console.log("likesData", data);
                setLikesData(data);
            });
    }, []);

    const colors = ['#3ba4f6', '#6b4fd6', '#a78bfa', '#2f5673', '#f5a623'];

    const getTags = (tag) => {
        if (Array.isArray(tag)) return tag;
        if (typeof tag === 'string' && tag.trim()) return tag.split(',');
        return [];
    };

    const getBookCountByGenre = () => {
        const result = {};
        books.forEach((book) => { result[book.genre] = (result[book.genre] || 0) + 1; });
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

    const getLikesCountByGenre = () => {
        const result = {};

        books.forEach((book) => {
            const genre = book.genre || "기타";
            const likes = Number(book.likes) || 0;

            result[genre] = (result[genre] || 0) + likes;
        });

        return Object.entries(result).map(([name, value]) => ({ name, value }));
    };

    const getLikesCountByTag = () => {
        const result = {};

        books.forEach((book) => {
            const likes = Number(book.likes) || 0;

            getTags(book.tag).forEach((tag) => {
                const trimTag = tag.trim();
                if (!trimTag) return;

                result[trimTag] = (result[trimTag] || 0) + likes;
            });
        });

        return Object.entries(result).map(([name, value]) => ({ name, value }));
    };
    const makeChartData = (data, type) => {
        const selectedData = data[type] || {};

        return Object.entries(selectedData).map(([name, value]) => ({
            name,
            value: Number(value) || 0,
        }));
    };


    const ChartCard = (title, data, chartType, setChartType, unit, selectedType, setSelectedType) => {
        const total = data.reduce((sum, item) => sum + item.value, 0);

        return (
            <div className="chart-card">
                <div className="chart-top">
                    <div>
                        <h3>{title}</h3>
                        <p>총 <strong>{total.toLocaleString()}</strong>{unit}</p>
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
                                    <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
                                        {data.map((_, index) => (
                                            <Cell key={index} fill={colors[index % colors.length]} />
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
                                        <b style={{ color: colors[index % colors.length] }}>•</b>
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

    const bookCountData = makeChartData(countData, bookCountType);
    const likesCountData = makeChartData(likesData, likesCountType);

    if (statsLoading) return (
        <section className="stats-section">
            <h2>도서 통계</h2>
            <p style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>📊 통계 데이터를 불러오는 중...</p>
        </section>
    );

    if (statsError) return (
        <section className="stats-section">
            <h2>도서 통계</h2>
            <p style={{ textAlign: 'center', padding: '40px 0', color: '#c53030' }}>⚠️ {statsError}</p>
        </section>
    );

    if (books.length === 0) return (
        <section className="stats-section">
            <h2>도서 통계</h2>
            <p style={{ textAlign: 'center', padding: '40px 0', color: '#888' }}>📭 통계를 표시할 도서가 없습니다.</p>
        </section>
    );

    return (
        <section className="stats-section">
            <h2>도서 통계</h2>
            <div className="stats-chart-wrap">
                {ChartCard('도서 수', bookCountData, bookChartType, setBookChartType, '권', bookCountType, setBookCountType)}
                {ChartCard('좋아요 수', likesCountData, likesChartType, setLikesChartType, '건', likesCountType, setLikesCountType)}
            </div>
        </section>
    );
}


export default BookChart;
