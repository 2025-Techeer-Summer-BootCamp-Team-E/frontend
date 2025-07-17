import React from "react";
import BookThumbnail from "./BookThumbnail";

interface Book {
  id: number;
  src: string;
  alt: string;
  title: string;
}

interface BooksSectionProps {
  books: Book[];
  selectedIndex: number;
  onBookSelect: (index: number) => void;
}

const BooksSection: React.FC<BooksSectionProps> = ({
  books,
  selectedIndex,
  onBookSelect,
}) => {
  return (
    <div className="flex justify-center p-10 pb-0 items-end">
      {books.map((book, index) => {
        const isHighlight = index === selectedIndex;

        // 강조 여부에 따라 크기/그림자 다르게
        const width = isHighlight ? 266 : 196;
        const height = isHighlight ? 360 : 288;
        const shadow = isHighlight
          ? "32px 12px 20.9px -6px rgba(0,0,0,0.13)"
          : "8px 4px 12px 2px rgba(0,0,0,0.25)";

        // 강조된 책만 살짝 아래로 이동
        const translateY = isHighlight ? "10px" : "0px";

        // 간격 (강조 옆은 171, 일반은 103)
        let marginRight = 103;
        if (
          isHighlight ||
          index === selectedIndex - 1 ||
          index === selectedIndex + 1

        ) {
          marginRight = 171;
        }

        return (
          <div
            key={book.id}
            style={{
              marginRight:
                index !== books.length - 1 ? `${marginRight}px` : "0",
              transform: `translateY(${translateY})`, // 강조된 책만 아래로 이동
              transition: "transform 0.3s ease",
            }}
            onClick={() => onBookSelect(index)}
            className="cursor-pointer"
          >
            <BookThumbnail
              src={book.src}
              alt={book.alt}
              width={width}
              height={height}
              shadow={shadow}
            />
          </div>
        );
      })}
    </div>
  );
};

export default BooksSection;
