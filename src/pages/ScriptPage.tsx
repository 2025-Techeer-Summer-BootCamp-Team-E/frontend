// src/pages/ScriptPage.tsx
import React, { useState } from "react";
import Header from "../components/Header";
import Stepper from "../components/Stepper";
import Script from "../components/Script"; // (장면 하나짜리 박스 컴포넌트)
import Regenerating from "../assets/Icons/Regenerating.svg"; // 재생성 아이콘
import FrontCharacterCard from "../components/FrontCharacterCard";
import CommonButton from "../components/CommonButton";
import BackIcon from "../assets/Icons/BackIcon.svg";
import VideoIcon from "../assets/Icons/VideoIcon.svg"; // 영상 생성 아이콘


const ScriptPage: React.FC = () => {

  const [selectedName, setSelectedName] = useState("홍선군")
  const [selectedSex, setSelectedSex] = useState("남성")
  const [exampleScripts, setExampleScripts] = useState<string[]>([
    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,

    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,

    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,

    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,

    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,

    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,

    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,
  ]);
    

const handleRegenerate = () => {
    console.log("대본 재생성!");
  };

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* 1) Header + Stepper */}
      <Header
        showNavigation
        navigationComponent={<Stepper currentStep={2} />}
      />

      {/* 2) 타이틀 영역 */}
      <main className="flex justify-center mt-[140px]">
        <div className="w-[751px] mx-auto mt-6">
          <div className="flex flex-col items-center">
            <h1 className="text-[40px] text-[#2C2C2C] font-NanumMyeongjo font-bold">
              스크립트 검토
            </h1>
            <p className="mt-2 text-[16px] text-[#424242] font-nanumGothic">
              AI가 생성한 브이로그 스크립트입니다.
            </p>
          </div>
        </div>
      </main>

      {/* 3) 캐릭터 카드 + 대본 박스 */}
      <div className="flex justify-center items-start mt-[22px] mr-[80px]">
        {/* 캐릭터 카드 */}
        <div className="flex-none w-[183.74px] h-[194px]">
          <FrontCharacterCard name={selectedName} sex={selectedSex} />
        </div>

        {/* 래퍼: 버튼을 절대 위치시키기 위한 relative 부모 */}
        <div className="flex justify-center ml-[37.26px]">
          <div className="relative">
            {/* 실제 컨테이너 (패딩 포함) */}
            <div className="
                w-[1206px] h-[661px]
                bg-white rounded-[30px]
                shadow-[0_4px_8.7px_rgba(0,0,0,0.25)]
                p-[23.78px_20px_57.78px_41px]
                box-border
              ">
              {/* 스크롤 래퍼 */}
              <div className={`
                w-full h-full
                overflow-y-scroll overflow-x-hidden

                /* WebKit 스크롤바 너비 */
                [&::-webkit-scrollbar]:w-[20px]

                /* 트랙 스타일 */
                [&::-webkit-scrollbar-track]:bg-[#F9F9F9]
                [&::-webkit-scrollbar-track]:rounded-[30px]
                [&::-webkit-scrollbar-track]:border-[2px]
                [&::-webkit-scrollbar-track]:border-solid
                [&::-webkit-scrollbar-track]:border-[#B2B2B2]

                /* Thumb 스타일 */
                [&::-webkit-scrollbar-thumb]:box-border
                [&::-webkit-scrollbar-thumb]:bg-[#A2A2A2]
                [&::-webkit-scrollbar-thumb]:rounded-[30px]
                [&::-webkit-scrollbar-thumb]:border-[3px]
                [&::-webkit-scrollbar-thumb]:border-solid
                [&::-webkit-scrollbar-thumb]:border-transparent
                [&::-webkit-scrollbar-thumb]:bg-clip-content
              `}>
                <div className="space-y-[34px] w-[1102px]">
                  {exampleScripts.map((text, idx) => (
                    <Script key={idx} sceneTitle={`Scene #${idx + 1}`}>
                      {text}
                    </Script>
                  ))}
                </div>
              </div>
            </div>

            {/* 절대 위치 재생성 버튼 */}
            <button
              onClick={handleRegenerate}
              className="
                absolute
                bottom-[calc(100%+22px)]    /* 컨테이너 테두리 기준 22px 위 */
                right-[15px]   /* 컨테이너 우측에서 15px 안쪽 */
                flex items-center gap-[6px] h-[27px]
                font-nanumGothic font-semibold text-[20px] text-black
                cursor-pointer hover:underline transition
              "
            >
              <img src={Regenerating} alt="재생성" className="w-[24px] h-[24px]" />
              재생성
            </button>

            {/* 4) 하단 버튼들 */}
             <CommonButton
               icon={<img src={BackIcon} alt="뒤로가기" className="w-[20px] h-[20px]" />}
               onClick={() => console.log("인물선택으로 돌아가기")}
               className="
                absolute
                top-[calc(100%+19px)]                 /* 컨테이너 아래에서 19px 아래 */
                right-[calc(100%+39px)]       /* 컨테이너 왼쪽에서 39px 왼쪽 */
                w-[280px] h-[64px]
                flex items-center justify-center gap-[21px]
                font-nanumGothic font-semibold text-[20px] text-black
              "
             >
              인물선택으로 돌아가기
             </CommonButton>

             <CommonButton
               icon={<img src={VideoIcon} alt="영상 생성" className="w-[20px] h-[20px]" />}
               onClick={() => console.log("영상 생성")}
               className="
                absolute
                top-[calc(100%+19px)]                /* 컨테이너 아래에서 19px 아래 */
                left-[calc(100%+39px)]        /* 컨테이너 오른쪽에서 39px 오른쪽 */
                w-[207px] h-[64px]
                flex items-center justify-center gap-[26px]
                font-nanumGothic font-semibold text-[20px] text-black
              "
             >
             영상생성
             </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptPage;