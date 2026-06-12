import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import noCover from '../img/no-cover.svg';
import { GENRE_LIST, TAG_LIST } from "../bookOption";
import { useAuth } from '../context/useAuth';

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('accessToken');
  const { user } = useAuth();
  const bookUrl = '/api/books';
  const commentUrl = '/api/comments';

  const [book, setBook] = useState(null);
  const [bookLoading, setBookLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAuthor, setEditAuthor] = useState('');
  const [editGenre, setEditGenre] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTag, setEditTag] = useState('');
  const [editImageUrl, setEditImageUrl] = useState('');
  const [loginUser, setLoginUser] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentPassword, setCommentPassword] = useState('');
  const [commentLoading, setCommentLoading] = useState(true);
  const [pwPrompt, setPwPrompt] = useState(null);
  const [contentExpanded, setContentExpanded] = useState(false);
  const CONTENT_LIMIT = 150;

  useEffect(() => {
    if (!token) return;
    const fetchLoginUser = async () => {
      try {
        const res = await fetch('/members/me', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        setLoginUser(data);
      } catch {
        // 로그인 유저 정보 조회 실패 시 무시
      }
    };
    fetchLoginUser();
  }, [token]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await fetch(bookUrl+`/${id}`);
        if (!res.ok) throw new Error('도서 정보를 불러오지 못했습니다.');
        const data = await res.json();
        setBook(data);
        setEditTitle(data.title ?? '');
        setEditAuthor(data.author ?? '');
        setEditGenre(data.genre ?? '');
        setEditContent(data.content ?? '');
        setEditTag(data.tag ?? '');
        setEditImageUrl(data.coverImageUrl ?? '');
      } catch (err) {
        console.error(err);
        alert(err.message);
        navigate('/books');
      } finally {
        setBookLoading(false);
      }
    };
    fetchBook();
  }, [id, navigate]);

  useEffect(() => {
    const fetchComments = async () => {
      setCommentLoading(true);
      try {
        const res = await fetch(`${bookUrl}/${id}/comments`);
        if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error('댓글을 불러오지 못했습니다.', err);
      } finally {
        setCommentLoading(false);
      }
    };
    fetchComments();
  }, [id]);

  const handleDelete = async () => {
    if (user?.isAdmin) {
      if (!window.confirm(`"${book.title}"을(를) 영구 삭제할까요?`)) return;
      try {
        const res = await fetch(`/api/admin/books/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('삭제 실패');
        alert('도서가 삭제되었습니다.');
        navigate('/books');
      } catch (err) {
        console.error(err);
        alert('삭제에 실패했습니다.');
      }
    } else {
      if (!window.confirm(`"${book.title}"을(를) 삭제 도서로 이동할까요?`)) return;
      try {
        const res = await fetch(`${bookUrl}/trash/${id}`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!res.ok) throw new Error('삭제 도서 이동 실패');
        alert('삭제 도서로 이동했습니다.');
        navigate('/books/deleted');
      } catch (err) {
        console.error(err);
        alert('삭제 도서 이동에 실패했습니다.');
      }
    }
  };

  const handleSubmitUpdate = async () => {
    try {
      const patchUrl = user?.isAdmin ? `/api/admin/books/${id}` : `${bookUrl}/${id}`;
      const res = await fetch(patchUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editTitle,
          author: editAuthor,
          genre: editGenre,
          content: editContent,
          tag: editTag,
          coverImageUrl: editImageUrl,
          updatedAt: new Date().toISOString(),
        }),
      });
      if (!res.ok) throw new Error('수정 실패');
      const updated = await res.json();
      setBook(updated);
      setIsEditMode(false);
      alert('수정 완료');
    } catch (err) {
      console.error(err);
      alert('수정에 실패했습니다.');
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    const newComment = {
      bookId: id,
      author: token ? (loginUser?.name ?? '회원') : (commentAuthor.trim() || '익명'),
      text: commentText.trim(),
      password: token ? null : commentPassword,
      createdAt: new Date().toISOString(),
    };
    try {
      const res = await fetch(`${bookUrl}/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
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

  const openPwPrompt = (comment, mode) => {
    if (token) {
      // 로그인 상태: 비밀번호 없이 바로 처리
      if (mode === 'delete') {
        handleCommentDelete(comment.id);
      } else {
        setPwPrompt({ id: comment.id, mode, pw: null, editText: comment.text, storedPw: null });
      }
      return;
    }
    setPwPrompt({ id: comment.id, mode, pw: '', editText: comment.text, storedPw: comment.password });
  };

  const closePwPrompt = () => setPwPrompt(null);

  const handleCommentDelete = async (commentId, password) => {
    try {
      const deleteUrl = user?.isAdmin ? `/api/admin/comments/${commentId}` : `${commentUrl}/${commentId}`;
      const res = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` }),
        },
        ...(!token && { body: JSON.stringify({ password }) }),
      });
      if (!res.ok) throw new Error();
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      closePwPrompt();
    } catch {
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  const handlePwConfirm = async () => {
    if (pwPrompt.mode === 'delete') {
      await handleCommentDelete(pwPrompt.id, pwPrompt.pw);
    } else {
      try {
        const patchUrl = user?.isAdmin ? `/api/admin/comments/${pwPrompt.id}` : `${commentUrl}/${pwPrompt.id}`;
        const res = await fetch(patchUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
          },
          body: JSON.stringify({ text: pwPrompt.editText, ...(!token && { password: pwPrompt.pw }) }),
        });
        if (!res.ok) throw new Error();
        const updated = await res.json();
        setComments((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
        closePwPrompt();
      } catch {
        alert('댓글 수정에 실패했습니다.');
      }
    }
  };

  if (bookLoading) return (
      <p style={{ textAlign: 'center', marginTop: '60px', color: '#888' }}>
        도서 정보를 불러오는 중...
      </p>
  );
  if (!book) return null;

  const tagsArray = book.tag ? book.tag.split(',').filter(Boolean) : [];

  return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.buttonRow}>
            {token && (
                <>
                  {!isEditMode ? (
                      <button style={styles.editBtn} onClick={() => navigate(`/books/${id}/edit`)}>수정</button>
                  ) : (
                      <button style={styles.saveBtn} onClick={handleSubmitUpdate}>✅ 수정 완료</button>
                  )}
                  <button style={styles.deleteBtn} onClick={handleDelete}>삭제</button>
                </>
            )}
          </div>

          <div style={styles.topSection}>
            <div style={styles.coverWrap}>
              {isEditMode ? (
                  <input type="text" placeholder="이미지 URL" value={editImageUrl}
                         onChange={(e) => setEditImageUrl(e.target.value)} style={styles.input} />
              ) : (
                  <img src={book.coverImageUrl || noCover} alt={book.title} style={styles.coverImg} />
              )}
            </div>

            <div style={styles.infoCol}>
              {isEditMode ? (
                  <input type="text" value={editTitle}
                         onChange={(e) => setEditTitle(e.target.value)}
                         style={{ ...styles.input, fontSize: '20px', fontWeight: 'bold' }} />
              ) : (
                  <div style={styles.titleRow}>
                    <h2 style={styles.title}>{book.title}</h2>
                    <span style={styles.likes}>❤️ {book.likes ?? 0}</span>
                  </div>
              )}

              {isEditMode ? (
                  <input type="text" value={editAuthor}
                         onChange={(e) => setEditAuthor(e.target.value)} style={styles.input} />
              ) : (
                  <p style={styles.author}>저자: {book.author}</p>
              )}

              {isEditMode ? (
                  <select value={editGenre} onChange={(e) => setEditGenre(e.target.value)} style={styles.select}>
                    {GENRE_LIST.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
              ) : (
                  <span style={styles.genreBadge}>{book.genre}</span>
              )}

              {isEditMode ? (
                  <select value={editTag} onChange={(e) => setEditTag(e.target.value)} style={styles.select}>
                    {TAG_LIST.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
              ) : (
                  <div style={styles.tagRow}>
                    {tagsArray.map((t, idx) => (
                        <span key={idx} style={styles.tag}>#{t.trim()}</span>
                    ))}
                  </div>
              )}

              <div style={styles.contentSection}>
                <h4 style={styles.contentTitle}>도서 내용</h4>
                {isEditMode ? (
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)}
                              rows={6} style={styles.textarea} />
                ) : (
                    <>
                      <p style={styles.content}>
                        {!book.content ? '등록된 내용이 없습니다.'
                            : contentExpanded || book.content.length <= CONTENT_LIMIT
                                ? book.content
                                : book.content.slice(0, CONTENT_LIMIT) + '...'}
                      </p>
                      {book.content?.length > CONTENT_LIMIT && (
                          <button onClick={() => setContentExpanded((prev) => !prev)} style={styles.moreBtn}>
                            {contentExpanded ? '접기 ▲' : '더보기 ▼'}
                          </button>
                      )}
                    </>
                )}
              </div>

              <div style={styles.dateWrap}>
                <p style={styles.date}>등록일: {book.createdAt ? book.createdAt.split('T')[0] : '-'}</p>
                <p style={styles.date}>수정일: {book.updatedAt ? book.updatedAt.split('T')[0] : '-'}</p>
              </div>
            </div>
          </div>

          {!isEditMode && (
              <div style={styles.commentSection}>
                <h3 style={styles.commentTitle}>
                  💬 댓글 {comments.length > 0 && <span style={styles.commentCount}>{comments.length}</span>}
                </h3>

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
                            {pwPrompt?.id === c.id ? (
                                <div style={styles.pwBox}>
                                  {pwPrompt.mode === 'edit' && (
                                      <textarea value={pwPrompt.editText}
                                                onChange={(e) => setPwPrompt((p) => ({ ...p, editText: e.target.value }))}
                                                rows={2} style={{ ...styles.commentTextarea, marginBottom: '8px' }} />
                                  )}
                                  {!token && pwPrompt.mode === 'delete' && (
                                      <p style={{ fontSize: '13px', color: '#666', margin: '0 0 8px 0' }}>
                                        이 댓글을 삭제하려면 비밀번호를 입력하세요.
                                      </p>
                                  )}
                                  <div style={styles.pwRow}>
                                    {!token && (
                                      <input type="password" placeholder="비밀번호" value={pwPrompt.pw}
                                             onChange={(e) => setPwPrompt((p) => ({ ...p, pw: e.target.value }))}
                                             onKeyDown={(e) => e.key === 'Enter' && handlePwConfirm()}
                                             style={styles.pwInput} autoFocus />
                                    )}
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

                {!user?.isAdmin && (
                  <div style={styles.commentForm}>
                    <div style={styles.commentInputRow}>
                      <div style={styles.commentTextareaWrap}>
                        {!token && (
                          <div style={styles.commentMetaRow}>
                            <input type="text" placeholder="작성자 (선택)" value={commentAuthor}
                                   onChange={(e) => setCommentAuthor(e.target.value)} style={styles.commentAuthorInput} />
                            <input type="password" placeholder="비밀번호" value={commentPassword}
                                   onChange={(e) => setCommentPassword(e.target.value)} style={styles.commentAuthorInput} />
                          </div>
                        )}
                        <textarea placeholder="댓글을 입력하세요..." value={commentText}
                                  onChange={(e) => setCommentText(e.target.value)}
                                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddComment(); } }}
                                  rows={2} style={styles.commentTextarea} />
                      </div>
                      <button style={styles.commentSubmitBtn} onClick={handleAddComment} disabled={!commentText.trim()}>
                        등록
                      </button>
                    </div>
                  </div>
                )}
              </div>
          )}
        </div>
      </div>
  );
}

const styles = {
  page: { display: 'flex', justifyContent: 'center', padding: '40px 20px', backgroundColor: '#f9f9f9', minHeight: '100vh' },
  card: { width: '100%', maxWidth: '780px', backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)', padding: '32px', boxSizing: 'border-box' },
  buttonRow: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '24px' },
  editBtn: { padding: '8px 16px', backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  saveBtn: { padding: '8px 16px', backgroundColor: '#2b6cb0', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  deleteBtn: { padding: '8px 16px', backgroundColor: '#e53e3e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' },
  topSection: { display: 'flex', gap: '28px', alignItems: 'flex-start', marginBottom: '32px' },
  coverWrap: { flexShrink: 0, textAlign: 'center' },
  coverImg: { width: '210px', height: 'auto', objectFit: 'contain', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', display: 'block' },
  titleRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  likes: { fontSize: '18px', color: '#e53e3e', fontWeight: 'bold', whiteSpace: 'nowrap', flexShrink: 0 },
  dateWrap: { display: 'flex', flexDirection: 'column', gap: '2px', marginTop: 'auto' },
  infoCol: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '4px' },
  title: { fontSize: '24px', fontWeight: 'bold', color: '#111', margin: 0 },
  author: { fontSize: '15px', color: '#555', margin: 0 },
  genreBadge: { display: 'inline-block', alignSelf: 'flex-start', padding: '4px 12px', backgroundColor: '#E1F5EE', color: '#085041', borderRadius: '99px', fontSize: '13px', fontWeight: 'bold', border: '1px solid #1D9E75' },
  tagRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  tag: { padding: '3px 10px', backgroundColor: '#f0f4ff', color: '#3a5bd9', borderRadius: '99px', fontSize: '12px', border: '1px solid #c3d0f7' },
  date: { fontSize: '12px', color: '#aaa', margin: 0 },
  contentSection: { backgroundColor: '#f3effe', border: '1px solid #d8c8fa', borderRadius: '10px', padding: '16px 18px' },
  contentTitle: { fontSize: '14px', fontWeight: 'bold', color: '#6b3fa0', margin: '0 0 8px 0' },
  content: { fontSize: '14px', lineHeight: '1.8', color: '#4a3060', whiteSpace: 'pre-wrap', margin: 0 },
  moreBtn: { marginTop: '8px', background: 'none', border: 'none', color: '#6b3fa0', fontSize: '13px', cursor: 'pointer', padding: 0, fontWeight: 'bold' },
  input: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', boxSizing: 'border-box' },
  select: { width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', backgroundColor: '#fff' },
  textarea: { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px', lineHeight: '1.7', resize: 'vertical', boxSizing: 'border-box' },
  commentSection: { borderTop: '1px solid #eee', paddingTop: '28px' },
  commentTitle: { fontSize: '16px', fontWeight: 'bold', color: '#333', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' },
  commentCount: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#1D9E75', color: '#fff', borderRadius: '99px', fontSize: '12px', fontWeight: 'bold', minWidth: '22px', height: '22px', padding: '0 6px' },
  commentList: { listStyle: 'none', padding: 0, margin: '0 0 20px 0', display: 'flex', flexDirection: 'column', gap: '10px' },
  commentItem: { backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '12px 14px', border: '1px solid #eee' },
  commentHeader: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' },
  commentAuthor: { fontWeight: 'bold', fontSize: '13px', color: '#333' },
  commentDate: { fontSize: '11px', color: '#bbb', flex: 1 },
  commentText: { fontSize: '14px', color: '#444', margin: 0, lineHeight: '1.6', whiteSpace: 'pre-wrap' },
  commentEmpty: { fontSize: '14px', color: '#aaa', textAlign: 'center', padding: '20px 0', margin: '0 0 20px 0' },
  commentForm: { display: 'flex', flexDirection: 'column', gap: '8px' },
  commentTextareaWrap: { flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' },
  commentMetaRow: { display: 'flex', gap: '8px' },
  commentAuthorInput: { padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', flex: 1, minWidth: '120px', boxSizing: 'border-box' },
  commentActionBtn: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '12px', padding: '0 4px' },
  pwBox: { marginTop: '8px', padding: '12px', backgroundColor: '#f9f9f9', borderRadius: '6px', border: '1px solid #eee' },
  pwRow: { display: 'flex', gap: '6px', alignItems: 'center' },
  pwInput: { flex: 1, padding: '7px 10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '13px', boxSizing: 'border-box' },
  pwConfirmBtn: { padding: '7px 14px', backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap' },
  pwCancelBtn: { padding: '7px 12px', backgroundColor: '#eee', color: '#555', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', whiteSpace: 'nowrap' },
  commentInputRow: { display: 'flex', gap: '8px', alignItems: 'flex-end' },
  commentTextarea: { width: '100%', padding: '10px 12px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '14px', lineHeight: '1.6', resize: 'none', boxSizing: 'border-box' },
  commentSubmitBtn: { padding: '0 20px', height: '60px', backgroundColor: '#1D9E75', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold', flexShrink: 0 },
};

export default BookDetail;