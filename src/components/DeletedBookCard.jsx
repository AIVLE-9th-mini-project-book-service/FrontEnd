import { getFirstSentence } from '../utils/bookUtils';

function DeletedBookCard({ book, onRestore, onPermanentDelete, busyId }) {
  const isBusy = busyId === book.id;

  return (
    <li className="book-card book-card--deleted">
      <div className="book-card-inner">
        {book.coverImageUrl ? (
          <img
            className="book-cover book-cover--dim"
            src={book.coverImageUrl}
            alt={`${book.title} 표지`}
          />
        ) : (
          <div className="book-cover book-cover--placeholder">표지 없음</div>
        )}
        <div className="book-card-body">
          <h3>{book.title}</h3>
          <p className="book-meta">작가: {book.author}</p>
          <p className="book-preview">{getFirstSentence(book.content)}</p>
          {book.deletedAt && (
            <p className="book-meta book-date">
              휴지통 이동:{' '}
              {new Date(book.deletedAt).toLocaleString('ko-KR')}
            </p>
          )}
          <div className="book-card-actions">
            <button
              type="button"
              className="btn-secondary"
              disabled={isBusy}
              onClick={() => onRestore(book.id)}
            >
              복원
            </button>
            <button
              type="button"
              className="btn-danger"
              disabled={isBusy}
              onClick={() => onPermanentDelete(book)}
            >
              영구 삭제
            </button>
          </div>
        </div>
      </div>
    </li>
  );
}

export default DeletedBookCard;
