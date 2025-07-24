import React from "react";
import I_Script from "../assets/Icons/Script.svg";

interface BackProps {
  name: string;
  description: string;
  characterId?: number;
  onScriptCreate: (characterId: number, characterName: string) => void;
}

const BackCharacterCard: React.FC<BackProps> = ({
  name,
  description,
  characterId,
  onScriptCreate,
}) => {
  const handleScriptCreate = (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 뒤집기 이벤트 방지

    if (characterId && onScriptCreate) {
      onScriptCreate(characterId, name);
    }
  };

  return (
    <div
      className="w-full h-full bg-[#9B8B7A] rounded-[20px] shadow-lg flex flex-col items-center font-NanumMyeongjo "
      style={{
        boxShadow: "4px 4px 0 rgba(130, 130, 130, 0.7)",
        transition: "all 0.3s cubic-bezier(0.4,0.2,0.3,1)",
      }}
    >
      <div className="font-extrabold text-[40px]">{name}</div>
      <div className="w-[235px] h-[7px] bg-black flex items-center justify-center"></div>
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <div className="w-[220px] h-[175px] text-[18px] text-white text-extrabold">
          {description}
        </div>
      </div>

      <button
        className="w-[190px] h-[42px] flex mt-8 mb-4 rounded-[8px] bg-[#FFF5E3] text-black text-[20px] border-2 border-gray font-bold shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] hover:bg-[#E9E3DC] transition"
        onClick={handleScriptCreate}
        disabled={!characterId}
      >
        <div className="flex mt-1 gap-2 items-center">
          <img
            src={I_Script}
            alt="대본 생성"
            className="w-[28px] h-[28px] ml-2"
          />
          <span className="font-extrabold">대본 작성하기</span>
        </div>
      </button>
    </div>
  );
};

export default BackCharacterCard;
