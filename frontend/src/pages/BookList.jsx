// import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

const initialBooks = [
  {
    id: 1,
    title: "어린 왕자",
    author: "앙투안 드 생텍쥐페리",
    firstSentence: "다른 사람들에게는 결코 보여주지 않았던 나의 첫 번째 그림을 보여주었다.",
    coverImage: "https://via.placeholder.com/120x160?text=The+Little+Prince",
    likes: 15,
  },
  {
    id: 2,
    title: "데미안",
    author: "헤르만 헤세",
    firstSentence: "내 속에서 솟아 나오려는 것, 바로 그것을 나는 살아보려고 했다.",
    coverImage: "https://via.placeholder.com/120x160?text=Demian",
    likes: 24,
  },
];

function BookList() {
  const [books, setBooks] = useState(initialBooks);
  const [searchTerm, setSearchTerm] = useState("");

  // 추천(좋아요) 버튼 클릭 시 카운트 증가 함수
  const handleLike = (id) => {
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, likes: book.likes + 1 } : book
      )
    );
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>도서 목록 페이지</h1>

      <div style={styles.searchBar}>
        <Input
          name="search"
          placeholder="제목 또는 작가를 입력하세요..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.input}
        />
        <Button 
          label="검색" 
          onClick={() => alert(`'${searchTerm}' 검색 결과입니다.`)} 
          style={styles.searchButton}
        />
      </div>

      <div style={styles.bookList}>
        {filteredBooks.map((book) => (
          <div key={book.id} style={styles.bookCard}>
            <img
              src={book.coverImage}
              alt={`${book.title} 표지`}
              style={styles.coverImage}
            />
            
            <div style={styles.bookInfo}>
              <h3 style={styles.bookTitle}>{book.title}</h3>
              <p style={styles.bookAuthor}>작가: {book.author}</p>
              <p style={styles.firstSentence}>
                <em>"{book.firstSentence}"</em>
              </p>
              
              <Button
                label={`👍 추천 (${book.likes})`}
                onClick={() => handleLike(book.id)}
                style={styles.likeButton}
              />
            </div>
          </div>
        ))}
        {filteredBooks.length === 0 && (
          <p style={styles.noResult}>검색 결과와 일치하는 도서가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif" },
  pageTitle: { textAlign: "center", marginBottom: "25px", color: "#333" },
  searchBar: { display: "flex", gap: "10px", marginBottom: "30px" },
  input: { flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc", fontSize: "14px" },
  searchButton: { padding: "10px 20px", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  bookList: { display: "flex", flexDirection: "column", gap: "20px" },
  bookCard: { display: "flex", border: "1px solid #eaeaea", padding: "20px", borderRadius: "8px", gap: "20px", backgroundColor: "#f9f9f9" },
  coverImage: { width: "120px", height: "160px", objectFit: "cover", borderRadius: "4px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  bookInfo: { flex: 1, display: "flex", flexDirection: "column", gap: "8px", justifyContent: "center" },
  bookTitle: { margin: 0, fontSize: "20px", color: "#222" },
  bookAuthor: { margin: 0, color: "#666", fontSize: "14px" },
  firstSentence: { margin: "5px 0 10px 0", color: "#555", fontStyle: "italic", fontSize: "14px", backgroundColor: "#fff", padding: "8px", borderRadius: "4px", borderLeft: "3px solid #007bff" },
  likeButton: { alignSelf: "flex-start", backgroundColor: "#007bff", color: "#fff", border: "none", padding: "8px 14px", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" },
  noResult: { textAlign: "center", color: "#999", padding: "20px" }
};

export default BookList;