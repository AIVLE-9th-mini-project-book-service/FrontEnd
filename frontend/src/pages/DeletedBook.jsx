/**
 * 도서 삭제 페이지
 * deletedAt 필드에 삭제 날짜가 있는 도서만 표시합니다.
 */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DeletedBookCard from '../components/DeletedBookCard';

const bookUrl = 'http://localhost:3000/books';

async function parseResponse(res, fallbackMessage) {
  if (!res.ok) throw new Error(fallbackMessage);
  if (res.status === 204) return null;
  return res.json();
}

async function fetchDeletedBooks() {
  const res = await fetch(bookUrl);
  const books = await parseResponse(res, '삭제된 도서 목록을 불러오지 못했습니다.');
  return books.filter((book) => book.deletedAt);
}

async function restoreDeletedBook(id) {
  const res = await fetch(bookUrl + `/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      deletedAt: '',
      updatedAt: new Date().toISOString(),
    }),
  });
  return parseResponse(res, '도서 복원에 실패했습니다.');
}

async function permanentDeleteBook(id) {
  const res = await fetch(bookUrl + `/${id}`, { method: 'DELETE' });
  return parseResponse(res, '영구 삭제에 실패했습니다.');
}

function DeletedBookPage() {
  const navigate = useNavigate();
  const [deletedBooks, setDeletedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const loadDeleted = async () => {
      setLoading(true);
      try {
        const data = await fetchDeletedBooks();
        setDeletedBooks(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError('삭제된 도서를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };
    loadDeleted();
  }, []);

  const handleRestore = async (id) => {
    setBusyId(id);
    setMessage(null);
    try {
      const restored = await restoreDeletedBook(id);
      setDeletedBooks((prev) => prev.filter((b) => b.id !== id));
      setMessage(`"${restored.title}" 도서가 복원되었습니다.`);
      navigate('/books');
    } catch (e) {
      console.error(e);
      setError('도서 복원에 실패했습니다.');
    } finally {
      setBusyId(null);
    }
  };

  const handlePermanentDelete = async (book) => {
    const ok = window.confirm(
      `"${book.title}"을(를) 영구 삭제할까요?\n이 작업은 되돌릴 수 없습니다.`
    );
    if (!ok) return;

    setBusyId(book.id);
    setMessage(null);
    try {
      await permanentDeleteBook(book.id);
      setDeletedBooks((prev) => prev.filter((b) => b.id !== book.id));
      setMessage(`"${book.title}"이(가) 영구 삭제되었습니다.`);
    } catch (e) {
      console.error(e);
      setError('영구 삭제에 실패했습니다.');
    } finally {
      setBusyId(null);
    }
  };

  if (loading) {
    return (
      <section className="app-content trash-page">
        <p className="status-message">삭제 도서를 불러오는 중입니다...</p>
      </section>
    );
  }

  return (
    <section className="app-content trash-page">
      <div className="trash-header">
        <h1 className="page-title">휴지통</h1>
        <p className="page-desc">
          삭제된 도서를 복원하거나 영구 삭제할 수 있습니다.
        </p>
      </div>

      {error && <p className="status-message status-message--error">{error}</p>}
      {message && <p className="status-message status-message--success">{message}</p>}

      {!deletedBooks.length ? (
        <div className="trash-empty">
          <span className="trash-empty-icon" aria-hidden>🗑️</span>
          <p className="empty-message">휴지통이 비어 있습니다.</p>
          <p className="page-desc">
            도서 상세·목록에서 삭제한 도서가 여기에 표시됩니다.
          </p>
        </div>
      ) : (
        <>
          <p className="trash-count">총 {deletedBooks.length}권</p>
          <ul className="book-list">
            {deletedBooks.map((book) => (
              <DeletedBookCard
                key={book.id}
                book={book}
                onRestore={handleRestore}
                onPermanentDelete={handlePermanentDelete}
                busyId={busyId}
              />
            ))}
          </ul>
        </>
      )}
    </section>
  );
}

export default DeletedBookPage;