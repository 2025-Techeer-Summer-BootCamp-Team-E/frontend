import React from "react";
import { useNavigate } from "react-router-dom";
import I_Script from "../assets/Icons/Script.svg";

interface BackProps {
  name: string;
  description: string;
}

const BackCharacterCard: React.FC<BackProps> = ({ name, description }) => {
  const navigate = useNavigate();

  const handleScriptCreate = () => {
    navigate("/script");
  };

  return (
    <div
      className="w-full h-full bg-[#9B8B7A] rounded-[20px] shadow-lg flex flex-col items-center font-NanumMyeongjo "
      style={{
        boxShadow: "4px 4px 0 rgba(130, 130, 130, 0.7)",
        transition: "all 0.3s cubic-bezier(0.4,0.2,0.3,1)",
      }}
    >
      <div
        className="font-extrabold py-2 break-words"
        style={{
          fontSize:
            name.length > 10 ? "18px" : name.length > 7 ? "24px" : "30px",
          maxWidth: name.length > 10 ? "200px" : "w-full",
        }}
      >
        {name}
      </div>

      {/* 이름-설명 구분선 */}
      <div className="w-[235px] h-[5px] bg-black flex items-center justify-center"></div>

      <div className="flex-1 flex items-center justify-center text-center px-2 mb-10">
        <div className="w-[220px] h-[175px] text-[14px] text-white text-extrabold">
          {description}
        </div>
      </div>

      <button
        className="w-[150px] h-[32  px] flex mt-12 mb-2 rounded-[8px] bg-[#FFF5E3] text-black text-[20px] border-2 border-gray font-bold shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] hover:bg-[#E9E3DC] transition"
        onClick={handleScriptCreate}
      >
        <div className="flex mt-1 gap-2">
          <img
            src={I_Script}
            alt="대본 생성"
            className="w-[18px] h-[18px] ml-2 mt-0.5"
          />
          <span className="font-extrabold text-[16px]">대본 작성하기</span>
        </div>
      </button>
    </div>
  );
};

export default BackCharacterCard;
