/**
 * Đường dẫn API Deezer. Một nguồn duy nhất để server và route handler
 * cùng dùng, tránh mỗi nơi tự ghép URL.
 */
export const deezerEndpoint = {
  search: (query: string) => `/search?q=${encodeURIComponent(query)}`,
  track: (id: string) => `/track/${id}`,
};
