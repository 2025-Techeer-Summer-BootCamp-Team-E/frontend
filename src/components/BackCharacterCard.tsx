import React from 'react';

interface BackProps {
  name: string;
  description: string;
}

const BackCharacterCard: React.FC<BackProps> = ({name, description}) => {

  return (
    <div className="w-full h-full bg-[#9B8B7A] rounded-[20px] shadow-lg flex flex-col items-center"
    style={
      {
        boxShadow: '6px 6px 16px rgba(130, 130, 130, 0.7), 6px 6px 16px rgba(130, 130, 130, 0.7)',
        transition: 'all 0.3s cubic-bezier(0.4,0.2,0.3,1)',
      }
    }>
      <div className="font-bold text-[40px]">{name}</div>
      <div className="w-[235px] h-[7px] bg-black flex items-center justify-center"></div>
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <div className="w-[220px] h-[175px] text-[16px] text-white text-bold">{description}</div>
      </div>
      <button
        className="w-[190px] h-[42px] mt-4 mb-4 rounded-[8px] bg-white text-[#9B8B7A] text-[18px] font-bold shadow-[0_4px_12px_0_rgba(0,0,0,0.09)] hover:bg-[#E9E3DC] transition"
        style={{
          letterSpacing: "0.02em",
        }}
      >
        대본 작성하기
      </button>
    </div>
  );
};

export default BackCharacterCard;