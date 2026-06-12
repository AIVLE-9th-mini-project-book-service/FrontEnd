import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import noCover from '../img/no-cover.svg';

function MyPage() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const token = localStorage.getItem('accessToken');

    const [myInfo, setMyInfo] = useState(null);
    const [myBooks, setMyBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                const [infoRes, booksRes] = await Promise.all([
                    fetch('/api/members/me', {
                        headers: { 'Authorization': `Bearer ${token}` },
                    }),
                    fetch('/api/books/my', {
                        headers: { 'Authorization': `Bearer ${token}` },
                    }),
                ]);

                if (!infoRes.ok) throw new Error('내 정보를 불러오지 못했습니다.');
                if (!booksRes.ok) throw new Error('내 도서를 불러오지 못했습니다.');

                const info = await infoRes.json();
                const books = await booksRes.json();

                setMyInfo(info);
                setMyBooks(books);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return (
        <p style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
            불러오는 중...
        </p>
    );

    if (error) return (
        <p style={{ textAlign: 'center', marginTop: '60px', color: '#e53e3e' }}>
            {error}
        </p>
    );

    return (
        <div style={styles.page}>

            {/* 내 정보 카드 */}
            <div style={styles.infoCard}>
                <div style={styles.avatar}>
                    {myInfo?.name?.charAt(0) ?? '?'}
                </div>
                <div style={styles.infoContent}>
                    <h2 style={styles.name}>{myInfo?.name}</h2>
                    <p style={styles.email}>{myInfo?.email}</p>
                    <p style={styles.bookCount}>등록한 도서 {myBooks.length}권</p>
                </div>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                    로그아웃
                </button>
            </div>

            {/* 내가 등록한 책 */}
            <div style={styles.section}>
                <h3 style={styles.sectionTitle}>내가 등록한 도서</h3>

                {myBooks.length === 0 ? (
                    <div style={styles.empty}>
                        <p style={styles.emptyIcon}>📚</p>
                        <p>아직 등록한 도서가 없습니다.</p>
                        <button style={styles.registerBtn} onClick={() => navigate('/books/register')}>
                            도서 등록하기
                        </button>
                    </div>
                ) : (
                    <div style={styles.grid}>
                        {myBooks.map((book) => (
                            <div
                                key={book.id}
                                style={styles.card}
                                onClick={() => navigate(`/books/${book.id}`)}
                            >
                                <img
                                    src={book.coverImageUrl || noCover}
                                    alt={book.title}
                                    style={styles.cover}
                                    onError={(e) => { e.target.src = noCover; }}
                                />
                                <div style={styles.cardInfo}>
                                    <p style={styles.cardTitle}>{book.title}</p>
                                    <p style={styles.cardAuthor}>{book.author}</p>
                                    <span style={styles.cardGenre}>{book.genre}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

const styles = {
    page: { maxWidth: '900px', margin: '40px auto', padding: '0 20px' },

    infoCard: {
        display: 'flex', alignItems: 'center', gap: '24px',
        backgroundColor: '#fff', borderRadius: '12px',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
        padding: '32px', marginBottom: '40px',
    },
    avatar: {
        width: '72px', height: '72px', borderRadius: '50%',
        backgroundColor: '#1D9E75', color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '28px', fontWeight: 'bold', flexShrink: 0,
    },
    infoContent: { flex: 1 },
    name: { fontSize: '22px', fontWeight: 'bold', color: '#111', margin: '0 0 6px' },
    email: { fontSize: '14px', color: '#888', margin: '0 0 6px' },
    bookCount: { fontSize: '14px', color: '#1D9E75', fontWeight: '600', margin: 0 },
    logoutBtn: {
        padding: '10px 20px', backgroundColor: '#fff', color: '#e53e3e',
        border: '1px solid #e53e3e', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
        flexShrink: 0,
    },

    section: { backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: '32px' },
    sectionTitle: { fontSize: '18px', fontWeight: 'bold', color: '#111', margin: '0 0 24px' },

    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '20px',
    },
    card: {
        cursor: 'pointer', borderRadius: '10px', overflow: 'hidden',
        border: '1px solid #eee', transition: 'transform 0.2s, box-shadow 0.2s',
        backgroundColor: '#fafafa',
    },
    cover: { width: '100%', aspectRatio: '3/4', objectFit: 'cover', display: 'block' },
    cardInfo: { padding: '10px 12px' },
    cardTitle: { fontSize: '14px', fontWeight: 'bold', color: '#111', margin: '0 0 4px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' },
    cardAuthor: { fontSize: '12px', color: '#888', margin: '0 0 6px' },
    cardGenre: {
        display: 'inline-block', padding: '2px 8px',
        backgroundColor: '#E1F5EE', color: '#085041',
        borderRadius: '99px', fontSize: '11px', fontWeight: '600',
    },

    empty: { textAlign: 'center', padding: '60px 0', color: '#888' },
    emptyIcon: { fontSize: '48px', marginBottom: '12px' },
    registerBtn: {
        marginTop: '16px', padding: '10px 24px',
        backgroundColor: '#1D9E75', color: '#fff',
        border: 'none', borderRadius: '8px',
        fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    },
};

export default MyPage;