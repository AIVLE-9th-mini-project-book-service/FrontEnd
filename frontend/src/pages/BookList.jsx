import { useState, useEffect } from "react";
import noCover from "../img/no-cover.svg";
import Button from "../components/Button";
import Input from "../components/Input";

function BookList({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const bookUrl = 'http://localhost:3000/books';

  // 컴포넌트 로드 시 서버에서 데이터를 가져오는 로직 추가
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(bookUrl);
        
        if (!res.ok) {
          throw new Error("서버 응답 오류");
        }
        
        const data = await res.json();
        setBooks(data);
        
      } catch (error) {
        console.error("도서 목록 로딩 실패:", error);
        alert("검색 결과를 불러오지 못했습니다.");
      }
    };

    fetchBooks();
  }, []);

  // 추천 카운트 증가 함수 (서버 반영 버전)
  const handleLike = async (id, currentLikes) => {
    try {
      const res = await fetch(bookUrl+`/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: currentLikes + 1 }),
      });

      if (!res.ok) throw new Error("좋아요 반영 실패");

      // 로컬 state 업데이트
      setBooks(
        books.map((book) =>
          book.id === id ? { ...book, likes: book.likes + 1 } : book
        )
      );
    } catch (error) {
      console.error(error);
      alert("처리에 실패했습니다.");
    }
  };

  const filteredBooks = books.filter(
    (book) =>
      (book.title?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (book.author?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="book-list-container">
      <h1 className="book-list-title">도서 목록 페이지</h1>

      <div className="book-list-search-bar">
        <Input
          name="search"
          placeholder="제목 또는 작가를 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="book-list-search-input"
        />
        <Button
          label="검색"
          onClick={() => alert(`'${searchTerm}' 검색 결과입니다.`)}
          className="book-list-search-btn"
        />
      </div>

      <div className="book-list-grid">
        {filteredBooks.map((book) => (
          <div key={book.id} className="book-list-card">
            <img
              src={book.coverImageUrl || book.coverImage || noCover}
              alt={`${book.title} 표지`}
              className="book-list-cover"
              onClick={() => onSelectBook(book.id)}
              style={{ cursor: "pointer" }}
            />
            <div className="book-list-info">
              <h3 className="book-list-name">{book.title}</h3>
              <p className="book-list-author">작가: {book.author}</p>
              <p className="book-list-description">
                <em>"{book.content || book.firstSentence || "등록된 소개글이 없습니다."}"</em>
              </p>
              <Button
                label={`👍 추천 (${book.likes || 0})`}
                onClick={() => handleLike(book.id, book.likes || 0)}
                className="book-list-like-btn"
              />
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <p className="book-list-no-result">검색 결과와 일치하는 도서가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default BookList;