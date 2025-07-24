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

export interface ScriptScene {
  sceneId: number;
  background: string;
  mood: string;
  style: string;
  camera: string;
  soundtrack: string;
  characters: {
    name: string;
    appearance: string;
    expression: string;
    action: string;
  }[];
  lines: {
    speaker: string;
    line_en: string;
    line_ko: string;
  }[];
  rewriting_prompt: string;
  rewriting_id: string;
}

export interface ScriptApiResponse {
  script_id: string;
  characterId: number;
  scenes: ScriptScene[];
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

// 특정 캐릭터의 스크립트 생성 (POST /characters/{characterId}/script/)
export const createScript = async (
  characterId: number
): Promise<ScriptApiResponse> => {
  try {
    const response = await axios.post<ScriptApiResponse>(
      ENDPOINTS.scripts.create(characterId.toString())
    );
    console.log("Script API 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      `Failed to create script for character ${characterId}:`,
      error
    );
    throw error;
  }
};
