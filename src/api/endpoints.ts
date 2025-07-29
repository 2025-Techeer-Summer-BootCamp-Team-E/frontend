export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API_URL = (path: string) => `${API_BASE_URL}${path}`;

export const ENDPOINTS = {
  auth: {
    login: API_URL("/users/login/"),
    signup: API_URL("/users/signup/"),
    logout: API_URL("/users/logout/"), // 서버에 없지만 일단 유지
    refresh: API_URL("/users/token/refresh/"),
    me: API_URL("/users/me/"), // 사용자 정보 조회용 추가
  },
  books: {
    getOfficial: API_URL("/books/official"),
    getPersonal: API_URL("/books/personal"),
    uploadPdf: API_URL("/books/pdf"), // PDF 업로드로 책 생성, 비동기 구현
    // create: API_URL("/books"),
    // update: "/books/:id",
    // delete: "/books/:id",
    // getById: "/books/:id",
    // getByUserId: "/books/user/:userId",
  },
  characters: {
    // getByBookId: (bookId: string) => API_URL(`/books/${bookId}/characters`),
    createOrGetByBookId: (bookId: string) =>
      API_URL(`/books/${bookId}/characters`), // 소설을 바탕으로 인물 생성 OR 조회. GET으로 하게 될 듯
  },
  scripts: {
    create: (characterId: string) =>
      API_URL(`/characters/${characterId}/scripts`), // 인물을 바탕으로 스크립트 생성
  },
  videos: {
    get: API_URL("/videos"), // 저장된 영상 목록 조회
    getByVideoId: (videoId: string) => API_URL(`/videos/${videoId}`),
    getByBookId: (bookId: string) => API_URL(`/books/${bookId}/videos`),

    createVideo: API_URL("/videos"), // 영상 생성 요청
    // shareVideo: (videoId: number) => `/videos/${videoId}/share`,
  },
  booksmarks: {
    get: API_URL("/videos/bookmarks/bookmarked"), // 북마크된 영상 조회
    update: (videoId: number /*string*/) =>
      API_URL(`videos/bookmarks/${videoId}`), // 책 북마크 추가/삭제, // 책 북마크 추가/삭제
  },
};
