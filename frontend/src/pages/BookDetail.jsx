import { useState, useEffect } from 'react';
import noCover from '../img/no-cover.svg';

const GENRE_LIST = ["소설", "고전", "역사", "IT", "동화", "자기계발", "과학", "경제", "철학", "예술"];
const TAG_LIST = ["한국문학", "고전문학", "개발/프로그래밍", "역사/인문", "고전/동화", "베스트셀러", "추천도서", "과학/기술"];

function BookDetail({ book, onDelete, onUpdate }) {
  const tagsArray = book.tag ? book.tag.split(',').filter(Boolean) : [];

  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(book.title);
  const [editAuthor, setEditAuthor] = useState(book.author);
  const [editGenre, setEditGenre] = useState(book.genre);
  const [editContent, setEditContent] = useState(book.content);
  const [editTag, setEditTag] = useState(book.tag);
  const [editImageUrl, setEditImageUrl] = useState(book.coverImageUrl);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentPassword, setCommentPassword] = useState('');
  const [commentLoading, setCommentLoading] = useState(true);

  // 수정/삭제 비밀번호 확인 UI 상태 { id, mode: 'edit'|'delete', pw, editText }
  const [pwPrompt, setPwPrompt] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentLoading(true);
      try {
        // json-server v1 쿼리 파라미터 타입 불일치 방지 → 전체 조회 후 클라이언트 필터링
        const res = await fetch(`http://localhost:3000/comments`);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        const filtered = data.filter(
          (c) => String(c.bookId) === String(book.id)
        );
        setComments(filtered);
      } catch (err) {
        console.error('댓글을 불러오지 못했습니다.', err);
      } finally {
        setCommentLoading(false);
      }
    };
    fetchComments();
  }, [book.id]);

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const newComment = {
      bookId: book.id,
      author: commentAuthor.trim() || '익명',
      text: commentText.trim(),
      password: commentPassword,          // 비밀번호 저장
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComment),
      });
      if (!res.ok) throw new Error();
      const saved = await res.json();
      setComments((prev) => [...prev, saved]);
      setCommentText('');
      setCommentAuthor('');
      setCommentPassword('');
    } catch {
      alert('댓글 등록에 실패했습니다.');
    }
  };

  // 수정/삭제 버튼 클릭 → 비밀번호 입력 UI 열기
  const openPwPrompt = (comment, mode) => {
    setPwPrompt({ id: comment.id, mode, pw: '', editText: comment.text, storedPw: comment.password });
  };

  const closePwPrompt = () => setPwPrompt(null);

  const handlePwConfirm = async () => {
    if (pwPrompt.pw !== pwPrompt.storedPw) {
      alert('비밀번호가 올바르지 않습니다.');
      return;
    }
    if (pwPrompt.mode === 'delete') {
      try {
        const res = await fetch(`http://localhost:3000/comments/${pwPrompt.id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        setComments((prev) => prev.filter((c) => c.id !== pwPrompt.id));
        closePwPrompt();
      } catch {
        alert('댓글 삭제에 실패했습니다.');
      }
    } else {
      try {
        const res = await fetch(`http://localhost:3000/comments/${pwPrompt.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: pwPrompt.editText }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setComments((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        closePwPrompt();
      } catch {
        alert('댓글 수정에 실패했습니다.');
      }
    }
  };

  const handleSubmitUpdate = () => {
    onUpdate({
      id: book.id,
      title: editTitle,
      author: editAuthor,
      genre: editGenre,
      content: editContent,
      tag: editTag,
      coverImageUrl: editImageUrl,
    });
    setIsEditMode(false);
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* 상단 버튼 */}
        <div style={styles.buttonRow}>
          {!isEditMode ? (
            <button style={styles.editBtn} onClick={() => setIsEditMode(true)}>수정</button>
          ) : (
            <button style={styles.saveBtn} onClick={handleSubmitUpdate}>✅ 수정 완료</button>
          )}
          <button style={styles.deleteBtn} onClick={onDelete}>삭제</button>
        </div>

        {/* 이미지 + 정보 가로 배치 */}
        <div style={styles.topSection}>

          {/* 이미지 */}
          <div style={styles.coverWrap}>
            {isEditMode ? (
              <input
                type="text"
                placeholder="이미지 URL"
                value={editImageUrl}
                onChange={(e) => setEditImageUrl(e.target.value)}
                style={styles.input}
              />
            ) : (
              <img
                src={book.coverImageUrl || noCover}
                alt={book.title}
                style={styles.coverImg}
              />
            )}
          </div>

          {/* 텍스트 정보 */}
          <div style={styles.infoCol}>

            {/* 제목 + 좋아요 */}
            {isEditMode ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                style={{ ...styles.input, fontSize: '20px', fontWeight: 'bold' }}
              />
            ) : (
              <div style={styles.titleRow}>
                <h2 style={styles.title}>{book.title}</h2>
                <span style={styles.likes}>❤️ {book.likes ?? 0}</span>
              </div>
            )}

            {/* 저자 */}
            {isEditMode ? (
              <input
                type="text"
                value={editAuthor}
                onChange={(e) => setEditAuthor(e.target.value)}
                style={styles.input}
              />
            ) : (
              <p style={styles.author}>저자: {book.author}</p>
            )}

            {/* 장르 */}
            {isEditMode ? (
              <select
                value={editGenre}
                onChange={(e) => setEditGenre(e.target.value)}
                style={styles.select}
              >
                {GENRE_LIST.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            ) : (
              <span style={styles.genreBadge}>{book.genre}</span>
            )}

            {/* 태그 */}
            {isEditMode ? (
              <select
                value={editTag}
                onChange={(e) => setEditTag(e.target.value)}
                style={styles.select}
              >
                {TAG_LIST.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ) : (
              <div style={styles.tagRow}>
                {tagsArray.map((t, idx) => (
                  <span key={idx} style={styles.tag}>#{t.trim()}</span>
                ))}
              </div>
            )}

            {/* 도서 내용 */}
            <div style={styles.contentSection}>
              <h4 style={styles.contentTitle}>도서 내용</h4>
              {isEditMode ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  rows={6}
                  style={styles.textarea}
                />
              ) : (
                <p style={styles.content}>{book.content}</p>
              )}
            </div>

            {/* 등록일 / 수정일 */}
            <div style={styles.dateWrap}>
              <p style={styles.date}>등록일: {book.createdAt ? book.createdAt.split('T')[0] : '-'}</p>
              <p style={styles.date}>수정일: {book.updatedAt ? book.updatedAt.split('T')[0] : '-'}</p>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 - 수정 모드일 때 숨김 */}
        {!isEditMode && <div style={styles.commentSection}>
          <h3 style={styles.commentTitle}>💬 댓글 {comments.length > 0 && <span style={styles.commentCount}>{comments.length}</span>}</h3>

          {/* 댓글 목록 */}
          {commentLoading ? (
            <p style={styles.commentEmpty}>댓글을 불러오는 중...</p>
          ) : comments.length === 0 ? (
            <p style={styles.commentEmpty}>아직 댓글이 없습니다. 첫 댓글을 남겨보세요!</p>
          ) : (
            <ul style={styles.commentList}>
              {comments.map((c) => (
                <li key={c.id} style={styles.commentItem}>
                  <div style={styles.commentHeader}>
                    <span style={styles.commentAuthor}>{c.author}</span>
                    <span style={styles.commentDate}>{c.createdAt?.split('T')[0]}</span>
                    <button style={styles.commentActionBtn} onClick={() => openPwPrompt(c, 'edit')}>수정</button>
                    <button style={{ ...styles.commentActionBtn, color: '#e53e3e' }} onClick={() => openPwPrompt(c, 'delete')}>삭제</button>
                  </div>

                  {/* 비밀번호 확인 + 수정 UI */}
                  {pwPrompt?.id === c.id ? (
                    <div style={styles.pwBox}>
                      {pwPrompt.mode === 'edit' && (
                        <textarea
                          value={pwPrompt.editText}
                          onChange={(e) => setPwPrompt((p) => ({ ...p, editText: e.target.value }))}
                          rows={2}
                          style={{ ...styles.commentTextarea, marginBottom: '8px' }}
                        />
                      )}
                      {pwPrompt.mode === 'delete' && (
                        <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0' }}>이 댓글을 삭제하려면 비밀번호를 입력하세요.</p>
                      )}
                      <div style={styles.pwRow}>
                        <input
                          type="password"
                          placeholder="비밀번호"
                          value={pwPrompt.pw}
                          onChange={(e) => setPwPrompt((p) => ({ ...p, pw: e.target.value }))}
                          onKeyDown={(e) => e.key === 'Enter' && handlePwConfirm()}
                          style={styles.pwInput}
                          autoFocus
                        />
                        <button style={styles.pwConfirmBtn} onClick={handlePwConfirm}>
                          {pwPrompt.mode === 'edit' ? '수정 완료' : '삭제'}
                        </button>
                        <button style={styles.pwCancelBtn} onClick={closePwPrompt}>취소</button>
                      </div>
                    </div>
                  ) : (
                    <p style={styles.commentText}>{c.text}</p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {/* 댓글 입력 */}
          <div style={styles.commentForm}>
            <div style={styles.commentInputRow}>
              <div style={styles.commentTextareaWrap}>
                <div style={styles.commentMetaRow}>
                  <input
                    type="text"
                    placeholder="작성자 (선택)"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    style={styles.commentAuthorInput}
                  />
                  <input
                    type="password"
                    placeholder="비밀번호"
                    value={commentPassword}
                    onChange={(e) => setCommentPassword(e.target.value)}
                    style={styles.commentAuthorInput}
                  />
                </div>
                <textarea
                  placeholder="댓글을 입력하세요..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                  rows={2}
                  style={styles.commentTextarea}
                />
              </div>
              <button
                style={styles.commentSubmitBtn}
                onClick={handleAddComment}
                disabled={!commentText.trim()}
              >등록</button>
            </div>
          </div>
        </div>}

      </div>
    </div>
  );
}

const styles = {
  page: {
    display: 'flex',
    justifyContent: 'center',
    padding: '40px 20px',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  card: {
    width: '100%',
    maxWidth: '780px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    padding: '32px',
    boxSizing: 'border-box',
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginBottom: '24px',
  },
  editBtn: {
    padding: '8px 16px',
    backgroundColor: '#1D9E75',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  saveBtn: {
    padding: '8px 16px',
    backgroundColor: '#2b6cb0',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  deleteBtn: {
    padding: '8px 16px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  topSection: {
    display: 'flex',
    gap: '28px',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  coverWrap: {
    flexShrink: 0,
    textAlign: 'center',
  },
  coverImg: {
    width: '210px',
    height: '300px',
    objectFit: 'cover',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    display: 'block',
  },
  titleRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  likes: {
    fontSize: '18px',
    color: '#e53e3e',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  dateWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    marginTop: 'auto',
  },
  infoCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    paddingTop: '4px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#111',
    margin: 0,
  },
  author: {
    fontSize: '15px',
    color: '#555',
    margin: 0,
  },
  genreBadge: {
    display: 'inline-block',
    alignSelf: 'flex-start',
    padding: '4px 12px',
    backgroundColor: '#E1F5EE',
    color: '#085041',
    borderRadius: '99px',
    fontSize: '13px',
    fontWeight: 'bold',
    border: '1px solid #1D9E75',
  },
  tagRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
  },
  tag: {
    padding: '3px 10px',
    backgroundColor: '#f0f4ff',
    color: '#3a5bd9',
    borderRadius: '99px',
    fontSize: '12px',
    border: '1px solid #c3d0f7',
  },
  date: {
    fontSize: '12px',
    color: '#aaa',
    margin: 0,
  },
  contentSection: {
    backgroundColor: '#f3effe',
    border: '1px solid #d8c8fa',
    borderRadius: '10px',
    padding: '16px 18px',
  },
  contentTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#6b3fa0',
    margin: '0 0 8px 0',
  },
  content: {
    fontSize: '14px',
    lineHeight: '1.8',
    color: '#4a3060',
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    backgroundColor: '#fff',
  },
  textarea: {
    width: '100%',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    lineHeight: '1.7',
    resize: 'vertical',
    boxSizing: 'border-box',
  },

  // 댓글
  commentSection: {
    borderTop: '1px solid #eee',
    paddingTop: '28px',
  },
  commentTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 16px 0',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  commentCount: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1D9E75',
    color: '#fff',
    borderRadius: '99px',
    fontSize: '12px',
    fontWeight: 'bold',
    minWidth: '22px',
    height: '22px',
    padding: '0 6px',
  },
  commentList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 20px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  commentItem: {
    backgroundColor: '#f8f8f8',
    borderRadius: '8px',
    padding: '12px 14px',
    border: '1px solid #eee',
  },
  commentHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '6px',
  },
  commentAuthor: {
    fontWeight: 'bold',
    fontSize: '13px',
    color: '#333',
  },
  commentDate: {
    fontSize: '11px',
    color: '#bbb',
    flex: 1,
  },
  commentText: {
    fontSize: '14px',
    color: '#444',
    margin: 0,
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
  },
  commentEmpty: {
    fontSize: '14px',
    color: '#aaa',
    textAlign: 'center',
    padding: '20px 0',
    margin: '0 0 20px 0',
  },
  commentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  commentTextareaWrap: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  commentMetaRow: {
    display: 'flex',
    gap: '8px',
  },
  commentAuthorInput: {
    padding: '8px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '13px',
    flex: 1,
    minWidth: '120px',
    boxSizing: 'border-box',
  },
  commentActionBtn: {
    background: 'none',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '12px',
    padding: '0 4px',
  },
  pwBox: {
    marginTop: '8px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    borderRadius: '6px',
    border: '1px solid #eee',
  },
  pwRow: {
    display: 'flex',
    gap: '6px',
    alignItems: 'center',
  },
  pwInput: {
    flex: 1,
    padding: '7px 10px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '13px',
    boxSizing: 'border-box',
  },
  pwConfirmBtn: {
    padding: '7px 14px',
    backgroundColor: '#1D9E75',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
  },
  pwCancelBtn: {
    padding: '7px 12px',
    backgroundColor: '#eee',
    color: '#555',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    whiteSpace: 'nowrap',
  },
  commentInputRow: {
    display: 'flex',
    gap: '8px',
    alignItems: 'flex-end',
  },
  commentTextarea: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    fontSize: '14px',
    lineHeight: '1.6',
    resize: 'none',
    boxSizing: 'border-box',
  },
  commentSubmitBtn: {
    padding: '0 20px',
    height: '60px',
    backgroundColor: '#1D9E75',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    flexShrink: 0,
  },
};

export default BookDetail;
