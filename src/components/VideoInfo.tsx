import React, { useState } from "react";
import { bookmarkVideo } from "../api/videoApi";
import { unbookmarkVideo } from "../api/videoApi";

export interface VideoInfoProps {
  video_id?: number;
  video_title?: string;
  book_name?: string;
  character_description?: string;
  character_name?: string;
  created_at?: string;
  video_url?: string;
  thumbnail_url?: string;
  is_bookmarked?: boolean;
  onClick?: (videoUrl: string) => void;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  video_id,
  video_title,
  book_name,
  character_name,
  character_description,
  created_at,
  video_url,
  thumbnail_url,
  is_bookmarked = false,
  onClick,
}) => {
  const [bookmark, setBookmark] = useState(is_bookmarked);

  // 북마크 버튼 토글 함수
  const handleBookmarkClick = async () => {
    if (typeof video_id !== "number") return;

    try {
      if (bookmark) {
        await unbookmarkVideo(video_id);
        console.log(video_url);

        setBookmark(false);
      } else {
        await bookmarkVideo(video_id);
        console.log(video_url);

        setBookmark(true);
      }
    } catch (err) {
      console.error("북마크 처리 실패:", err);
    }
  };

  return (
    <div className="w-[1206px] [h-256px] flex rounded-[16px] border border-gray-300 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow relative">
      {/* 북마크 표시 */}
      <button onClick={handleBookmarkClick}>
        {bookmark ? (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              북마크
            </div>
          </div>
        ) : (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-gray-400 text-black-900 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
              </svg>
              북마크
            </div>
          </div>
        )}
      </button>

      {/* 왼쪽: 이미지 */}
      <button onClick={() => onClick?.(video_url || "")}>
        <div className="flex-shrink-0 p-3 relative">
          {thumbnail_url ? (
            <div className="relative">
              <img
                src={thumbnail_url}
                alt="Video thumbnail"
                className="w-[398px] h-[224px] border-2 rounded-[12px] object-cover"
                style={{ borderColor: "#AEAEAE" }}
              />

              {/* Duration overlay
              {duration && (
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                  {duration}
                </div>
              )} */}
            </div>
          ) : (
            <div className="w-[398px] h-[224px] rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
              No Image
            </div>
          )}
        </div>
      </button>

      {/* 오른쪽: 텍스트 */}
      <div className="flex flex-col justify-center flex-1 gap-2 pr-4">
        <div className="flex justify-between items-start">
          <div className="text-[24px] font-bold">{video_title}</div>
        </div>
        <div className="flex justify-between mb-2">
          {book_name && (
            <p className="text-[18px] text-[#DCAC62] font-semibold">
              from: {book_name}
            </p>
          )}

          {created_at && (
            <div className="text-[12px] text-gray-500 bg-gray-100 px-3 py-1 mb-4 rounded-full">
              {new Date(created_at).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
        </div>
        <div className="w-[700px] h-[95px] rounded-[12px] bg-gray-100 px-4 py-3">
          <div className="mb-2">
            <span className="font-bold text-[16px] text-gray-700">
              Character:{" "}
            </span>
            <span className="font-semibold text-[16px] text-gray-800">
              {character_name}
            </span>
          </div>
          <div className="text-gray-700 text-[14px] leading-relaxed">
            {character_description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
