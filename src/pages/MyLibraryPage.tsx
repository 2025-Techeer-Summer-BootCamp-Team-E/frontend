import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BooksSection from "../components/BooksSection";
import BookUploadModal from "../components/BookUploadModal";
import { useAuth } from "../hooks/useAuth";
import {
  getOfficialBooks,
  getVideosByBookId,
  uploadBookAsync,
  createBookProcessingStream,
} from "../api/bookApi";
import {
  getCharactersByBookIdAsync,
  createCharacterProcessingStream,
  type CharacterSSEEventData,
} from "../api/characterApi";
import type {
  BookApiResponse,
  VideoApiResponse,
  AsyncUploadResponse,
  SSEEventData,
} from "../api/bookApi";
import { useAppStore } from "../stores/appStore";
import VideoModal from "../components/VideoModal";
import VideoCarousel from "../components/VideoCarousel";

// utils (한글 조사 구분 함수)
import { getKoreanParticle } from "../utils/koreanUtils";

// assets
import BookFloor from "../assets/images/BookFloor.svg";
import SearchIcon from "../assets/icons/SearchIcon.svg";

// 랜덤 placeholder 이미지 import
import sampleCover1 from "../assets/images/sample_cover1.png";
import sampleCover2 from "../assets/images/sample_cover2.png";
import sampleCover3 from "../assets/images/sample_cover3.png";
import sampleCover4 from "../assets/images/sample_cover4.png";

// 책 데이터 타입
interface Book {
  id: number;
  src: string;
  alt: string;
  title: string;
}

// 영상 데이터 타입 (API 응답을 UI에 맞게 변환된 형태)
interface VideoData {
  imageUrl: string;
  videoUrl: string;
  videoId: number;
}

const MyLibraryPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Zustand store 사용
  const { setBookSession, clearAllScripts } = useAppStore();

  // 인증되지 않은 사용자 리다이렉트
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/auth");
    }
  }, [authLoading, isAuthenticated, navigate]);

  // 메인 페이지 진입 시 스크립트 캐시 정리 (선택적)
  useEffect(() => {
    // 메인 페이지로 돌아왔을 때 모든 스크립트 캐시 정리
    clearAllScripts();
  }, [clearAllScripts]);

  const [bookFilter, setBookFilter] = useState<"service" | "uploaded">(
    "service"
  );
  // 현재 선택된 책의 인덱스
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(0); // 첫 번째 책 기본 선택
  // 영상 생성 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 책 업로드 모달 상태
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태

  // 새로운 비동기 업로드 관련 상태
  const [uploadProgress, setUploadProgress] = useState<string>("");
  const [uploadingBookId, setUploadingBookId] = useState<number | null>(null);
  const [sseCleanup, setSseCleanup] = useState<(() => void) | null>(null);
  // 업로드 로딩 모달 상태 추가
  const [isUploadProcessing, setIsUploadProcessing] = useState(false);
  const [uploadBookTitle, setUploadBookTitle] = useState<string>("");
  // 완료 상태 추가
  const [isUploadCompleted, setIsUploadCompleted] = useState(false);

  // 인물 생성 관련 상태 추가
  const [isCharacterProcessing, setIsCharacterProcessing] = useState(false);
  const [characterProgress, setCharacterProgress] = useState<string>("");
  const [characterBookTitle, setCharacterBookTitle] = useState<string>("");
  const [characterCleanup, setCharacterCleanup] = useState<(() => void) | null>(
    null
  );

  // 책 목록 데이터
  const [books, setBooks] = useState<Book[]>([]);
  // 책 목록 로딩 상태
  const [booksLoading, setBooksLoading] = useState(true);
  // 영상 목록 데이터
  const [videos, setVideos] = useState<VideoData[]>([]);
  // 영상 목록 로딩 상태
  const [videosLoading, setVideosLoading] = useState(false);
  // 선택한 영상의 url 상태
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);

  // uploadProgress 상태 변화 모니터링
  useEffect(() => {
    console.log("uploadProgress 상태 변경됨:", uploadProgress);
  }, [uploadProgress]);

  // SSE 연결 정리
  useEffect(() => {
    return () => {
      if (sseCleanup) {
        sseCleanup();
      }
      if (characterCleanup) {
        characterCleanup();
      }
    };
  }, [sseCleanup, characterCleanup]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true); // 로딩 상태 시작

        // bookApi를 사용하여 공식 책 목록 API 호출
        const data = await getOfficialBooks();

        console.log(data);

        // API 응답을 Book 타입(interface)에 맞게 변환
        const transformedBooks: Book[] = data.map((book: BookApiResponse) => {
          // 책 ID를 기반으로 일관된 랜덤 이미지 선택
          const placeholderImages = [
            sampleCover1,
            sampleCover2,
            sampleCover3,
            sampleCover4,
          ];
          const randomIndex = book.book_id % placeholderImages.length;

          return {
            id: book.book_id, // book_id -> id 매핑
            src: book.cover_url || placeholderImages[randomIndex],
            alt: book.title, // 이미지 alt 속성
            title: book.title, // 책 제목
          };
        });

        setBooks(transformedBooks); // 변환된 책 목록 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // 에러 발생 시 빈 배열로 설정하여 UI 깨짐 방지
        setBooks([]);
      } finally {
        setBooksLoading(false); // 로딩 상태 종료
      }
    };

    // 🔒 인증 완료 && 로그인된 상태에서만 호출
    if (!authLoading && isAuthenticated) {
      fetchBooks();
    }
  }, [authLoading, isAuthenticated]); // 의존성 배열이 빈 배열이 컴포넌트 마운트 시에만 실행

  // const filteredBooks = () => {
  //   if (!searchTerm) return books; // 검색어가 없으면 전체 목록 반환
  //   return books.filter((book) =>
  //     book.title.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // }
  // useMemo로 성능 최적화
  const filteredBooks = useMemo(() => {
    if (!searchTerm) return books; // 검색어가 없으면 전체 목록 반환
    return books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [books, searchTerm]);

  // 현재 선택된 책 객체
  const selectedBook = books[selectedBookIndex];

  // 선택된 책의 영상 목록 조회
  useEffect(() => {
    const fetchVideos = async () => {
      if (!selectedBook) {
        setVideos([]);
        return;
      }

      try {
        setVideosLoading(true);
        const videoData = await getVideosByBookId(selectedBook.id);

        // API 응답을 VideoData 타입에 맞게 변환
        const transformedVideos: VideoData[] = videoData.map(
          (video: VideoApiResponse) => ({
            videoId: video.video_id,
            videoUrl: video.video_url,
            imageUrl: video.thumbnail_url,
          })
        );

        setVideos(transformedVideos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
        setVideos([]);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchVideos();
  }, [selectedBook]); // selectedBook가 변경될 때마다 실행
  // 선택된 책에 해당하는 영상 목록
  const selectedBookVideos = videos;
  // 한글 조사 처리 ("로" 또는 "으로")
  const particle = selectedBook ? getKoreanParticle(selectedBook.title) : "로";

  // 인증 로딩 중이면 로딩 화면 표시
  if (authLoading) {
    return (
      <div
        className="min-h-screen bg-[#F8F3ED] relative overflow-auto"
        style={{ contain: "layout" }}
      >
        {/* 로딩 중에도 동일한 레이아웃 구조 유지 */}
        <main
          className="pt-[160px] flex flex-col items-center relative"
          style={{ contain: "layout" }}
        >
          <section className="text-center py-[80px] px-4">
            <h1 className="text-[48px] font-bold text-black mb-4 font-NanumMyeongjo">
              어떤 이야기로 VLOG를 만들어볼까요?
            </h1>
            <p className="text-[20px] text-gray-600">
              책을 선택하거나, 직접 텍스트를 업로드하여 시작해보세요.
            </p>
          </section>

          <div
            className="xl:w-[84rem] 2xl:w-[107rem] mx-4 mb-0 bg-white rounded-t-[50px] drop-shadow-[0_8px_32px_rgba(0,0,0,0.25)] relative h-[800px]"
            style={{ contain: "layout" }}
          >
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DCAC62] mx-auto mb-4"></div>
                <p className="text-lg text-gray-600">인증 확인 중...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 인물 생성 클릭 핸들러
  const handleCreateVideo = async () => {
    if (!selectedBook) {
      alert("책을 선택해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 화면 표시

    try {
      // 비동기 인물 생성 API 호출
      const characterResponse = await getCharactersByBookIdAsync(
        selectedBook.id
      );

      // 응답 타입에 따라 처리
      if ("task_id" in characterResponse) {
        // 새로운 인물 생성이 필요한 경우 (비동기)
        console.log("새로운 인물 생성 시작:", characterResponse);
        setCharacterBookTitle(characterResponse.book_title);
        setCharacterProgress("인물 생성 시작 중...");
        setIsCharacterProcessing(true);

        // SSE 연결 설정
        let cleanupFunc: (() => void) | null = null;

        const createCharacterSSEConnection = async () => {
          cleanupFunc = await createCharacterProcessingStream(
            characterResponse.task_id,
            (eventData: CharacterSSEEventData) => {
              console.log("Character SSE Event received:", eventData);

              if (eventData.event === "connected") {
                const message = "연결 성공! AI가 등장인물을 분석하고 있어요";
                console.log("🔗 [Character SSE] 연결 성공 - 메시지:", message);
                setCharacterProgress(message);
              } else if (eventData.event === "progress") {
                let message = "인물 분석 중...";

                if (eventData.data.step === "character_extraction") {
                  message = `캐릭터 추출 중... (${eventData.data.processed_chunks}/${eventData.data.total_chunks})`;
                } else if (eventData.data.step === "character_merging") {
                  message = "캐릭터 병합 및 중복 제거 중...";
                } else if (eventData.data.step === "scene_generation") {
                  message = `장면 생성 및 저장 중... (${eventData.data.processed_characters}/${eventData.data.total_characters})`;
                }

                console.log("📊 [Character SSE] 진행 중 - 메시지:", message);
                setCharacterProgress(message);
              } else if (eventData.event === "completed") {
                const message = `인물 생성 완료! 총 ${eventData.data.total_characters}명의 캐릭터가 생성되었습니다.`;
                console.log("✅ [Character SSE] 완료 - 메시지:", message);
                setCharacterProgress(message);

                // 완료된 캐릭터 정보 저장
                if (eventData.data.characters) {
                  const minimalCharacters = eventData.data.characters.map(
                    (c) => ({
                      id: c.id,
                      characterName: c.characterName,
                      isMain: c.isMain,
                      age: c.age,
                      gender: c.gender,
                      characterDescription: c.characterDescription,
                    })
                  );

                  // Zustand store에 책 세션 정보 저장
                  setBookSession(
                    selectedBook.id,
                    selectedBook.title,
                    minimalCharacters
                  );

                  // 페이지 이동
                  navigate("/char", {
                    state: {
                      characters: minimalCharacters,
                      bookTitle: selectedBook.title,
                      bookId: selectedBook.id,
                    },
                  });
                }

                // 2초 후 모달 닫기
                setTimeout(() => {
                  setCharacterCleanup(null);
                  setIsCharacterProcessing(false);
                  setCharacterProgress("");
                  setCharacterBookTitle("");
                }, 2000);
              } else if (eventData.event === "error") {
                const message = `오류가 발생했어요: ${eventData.data.error_message || "알 수 없는 오류"}`;
                console.log("❌ [Character SSE] 오류 - 메시지:", message);
                setCharacterProgress(message);
                setCharacterCleanup(null);
                setIsCharacterProcessing(false);
                setCharacterProgress("");
                setCharacterBookTitle("");
                alert(
                  `인물 생성 중 오류가 발생했습니다: ${eventData.data.error_message || "알 수 없는 오류"}`
                );
              }
            },
            (error) => {
              console.error("Character SSE Error:", error);
              setCharacterProgress("연결 오류가 발생했어요");
              setCharacterCleanup(null);
              setIsCharacterProcessing(false);
              setCharacterProgress("");
              setCharacterBookTitle("");
            },
            () => {
              console.log("Character SSE stream completed");
              setCharacterCleanup(null);
            }
          );

          if (cleanupFunc) {
            setCharacterCleanup(() => cleanupFunc);
          }
        };

        await createCharacterSSEConnection();
      } else {
        // 이미 인물이 존재하는 경우 (동기)
        console.log("기존 인물 조회:", characterResponse);
        const minimalCharacters = characterResponse.characters.map((c) => ({
          id: c.id,
          characterName: c.characterName,
          isMain: c.isMain,
          age: c.age,
          gender: c.gender,
          characterDescription: c.characterDescription,
        }));

        // Zustand store에 책 세션 정보 저장
        setBookSession(selectedBook.id, selectedBook.title, minimalCharacters);

        // 페이지 이동
        navigate("/char", {
          state: {
            characters: minimalCharacters,
            bookTitle: selectedBook.title,
            bookId: selectedBook.id,
          },
        });
      }
    } catch (error) {
      console.error("Failed to fetch characters:", error);

      // 에러 타입에 따른 상세 메시지
      let errorMessage = "캐릭터 정보를 불러오는데 실패했습니다.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number };
          code?: string;
        };
        if (axiosError.response?.status === 500) {
          errorMessage = `서버에서 캐릭터 생성 중 오류가 발생했습니다.`;
        } else if (axiosError.response?.status === 404) {
          errorMessage = "해당 책을 찾을 수 없습니다.";
        } else if (axiosError.code === "ERR_NETWORK") {
          errorMessage = "네트워크 연결을 확인해주세요.";
        }
      }

      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // 기존 동기 책 업로드 핸들러 (주석처리)
  // const handleBookUpload = async (title: string, pdfFile: File) => {
  //   setIsUploadLoading(true);
  //   try {
  //     // 책 업로드 API 호출
  //     const newBook = await uploadBook(title, pdfFile);

  //     // 새 책을 책 목록에 추가
  //     const transformedBook = {
  //       id: newBook.book_id,
  //       src:
  //         newBook.pdf_url ||
  //         `https://via.placeholder.com/400x600/DCAC62/FFFFFF?text=${encodeURIComponent(newBook.title)}`,
  //       alt: newBook.title,
  //       title: newBook.title,
  //     };

  //     setBooks((prevBooks) => [...prevBooks, transformedBook]);

  //     // 새 책을 선택하고 모달 닫기
  //     setSelectedBookIndex(books.length);
  //     setIsUploadModalOpen(false);

  //     alert(`'${title}' 책이 성공적으로 추가되었습니다!`);
  //   } catch (error) {
  //     console.error("Book upload failed:", error);
  //     alert("책 업로드에 실패했습니다. 다시 시도해주세요.");
  //   } finally {
  //     setIsUploadLoading(false);
  //   }
  // };

  // 새로운 비동기 책 업로드 핸들러 (SSE 포함)
  const handleBookUpload = async (title: string, pdfFile: File) => {
    setIsUploadLoading(true);
    setUploadProgress("업로드 시작 중...");
    setUploadBookTitle(title);
    setIsUploadCompleted(false); // 완료 상태 초기화

    // 기존 업로드 모달 닫고 새로운 로딩 모달 시작
    setIsUploadModalOpen(false);
    setIsUploadProcessing(true);

    try {
      // 비동기 책 업로드 API 호출
      const uploadResponse: AsyncUploadResponse = await uploadBookAsync(
        title,
        pdfFile
      );

      console.log("Upload response:", uploadResponse);
      setUploadingBookId(uploadResponse.book_id);
      setUploadProgress("업로드 완료! 처리 중...");

      // SSE 연결 설정 - cleanup 함수를 미리 정의
      let cleanupFunc: (() => void) | null = null;

      const createSSEConnection = async () => {
        cleanupFunc = await createBookProcessingStream(
          uploadResponse.task_id,
          (eventData: SSEEventData) => {
            console.log("SSE Event received:", eventData);
            console.log("현재 uploadProgress 상태:", uploadProgress);

            if (eventData.event === "connected") {
              const message = "연결 성공! AI가 책을 분석하고 있어요";
              console.log("🔗 [SSE] 연결 성공 - 메시지:", message);
              setUploadProgress(() => {
                console.log("setUploadProgress 함수형 호출 - connected");
                return message;
              });
            } else if (eventData.event === "test") {
              const message = "테스트 연결 확인 중...";
              console.log("🧪 [TEST] 테스트 이벤트 - 메시지:", message);
              setUploadProgress(() => {
                console.log("setUploadProgress 함수형 호출 - test");
                return message;
              });
            } else if (eventData.event === "started") {
              const message = "PDF 분석을 시작했어요! 잠시만 기다려주세요";
              console.log("🚀 [STARTED] 처리 시작 - 메시지:", message);
              setUploadProgress(() => {
                console.log("setUploadProgress 함수형 호출 - started");
                return message;
              });
            } else if (eventData.event === "progress") {
              const message = "AI가 책 내용을 분석하고 있어요...";
              console.log("📊 [PROGRESS] 진행 중 - 메시지:", message);
              setUploadProgress(() => {
                console.log("setUploadProgress 함수형 호출 - progress");
                return message;
              });
            } else if (eventData.event === "completed") {
              const message = "처리 완료!";
              console.log("✅ [COMPLETED] 완료 - 메시지:", message);
              setUploadProgress(() => {
                console.log("setUploadProgress 함수형 호출 - completed");
                return message;
              });
              setIsUploadCompleted(true); // 완료 상태 설정

              // 완료된 책을 목록에 추가
              const transformedBook = {
                id: uploadResponse.book_id,
                src:
                  eventData.data.s3_url || // pdf_url → s3_url 변경
                  `https://via.placeholder.com/400x600/DCAC62/FFFFFF?text=${encodeURIComponent(title)}`,
                alt: title,
                title: title,
              };

              setBooks((prevBooks) => [...prevBooks, transformedBook]);
              setSelectedBookIndex(books.length);

              // 2초 후 모달 닫기 (체크 표시 애니메이션을 보여주기 위해)
              setTimeout(() => {
                setSseCleanup(null);
                setIsUploadModalOpen(false);
                setUploadingBookId(null);
                setUploadProgress("");
                setIsUploadProcessing(false);
                setUploadBookTitle("");
                setIsUploadCompleted(false);
              }, 1000);
            } else if (eventData.event === "error") {
              const message = `오류가 발생했어요: ${eventData.data.message || eventData.data.error_message || "알 수 없는 오류"}`;
              console.log("❌ [ERROR] 오류 - 메시지:", message);
              setUploadProgress(() => {
                console.log("setUploadProgress 함수형 호출 - error");
                return message;
              });
              setSseCleanup(null);
              setUploadingBookId(null);
              setIsUploadProcessing(false);
              setUploadBookTitle("");
              setIsUploadCompleted(false);
              alert(
                `처리 중 오류가 발생했습니다: ${eventData.data.message || eventData.data.error_message || "알 수 없는 오류"}`
              );
            }
          },
          (error) => {
            console.error("SSE Error:", error);
            setUploadProgress("연결 오류가 발생했어요");
            setSseCleanup(null);
            setUploadingBookId(null);
            setIsUploadProcessing(false);
            setUploadBookTitle("");
            setIsUploadCompleted(false);
          },
          () => {
            console.log("SSE stream completed");
            setSseCleanup(null);
          }
        );

        if (cleanupFunc) {
          setSseCleanup(() => cleanupFunc);
        }
      };

      await createSSEConnection();
    } catch (error) {
      console.error("Book upload failed:", error);
      setUploadProgress("");
      setUploadingBookId(null);
      setIsUploadProcessing(false);
      setUploadBookTitle("");
      setIsUploadCompleted(false);
      alert("책 업로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsUploadLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md">
            <div className="w-24 h-24 mb-4">
              {/* 로딩 애니메이션 - 회전하는 원 */}
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#DCAC62]"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700 text-center mb-3">
              {selectedBook ? `『${selectedBook.title}』의` : "책의"} <br />
              등장인물을 분석하고 있어요!
            </p>
            <div className="text-sm text-gray-500 text-center space-y-1">
              <p>🤖 AI가 책 내용을 분석 중입니다</p>
              <p>📚 등장인물의 성격과 관계를 파악 중입니다</p>
              <p className="text-xs text-gray-400 mt-2">
                새로 업로드한 책의 경우
                <br />
                3-5분 정도 소요될 수 있습니다
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 인물 생성 처리 로딩 모달 */}
      {isCharacterProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md">
            <div className="w-24 h-24 mb-4">
              {/* 로딩 애니메이션 - 회전하는 원 */}
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#DCAC62]"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700 text-center mb-3">
              『{characterBookTitle}』의 등장인물을 분석하고 있어요!
            </p>
            <div className="text-sm text-gray-500 text-center space-y-1">
              <p>🤖 AI가 책 내용을 분석 중입니다</p>
              <p>👥 등장인물의 성격과 관계를 파악 중입니다</p>
              <p className="text-xs text-gray-400 mt-2">{characterProgress}</p>
            </div>
          </div>
        </div>
      )}

      {/* 업로드 처리 로딩 모달 */}
      {isUploadProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md">
            <div className="w-24 h-24 mb-4">
              {isUploadCompleted ? (
                // 완료 시 체크 표시 애니메이션
                <div className="w-24 h-24 flex items-center justify-center">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                </div>
              ) : (
                // 로딩 애니메이션 - 회전하는 원
                <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#DCAC62]"></div>
              )}
            </div>

            {uploadProgress !== "처리 완료!" ? (
              <p className="text-lg font-semibold text-gray-700 text-center mb-3">
                『{uploadBookTitle}』을 처리하고 있어요!
              </p>
            ) : (
              <p className="text-lg font-semibold text-gray-700 text-center mb-3">
                『{uploadBookTitle}』 분석 완료!
              </p>
            )}

            {uploadProgress !== "처리 완료!" ? (
              <div className="text-sm text-gray-500 text-center space-y-1">
                <p>📚 PDF 파일을 분석 중입니다</p>
                <p>🤖 AI가 책 내용을 이해하고 있어요</p>
                <p className="text-xs text-gray-400 mt-2">{uploadProgress}</p>
              </div>
            ) : (
              <div className="text-sm text-gray-500 text-center space-y-1">
                {/* <p className="text-xs text-gray-400 mt-2">{uploadProgress}</p> */}
              </div>
            )}
            {/* <div className="text-sm text-gray-500 text-center space-y-1">

              <p>📚 PDF 파일을 분석 중입니다</p>
              <p>🤖 AI가 책 내용을 이해하고 있어요</p>
              <p className="text-xs text-gray-400 mt-2">{uploadProgress}</p>
            </div> */}
          </div>
        </div>
      )}

      {/* Main Content - with top padding to account for fixed header */}
      <main
        className="pt-[160px] flex flex-col items-center relative"
        style={{ contain: "layout" }}
      >
        {/* Hero Section */}
        <section className="text-center py-[80px] px-4">
          <h1 className="text-[48px] font-bold text-black mb-4 font-NanumMyeongjo">
            어떤 이야기로 VLOG를 만들어볼까요?
          </h1>
          <p className="text-[20px] text-gray-600">
            책을 선택하거나, 직접 텍스트를 업로드하여 시작해보세요.
          </p>
        </section>

        {/* Search and Books Container */}
        <div className="xl:w-[84rem] 2xl:w-[107rem] mx-4 mb-0 bg-white rounded-t-[50px] drop-shadow-[0_8px_32px_rgba(0,0,0,0.25)]">
          {/* Search Section */}
          <section className="flex justify-between p-[2rem]">
            {/* Book Filter Tabs */}
            <div className="flex gap-8 mx-4">
              <button
                onClick={() => setBookFilter("service")}
                className={`text-[1.25rem] font-bold cursor-pointer border-b-2 transition-colors ${
                  bookFilter === "service"
                    ? "text-[#604317] border-[#604317]"
                    : "text-[#B1AAA2] border-transparent hover:text-[#604317]"
                }`}
              >
                서비스 제공 책
              </button>
              <button
                onClick={() => setBookFilter("uploaded")}
                className={`text-[1.25rem] font-bold cursor-pointer border-b-2 transition-colors ${
                  bookFilter === "uploaded"
                    ? "text-[#604317] border-[#604317]"
                    : "text-[#B1AAA2] border-transparent hover:text-[#604317]"
                }`}
              >
                내가 업로드한 책
              </button>
            </div>

            {/* Search Controls */}
            <div className="flex xl:w-[312px] 2xl:w-[344px] h-[48px] items-center justify-between">
              <span className="text-[1.25rem] font-bold text-[#604317] cursor-pointer">
                전체보기
              </span>
              <div className="relative xl:w-[224px] 2xl:w-[244px]">
                <input
                  type="text"
                  placeholder="작품명으로 검색"
                  className="w-full bg-[#E4E4E4] px-4 py-3 pr-10 rounded-full text-[16px] text-[#9F9494] focus:outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <img
                  src={SearchIcon}
                  alt="SearchIcon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                />
              </div>
            </div>
          </section>

          {/* Books Grid Section */}
          <section>
            {booksLoading ? (
              <div className="flex justify-center p-10 pb-0 items-end min-h-[400px]">
                <div className="flex items-end justify-center gap-8">
                  {/* 로딩 스켈레톤 - 더 예쁜 책 모양 */}
                  {[...Array(5)].map((_, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center group"
                    >
                      <div className="relative">
                        {/* 책 스켈레톤 */}
                        <div
                          className="animate-pulse bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-lg"
                          style={{ width: 220, height: 320 }}
                        >
                          {/* 책 등의 세로선 효과 */}
                          <div className="absolute left-4 top-0 bottom-0 w-1 bg-gray-400/50 rounded-full"></div>
                          {/* 책 제목 영역 */}
                          <div className="absolute top-6 left-6 right-6">
                            <div className="h-4 bg-gray-400/60 rounded mb-2"></div>
                            <div className="h-3 bg-gray-400/40 rounded w-3/4"></div>
                          </div>
                          {/* 책 이미지 영역 */}
                          <div className="absolute bottom-6 left-6 right-6 h-32 bg-gray-400/30 rounded"></div>
                        </div>

                        {/* 글리머 효과 */}
                        <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-lg"></div>
                      </div>

                      {/* 제목 스켈레톤 */}
                      <div className="mt-4 text-center">
                        <div className="animate-pulse h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div className="animate-pulse h-3 bg-gray-200 rounded w-16"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <BooksSection
                books={filteredBooks}
                selectedIndex={selectedBookIndex}
                onBookSelect={setSelectedBookIndex}
                onAddBook={() => setIsUploadModalOpen(true)}
              />
            )}
          </section>
        </div>
        <img
          src={BookFloor}
          alt="BookFloor"
          className="xl:w-[91.5rem] 2xl:w-[116.5rem] drop-shadow-floor relative z-0"
        />

        {/* Video List Section */}
        <section className="mt-[72px] px-[52px] pb-[120px]">
          {selectedBook ? (
            <>
              <h2 className="w-full text-[32px] font-bold text-black mb-8 flex justify-center">
                <span className="text-[#DCAC62]">{selectedBook.title}</span>
                <span className="text-black"> {particle} 만든 VLOG 목록</span>
              </h2>

              {videosLoading ? (
                // 영상 로딩 중
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DCAC62] mx-auto mb-4"></div>
                  <p className="text-[20px] text-gray-600">
                    영상 목록을 불러오는 중...
                  </p>
                </div>
              ) : selectedBookVideos.length === 0 ? (
                // 영상이 없는 경우
                <div className="text-center">
                  <p className="text-[20px] text-gray-600 mb-8">
                    아직 이 책으로 만든 영상이 없네요!
                  </p>
                  <div className="flex justify-center">
                    <div
                      onClick={handleCreateVideo}
                      className="flex-shrink-0 w-[400px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600 text-lg font-medium">
                        바로 첫 번째 영상을 만들어볼까요?
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // 영상이 있는 경우
                <div className="relative">
                  {/* Video cards container */}
                  <VideoCarousel
                    videos={selectedBookVideos}
                    onClickVideo={setSelectedVideoUrl}
                    onClickCreate={handleCreateVideo}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <p className="text-[20px] text-gray-600">책을 선택해주세요.</p>
            </div>
          )}
        </section>
      </main>

      {/* 책 업로드 모달 */}
      <BookUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleBookUpload}
        isLoading={isUploadLoading}
        uploadProgress={uploadProgress}
        uploadingBookId={uploadingBookId}
      />

      {selectedVideoUrl && (
        <VideoModal
          videoUrl={selectedVideoUrl}
          onClose={() => setSelectedVideoUrl(null)}
        />
      )}
    </div>
  );
};

export default MyLibraryPage;
