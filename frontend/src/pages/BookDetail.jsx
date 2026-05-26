import  { useState } from 'react';

function BookDetail({ book, onBack, onDelete, onUpdate }) {
  const tagsArray = book.tag ? book.tag.split(',') : [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.author);
  const [editGenre, setEditGenre] = useState(book.genre);
  const [editContent, setEditContent] = useState(book.content);
  const [editTag, setEditTag] = useState(book.tag);
  const [editImageUrl, setEditImageUrl] = useState(book.coverImageUrl);

  const GENRE_LIST = ["소설", "고전", "역사", "IT", "동화", "자기계발", "과학", "경제", "철학", "예술"]; 
  const TAG_LIST = ["한국문학", "고전문학", "개발/프로그래밍", "역사/인문", "고전/동화", "베스트셀러", "추천도서", "과학/기술"];


const handleSubmitUpdate = () => {
  onUpdate({
    id: book.id,
    title: editTitle,
    author: editAuthor,
    genre: editGenre,
    content: editContent,
    tag: editTag,
    coverImageUrl: editImageUrl
  });
  setIsEditMode(false);
};

  return (
    <div>
      <button onClick={onBack}>
        ← 목록으로 돌아가기
      </button>
      <div>
        {/* 이미지 */}
        <div>
          {isEditMode ? (
            <input
              type="text"
              placeholder="이미지 URL"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
            />
          ) : (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              width="200"
            />
          )}

          <p>❤️ 추천 수: {book.likes}개</p>
        </div>
        {/* 장르 */}
        <div>
          {isEditMode ? (
    <select
      value={editGenre}
      onChange={(e) => setEditGenre(e.target.value)}
      >
      {GENRE_LIST.map((genre) => (
      <option
      key={genre}
      value={genre}
      >
      {genre}
    </option>
  ))}
</select>
          ) : (
            <span>[{book.genre}]</span>
          )}
        </div>
        {/* 제목 */}
        <div>
          {isEditMode ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
          ) : (
            <h2>{book.title}</h2>
          )}
        </div>
        {/* 작성자 */}
        <div>
          {isEditMode ? (
            <input
              type="text"
              value={editAuthor}
              onChange={(e) => setEditAuthor(e.target.value)}
            />
          ) : (
            <p>저자: {book.author}</p>
          )}
        </div>
        {/* 등록일 */}
        <p>
          등록일:
          {book.createdAt
            ? book.createdAt.split('T')[0]
            : ''}
        </p>
        {/* 태그 */}
        <div>
          {isEditMode ? (
            <select
             value={editTag}
            onChange={(e) => setEditTag(e.target.value)}
            >
            {TAG_LIST.map((tag) => (
          <option
          key={tag}
          value={tag}
          >
      {tag}
    </option>
  ))}
</select>
          ) : (
            tagsArray.map((t, idx) => (
              <span
                key={idx}
                style={{ marginRight: '5px' }}
              >
                #{t.trim()}
              </span>
            ))
          )}

        </div>
        {/* 도서 내용 */}
        <div style={{ marginTop: '20px' }}>
          <h4>도서 내용</h4>
          {isEditMode ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows="10"
              cols="50"
            />
          ) : (
            <p style={{ whiteSpace: 'pre-wrap' }}>
              {book.content}
            </p>
          )}
        </div>
        {/* 버튼 */}
        <div style={{ marginTop: '20px' }}>
          {!isEditMode ? (
            <button
              onClick={() => setIsEditMode(true)}
            >
              게시글 수정
            </button>
          ) : (
            <button
              onClick={handleSubmitUpdate}
            >
              수정 완료
            </button>
          )}

          <button onClick={onDelete}>
            게시글 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookDetail;