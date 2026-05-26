import { useState, useEffect } from 'react';
import Header from './pages/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookRegister from './pages/BookRegister';
import Footer from './pages/Footer';
import BookMain from './pages/BookMain';
import DeletedBook from './pages/DeletedBook';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(() => localStorage.getItem('page') ?? 'main');
  const [selectedBook, setSelectedBook] = useState(null);
  const [deletedRefreshKey, setDeletedRefreshKey] = useState(0);

  // 책 목록 로드
  const loadBooks = async () => {
    const res = await fetch('http://localhost:3000/books');
    if (!res.ok) throw new Error('서버 연결 실패');
    const data = await res.json();
    setBooks(data.filter((book) => !book.deletedAt));
  };

  // 특정 책 1권 fetch
  const fetchBookById = async (id) => {
    const res = await fetch(`http://localhost:3000/books/${id}`);
    if (!res.ok) throw new Error('책 정보를 불러오지 못했습니다.');
    return res.json();
  };

  // 앱 초기 로드
  useEffect(() => {
    const init = async () => {
      try {
        await loadBooks();

        // 새로고침 복원: detail 페이지였으면 해당 책 다시 fetch
        const savedPage = localStorage.getItem('page');
        const savedBookId = localStorage.getItem('selectedBookId');
        if (savedPage === 'detail' && savedBookId) {
          const book = await fetchBookById(savedBookId);
          setSelectedBook(book);
        }
      } catch (err) {
        console.error(err);
        setError('도서 목록을 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const goToPage = (newPage, book = null) => {
    setPage(newPage);
    localStorage.setItem('page', newPage);
    if (book) {
      setSelectedBook(book);
      localStorage.setItem('selectedBookId', book.id);
    } else {
      setSelectedBook(null);
      localStorage.removeItem('selectedBookId');
    }
  };

  const handleSelectBook = async (id) => {
    try {
      const book = await fetchBookById(id);
      goToPage('detail', book);
    } catch (err) {
      console.error(err);
      alert('책 정보를 불러오지 못했습니다.');
    }
  };

  const handleGoToList = () => {
    goToPage('list');
    loadBooks().catch(console.error);
  };

  const handleGoToDeleted = () => {
    goToPage('deleted');
    setDeletedRefreshKey((prev) => prev + 1);
  };

  const handleDelete = async (book) => {
    const ok = window.confirm(`"${book.title}"을(를) 삭제 도서로 이동할까요?`);
    if (!ok) return;
    try {
      const res = await fetch(`http://localhost:3000/books/${book.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('삭제 도서 이동 실패');
      setBooks((prev) => prev.filter((item) => item.id !== book.id));
      setDeletedRefreshKey((prev) => prev + 1);
      goToPage('deleted');
      alert('삭제 도서로 이동했습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제 도서 이동에 실패했습니다.');
    }
  };

  const handleUpdate = async (updatedBook) => {
    try {
      const res = await fetch(`http://localhost:3000/books/${updatedBook.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          content: updatedBook.content,
          tag: updatedBook.tag,
          coverImageUrl: updatedBook.coverImageUrl,
          updatedAt: new Date().toISOString(),
        }),
      });
      const data = await res.json();
      setSelectedBook(data);
      setBooks((prev) => prev.map((b) => (b.id === data.id ? data : b)));
      alert('수정 완료');
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <>
      <Header onGoToList={handleGoToList} onGoToDeleted={handleGoToDeleted} onGoToMain={() => goToPage('main')} />
      <p style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>도서 정보를 불러오는 중...</p>
    </>
  );

  if (error) return (
    <>
      <Header onGoToList={handleGoToList} onGoToDeleted={handleGoToDeleted} onGoToMain={() => goToPage('main')} />
      <p style={{ textAlign: 'center', marginTop: '60px', color: '#c53030' }}>에러 발생: {error}</p>
    </>
  );

  return (
    <>
      <Header onGoToList={handleGoToList} onGoToDeleted={handleGoToDeleted} onGoToMain={() => goToPage('main')} />
      <main>
        {page === 'detail' ? (
          selectedBook
            ? <BookDetail book={selectedBook} onDelete={() => handleDelete(selectedBook)} onUpdate={handleUpdate} />
            : <p style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>도서 정보를 찾을 수 없습니다.</p>
        ) : page === 'main' ? (
          <BookMain onGoToList={handleGoToList} onGoToRegister={() => goToPage('register')} onGoToDeleted={handleGoToDeleted} onSelectBook={handleSelectBook} />
        ) : page === 'register' ? (
          <BookRegister onBack={handleGoToList} />
        ) : page === 'deleted' ? (
          <DeletedBook key={deletedRefreshKey} />
        ) : (
          <BookList books={books} onSelectBook={handleSelectBook} onDeleteBook={handleDelete} />
        )}
      </main>
      <Footer />
    </>
  );
}

export default App;
