import React, { useState, useEffect } from "react";
import FrontCharacterCard from "./FrontCharacterCard";
import BackCharacterCard from "./BackCharacterCard";

type CharacterType = {
  name: string;
  sex: string;
  description: string;
};

const ActCharacterCard: React.FC = () => {
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);

  //json 파일에서 캐릭터 데이터 불러오기
  useEffect(() => {
    fetch("/SampleCharacterCard.json")
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data);
        setFlipped(Array(data.length).fill(false));
      });
  }, []);

  if (characters.length === 0) return <div>로딩중...</div>;

  const handleFlip = (idx: number) => {
    setFlipped((prevFlipped) => {
      const updated = [...prevFlipped];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  return (
    <div className="flex justify-evenly w-full">
      {characters.map((character, idx) => (
        <div
          key={character.name}
          className="w-[300px] h-[400px] flex justify-center items-center rounded-[30px]"
        >
          <button
            onClick={() => handleFlip(idx)}
            className="w-full h-full focus:outline-none border-none bg-transparent"
          >
            {flipped[idx] ? (
              <BackCharacterCard
                name={character.name}
                description={character.description}
              />
            ) : (
              <FrontCharacterCard name={character.name} sex={character.sex} />
            )}
          </button>
        </div>
      ))}
    </div>
  );
};

export default ActCharacterCard;
