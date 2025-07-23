import axios from "axios";
import { ENDPOINTS } from "./endpoints";

// API 응답 타입 정의
export interface BookApiResponse {
  book_id: number;
  title: string;
  content: string;
  pdf_url: string;
}

export interface VideoApiResponse {
  video_id: number;
  character_id: number;
  video_url: string;
  thumbnail_url: string;
}

export interface CharacterApiResponse {
  character_id: number;
  character_name: string;
  is_main: boolean;
  age: number;
  gender: string;
  character_description: string;
}

// 공식 책 목록 조회 (GET /books/official)
export const getOfficialBooks = async (): Promise<BookApiResponse[]> => {
  try {
    const response = await axios.get<BookApiResponse[]>(
      ENDPOINTS.books.getOfficial
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch official books:", error);
    throw error;
  }
};

// 개인 업로드 책 목록 조회
export const getPersonalBooks = async (): Promise<BookApiResponse[]> => {
  try {
    const response = await axios.get<BookApiResponse[]>(
      ENDPOINTS.books.getPersonal
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch personal books:", error);
    throw error;
  }
};

// 특정 책의 영상 목록 조회
export const getVideosByBookId = async (
  bookId: number
): Promise<VideoApiResponse[]> => {
  try {
    const response = await axios.get<VideoApiResponse[]>(
      ENDPOINTS.videos.getByBookId(bookId.toString())
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch videos for book ${bookId}:`, error);
    throw error;
  }
};

// PDF 업로드로 책 생성
export const uploadBook = async (
  title: string,
  pdfFile: File
): Promise<BookApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", pdfFile);

    const response = await axios.post<BookApiResponse>(
      ENDPOINTS.books.uploadPdf,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upload book:", error);
    throw error;
  }
};

// // 특정 책의 캐릭터 목록 조회 (GET /books/{bookId}/characters)
// export const getCharactersByBookId = async (
//   bookId: number
// ): Promise<CharacterApiResponse[]> => {
//   try {
//     const response = await axios.get<CharacterApiResponse[]>(
//       ENDPOINTS.characters.getByBookId(bookId.toString())
//     );
//     return response.data;
//   } catch (error) {
//     console.error(`Failed to fetch characters for book ${bookId}:`, error);
//     throw error;
//   }
// };
