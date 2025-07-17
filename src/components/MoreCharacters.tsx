import React from "react";

const names = ["정 대식", "정 대일", "정 대이", "정 대삼"];

const MoreCharacters: React.FC = () => {
  return (
    <div className="flex flex-col items-center w-[120px] bg-white rounded-xl border border-[#bcb3a2] py-3 shadow-md mx-auto">
      {names.map((name, idx) => (
        <React.Fragment key={name}>
          <div className="px-2 text-sm text-[#484848] text-center font-medium w-full">
            {name}
          </div>
          {/* 마지막 항목 아래엔 줄 안 넣음 */}
          {idx !== names.length - 1 && (
            <div className="border-t-[3px] border-black w-full" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MoreCharacters;
