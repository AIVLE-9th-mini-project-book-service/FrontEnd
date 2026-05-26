import { useState, useEffect } from 'react';
import Header from './pages/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookRegister from './pages/BookRegister';
import DeletedBookPage from './pages/DeletedBook';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [page, setPage] = useState('list');
  const [deletedRefreshKey, setDeletedRefreshKey] = useState(0);

  const loadBooks = async () => {
    const res = await fetch('http://localhost:3000/books');
    if (!res.ok) throw new Error('서버 연결 실패');
    const data = await res.json();
    setBooks(data.filter((book) => !book.deletedAt));
  };

  useEffect(() => {
    async function initBooks() {
      try {
        await loadBooks();
      } catch (err) {
        console.error(err);
        setError('도서 목록을 불러오지 못했습니다.');
      }
      setLoading(false);
    }
    initBooks();
  }, []);

  const handleSelectBook = (id) => {
    setSelectedBookId(id);
  };

  const handleGoToList = () => {
    setSelectedBookId(null);
    setPage('list');
    loadBooks().catch((err) => {
      console.error(err);
      setError('도서 목록을 불러오지 못했습니다.');
    });
  };

  const handleGoToDeleted = () => {
    setSelectedBookId(null);
    setDeletedRefreshKey((prev) => prev + 1);
    setPage('deleted');
  };
  
  const handleDelete = async (book) => {
    const targetBook = books.find((b) => b.id === book.id) ?? book;
    const ok = window.confirm(`"${targetBook.title}"을(를) 삭제 도서로 이동할까요?`);
    if (!ok) return;

    try {
      const res = await fetch(`http://localhost:3000/books/${targetBook.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          deletedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
      });

      if (!res.ok) throw new Error('삭제 도서 이동 실패');

      setBooks((prev) => prev.filter((item) => item.id !== targetBook.id));
      setSelectedBookId(null);
      setDeletedRefreshKey((prev) => prev + 1);
      setPage('deleted');
      alert('삭제 도서로 이동했습니다.');
    } catch (err) {
      console.error(err);
      alert('삭제 도서 이동에 실패했습니다.');
    }
  };

const handleUpdate = async (updatedBook) => {

  try {
    const now = new Date();
    const res = await fetch(
      `http://localhost:3000/books/${updatedBook.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: updatedBook.title,
          author: updatedBook.author,
          genre: updatedBook.genre,
          content: updatedBook.content,
          tag: updatedBook.tag,
          coverImageUrl: updatedBook.coverImageUrl,
          updatedAt: now
        })
      }
    );
    const data = await res.json();
    // books 상태 업데이트
    setBooks(prev =>
      prev.map(book =>
        book.id === data.id ? data : book
      )
    );
    alert('수정 완료');
  } catch (err) {
    console.error(err);
  }
};

  if (loading) return <><Header onGoToList={handleGoToList} onGoToDeleted={handleGoToDeleted} /><p>도서 정보를 불러오는 중...</p></>;
  if (error) return <><Header onGoToList={handleGoToList} onGoToDeleted={handleGoToDeleted} /><p>에러 발생: {error}</p></>;

  const selectedBook = books.find(b => b.id === selectedBookId);

  return (
    <>
      <Header onGoToList={handleGoToList} onGoToDeleted={handleGoToDeleted} />

      <main>
        {page === 'register' ? (
          <BookRegister onBack={handleGoToList} />
        ) : page === 'deleted' ? (
          <DeletedBookPage key={deletedRefreshKey} />
        ) : selectedBook ? (
          <BookDetail book={selectedBook} onBack={handleGoToList} onDelete={() => handleDelete(selectedBook)} 
            onUpdate={handleUpdate}/>
        ) : (
          <>
            <button onClick={() => setPage('register')}>+ 도서 등록</button>
            <BookList books={books} onSelectBook={handleSelectBook} onDeleteBook={handleDelete} />
          </>
        )}
      </main>
    </>
  );
}

export default App;