import React, { useState, useEffect } from "react";
import VideoThumbnail from "../components/VideoThumbnail";

const ThumbnailFetch: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 이미지 샘플
    const url = "https://cdn.imweb.me/thumbnail/20221203/fba3a2f258bdc.png";
    setTimeout(() => {
      setImageUrl(url);
      setIsLoading(false);
    }, 100);
  }, []);

  return (
    <div className="p-8">
      <VideoThumbnail imageUrl={isLoading ? undefined : imageUrl} />
    </div>
  );
};

export default ThumbnailFetch;