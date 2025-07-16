import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ActCharacterCard from "../components/ActCharacterCard";
import CommonButton from "../components/CommonButton";
import BackIcon from "../assets/Icons/BackIcon.svg";
import { Link } from "react-router-dom";

const ScriptCreateLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8F3ED]">
      {/* 상단 헤더 */}
      <Header />

      {/* 메인 내용 */}
      <main className="flex flex-col flex-1 items-center w-full pt-6">
        {/* 스텝바 */}
        <div className="w-full max-w-6xl flex flex-col items-center pb-8">
          <div className="flex items-center justify-center gap-16 w-full mt-4 mb-4">
            {/* Stepper */}
            <div className="flex items-center gap-16"></div>
          </div>

          <div className="mt-2 text-4xl font-bold text-[#252016]">
            주인공 선택하기
          </div>
          <div className="mt-2 text-base text-[#958A7A]">
            브이로그의 주인공이 될 등장인물을 선택해주세요.
          </div>
        </div>

        <div className="w-full max-w-[2300px] bg-white">
          {/* 캐릭터 카드 리스트 */}
          <div className="w-full flex justify-center justify-evenly mb-10 mt-10 ml-10">
            <ActCharacterCard />
          </div>

          {/* 인물 더보기 + 안내문구 */}
          <div className="flex justify-end items-center mb-8">
            <span className="text-[#C1B5A7] text-sm mr-2">
              원하는 인물이 없나요?
            </span>
            <button className="border border-[#D2C8BA] bg-white rounded-lg text-[#75624E] text-sm flex items-center mr-10">
              인물 더보기 <span className="ml-1">▼</span>
            </button>
          </div>
        </div>
      </main>

      {/* 하단 돌아가기 버튼 */}
      <div className="mb-10 ml-8">
        <CommonButton
          icon={<img src={BackIcon} alt="뒤로가기" className="mr-2" />}
          //onClick={() => navigate("/mylibrary")}
        >
          내 서재로 돌아가기
        </CommonButton>{" "}
      </div>
    </div>
  );
};

export default ScriptCreateLayout;
