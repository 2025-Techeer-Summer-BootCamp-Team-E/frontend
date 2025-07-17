import React from "react";

interface BookThumbnailProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  shadow?: string;
}

const BookThumbnail: React.FC<BookThumbnailProps> = ({
  src,
  alt,
  width = 196,
  height = 288,
  shadow = "8px 4px 12px 2px rgba(0,0,0,0.25)",
}) => {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        boxShadow: shadow,
        borderRadius: "0px",
      }}
    />
  );
};

export default BookThumbnail;
