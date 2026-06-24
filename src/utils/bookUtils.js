export function getFirstSentence(content = '') {
  const trimmed = content.trim();
  if (!trimmed) return '';
  const match = trimmed.match(/^[^.!?。]+[.!?。]?/);
  return match ? match[0].trim() : trimmed.slice(0, 80);
}

// export function sortByLikesDesc(books) {
//   return [...books].sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
// }

// export function topBooksByLikes(books, limit = 5) {
//   return sortByLikesDesc(books).slice(0, limit);
// }
