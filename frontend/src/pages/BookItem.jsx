import React from 'react';

function BookItem({ id, title, author, tag, coverImageUrl, onSelect }) {
  // 컴마(,)로 들어온 태그 문자열을 배열로 쪼갬 (예: "React,Java" -> ["React", "Java"])
  const tagsArray = tag ? tag.split(',') : [];

  return (
    <li onClick={() => onSelect(id)} style={{ cursor: 'pointer', border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
      {/* 1. 이미지 */}
      <img src={coverImageUrl} alt={title} width="100" />
      
      {/* 2. 제목 */}
      <h3>{title}</h3>
      
      {/* 3. 글쓴이 */}
      <p>글쓴이: {author}</p>
      
      {/* 4. 태그 */}
      <div>
        {tagsArray.map((t, idx) => (
          <span key={idx} style={{ marginRight: '5px' }}>#{t.trim()}</span>
        ))}
      </div>
    </li>
  );
}

export default BookItem;