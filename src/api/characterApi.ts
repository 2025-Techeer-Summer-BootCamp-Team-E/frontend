import axios from "axios";
import { ENDPOINTS } from "./endpoints";

// 기존 타입들
export interface CharacterApiResponse {
  id: number;
  characterName: string;
  isMain: boolean;
  age: number;
  gender: string;
  characterDescription: string;
}

// 스크립트 관련 타입들
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

// 새로운 비동기 인물 생성 응답 타입
export interface AsyncCharacterResponse {
  task_id: string;
  book_id: number;
  book_title: string;
  message: string;
}

// 기존 인물 조회 응답 타입 (이미 존재하는 경우)
export interface ExistingCharactersResponse {
  message: string;
  book_id: number;
  book_title: string;
  total_characters: number;
  characters: CharacterApiResponse[];
}

// 인물 생성 SSE 이벤트 데이터 타입
export interface CharacterSSEEventData {
  event: "connected" | "progress" | "completed" | "error";
  data: {
    message?: string;
    channel?: string;
    step?: string;
    total_chunks?: number;
    processed_chunks?: number;
    current_chunk?: number;
    book_title?: string;
    total_characters?: number;
    processed_characters?: number;
    current_character?: string;
    characters?: CharacterApiResponse[];
    processing_stats?: {
      total_chunks_processed: number;
      total_chunks_available: number;
      characters_found: number;
      characters_saved: number;
      optimal_chunk_size: number;
    };
    error_message?: string;
  };
}

// 새로운 비동기 대본 생성 응답 타입
export interface AsyncScriptResponse {
  task_id: string;
  script_id: string;
  character_id: number;
  character_name: string;
  message: string;
}

// 기존 대본 조회 응답 타입 (이미 존재하는 경우)
export interface ExistingScriptResponse {
  script_id: string;
  character_id: number;
  character_name: string;
  scenes: ScriptScene[];
  message: string;
  scene_count?: number;
  completed_at?: string;
}

// 대본 생성 SSE 이벤트 데이터 타입
export interface ScriptSSEEventData {
  event: "connected" | "progress" | "completed" | "error";
  data: {
    success?: boolean;
    message?: string;
    channel?: string;
    eventstream_url?: string;
    script_id?: string;
    current_status?: string;
    status?: string;
    character_id?: number;
    character_name?: string;
    scene_count?: number;
    completed_at?: string;
    scenes?: ScriptScene[];
    note?: string;
    error_message?: string;
  };
}

// 기존 동기 인물 조회 함수
export const getCharactersByBookId = async (
  bookId: number
): Promise<CharacterApiResponse[]> => {
  try {
    const response = await axios.get<CharacterApiResponse[]>(
      ENDPOINTS.characters.createOrGetByBookId(bookId.toString())
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch characters for book ${bookId}:`, error);
    throw error;
  }
};

// 새로운 비동기 인물 생성 함수
export const getCharactersByBookIdAsync = async (
  bookId: number
): Promise<AsyncCharacterResponse | ExistingCharactersResponse> => {
  try {
    const response = await axios.post<
      AsyncCharacterResponse | ExistingCharactersResponse
    >(ENDPOINTS.characters.createOrGetByBookIdAsync(bookId.toString()));
    return response.data;
  } catch (error) {
    console.error(
      `Failed to fetch characters asynchronously for book ${bookId}:`,
      error
    );
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

// 새로운 비동기 대본 생성 함수
export const createScriptAsync = async (
  characterId: number
): Promise<AsyncScriptResponse | ExistingScriptResponse> => {
  try {
    const response = await axios.post<
      AsyncScriptResponse | ExistingScriptResponse
    >(ENDPOINTS.scripts.createAsync(characterId.toString()));
    return response.data;
  } catch (error) {
    console.error(
      `Failed to create script asynchronously for character ${characterId}:`,
      error
    );
    throw error;
  }
};

// 인물 생성 SSE 스트림 처리 함수
export const createCharacterProcessingStream = async (
  taskId: string,
  onMessage: (event: CharacterSSEEventData) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<() => void> => {
  let isAborted = false;
  const abortController = new AbortController();

  // AuthContext에서 토큰 가져오기
  const token = localStorage.getItem("auth_token");
  console.log("🔐 Character SSE 요청 토큰:", token ? "토큰 있음" : "토큰 없음");
  console.log(
    "🔐 Character SSE 요청 URL:",
    ENDPOINTS.characters.getCharacterEventStream(taskId)
  );

  try {
    const headers: Record<string, string> = {
      Accept: "text/event-stream",
    };

    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("🔐 Authorization 헤더 추가됨");
    } else {
      console.log("⚠️ 토큰이 없어서 Authorization 헤더 없음");
    }

    console.log("🔐 Character SSE 요청 헤더:", headers);

    const response = await fetch(
      ENDPOINTS.characters.getCharacterEventStream(taskId),
      {
        method: "GET",
        headers,
        signal: abortController.signal,
      }
    );

    console.log(
      "🔐 Character SSE 응답 상태:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentEvent = "message";

    const readStream = async () => {
      try {
        while (!isAborted) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Character SSE stream completed");
            onComplete();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log("📡 Character SSE 데이터 청크:", chunk);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ") && line.length > 6) {
              try {
                const jsonData = JSON.parse(line.slice(6));
                const eventData: CharacterSSEEventData = {
                  event: currentEvent as
                    | "connected"
                    | "progress"
                    | "completed"
                    | "error",
                  data: jsonData,
                };
                console.log("Character SSE 파싱된 데이터:", eventData);
                onMessage(eventData);
              } catch (error) {
                console.error("Failed to parse Character SSE data:", error);
              }
            }
          }
        }
      } catch (error) {
        if (!isAborted) {
          console.error("Character stream reading error:", error);
          onError(
            error instanceof Error
              ? error.message
              : "Character stream reading error"
          );
        }
      } finally {
        try {
          reader.releaseLock();
        } catch {
          // 이미 릴리즈된 경우 무시
        }
      }
    };

    readStream();

    // cleanup 함수 반환
    return () => {
      isAborted = true;
      abortController.abort();
      try {
        reader.releaseLock();
      } catch {
        // 이미 릴리즈된 경우 무시
      }
    };
  } catch (error) {
    console.error("Failed to create Character SSE stream:", error);
    onError(
      error instanceof Error
        ? error.message
        : "Failed to create Character SSE stream"
    );

    // 빈 cleanup 함수 반환
    return () => {};
  }
};

// 대본 생성 SSE 스트림 처리 함수 (인물 생성 SSE와 동일한 엔드포인트 사용)
export const createScriptProcessingStream = async (
  taskId: string,
  onMessage: (event: ScriptSSEEventData) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<() => void> => {
  let isAborted = false;
  const abortController = new AbortController();

  // AuthContext에서 토큰 가져오기
  const token = localStorage.getItem("auth_token");
  console.log("🔐 Script SSE 요청 토큰:", token ? "토큰 있음" : "토큰 없음");
  console.log(
    "🔐 Script SSE 요청 URL:",
    ENDPOINTS.characters.getCharacterEventStream(taskId)
  );

  try {
    const headers: Record<string, string> = {
      Accept: "text/event-stream",
    };

    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("🔐 Authorization 헤더 추가됨");
    } else {
      console.log("⚠️ 토큰이 없어서 Authorization 헤더 없음");
    }

    console.log("🔐 Script SSE 요청 헤더:", headers);

    const response = await fetch(
      ENDPOINTS.characters.getCharacterEventStream(taskId),
      {
        method: "GET",
        headers,
        signal: abortController.signal,
      }
    );

    console.log(
      "🔐 Script SSE 응답 상태:",
      response.status,
      response.statusText
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentEvent = "message";

    const readStream = async () => {
      try {
        while (!isAborted) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("Script SSE stream completed");
            onComplete();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log("📡 Script SSE 데이터 청크:", chunk);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ") && line.length > 6) {
              try {
                const jsonData = JSON.parse(line.slice(6));
                const eventData: ScriptSSEEventData = {
                  event: currentEvent as
                    | "connected"
                    | "progress"
                    | "completed"
                    | "error",
                  data: jsonData,
                };
                console.log("Script SSE 파싱된 데이터:", eventData);
                onMessage(eventData);
              } catch (error) {
                console.error("Failed to parse Script SSE data:", error);
              }
            }
          }
        }
      } catch (error) {
        if (!isAborted) {
          console.error("Script stream reading error:", error);
          onError(
            error instanceof Error
              ? error.message
              : "Script stream reading error"
          );
        }
      } finally {
        try {
          reader.releaseLock();
        } catch {
          // 이미 릴리즈된 경우 무시
        }
      }
    };

    readStream();

    // cleanup 함수 반환
    return () => {
      isAborted = true;
      abortController.abort();
      try {
        reader.releaseLock();
      } catch {
        // 이미 릴리즈된 경우 무시
      }
    };
  } catch (error) {
    console.error("Failed to create Script SSE stream:", error);
    onError(
      error instanceof Error
        ? error.message
        : "Failed to create Script SSE stream"
    );

    // 빈 cleanup 함수 반환
    return () => {};
  }
};
