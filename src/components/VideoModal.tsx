import React, { useRef, useEffect } from "react";

interface VideoModalProps {
  videoUrl: string;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ videoUrl, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
      <div
        ref={modalRef}
        className="relative bg-white rounded-lg p-10 w-[800px] max-w-full shadow-lg"
      >
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="aspect-video w-full">
          <iframe
            className="w-full h-full rounded-md"
            src={videoUrl}
            title="Video player"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
