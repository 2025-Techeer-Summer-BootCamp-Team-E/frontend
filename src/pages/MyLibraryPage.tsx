import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import BooksSection from "../components/BooksSection";
import BookUploadModal from "../components/BookUploadModal";
import { useAuth } from "../hooks/useAuth";
import {
  getOfficialBooks,
  getVideosByBookId,
  uploadBook,
} from "../api/bookApi";
import { getCharactersByBookId } from "../api/characterApi";
import type { BookApiResponse, VideoApiResponse } from "../api/bookApi";
import { useAppStore } from "../stores/appStore";

// utils (한글 조사 구분 함수)
import { getKoreanParticle } from "../utils/koreanUtils";

// assets
import BookFloor from "../assets/Images/BookFloor.svg";
import SearchIcon from "../assets/Icons/SearchIcon.svg";
import VideoThumbnail from "../components/VideoThumbnail";

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

  // 책 목록 데이터
  const [books, setBooks] = useState<Book[]>([]);
  // 책 목록 로딩 상태
  const [booksLoading, setBooksLoading] = useState(true);
  // 영상 목록 데이터
  const [videos, setVideos] = useState<VideoData[]>([]);
  // 영상 목록 로딩 상태
  const [videosLoading, setVideosLoading] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setBooksLoading(true); // 로딩 상태 시작

        // bookApi를 사용하여 공식 책 목록 API 호출
        const data = await getOfficialBooks();

        // API 응답을 Book 타입(interface)에 맞게 변환
        const transformedBooks: Book[] = data.map((book: BookApiResponse) => ({
          id: book.book_id, // book_id -> id 매핑
          src:
            book.pdf_url || // PDF URL이 있으면 사용, 없으면 플레이스홀더 이미지
            "https://via.placeholder.com/400x600/DCAC62/FFFFFF?text=" +
              encodeURIComponent(book.title),
          alt: book.title, // 이미지 alt 속성
          title: book.title, // 책 제목
        }));

        setBooks(transformedBooks); // 변환된 책 목록 상태 업데이트
      } catch (error) {
        console.error("Failed to fetch books:", error);
        // 에러 발생 시 빈 배열로 설정하여 UI 깨짐 방지
        setBooks([]);
      } finally {
        setBooksLoading(false); // 로딩 상태 종료
      }
    };

    fetchBooks(); // 함수 실행
  }, []); // 의존성 배열이 빈 배열이 컴포넌트 마운트 시에만 실행

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
      <div className="min-h-screen bg-[#F8F3ED] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DCAC62] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">인증 확인 중...</p>
        </div>
      </div>
    );
  }

  // 영상 생성 클릭 핸들러
  const handleCreateVideo = async () => {
    if (!selectedBook) {
      alert("책을 선택해주세요.");
      return;
    }

    setIsLoading(true); // 로딩 화면 표시

    try {
      // 선택된 책의 캐릭터 목록 API 호출
      const charactersData = await getCharactersByBookId(selectedBook.id);

      // 캐릭터 정보에서 scenes를 제외한 최소 정보만 저장
      const minimalCharacters = charactersData.map((c) => ({
        id: c.id,
        characterName: c.characterName,
        isMain: c.isMain,
        age: c.age,
        gender: c.gender,
        characterDescription: c.characterDescription,
      }));

      // Zustand store에 책 세션 정보 저장
      setBookSession(selectedBook.id, selectedBook.title, minimalCharacters);

      // API 응답 완료 후 캐릭터 데이터와 함께 페이지 이동
      navigate("/char", {
        state: {
          characters: minimalCharacters,
          bookTitle: selectedBook.title,
          bookId: selectedBook.id,
        },
      });
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

  // 책 업로드 핸들러
  const handleBookUpload = async (title: string, pdfFile: File) => {
    setIsUploadLoading(true);
    try {
      // 책 업로드 API 호출
      const newBook = await uploadBook(title, pdfFile);

      // 새 책을 책 목록에 추가
      const transformedBook = {
        id: newBook.book_id,
        src:
          newBook.pdf_url ||
          `https://via.placeholder.com/400x600/DCAC62/FFFFFF?text=${encodeURIComponent(newBook.title)}`,
        alt: newBook.title,
        title: newBook.title,
      };

      setBooks((prevBooks) => [...prevBooks, transformedBook]);

      // 새 책을 선택하고 모달 닫기
      setSelectedBookIndex(books.length);
      setIsUploadModalOpen(false);

      alert(`'${title}' 책이 성공적으로 추가되었습니다!`);
    } catch (error) {
      console.error("Book upload failed:", error);
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

      {/* Main Content - with top padding to account for fixed header */}
      <main className="pt-[180px] flex flex-col items-center">
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
                books={books}
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
                  {/* Navigation arrows */}
                  <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {/* Video cards container */}
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex gap-[40px] pb-4 px-12">
                      {selectedBookVideos.map((video, index) => (
                        <VideoThumbnail key={index} imageUrl={video.imageUrl} />
                      ))}
                      {/* Add empty card for "더 만들어볼까요?" */}
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
                          영상을 하나 더 만들어볼까요?
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Pagination dots - only show when there are videos */}
              {selectedBookVideos.length > 0 && (
                <div className="flex justify-center mt-8 gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#DCAC62]"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
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
      />
    </div>
  );
};

export default MyLibraryPage;
