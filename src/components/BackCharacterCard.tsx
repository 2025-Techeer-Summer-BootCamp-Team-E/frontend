import React from 'react';

interface BackProps {
  name: string;
  description: string;
}

const BackCharacterCard: React.FC<BackProps> = ({name, description}) => {

  return (
    <div className="w-full h-full bg-[#9B8B7A] rounded-md shadow-lg flex flex-col items-center"
    style={
      {
        boxShadow: '6px 6px 16px rgba(130, 130, 130, 0.7), 6px 6px 16px rgba(130, 130, 130, 0.7)',
        transition: 'all 0.3s cubic-bezier(0.4,0.2,0.3,1)',
      }
    }>
      <div className="font-bold text-[40px]">{name}</div>
      <div className="w-[235px] h-[7px] bg-black flex items-center justify-center"></div>
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <div className="w-[220px] h-[175px] text-[20px] mt-[-100px] text-white text-bold">{description}</div>
      </div>
    </div>
  );
};

export default BackCharacterCard;