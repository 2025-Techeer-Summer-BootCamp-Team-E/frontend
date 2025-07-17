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
      className="w-full h-full bg-[#9B8B7A] rounded-[20px] shadow-lg flex flex-col items-center"
      style={{
        boxShadow:
          "4px 4px 0 rgba(130, 130, 130, 0.7), 4px 4px 0 rgba(130, 130, 130, 0.7)",
        transition: "all 0.3s cubic-bezier(0.4,0.2,0.3,1)",
      }}
    >
      <div className="font-bold text-[40px]">{name}</div>
      <div className="w-[235px] h-[7px] bg-black flex items-center justify-center"></div>
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <div className="w-[220px] h-[175px] text-[16px] text-white text-bold">
          {description}
        </div>
      </div>

      <button
        className="w-[190px] h-[42px] flex mt-4 mb-4 rounded-[8px] bg-[#FFF5E3] text-black text-[20px] border-2 border-gray font-bold shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] hover:bg-[#E9E3DC] transition"
        onClick={handleScriptCreate}
      >
        <div className="flex mt-1 gap-2">
          <img
            src={I_Script}
            alt="대본 생성"
            className="w-[28px] h-[28px] ml-2"
          />
          대본 작성하기
        </div>
      </button>
    </div>
  );
};

export default BackCharacterCard;
