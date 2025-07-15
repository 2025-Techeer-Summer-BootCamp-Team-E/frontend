import React from 'react';

interface BackProps {
  name: string;
  description: string;
}

const BackCharacterCard: React.FC<BackProps> = ({name, description}) => {

  return (
    <div className="w-[264px] h-[300px] bg-[#9B8B7A] rounded-md shadow-lg flex flex-col items-center">
      <div className="font-bold text-[32px]">{name}</div>
      <div className="w-[235px] h-[7px] bg-black flex items-center justify-center"></div>
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <span className="w-[207px] h-[173px] text-[16px] text-white text-bold">{description}</span>
      </div>
    </div>
  );
};

export default BackCharacterCard;