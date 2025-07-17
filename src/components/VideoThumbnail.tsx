import React from "react";

interface VideoThumbnailProps {
  imageUrl?: string;
}

const VideoThumbnail: React.FC<VideoThumbnailProps> = ({ imageUrl }) => {
  return (
    <div className="flex-shrink-0 w-[400px] h-[200px] bg-gray-100 rounded-lg overflow-hidden shadow-md">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt="VideoThumbnail"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
          <span className="text-gray-400">Loading...</span>
        </div>
      )}
    </div>
  );
};

export default VideoThumbnail;
