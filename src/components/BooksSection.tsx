import React, { useState, useRef, useEffect } from "react";
import BookThumbnail from "./BookThumbnail";
import "./BooksSection.css";

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
  onAddBook?: () => void;
}

const BooksSection: React.FC<BooksSectionProps> = ({
  books,
  selectedIndex,
  onBookSelect,
  onAddBook,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // 한 화면에 보여질 책의 개수
  const booksPerSlide = 5;
  const totalSlides = Math.ceil(
    (books.length + (onAddBook ? 1 : 0)) / booksPerSlide
  );

  // 선택된 책이 있는 슬라이드로 자동 이동
  useEffect(() => {
    const targetSlide = Math.floor(selectedIndex / booksPerSlide);
    if (targetSlide !== currentSlide) {
      setCurrentSlide(targetSlide);
    }
  }, [selectedIndex, currentSlide, booksPerSlide]);

  const handlePrevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleBookClick = (index: number) => {
    onBookSelect(index);
  };

  // 현재 슬라이드에서 보여질 책들 계산
  const getCurrentSlideBooks = () => {
    const startIndex = currentSlide * booksPerSlide;
    const endIndex = Math.min(startIndex + booksPerSlide, books.length);
    const currentBooks = books.slice(startIndex, endIndex);

    // 책 추가 버튼을 마지막 슬라이드에 포함
    const shouldShowAddButton =
      onAddBook && (currentSlide === totalSlides - 1 || books.length === 0);

    return { currentBooks, shouldShowAddButton, startIndex };
  };

  const { currentBooks, shouldShowAddButton, startIndex } =
    getCurrentSlideBooks();

  return (
    <div className="relative w-full fade-in-up">
      {/* 캐러셀 컨테이너 */}
      <div className="relative overflow-hidden">
        {/* 네비게이션 버튼 - 이전 */}
        {totalSlides > 1 && (
          <button
            onClick={handlePrevSlide}
            disabled={isAnimating}
            className="nav-button absolute left-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
          >
            <svg
              className="w-6 h-6 text-[#604317]"
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
        )}

        {/* 네비게이션 버튼 - 다음 */}
        {totalSlides > 1 && (
          <button
            onClick={handleNextSlide}
            disabled={isAnimating}
            className="nav-button absolute right-4 top-1/2 transform -translate-y-1/2 z-20 w-12 h-12 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
          >
            <svg
              className="w-6 h-6 text-[#604317]"
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
        )}

        {/* 책 컨테이너 */}
        <div
          ref={carouselRef}
          className="carousel-container flex justify-center p-10 pb-0 items-end min-h-[500px] gpu-accelerated"
          style={{
            transform: `translateX(-${currentSlide * 100}%)`,
            transition: isAnimating
              ? "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)"
              : "none",
          }}
        >
          {/* 고정된 컨테이너로 책들 감싸기 */}
          <div className="flex items-end justify-center gap-8 relative">
            {currentBooks.map((book, index) => {
              const actualIndex = startIndex + index;
              const isSelected = actualIndex === selectedIndex;

              return (
                <div
                  key={book.id}
                  className="relative flex flex-col items-center group cursor-pointer"
                  onClick={() => handleBookClick(actualIndex)}
                >
                  {/* 책 컨테이너 - 고정된 크기로 레이아웃 안정성 확보 */}
                  <div className="relative flex items-end justify-center">
                    {/* 선택한 책 뒤에 나타내는 링인데 별론 거 같음 */}
                    {/* {isSelected && (
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div
                          className="selection-ring rounded-lg border-4 border-[#DCAC62] bg-[#DCAC62]/10"
                          style={{
                            width: "280px",
                            height: "380px",
                          }}
                        />
                      </div>
                    )}  */}

                    {/* 책 썸네일 */}
                    <div
                      className={`book-container relative z-20 ${isSelected ? "selected book-shadow-selected" : "book-shadow-normal"}`}
                    >
                      <BookThumbnail
                        src={book.src}
                        alt={book.alt}
                        width={220}
                        height={320}
                        shadow={
                          isSelected
                            ? "0 25px 50px rgba(220,172,98,0.4)"
                            : "0 10px 25px rgba(0,0,0,0.15)"
                        }
                      />
                    </div>
                  </div>

                  {/* 책 제목 */}
                  <div className="mt-4 text-center max-w-[200px]">
                    <p
                      className={`
                      font-medium transition-all duration-[400ms] ease-out line-clamp-2
                      ${
                        isSelected
                          ? "text-[#604317] text-lg font-bold"
                          : "text-gray-700 text-base group-hover:text-[#604317]"
                      }
                    `}
                    >
                      {book.title}
                    </p>
                  </div>

                  {/* 선택 표시 점 */}
                  {isSelected && (
                    <div className="mt-2 w-2 h-2 bg-[#DCAC62] rounded-full animate-bounce" />
                  )}
                </div>
              );
            })}

            {/* 책 추가 버튼 */}
            {shouldShowAddButton && (
              <div
                className="relative flex flex-col items-center group cursor-pointer"
                onClick={onAddBook}
              >
                <div className="relative flex items-end justify-center">
                  <div className="book-container relative z-20 book-shadow-normal">
                    <div
                      className="gradient-background flex flex-col items-center justify-center border-2 border-dashed border-[#DCAC62] transition-all duration-300 rounded-lg backdrop-blur-sm"
                      style={{
                        width: 220,
                        height: 320,
                        boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
                      }}
                    >
                      <div className="icon-background w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                        <svg
                          className="w-8 h-8 text-[#DCAC62] group-hover:text-[#B8941F] transition-colors duration-300"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2.5}
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                          />
                        </svg>
                      </div>
                      <p className="text-[#75624E] font-medium text-center px-6 leading-relaxed group-hover:text-[#604317] transition-colors duration-300">
                        새 책<br />
                        추가하기
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center max-w-[200px]">
                  <p className="text-gray-600 text-base group-hover:text-[#604317] transition-colors duration-300">
                    새로운 이야기
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 슬라이드 인디케이터 */}
      {totalSlides > 1 && (
        <div className="flex justify-center mt-8 gap-3">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => !isAnimating && setCurrentSlide(index)}
              disabled={isAnimating}
              className={`slide-indicator w-3 h-3 rounded-full disabled:cursor-not-allowed ${
                index === currentSlide ? "active" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BooksSection;
