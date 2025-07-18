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
  ]);
    

  const handleRegenerate = () => {
    // TODO: 실제 API 호출하거나 새로 대본을 생성하는 로직을 여기에 넣으세요.
    // 예: fetch("/api/regenerate-script").then(res=>res.json()).then(data=>setExampleScripts(data.scripts))
    console.log("대본 재생성!");
  };

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* 1) Header + Stepper */}
      <Header
        showNavigation={true}
        navigationComponent={<Stepper currentStep={2} />}
      />

      {/* 2) main이 이미 flex justify-center 상태이므로
            아래 콘텐츠를 스텝퍼(751px) 기준 가운데 붙이려면
            이 div만 w-[751px] mx-auto */}
      <main className="flex mt-[140px] ml-[80px] justify-center ">
        <div className="w-[751px] mx-auto mt-6">
          {/* 🖋 제목영역 (스크립트 검토 + 부제) */}
          <div className="flex flex-col items-center">
            <h1 className="text-[40px] text-[#2C2C2C] font-nanumMyeongjo font-bold">
              스크립트 검토
            </h1>
            <p className="mt-2 text-[16px] text-[#424242] font-nanumGothic">
              AI가 생성한 브이로그 스크립트입니다.
            </p>
          </div>
        </div>
      </main>

      {/* 3) 재생성 버튼 */}
      <div className="flex justify-center ">
        <button
          onClick={handleRegenerate}
          className="
            flex items-center justify-center gap-[6px]
            h-[27px] mx-auto mr-[300px] mt-[-15px]
            font-nanumGothic font-semibold text-[20px] text-black
            cursor-pointer       /* 포인터 커서 */
            hover:underline       /* 호버 시 밑줄 */
            transition            /* 부드러운 상태 전환 */
          "
        >
          <img
            src={Regenerating}
            alt="재생성"
            className="w-[24px] h-[24px]"
          />
          재생성
        </button>
      </div>
      <div className="flex justify-center items-start mt-[22px]">
       <div className="flex-none w-[183.74px] h-[194px]">
        <FrontCharacterCard 
        name={selectedName}
        sex={selectedSex}/>
       </div>
       {/* 3) 하얀 박스 컨테이너: 제목 아래 34px, 중앙 정렬 */}
       <div className="flex justify-center ml-[37.26px]">
        <div
         className="
             w-[1206px] h-[661px]
             bg-white rounded-[30px]
             shadow-[0_4px_8.7px_rgba(0,0,0,0.25)]
             p-[23.78px_20px_57.78px_41px]           
             box-border">
           {/* 4) 대화창 wrapper: 컨테이너 내 첫 위치(top:23.78,left:41), width=1102, 세로 간격 34 */}
           <div className="w-full h-full overflow-y-scroll overflow-x-hidden scrollbar-fancy">
            <div className="space-y-[34px] w-[1102px]">
             {exampleScripts.map((text, idx) => (
             <Script key={idx} sceneTitle={`Scene #${idx + 1}`}>
             {text}
             </Script>))}
            </div>
           </div>
          </div>
         </div>
        </div> 
      <button
      className="
            flex items-center justify-center gap-[1289px]
            h-[64px] ml-[170px] mt-[19px]
            font-nanumGothic font-semibold text-[20px] text-black
            cursor-pointer       /* 포인터 커서 */
            transition            /* 부드러운 상태 전환 */
          ">
        <CommonButton
          icon={<img src={BackIcon} alt="뒤로가기" className="w-[20px] h-[20px]" />}
          onClick={() => console.log("대본 저장")}
          className ="w-[280px] h-[64px] gap-[21px]"
        >
          인물선택으로 돌아가기
        </CommonButton>

        <CommonButton 
          icon={<img src={VideoIcon} alt="영상 생성" className="w-[20px] h-[20px]" />}
          onClick={() => console.log("대본 저장")}
          className = "w-[207px] h-[64px] gap-[26px]"
        >
          영상생성
        </CommonButton>
      </button>
    </div>
  );
};

export default ScriptPage;
