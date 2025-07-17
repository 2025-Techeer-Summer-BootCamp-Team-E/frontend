import React from "react";

export interface VideoInfoProps {
  imageUrl?: string;
  title?: string;
  from?: string;
  description?: string;
  character?: string;
  duration?: string;
  createdAt?: string;
}

const VideoInfo: React.FC<VideoInfoProps> = ({
  imageUrl,
  title,
  from,
  character,
  description,
  duration,
  createdAt,
}) => {
  return (
    <div className="w-[1206px] [h-256px] flex rounded-[16px] border border-gray-300 bg-white shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {/* 왼쪽: 이미지 */}
      <div className="flex-shrink-0 p-3 relative">
        {imageUrl ? (
          <div className="relative">
            <img
              src={imageUrl}
              alt="Video thumbnail"
              className="w-[398px] h-[224px] border-2 rounded-[12px] object-cover"
              style={{ borderColor: "#AEAEAE" }}
            />
            {/* Duration overlay */}
            {duration && (
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-medium">
                {duration}
              </div>
            )}
          </div>
        ) : (
          <div className="w-[398px] h-[224px] rounded-xl bg-gray-200 flex items-center justify-center text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      {/* 오른쪽: 텍스트 */}
      <div className="flex flex-col justify-center flex-1 gap-2 pr-4">
        <div className="flex justify-between items-start">
          <div className="text-[24px] font-bold">{title}</div>
          {createdAt && (
            <div className="text-[12px] text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {new Date(createdAt).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          )}
        </div>
        {from && (
          <p className="text-[18px] text-[#DCAC62] mb-4 font-semibold">
            from: {from}
          </p>
        )}
        <div className="w-[700px] h-[95px] rounded-[12px] bg-gray-100 px-4 py-3">
          <div className="mb-2">
            <span className="font-bold text-[16px] text-gray-700">
              Character:{" "}
            </span>
            <span className="font-semibold text-[16px] text-gray-800">
              {character}
            </span>
          </div>
          <div className="text-gray-700 text-[14px] leading-relaxed">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoInfo;
