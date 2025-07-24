import React, { useEffect, useState } from "react";

interface ConfirmModalProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
  visible: boolean;
  isLoading?: boolean;
  confirmText?: string;
  message?: string; // 안내 문구
}

const EXIT_ANIMATION_TIME = 220;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  name,
  onConfirm,
  onCancel,
  visible,
  isLoading = false,
  confirmText = "확인",
  message,
}) => {
  const [show, setShow] = useState(false);
  const [animState, setAnimState] = useState<
    "none" | "enter" | "entered" | "exit"
  >("none");

  useEffect(() => {
    if (visible) {
      setShow(true);
      setAnimState("enter");
      const t = setTimeout(() => setAnimState("entered"), 16);
      return () => clearTimeout(t);
    } else if (show) {
      setAnimState("exit");
      const t = setTimeout(() => {
        setShow(false);
        setAnimState("none");
      }, EXIT_ANIMATION_TIME);
      return () => clearTimeout(t);
    }
  }, [visible, show]);

  if (!show) return null;

  let animClass = "";
  if (animState === "enter") animClass = "more-characters-appear";
  else if (animState === "entered")
    animClass = "more-characters-appear more-characters-appear-active";
  else if (animState === "exit")
    animClass = "more-characters-exit more-characters-exit-active";

  return (
    <div
      className={`
        fixed inset-0 bg-black/40 flex items-center justify-center z-50
        transition-all duration-200
        ${visible ? "opacity-100" : "opacity-0 pointer-events-none"}
      `}
    >
      <div
        className={`
          bg-white rounded-2xl shadow-xl p-8 min-w-[320px] flex flex-col items-center font-NanumMyeongjo border-8 border-[#F8F3ED]
          ${animClass}
        `}
      >
        <div className="text-xl font-bold mb-4">
          {message || "선택한 인물로 진행하시겠습니까?"}
        </div>
        <div className="mb-6 text-[48px] text-[#5a4630] font-medium font-black">
          {name}
        </div>
        <div className="flex gap-4">
          <button
            className="px-6 py-2 rounded bg-gray-200 text-[#000000] font-bold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            style={{ boxShadow: "inset 0 0 0 4px #FFFFFF" }}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#000000]"></div>
            )}
            {isLoading ? "처리중..." : confirmText}
          </button>
          <button
            className="px-6 py-2 rounded bg-gray-200 text-[#000000] font-bold hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ boxShadow: "inset 0 0 0 4px #FFFFFF" }}
            onClick={onCancel}
            disabled={isLoading}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
