import axios from "axios";
import { ENDPOINTS } from "../constants/api";

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

// 공식 책 목록 조회
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
