import React, { useState, useEffect } from "react";
import BookThumbnail from "./BookThumbnail";

interface Book {
  src: string;
  alt: string;
}

const BooksSection: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [highlightIndex, setHighlightIndex] = useState<number>(1); // 두 번째 책 기본 강조

  useEffect(() => {
    const sampleBooks: Book[] = [
      {
        src: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/2090000149319.jpg",
        alt: "긴긴밤",
      },
      {
        src: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9788937461545.jpg",
        alt: "카라마조프가의 형제들",
      },
      {
        src: "https://contents.kyobobook.co.kr/sih/fit-in/400x0/pdt/9791165345693.jpg",
        alt: "달러구트 꿈 백화점",
      },
      {
        src: "https://image.aladin.co.kr/product/27106/90/cover500/e462538205_1.jpg",
        alt: "짧은 밤이지만 빛나고 있어",
      },
    ];
    setBooks(sampleBooks);
  }, []);

  return (
    <div className="flex justify-center p-10 items-end">
      {books.map((book, index) => {
        const isHighlight = index === highlightIndex;

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
        if (isHighlight || index === highlightIndex - 1 || index === highlightIndex + 1) {
          marginRight = 171; 
        }

        return (
          <div
            key={index}
            style={{
              marginRight: index !== books.length - 1 ? `${marginRight}px` : "0",
              transform: `translateY(${translateY})`, // 강조된 책만 아래로 이동
              transition: "transform 0.3s ease",
            }}
            onClick={() => setHighlightIndex(index)}
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
