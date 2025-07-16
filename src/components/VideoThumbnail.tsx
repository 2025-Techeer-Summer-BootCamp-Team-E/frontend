import React from "react";

interface VideoThumbnailProps {
  imageUrl?: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ imageUrl }) => {
  return (
    <span className="w-[356px] h-[200px] bg-gray-100 overflow-hidden">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="VideoThumbnail"
          className="w-[356px] h-[200px] object-cover"
        />
      ) : (
        <div className="w-[356px] h-[200px] bg-gray-200 animate-pulse" />
      )}
    </span>
  );
};

export default VideoThumbnail;
