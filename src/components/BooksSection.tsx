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
  onAddBook?: () => void; // 책 추가 버튼 클릭 핸들러
}

const BooksSection: React.FC<BooksSectionProps> = ({
  books,
  selectedIndex,
  onBookSelect,
  onAddBook,
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

      {/* 책 추가 버튼 */}
      {onAddBook && (
        <div
          style={{
            marginLeft: books.length > 0 ? "171px" : "0",
            transform: "translateY(0px)",
            transition: "transform 0.3s ease",
          }}
          onClick={onAddBook}
          className="cursor-pointer flex items-center justify-center"
        >
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-[#DCAC62] bg-[#FCFAF7]/50 hover:bg-[#FCFAF7] transition-colors rounded-lg"
            style={{
              width: 196,
              height: 288,
              boxShadow: "8px 4px 12px 2px rgba(0,0,0,0.25)",
            }}
          >
            <div className="w-16 h-16 rounded-full bg-[#DCAC62]/20 flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-[#DCAC62]"
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
            <p className="text-[#75624E] font-medium text-center px-4">
              새 책 추가하기
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BooksSection;
