import React from 'react';
import BookItem from './BookItem'; // 개별 아이템 가져오기

function BookList({ books, onSelectBook, onDeleteBook }) {
  return (
    <div style={{ padding: '20px' }}>
      <h2>📖 도서 목록</h2>
      <hr />
      
      <ul style={{ padding: 0 }}>
        {books.map((book) => (
          <BookItem
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            tag={book.tag}
            coverImageUrl={book.coverImageUrl}
            onSelect={onSelectBook}
            onDelete={onDeleteBook} // 
          />
        ))}
      </ul>
    </div>
  );
}

export default BookList;