import axios from "axios";
import { ENDPOINTS } from "./endpoints";

export interface CharacterApiResponse {
  id: number;
  characterName: string;
  isMain: boolean;
  age: number;
  gender: string;
  characterDescription: string;
  scenes: unknown[]; // 응답에 포함되어 있음
}

// 특정 책의 캐릭터 목록 조회 및 생성 (POST /characters/books/{bookId}/)
export const getCharactersByBookId = async (
  bookId: number
): Promise<CharacterApiResponse[]> => {
  try {
    const response = await axios.post<CharacterApiResponse[]>(
      ENDPOINTS.characters.createOrGetByBookId(bookId.toString())
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch characters for book ${bookId}:`, error);
    throw error;
  }
};
