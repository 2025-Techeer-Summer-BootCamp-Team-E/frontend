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

  // 이름의 공백이 2개 이상일 떄 줄바꿈
  const splitBySecondSpace = (str: string): string[] => {
    let count = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === " ") {
        count += 1;
        if (count === 2) {
          return [str.slice(0, i), str.slice(i + 1)];
        }
      }
    }
    return [str];
  };

  return (
    <div
      className="w-full h-full bg-[#9B8B7A] rounded-[20px] shadow-lg flex flex-col items-center font-NanumMyeongjo"
      style={{
        boxShadow: "4px 4px 0 rgba(130, 130, 130, 0.7)",
        transition: "all 0.3s cubic-bezier(0.4,0.2,0.3,1)",
      }}
    >
      {/* 이름 + 구분선 */}
      <div
        style={{ minHeight: 75, width: "100%" }}
        className="flex flex-col items-center justify-end"
      >
        <div
          className="font-extrabold py-2 break-words text-center"
          style={{
            fontSize:
              name.length > 10 ? "18px" : name.length > 7 ? "24px" : "30px",
            maxWidth: name.length > 10 ? "200px" : "100%",
          }}
        >
          {splitBySecondSpace(name).map((part, idx) => (
            <div key={idx}>{part}</div>
          ))}
        </div>
        {/* 구분선(항상 이름 아래 고정) */}
        <div className="w-[235px] h-[5px] bg-black rounded" />
      </div>

      {/* 설명 영역 */}
      <div className="flex-1 flex items-center justify-center text-center px-2 mb-10">
        <div
          className="w-[220px] h-[175px] text-white text-extrabold"
          style={{
            fontSize: description.length > 150 ? "16px" : "18px",
          }}
        >
          {description}
        </div>
      </div>

      {/* 대본 작성하기 버튼 */}
      <button
        className="w-[150px] h-[32px] flex mt-12 mb-2 rounded-[8px] bg-[#FFF5E3] text-black text-[20px] border-2 border-gray font-bold shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] hover:bg-[#E9E3DC] transition"
        onClick={handleScriptCreate}
        disabled={!characterId}
      >
        <div className="flex mt-1 gap-2 items-center">
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
