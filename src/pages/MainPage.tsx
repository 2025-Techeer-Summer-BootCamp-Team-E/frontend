import React, { useState } from "react";
import Header from "../components/Header";
import BooksSection from "../components/BooksSection";
import VideoInfoFetch from "../components/VideoInfoFetch";
import Toggle from "../components/Toggle";

const MainPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"books" | "vlog">("books");

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Header with Toggle Navigation */}
      <Header
        showNavigation={true}
        navigationComponent={
          <Toggle selected={activeTab} onSelectionChange={setActiveTab} />
        }
      />

      {/* Main Content - with top padding to account for fixed header */}
      <main className="pt-[180px]">
        {/* Hero Section */}
        <section className="text-center py-[80px] px-4">
          <h1 className="text-[48px] font-bold text-black mb-4">
            어떤 이야기로 VLOG를 만들어볼까요?
          </h1>
          <p className="text-[20px] text-gray-600">
            책을 선택하거나, 직접 텍스트를 업로드하여 시작해보세요.
          </p>
        </section>

        {/* Search Section */}
        <section className="flex justify-center mb-[80px] px-4">
          <div className="flex items-center gap-4 max-w-4xl w-full">
            <span className="text-[20px] font-medium text-gray-700">
              전체보기
            </span>
            <div className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder="작품, 장르나 토픽 검색..."
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-300 bg-white text-[16px] focus:outline-none focus:ring-2 focus:ring-[#DCAC62] focus:border-transparent"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </section>

        {/* Books Grid Section */}
        <section className="mb-[120px]">
          <BooksSection />
        </section>

        {/* Video List Section */}
        <section className="px-[52px] pb-[120px]">
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
