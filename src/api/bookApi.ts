import axios from "axios";
import { ENDPOINTS } from "./endpoints";

// API 응답 타입 정의
export interface BookApiResponse {
  book_id: number;
  title: string;
  content: string;
  pdf_url: string;
}

// 새로운 비동기 업로드 응답 타입
export interface AsyncUploadResponse {
  book_id: number;
  title: string;
  processing_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  task_id: string;
  message: string;
}

// 책 상태 조회 응답 타입
export interface BookStatusResponse {
  book_id: number;
  title: string;
  processing_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
  message?: string;
  content?: string; // COMPLETED 상태일 때만 있음
  pdf_url?: string; // COMPLETED 상태일 때만 있음
}

// SSE 연결 응답 타입
export interface SSEConnectionResponse {
  message: string;
  channel: string;
  eventstream_url: string;
  current_status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
}

// SSE 이벤트 데이터 타입 (직접 SSE 구현용)
export interface SSEEventData {
  event: "connected" | "test" | "started" | "progress" | "completed" | "error";
  data: {
    // 백엔드에서 오는 데이터와 필드명을 일치시킵니다.
    message?: string;
    channel?: string;
    progress?: number;
    s3_url?: string; // completed 이벤트에서 사용
    // 아래 필드는 프론트엔드에서 직접 사용하지 않지만, 백엔드 응답에 포함될 수 있습니다.
    book_id?: number;
    book_title?: string;
    content_length?: number;
    error_message?: string;
    task_id?: string;
    timestamp?: string;
  };
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

// 새로운 비동기 PDF 업로드로 책 생성
export const uploadBookAsync = async (
  title: string,
  pdfFile: File
): Promise<AsyncUploadResponse> => {
  try {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("pdf", pdfFile);

    const response = await axios.post<AsyncUploadResponse>(
      ENDPOINTS.books.uploadPdfAsync,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to upload book asynchronously:", error);
    throw error;
  }
};

// 책 처리 상태 조회
export const getBookStatus = async (
  bookId: number
): Promise<BookStatusResponse> => {
  try {
    const response = await axios.get<BookStatusResponse>(
      ENDPOINTS.books.getStatus(bookId.toString())
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to get book status for book ${bookId}:`, error);
    throw error;
  }
};

// SSE 연결 설정
export const connectToBookProcessingSSE = async (
  bookId: number
): Promise<SSEConnectionResponse> => {
  try {
    const response = await axios.get<SSEConnectionResponse>(
      ENDPOINTS.books.getEventStream(bookId.toString())
    );
    return response.data;
  } catch (error) {
    console.error(`Failed to connect to SSE for book ${bookId}:`, error);
    throw error;
  }
};

// SSE EventSource 생성 헬퍼 함수
export const createBookProcessingEventSource = (
  bookId: number,
  onMessage: (event: SSEEventData) => void,
  onError: (error: Event) => void
): EventSource => {
  const eventSource = new EventSource(
    `${ENDPOINTS.books.getEventStream(bookId.toString())}`
  );

  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      onMessage(data);
    } catch (error) {
      console.error("Failed to parse SSE message:", error);
    }
  };

  eventSource.onerror = (error) => {
    console.error("SSE connection error:", error);
    onError(error);
  };

  return eventSource;
};

// 새로운 fetch 기반 SSE 스트림 처리 함수 (AuthContext 토큰 사용)
export const createBookProcessingStream = async (
  taskId: string,
  onMessage: (event: SSEEventData) => void,
  onError: (error: string) => void,
  onComplete: () => void
): Promise<() => void> => {
  let isAborted = false;
  const abortController = new AbortController();

  // AuthContext에서 토큰 가져오기
  const token = localStorage.getItem("auth_token");
  console.log("🔐 SSE 요청 토큰:", token ? "토큰 있음" : "토큰 없음");
  console.log(
    "🔐 SSE 요청 URL:",
    ENDPOINTS.books.getEventStream(taskId.toString())
  );

  try {
    const headers: Record<string, string> = {
      Accept: "text/event-stream",
      // Accept: "application/json", // 임시
    };

    // 토큰이 있으면 Authorization 헤더 추가
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log("🔐 Authorization 헤더 추가됨");
    } else {
      console.log("⚠️ 토큰이 없어서 Authorization 헤더 없음");
    }

    console.log("🔐 SSE 요청 헤더:", headers);

    const response = await fetch(
      ENDPOINTS.books.getEventStream(taskId.toString()),
      {
        method: "GET",
        headers,
        signal: abortController.signal,
      }
    );

    console.log("🔐 SSE 응답 상태:", response.status, response.statusText);
    console.log(
      "🔐 SSE 응답 헤더:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body is null");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let currentEvent = "message"; // 기본 이벤트 타입

    const readStream = async () => {
      try {
        while (!isAborted) {
          const { done, value } = await reader.read();

          if (done) {
            console.log("SSE stream completed");
            onComplete();
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          console.log("📡 SSE 데이터 청크:", chunk);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.slice(7).trim();
            } else if (line.startsWith("data: ") && line.length > 6) {
              try {
                const jsonData = JSON.parse(line.slice(6));
                const eventData: SSEEventData = {
                  event: currentEvent as
                    | "connected"
                    | "test"
                    | "started"
                    | "progress"
                    | "completed"
                    | "error",
                  data: jsonData,
                };
                console.log("SSE 파싱된 데이터:", eventData);
                onMessage(eventData);
              } catch (error) {
                console.error("Failed to parse SSE data:", error);
              }
            }
          }
        }
      } catch (error) {
        if (!isAborted) {
          console.error("Stream reading error:", error);
          onError(
            error instanceof Error ? error.message : "Stream reading error"
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
    console.error("Failed to create SSE stream:", error);
    onError(
      error instanceof Error ? error.message : "Failed to create SSE stream"
    );

    // 빈 cleanup 함수 반환
    return () => {};
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
