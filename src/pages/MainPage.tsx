import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BooksSection from "../components/BooksSection";
import VideoInfoFetch from "../components/VideoInfoFetch";
import Toggle from "../components/Toggle";

// assets
import BookFloor from "../assets/Images/BookFloor.svg";
import SearchIcon from "../assets/Icons/SearchIcon.svg";

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"books" | "vlog">("books");
  const [isScrolled, setIsScrolled] = useState(false);
  const [bookFilter, setBookFilter] = useState<"service" | "uploaded">(
    "service"
  );

  useEffect(() => {
    const handleScroll = () => {
      // 스크롤이 80px 이상일 때 header 스타일 변경
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Header with Toggle Navigation */}
      <Header
        showNavigation={true}
        navigationComponent={
          <Toggle selected={activeTab} onSelectionChange={setActiveTab} />
        }
        isScrolled={isScrolled}
      />

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
            <BooksSection />
          </section>
        </div>
        <img
          src={BookFloor}
          alt="BookFloor"
          className="xl:w-[91.5rem] 2xl:w-[116.5rem] drop-shadow-floor"
        />

        {/* Video List Section */}
        <section className="mt-[72px] px-[52px] pb-[120px]">
          <h2 className="text-[32px] font-bold text-black mb-8">
            카라마조프가의 형제들 로 만든 VLOG 목록
          </h2>
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
                <VideoInfoFetch />
                {/* Add empty card for "더 만들어볼까요?" */}
                <div className="flex-shrink-0 w-[400px] h-[200px] border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50 cursor-pointer transition-colors">
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

          {/* Pagination dots */}
          <div className="flex justify-center mt-8 gap-2">
            <div className="w-2 h-2 rounded-full bg-[#DCAC62]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default MainPage;
