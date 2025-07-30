import React, { useState } from "react";
import VideoThumbnail from "../components/VideoThumbnail";

interface VideoData {
  imageUrl: string;
  videoUrl: string;
  videoId: number;
}

interface Props {
  videos: VideoData[];
  onClickVideo: (videoUrl: string) => void;
  onClickCreate: () => void;
}

const VideoCarousel: React.FC<Props> = ({
  videos,
  onClickVideo,
  onClickCreate,
}) => {
  const slides = [...videos, { videoId: -1, videoUrl: "", imageUrl: "" }];
  const [currentIndex, setCurrentIndex] = useState(0);

  const visibleSlides = Math.min(3, slides.length);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const getSlide = (index: number) =>
    slides[(index + slides.length) % slides.length];

  return (
    <div className="w-full flex flex-col items-center relative">
      <div className="mb-4 flex justify-between w-full px-8">
        <button
          onClick={handlePrev}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
        >
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

        <button
          onClick={handleNext}
          className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
        >
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
      </div>

      <div className="flex gap-8">
        {Array.from({ length: visibleSlides }).map((_, offset) => {
          const index = currentIndex + offset;
          const slide = getSlide(index);
          const isCenter = offset === Math.floor(visibleSlides / 2);

          return (
            <div
              key={index}
              className={`w-[400px] h-[200px] transition-transform ${
                isCenter ? "scale-105 shadow-xl z-10" : "opacity-80"
              }`}
            >
              {slide.videoId === -1 ? (
                <div
                  onClick={onClickCreate}
                  className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center bg-white hover:bg-gray-50 cursor-pointer transition-colors"
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
              ) : (
                <div
                  onClick={() => onClickVideo(slide.videoUrl)}
                  className="w-full h-full rounded-lg overflow-hidden shadow-md hover:scale-105 transition-transform cursor-pointer"
                >
                  <VideoThumbnail imageUrl={slide.imageUrl} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VideoCarousel;
