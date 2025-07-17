import React from "react";

interface ConfirmModalProps {
  name: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  name,
  onConfirm,
  onCancel,
}) => (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl p-8 min-w-[320px] flex flex-col items-center font-NanumMyeongjo border-8 border-[#F8F3ED]">
      <div className="text-xl font-bold mb-4">
        선택한 인물로 진행하시겠습니까?
      </div>
      <div className="mb-6 text-[48px] text-[#5a4630] font-medium font-black">
        {name}
      </div>
      <div className="flex gap-4">
        <button
          className="px-6 py-2 rounded bg-gray-200 text-[#000000] font-bold hover:bg-gray-300 transition"
          style={{ boxShadow: "inset 0 0 0 4px #FFFFFF" }}
          onClick={onConfirm}
        >
          확인
        </button>
        <button
          className="px-6 py-2 rounded bg-gray-200 text-[#000000] font-bold hover:bg-gray-300 transition"
          style={{ boxShadow: "inset 0 0 0 4px #FFFFFF" }}
          onClick={onCancel}
        >
          취소
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;
