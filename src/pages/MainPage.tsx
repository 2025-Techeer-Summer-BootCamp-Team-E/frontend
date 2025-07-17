import React, { useState } from "react";
import BooksSection from "../components/BooksSection";

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

// 영상 데이터 타입
interface VideoData {
  imageUrl: string;
}

// 한글 조사 처리 함수
const getKoreanParticle = (word: string): string => {
  if (!word) return "로";

  const lastChar = word[word.length - 1];
  const lastCharCode = lastChar.charCodeAt(0);

  // 한글 완성형 문자 범위 확인 (가-힣)
  if (lastCharCode >= 0xac00 && lastCharCode <= 0xd7a3) {
    // 받침 확인: (문자코드 - 0xAC00) % 28
    const finalConsonantIndex = (lastCharCode - 0xac00) % 28;

    // 받침이 없거나 'ㄹ' 받침인 경우 '로' 사용
    // ㄹ 받침의 인덱스는 8
    if (finalConsonantIndex === 0 || finalConsonantIndex === 8) {
      return "로";
    } else {
      return "으로";
    }
  }

  // 한글이 아닌 경우 기본값
  return "로";
};

const MainPage: React.FC = () => {
  const [bookFilter, setBookFilter] = useState<"service" | "uploaded">(
    "service"
  );
  const [selectedBookIndex, setSelectedBookIndex] = useState<number>(1); // 카라마조프가의 형제들 기본 선택
  const [isLoading, setIsLoading] = useState(false);

  // 책 목록 데이터
  const books: Book[] = [
    {
      id: 0,
      src: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/2090000149319.jpg",
      alt: "긴긴밤",
      title: "긴긴밤",
    },
    {
      id: 1,
      src: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788937461545.jpg",
      alt: "카라마조프가의 형제들",
      title: "카라마조프가의 형제들",
    },
    {
      id: 2,
      src: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791165345693.jpg",
      alt: "달러구트 꿈 백화점",
      title: "달러구트 꿈 백화점",
    },
    {
      id: 3,
      src: "https://image.aladin.co.kr/product/27106/90/cover500/e462538205_1.jpg",
      alt: "짧은 밤이지만 빛나고 있어",
      title: "짧은 밤이지만 빛나고 있어",
    },
  ];

  // 각 책별 영상 데이터
  const videoDataByBook: Record<number, VideoData[]> = {
    0: [
      // 긴긴밤
      { imageUrl: "https://picsum.photos/400/200?random=1" },
      { imageUrl: "https://picsum.photos/400/200?random=2" },
    ],
    1: [
      // 카라마조프가의 형제들
      { imageUrl: "https://picsum.photos/400/200?random=3" },
      { imageUrl: "https://picsum.photos/400/200?random=4" },
    ],
    2: [], // 달러구트 꿈 백화점 - 영상 없음
    3: [
      // 짧은 밤이지만 빛나고 있어
      { imageUrl: "https://picsum.photos/400/200?random=5" },
    ],
  };

  const selectedBook = books[selectedBookIndex];
  const selectedBookVideos = videoDataByBook[selectedBookIndex] || [];
  const particle = getKoreanParticle(selectedBook.title);

  // 영상 생성 클릭 핸들러
  const handleCreateVideo = () => {
    setIsLoading(true);

    // 1초 후 리다이렉트
    setTimeout(() => {
      window.location.href = "/char";
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Loading Screen */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center">
            <div className="w-24 h-24 mb-4">
              {/* 로딩 애니메이션 - 회전하는 원 */}
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#DCAC62]"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700 text-center">
              영상을 만들기 위해, <br />
              등장 인물을 분석하고 있어요!
            </p>
            {/* <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p> */}
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
          <section className="flex justify-between mb-[80px] p-[2rem]">
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
            <BooksSection
              books={books}
              selectedIndex={selectedBookIndex}
              onBookSelect={setSelectedBookIndex}
            />
          </section>
        </div>
        <img
          src={BookFloor}
          alt="BookFloor"
          className="xl:w-[91.5rem] 2xl:w-[116.5rem] drop-shadow-floor relative z-0"
        />

        {/* Video List Section */}
        <section className="mt-[72px] px-[52px] pb-[120px]">
          <h2 className="w-full text-[32px] font-bold text-black mb-8 flex justify-center">
            <span className="text-[#DCAC62]">{selectedBook.title}</span>
            <span className="text-black"> {particle} 만든 VLOG 목록</span>
          </h2>

          {selectedBookVideos.length === 0 ? (
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
        </section>
      </main>
    </div>
  );
};

export default MainPage;
