// src/components/Script.tsx
import React from "react";

export interface ScriptProps {
  sceneTitle?: string;
  children: React.ReactNode;
}

const Script: React.FC<ScriptProps> = ({ sceneTitle, children }) => {
  return (
    <div className="flex flex-col bg-[#F8F9FA] rounded-[30px] w-[1000px] h-[170px] p-6">
      {/* Scene Badge */}
      {sceneTitle && (
        <span
          className="
            inline-flex items-center justify-center   /* 인라인 박스 + 중앙 정렬 */
            w-[109px] h-[28px]                       /* Figma에 맞춘 크기 */
            bg-[#0008FF] bg-opacity-[19%]            /* 배경색 #2900BC, 투명도 19% */
            rounded-[12px]                           /* 모서리 반경 12px */
          "
        >
          <span
            className="
              text-[16px] font-bold text-[#2900BC]   /* 글자 16px, Bold, 컬러 #2900BC */
              font-lora                             /* tailwind.config 로 설정한 Lora 폰트 */
            "
          >
            {sceneTitle}
          </span>
        </span>
      )}

      {/* 본문 */}
      <div className="mt-2 text-base leading-relaxed text-black text-[24px] font-crimson whitespace-pre-wrap">
        {children}
      </div>
    </div>
  );
};

export default Script;
