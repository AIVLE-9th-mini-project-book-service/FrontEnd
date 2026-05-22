import { useMemo, useState } from 'react'
import db from '../../db.json'
import './BookFinder.css'

const ICON_PROPS = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  'aria-hidden': true,
}

function SearchIcon() {
  return (
    <svg {...ICON_PROPS}>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
      <path
        d="M20 20l-4-4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ClearIcon() {
  return (
    <svg {...ICON_PROPS}>
      <path
        d="M8 8l8 8M16 8l-8 8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function getTopBooksByLikes(books, limit = 5) {
  return [...books]
    .sort((a, b) => Number(b.likes) - Number(a.likes))
    .slice(0, limit)
}

function BookCover({ book, rank }) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="book-card__cover-wrap">
      <span className="book-card__rank" aria-hidden="true">
        {rank}
      </span>
      {!imageError && book.coverImageUrl ? (
        <img
          src={book.coverImageUrl}
          alt={`${book.title} 표지`}
          className="book-card__cover"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="book-card__cover book-card__cover--fallback">
          <span>{book.title}</span>
        </div>
      )}
    </div>
  )
}

function BookFinder() {
  const [query, setQuery] = useState('')
  const popularBooks = useMemo(() => getTopBooksByLikes(db.books ?? []), [])

  const handleClear = () => setQuery('')

  return (
    <div className="book-finder">
      <main className="book-finder__main">
        <section className="book-finder__search-section">
          <h1>도서 검색</h1>
          <p className="book-finder__subtitle">
            제목이나 저자명으로 도서를 검색할 수 있습니다.
          </p>

          <form
            className="book-finder__search"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="검색어를 입력해 주세요"
              aria-label="도서 검색"
              autoComplete="off"
            />
            <div className="book-finder__search-actions">
              {query.length > 0 && (
                <button
                  type="button"
                  className="book-finder__search-clear"
                  onClick={handleClear}
                  aria-label="검색어 지우기"
                >
                  <ClearIcon />
                </button>
              )}
              <button
                type="submit"
                className="book-finder__search-submit"
                aria-label="검색"
              >
                <SearchIcon />
              </button>
            </div>
          </form>
        </section>

        <section className="book-finder__popular">
          <h2>인기검색어</h2>
          <div className="book-finder__popular-grid">
            {popularBooks.map((book, index) => (
              <button
                key={book.id}
                type="button"
                className="book-card"
                onClick={() => setQuery(book.title)}
              >
                <BookCover book={book} rank={index + 1} />
                <span className="book-card__title">{book.title}</span>
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default BookFinder
