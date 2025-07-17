import React from "react";

const names = [
  "정 대식",
  "정 대일",
  "정 대이",
  "정 대삼",
  "정 대사",
  "정 대오",
];

interface MoreCharactersProps {
  onNameClick: (name: string) => void;
}

const MoreCharacters: React.FC<MoreCharactersProps> = ({ onNameClick }) => {
  return (
    <div className="flex flex-col items-center w-[140px] bg-white rounded-md border-2 border-[#B5AD9F] shadow-md">
      {names.map((name, idx) => (
        <React.Fragment key={name}>
          <button
            className="px-2 text-sm text-[#484848] text-center font-medium w-full hover:bg-gray-200"
            onClick={() => onNameClick(name)}
          >
            {name}
          </button>
          {/* 마지막 항목 아래엔 줄 안 넣음 */}
          {idx !== names.length - 1 && (
            <div className="border-[1px] border-black w-full mt-1 mb-1" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MoreCharacters;
