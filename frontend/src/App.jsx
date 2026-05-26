import { useState, useEffect } from 'react';
import Header from './pages/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookRegister from './pages/BookRegister';
import BookEdit from './pages/BookEdit';
import Footer from './pages/Footer';
import BookMain from './pages/BookMain';
import DeletedBook from './pages/DeletedBook';
import BookFinder from './pages/BookFinder';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedBookId, setSelectedBookId] = useState(null);

  // 현재 페이지 상태
  const [page, setPage] = useState('main');

  const [deletedRefreshKey, setDeletedRefreshKey] = useState(0);

  const bookUrl= 'http://localhost:3000/books';

  const loadBooks = async () => {
    const res = await fetch(bookUrl);

    if (!res.ok) {
      throw new Error('서버 연결 실패');
    }

    const data = await res.json();

    setBooks(
      data.filter((book) => !book.deletedAt)
    );
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

  // 도서 상세 페이지 이동
  const handleSelectBook = (id) => {
    setSelectedBookId(id);
    setPage('detail');
  };

  // 도서 목록 이동
  const handleGoToList = () => {
    setSelectedBookId(null);

    setPage('list');

    loadBooks().catch((err) => {
      console.error(err);
      setError('도서 목록을 불러오지 못했습니다.');
    });
  };

  // 메인 페이지 이동
  const handleGoToMain = () => {
    setSelectedBookId(null);
    setPage('main');
  };

  // 도서 검색 페이지 이동
  const handleGoToFinder = () => {
    setSelectedBookId(null);
    setPage('finder');
  };

  // 수정 페이지 이동
  const handleGoToEdit = () => {
    setPage('edit');
  };

  // 수정 완료 후 상태 반영
  const handleSaveBook = (updatedBook) => {
    setBooks((prev) =>
      prev.map((book) => book.id === updatedBook.id ? updatedBook : book)
    );
    setPage('detail');
  };

  // 커버 이미지 업데이트
  const handleCoverUpdate = async (bookId, imageSrc) => {
    try {
      const res = await fetch(bookUrl+`/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coverImageUrl: imageSrc }),
      });
      const data = await res.json();
      setBooks((prev) =>
        prev.map((book) => book.id === data.id ? data : book)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // 삭제 도서 페이지 이동
  const handleGoToDeleted = () => {
    setSelectedBookId(null);

    setDeletedRefreshKey((prev) => prev + 1);

    setPage('deleted');
  };

  const handleDelete = async (book) => {
    const targetBook =
      books.find((b) => b.id === book.id) ?? book;

    const ok = window.confirm(
      `"${targetBook.title}"을(를) 삭제 도서로 이동할까요?`
    );

    if (!ok) return;

    try {
      const res = await fetch(
        bookUrl+`/${targetBook.id}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            deletedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      );

      if (!res.ok) {
        throw new Error('삭제 도서 이동 실패');
      }

      setBooks((prev) =>
        prev.filter((item) => item.id !== targetBook.id)
      );

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
        bookUrl+`/${updatedBook.id}`,
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

      setBooks((prev) =>
        prev.map((book) =>
          book.id === data.id ? data : book
        )
      );

      alert('수정 완료');
    } catch (err) {
      console.error(err);
    }
  };

  // 로딩 화면
  if (loading) {
    return (
      <>
        <Header
          onGoToMain={handleGoToMain}
          onGoToFinder={handleGoToFinder}
        />

        <p>도서 정보를 불러오는 중...</p>
      </>
    );
  }

  // 에러 화면
  if (error) {
    return (
      <>
        <Header
          onGoToMain={handleGoToMain}
          onGoToFinder={handleGoToFinder}
        />

        <p>에러 발생: {error}</p>
      </>
    );
  }

  const selectedBook =
    books.find((b) => b.id === selectedBookId);

  return (
    <>
      <Header
        onGoToMain={handleGoToMain}
        onGoToFinder={handleGoToFinder}
      />

      <main>

        {page === 'detail' && selectedBook ? (

          <BookDetail
            book={selectedBook}
            onBack={handleGoToList}
            onDelete={() => handleDelete(selectedBook)}
            onUpdate={handleUpdate}
            onEdit={handleGoToEdit}
          />

        ) : page === 'main' ? (

          <BookMain
            onGoToList={handleGoToList}
            onGoToRegister={() => setPage('register')}
            onGoToDeleted={handleGoToDeleted}
            onSelectBook={handleSelectBook}
          />

        ) : page === 'finder' ? (

          <BookFinder
            onSelectBook={handleSelectBook}
          />

        ) : page === 'edit' && selectedBook ? (

          <BookEdit
            book={selectedBook}
            onCoverUpdate={handleCoverUpdate}
            onBack={() => setPage('detail')}
            onSave={handleSaveBook}
          />

        ) : page === 'register' ? (

          <BookRegister
            onBack={handleGoToList}
          />

        ) : page === 'deleted' ? (

          <DeletedBook
            key={deletedRefreshKey}
          />

        ) : (

          <BookList
            books={books}
            onSelectBook={handleSelectBook}
            onDeleteBook={handleDelete}
          />

        )}
      </main>

      <Footer />
    </>
  );
}

export default App;