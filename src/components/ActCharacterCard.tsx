import React, { useState, useEffect } from 'react';
import FrontCharacterCard from './FrontCharacterCard';
import BackCharacterCard from './BackCharacterCard';

type CharacterType = {
  name: string;
  sex: string;
  description: string;
};


const ActCharacterCard: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  //json 파일에서 캐릭터 데이터 불러오기
  useEffect(() => {
    fetch('/SampleCharacterCard.json')
      .then(res => res.json())
      .then(data => {
        setCharacters(data);
        setSelectedIdx(null);
      });
  }, []);

  if (characters.length === 0) return <div>로딩중...</div>;

  
  return (
    //카드 강조 효과
    <div className="flex flex-wrap gap-12 justify-center">
      {characters.map((character,idx) => {
        const isSelected = idx === selectedIdx;
        const width = isSelected ? 330 : 264;
        const height = isSelected ? 375 : 300;
        const translateY = isSelected ? "-45px" : "0px";
        const zIndex = isSelected ? 10 : 1;

        return(
          <div
            key={character.name}
            style={{
              width,
              height,
              transform: `translateY(${translateY})`,
              borderRadius: 32,
              zIndex,
              transition: "all 0.3s cubic-bezier(0.4,0.2,0.3,1)",
            }}
            
            //클릭 시 카드 전환
            onClick={() => setSelectedIdx(isSelected ? null : idx)}
            className="flex justify-center items-center cursor-pointer border-2 border-transparent bg-transparent"
          >
            {isSelected ? (
              <BackCharacterCard
                name={character.name}
                description={character.description}
              />
            ) : (
              <FrontCharacterCard
                name={character.name}
                sex={character.sex}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ActCharacterCard;