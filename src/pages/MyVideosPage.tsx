import React, { useState } from "react";
import VideoInfoFetch from "../components/VideoInfoFetch";

const MyVideosPage: React.FC = () => {
  const [sortBy, setSortBy] = useState<"latest" | "oldest" | "title">("latest");
  const [videoCount, setVideoCount] = useState<number>(0);

  const handleDataLoaded = (count: number) => {
    setVideoCount(count);
  };

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* Main Content - with top padding to account for fixed header */}
      <main className="pt-[180px] flex flex-col items-center">
        {/* Hero Section */}
        <section className="text-center py-[80px] px-4">
          <h1 className="text-[48px] font-bold text-black mb-4 font-NanumMyeongjo">
            내가 만든 VLOG 모음
          </h1>
          <p className="text-[20px] text-gray-600">
            지금까지 만들어온 나만의 에피소드 브이로그들을 확인해보세요.
          </p>
        </section>

        {/* Content Container */}
        <div className="xl:w-[84rem] 2xl:w-[107rem] mx-4 mb-0 bg-white rounded-t-[50px] drop-shadow-[0_8px_32px_rgba(0,0,0,0.25)] pb-[120px]">
          {/* Filter and Sort Section */}
          <section className="flex justify-between items-center mb-[80px] p-[2rem]">
            {/* Stats */}
            <div className="flex gap-8 mx-4">
              <div className="text-[20px]">
                <span className="font-bold text-[#604317]">
                  총 {videoCount}개
                </span>
                <span className="text-[#B1AAA2] ml-2">의 영상</span>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center gap-4">
              <span className="text-[20px] text-[#604317] font-medium">
                정렬:
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "latest" | "oldest" | "title")
                  }
                  className="appearance-none bg-[#E4E4E4] px-6 py-2 pr-12 rounded-full text-[20px] text-[#604317] font-medium focus:outline-none focus:border-[#C49952] focus:ring-2 focus:ring-[#DCAC62]/20 cursor-pointer hover:border-[#C49952] transition-colors shadow-sm"
                >
                  <option value="latest">최신순</option>
                  <option value="oldest">오래된순</option>
                  <option value="title">제목순</option>
                </select>
                {/* Custom dropdown arrow */}
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-[#604317]"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Videos List Section */}
          <section className="px-[2rem]">
            <div className="flex flex-col items-center">
              <VideoInfoFetch sortBy={sortBy} onDataLoaded={handleDataLoaded} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default MyVideosPage;
