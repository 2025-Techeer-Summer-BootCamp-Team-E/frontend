import React from "react";
import BackIcon from "../assets/Icons/BackIcon.svg";

// 1rem = 16px
const CommonButton: React.FC = () => {
  return (
    // align-items:center -> items-center (tailwind버전)
    <button className="flex flex-row justify-center gap-[20px] items-center w-[17.5rem] h-[4rem] bg-[#FCFAF7] text-black rounded-full shadow-md">
      <img src={BackIcon} className="w-[20px] h-[20px]" />
      <span className="text-[20px] text-lg font-bold">대본으로 돌아가기</span>
    </button>
  );
};

export default CommonButton;
