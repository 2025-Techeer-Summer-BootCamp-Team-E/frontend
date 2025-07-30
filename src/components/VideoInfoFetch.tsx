import React, { useState, useEffect } from "react";
import VideoInfo from "./VideoInfo";
import type { VideoInfoProps } from "./VideoInfo";
import { /*getBookmarkedVideos,*/ getVideos } from "../api/videoApi"; // 북마크 조회
import VideoModal from "./VideoModal";
import { useAuth } from "../hooks/useAuth";

interface VideoInfoFetchProps {
  sortBy?: "latest" | "oldest" | "title";
  bookmarkedOnly?: boolean;
  onDataLoaded?: (count: number) => void;
}

const VideoInfoFetch: React.FC<VideoInfoFetchProps> = ({
  sortBy = "latest",
  bookmarkedOnly = false,
  onDataLoaded,
}) => {
  const [videoList, setVideoList] = useState<VideoInfoProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState<string | null>(null);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getVideos();
        const data = response.data?.data || response.data || [];

        const filteredData = bookmarkedOnly
          ? data.filter((video: VideoInfoProps) => video.is_bookmarked)
          : data;

        setVideoList(filteredData);
      } catch (error) {
        console.error("영상 목록 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    // 인증 완료 후에만 실행
    if (!authLoading && isAuthenticated) {
      fetchData();
    }
  }, [authLoading, isAuthenticated, bookmarkedOnly]);

  // 정렬된 비디오 목록
  const sortedVideoList = [...videoList].sort((a, b) => {
    switch (sortBy) {
      case "latest":
        if (!a.created_at || !b.created_at) return 0;
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      case "oldest":
        if (!a.created_at || !b.created_at) return 0;
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      case "title":
        if (!a.video_title || !b.video_title) return 0;
        return a.video_title.localeCompare(b.video_title);
      default:
        return 0;
    }
  });

  // 영상 갯수
  useEffect(() => {
    if (!loading && onDataLoaded) {
      onDataLoaded(sortedVideoList.length);
    }
  }, [sortedVideoList, loading, onDataLoaded]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-[120px]">
        <div className="text-[18px] text-gray-600">로딩 중...</div>
      </div>
    );

  if (sortedVideoList.length === 0) {
    return (
      <div className="text-center py-[120px]">
        <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-8">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>

        {bookmarkedOnly ? (
          <>
            <h3 className="text-[24px] font-bold text-gray-700 mb-4">
              북마크된 영상이 아직 없습니다!
            </h3>
            <p className="text-[18px] text-gray-500">
              북마크 표시를 눌러 영상을 북마크해보세요.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-[24px] font-bold text-gray-700 mb-4">
              아직 만든 영상이 없네요!
            </h3>
            <p className="text-[18px] text-gray-500 mb-8">
              첫 번째 VLOG를 만들어보시겠어요?
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="bg-[#DCAC62] text-black px-8 py-3 rounded-full text-[18px] font-bold hover:bg-[#C49952] transition-colors"
            >
              영상 만들러 가기
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-[40px]">
        {sortedVideoList.map((info, idx) => (
          <VideoInfo
            key={idx}
            {...info}
            onClick={(url) => setSelectedVideoUrl(url)}
          />
        ))}
      </div>

      {selectedVideoUrl && (
        <VideoModal
          videoUrl={selectedVideoUrl}
          onClose={() => setSelectedVideoUrl(null)}
        />
      )}
    </>
  );
};

export default VideoInfoFetch;
