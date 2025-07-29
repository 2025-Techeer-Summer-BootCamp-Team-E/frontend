import React from "react";
import man from "../assets/icons/man.png";
import woman from "../assets/icons/woman.png";

interface FrontProps {
  name: string;
  sex: string;
}

const FrontCharacterCard: React.FC<FrontProps> = ({ name, sex }) => {
  const genderImg = sex === "남성" ? man : woman;

  return (
    <div
      className="w-full h-full flex items-center justify-center relative"
      style={{
        borderRadius: "20px",
        boxShadow: "6px 6px 0 rgba(100, 100, 100, 0.5)",
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      {/* 캐릭터 이름 세로 표기 */}
      <span
        className="absolute top-2 left-2 font-extrabold text-white bg-transparent break-words font-NanumMyeongjo"
        style={{
          writingMode: "vertical-lr",
          textOrientation: "upright",
          letterSpacing: "0.2em",
          fontSize: name.length > 9 ? "16px" : "24px",
        }}
      >
        {name}
      </span>

      <img
        src={genderImg}
        alt={sex}
        className="w-full h-full bg-transparent"
        style={{
          objectFit: "cover",
          borderRadius: "20px",
          transition: "all 0.3s",
        }}
      />
    </div>
  );
};

export default FrontCharacterCard;
