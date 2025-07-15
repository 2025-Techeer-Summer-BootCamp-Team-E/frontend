import React from 'react';
import man from '../assets/Icons/man.svg';
import woman from '../assets/Icons/woman.svg';

interface FrontProps {
  name: string;
  sex: string;
}

const FrontCharacterCard: React.FC<FrontProps> = ({name, sex}) => {
    const genderImg = sex === "남성" ? man : woman;

    return (
        <div className="w-[264px] h-[300px] mb-4 flex items-center justify-center relative rounded-md">
            <span className="absolute top-3 left-1 font-bold text-m" style={{writingMode: 'vertical-rl', textOrientation: 'upright', letterSpacing: '0.2em', }}>{name}</span>
            <img src={genderImg} alt={sex} className="w-full h-full object-cover rounded-md" />
        </div>
    );
};

export default FrontCharacterCard;