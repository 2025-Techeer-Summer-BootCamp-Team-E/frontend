import React, { useState, useRef } from "react";
// import CommonButton from "./CommonButton";

interface BookUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (title: string, file: File) => void;
  isLoading?: boolean;
}

const BookUploadModal: React.FC<BookUploadModalProps> = ({
  isOpen,
  onClose,
  onUpload,
  isLoading = false,
}) => {
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
      } else {
        alert("PDF 파일만 업로드 가능합니다.");
      }
    }
  };

  const handleUpload = () => {
    if (!title.trim()) {
      alert("책 제목을 입력해주세요.");
      return;
    }
    if (!selectedFile) {
      alert("PDF 파일을 선택해주세요.");
      return;
    }

    onUpload(title.trim(), selectedFile);
  };

  const handleClose = () => {
    setTitle("");
    setSelectedFile(null);
    setIsDragging(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-[#252016] mb-6 text-center font-NanumMyeongjo">
          새 책 추가하기
        </h2>

        {/* 제목 입력 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            책 제목
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="책 제목을 입력하세요"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#DCAC62] focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        {/* 파일 업로드 영역 */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            PDF 파일
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-[#DCAC62] bg-[#DCAC62]/10"
                : selectedFile
                  ? "border-green-400 bg-green-50"
                  : "border-gray-300 hover:border-[#DCAC62]"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
              disabled={isLoading}
            />

            {selectedFile ? (
              <div className="text-green-600">
                <div className="w-12 h-12 mx-auto mb-2">
                  <svg
                    className="w-full h-full"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="font-medium">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="text-gray-500">
                <div className="w-12 h-12 mx-auto mb-2">
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>
                <p className="font-medium">
                  PDF 파일을 드래그하거나 클릭하여 선택
                </p>
                <p className="text-sm">또는 여기를 클릭하여 파일 탐색기 열기</p>
              </div>
            )}
          </div>
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            취소
          </button>
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                업로드 중...
              </div>
            ) : (
              "책 생성하기"
            )}
          </button>
          {/* <CommonButton
            onClick={handleUpload}
            disabled={isLoading || !title.trim() || !selectedFile}
            className="flex-1 h-auto py-2"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                업로드 중...
              </div>
            ) : (
              "책 생성하기"
            )}
          </CommonButton> */}
        </div>
      </div>
    </div>
  );
};

export default BookUploadModal;
