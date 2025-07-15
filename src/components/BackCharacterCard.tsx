import React from 'react';

interface BackProps {
  name: string;
  description: string;
}

const BackCharacterCard: React.FC<BackProps> = ({name, description}) => {

  return (
    <div className="w-[264px] h-[300px] bg-[#9B8B7A] rounded-md shadow-[10px_10px_32px_0_rgba(0,0,0,0.16)] flex flex-col items-center relative ">
      <div className="absolute top-2 font-bold text-[32px]">{name}</div>
      <div className= "absolute top-10 w-[235px] h-[7px] bg-black flex items-center justify-center"></div>
      <div className="flex-1 flex items-center justify-center text-center px-2">
        <span className="absolute top-14 w-[207px] h-[173px] text-[16px] text-white text-bold">{description}</span>
      </div>
    </div>
  );
};

export default BackCharacterCard;