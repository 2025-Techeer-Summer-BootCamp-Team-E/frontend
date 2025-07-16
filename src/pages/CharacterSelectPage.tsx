import React from "react";
//import { useNavigate } from "react-router-dom";
import ActCharacterCard from "../components/ActCharacterCard";
import CommonButton from "../components/CommonButton";
import Stepper from "../components/Stepper";
import BackIcon from "../assets/Icons/BackIcon.svg";
import Down_flag from "../assets/Icons/down_flag.svg";

const ScriptCreateLayout: React.FC = () => {
  return (
    <div className="flex flex-col bg-[#F8F3ED]">
      {/* 메인 내용 */}
      <main className="flex flex-col flex-1 items-center shadow-">
        {/* 스텝바 */}
        <div className="w-full max-w-6xl flex flex-col items-center pb-6">
          <div className="flex items-center justify-center gap-16 w-full mb-4">
            {/* Stepper */}
            <div className="flex items-center gap-16">
              <Stepper currentStep={1} />
            </div>
          </div>

          <div className="text-[48px] font-bold text-[#252016]">
            주인공 선택하기
          </div>
          <div className="mt-1 mb-2 text-base text-[#958A7A]">
            브이로그의 주인공이 될 등장인물을 선택해주세요.
          </div>
        </div>

        <div
          className="w-full h-full max-w-[2300px] max-h-[1200px] bg-white"
          style={{
            boxShadow:
              "inset 0px -4px 4px 0px rgba(0,0,0,0.10), inset -4px 0px 4px 0px rgba(0,0,0,0.11), 0px 4px 4px 0px rgba(0,0,0,0.5), 4px 0px 4px 0px rgba(0,0,0,0.5)",
          }}
        >
          {/* 캐릭터 카드 리스트 */}
          <div className="w-full justify-evenly p-10">
            <ActCharacterCard />
          </div>

          {/* 인물 더보기 + 안내문구 */}
          <div className="flex justify-end items-center mb-8">
            <span className="text-[#959595] text-sm mr-2 font-bold">
              원하는 인물이 없나요?
            </span>
            <button className="border border-[#D2C8BA] bg-white rounded-lg text-[#75624E] flex items-center justify-center mr-10 w-[150px] h-[40px]">
              <span className="text-[16px] font-bold">인물 더보기</span>
              <img src={Down_flag} alt="더보기" className="ml-2" />
            </button>
          </div>
        </div>
      </main>

      {/* 하단 돌아가기 버튼 */}
      <div className="mb-11 mt-10 ml-8">
        <CommonButton
          icon={<img src={BackIcon} alt="뒤로가기" className="mr-2" />}
          className="w-[280px] h-[60px]"
          //onClick={() => navigate("/mylibrary")} 돌아갈 링크
        >
          <span className="text-[20px]">내 서재로 돌아가기</span>
        </CommonButton>{" "}
      </div>
    </div>
  );
};

export default ScriptCreateLayout;
