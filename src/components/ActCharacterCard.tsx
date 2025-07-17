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

  // json 파일에서 캐릭터 데이터 불러오기
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
    <div className="flex justify-center justify-evenly w-full">
      {characters.map((character, idx) => (
        <div
          key={character.name}
          className={`flip-card ${flipped[idx] ? "flipped" : ""}`}
          style={{ width: 300, height: 400, cursor: "pointer" }}
          onClick={() => handleFlip(idx)}
        >
          <div className="flip-card-inner">
            <div className="flip-card-front">
              <FrontCharacterCard name={character.name} sex={character.sex} />
            </div>
            <div className="flip-card-back">
              <BackCharacterCard
                name={character.name}
                description={character.description}
              />
            </div>
          </div>
        </div>
      ))}
      <style>{`
        .flip-card {
          perspective: 1000px;
          width: 300px;
          height: 400px;
        }
        .flip-card-inner {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.5s cubic-bezier(0.4,0.2,0.3,1);
          transform-style: preserve-3d;
        }
        .flip-card.flipped .flip-card-inner {
          transform: rotateY(180deg);
        }
        .flip-card-front, .flip-card-back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          top: 0;
          left: 0;
        }
        .flip-card-back {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default ActCharacterCard;
