const API_BASE_URL = 'http://localhost:8080';

async function requestJson(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function searchBooks({ keyword, genres = [], tags = [], size = 20 }) {
  const params = new URLSearchParams({
    page: '0',
    size: String(size),
  });

  if (keyword?.trim()) {
    params.set('keyword', keyword.trim());
  }
  genres
    .filter((genre) => genre?.trim())
    .forEach((genre) => params.append('genres', genre.trim()));
  tags
    .filter((tag) => tag?.trim())
    .forEach((tag) => params.append('tags', tag.trim()));

  const data = await requestJson(`/books/search?${params.toString()}`);
  return data.content ?? [];
}

export async function searchBooksByFilters({ keyword, genres = [], tags = [], size = 50 }) {
  return searchBooks({ keyword, genres, tags, size });
}

export async function getPopularBooks(limit = 5) {
  const params = new URLSearchParams({ limit: String(limit) });
  return requestJson(`/books/popular?${params.toString()}`);
}
