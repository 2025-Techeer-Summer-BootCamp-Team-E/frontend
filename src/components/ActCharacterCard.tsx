import React, { useState, useEffect } from "react";
import FrontCharacterCard from "./FrontCharacterCard";
import BackCharacterCard from "./BackCharacterCard";

// API 응답 타입 (characterApi.ts에서 정의된 것과 동일)
type ApiCharacterType = {
  id: number;
  characterName: string;
  isMain: boolean;
  age: number;
  gender: string;
  characterDescription: string;
  scenes: unknown[];
};

// UI에서 사용할 타입 (기존 JSON 형식과 호환)
type CharacterType = {
  name: string;
  sex: string;
  description: string;
};

interface ActCharacterCardProps {
  characters?: ApiCharacterType[]; // API에서 받은 캐릭터 데이터 (optional)
}

const ActCharacterCard: React.FC<ActCharacterCardProps> = ({
  characters: apiCharacters,
}) => {
  const [characters, setCharacters] = useState<CharacterType[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);

  // API 데이터 또는 JSON 파일에서 캐릭터 데이터 불러오기
  useEffect(() => {
    if (apiCharacters && apiCharacters.length > 0) {
      // API에서 받은 데이터를 UI 형식으로 변환
      const transformedCharacters: CharacterType[] = apiCharacters.map(
        (char) => ({
          name: char.characterName,
          sex:
            char.gender === "male"
              ? "남성"
              : char.gender === "female"
                ? "여성"
                : char.gender,
          description: char.characterDescription,
        })
      );

      setCharacters(transformedCharacters);
      setFlipped(Array(transformedCharacters.length).fill(false));
    } else {
      // fallback: JSON 파일에서 캐릭터 데이터 불러오기
      fetch("/SampleCharacterCard.json")
        .then((res) => res.json())
        .then((data) => {
          setCharacters(data);
          setFlipped(Array(data.length).fill(false));
        })
        .catch((error) => {
          console.error("Failed to fetch sample characters:", error);
          setCharacters([]);
          setFlipped([]);
        });
    }
  }, [apiCharacters]);

  if (characters.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DCAC62] mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">등장인물을 불러오는 중...</p>
        </div>
      </div>
    );
  }

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
          key={`${character.name}-${idx}`}
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
          transform: rotateY(-180deg);
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
          transform: rotateY(-180deg);
        }
      `}</style>
    </div>
  );
};

export default ActCharacterCard;
