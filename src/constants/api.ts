export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = (path: string) => `${API_BASE_URL}${path}`;

export const ENDPOINTS = {
  books: {
    getOfficial: API_URL("/books/official"),
    getPersonal: API_URL("/books/personal"),
    // create: API_URL("/books"),
    // update: "/books/:id",
    // delete: "/books/:id",
    // getById: "/books/:id",
    // getByUserId: "/books/user/:userId",
  },
  characters: {
    getByBookId: (bookId: string) => API_URL(`/books/${bookId}/characters`),
    create: API_URL(`/characters/books/{bookId}`), // 소설을 바탕으로 인물 생성 OR 조회. GET으로 하게 될 듯
  },
  scripts: {
    create: (characterId: string) =>
      API_URL(`/characters/${characterId}/script`), // 인물을 바탕으로 스크립트 생성
  },
  videos: {
    get: API_URL(""), // 저장된 영상 목록 조회
    getByVideoId: (videoId: string) => API_URL(`/${videoId}`),
    // getByBookId:`${API_BASE_URL}/books/{bookId}/videos`,
    getByBookId: (bookId: string) => API_URL(`/books/${bookId}/videos`),
  },
  booksmarks: {
    get: API_URL("/bookmarked"), // 책 북마크 목록 조회
    update: (videoId: string) => API_URL(`/videos/${videoId}`), // 책 북마크 추가/삭제
  },
};
