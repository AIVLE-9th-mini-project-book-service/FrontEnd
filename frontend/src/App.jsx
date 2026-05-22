<<<<<<< HEAD
import { useState, useEffect } from 'react'
import BookEdit from './pages/BookEdit'
import './App.css'
=======
import { useState, useEffect } from 'react';
import Header from './pages/Header';
import BookList from './pages/BookList';
import BookDetail from './pages/BookDetail';
import BookRegister from './pages/BookRegister';
>>>>>>> origin/main

const JSON_SERVER_URL = 'http://localhost:3000'

function App() {
<<<<<<< HEAD
  const [books, setBooks] = useState([])

  // 컴포넌트 마운트 시 도서 목록 불러오기
  useEffect(() => {
    fetch(`${JSON_SERVER_URL}/books`)
      .then((res) => res.json())
      .then((data) => setBooks(data))
      .catch(() => alert('도서 목록을 불러오는데 실패했습니다.'))
  }, [])

  /**
   * 특정 도서의 coverImageUrl을 PATCH로 저장하고 화면 즉시 반영
   * @param {number} bookId - 업데이트할 도서 id
   * @param {string} imageSrc - Data URL 형태의 이미지
   */
  async function updateBookCover(bookId, imageSrc) {
    const res = await fetch(`${JSON_SERVER_URL}/books/${bookId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ coverImageUrl: imageSrc }),
    })
    if (!res.ok) throw new Error('json-server 저장 실패')

    // 불변성 map 패턴으로 화면 즉시 반영
    setBooks((prev) =>
      prev.map((b) =>
        b.id === bookId ? { ...b, coverImageUrl: imageSrc } : b
      )
    )
  }

  return (
    <div className="app">
      {books.map((book) => (
        <BookEdit
          key={book.id}
          book={book}
          onCoverUpdate={updateBookCover}
        />
      ))}
    </div>
  )
}

export default App
=======
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBookId, setSelectedBookId] = useState(null);
  const [page, setPage] = useState("list");

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch('http://localhost:3000/books');
        if (!res.ok) throw new Error('서버 연결 실패');
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        console.error(err);
        setError('도서 목록을 불러오지 못했습니다.');
      }
      setLoading(false);
    }
    loadBooks();
  }, []);

  const handleSelectBook = (id) => {
    setSelectedBookId(id);
  };

  const handleGoToList = () => {
    setSelectedBookId(null);
    setPage("list");
    
    fetch('http://localhost:3000/books')
      .then((res) => res.json())
      .then((data) => setBooks(data));
  };
  
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:3000/books/${id}`, {
        method: 'DELETE'
      });
      alert('삭제 완료');
      handleGoToList();
    } catch (err) {
      console.error(err);
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

  if (loading) return <><Header /><p>도서 정보를 불러오는 중...</p></>;
  if (error) return <><Header /><p>에러 발생: {error}</p></>;

  const selectedBook = books.find(b => b.id === selectedBookId);

  return (
    <>
      <Header />

      <main>
        {page === "register" ? (
          <BookRegister onBack={handleGoToList} />
        ) : selectedBook ? (
          <BookDetail book={selectedBook} onBack={handleGoToList} onDelete={() => handleDelete(selectedBook.id)} 
            onUpdate={handleUpdate}/>
        ) : (
          <>
            <button onClick={() => setPage("register")}>+ 도서 등록</button>
            <BookList books={books} onSelectBook={handleSelectBook} />
          </>
        )}
      </main>
    </>
  );
}

export default App;
>>>>>>> origin/main
