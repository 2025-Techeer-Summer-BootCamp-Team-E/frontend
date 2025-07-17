import React from "react";
import man from "../assets/Icons/Man.svg";
import woman from "../assets/Icons/Woman.svg";

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
        boxShadow:
          "6px 6px 0 rgba(100, 100, 100, 0.5), 6px 6px 0 rgba(100, 100, 100, 0.5)",
        transition: "box-shadow 0.3s ease-in-out",
      }}
    >
      <span
        className="absolute top-2 left-2 font-bold text-[28px] text-white bg-transparent"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "upright",
          letterSpacing: "0.2em",
        }}
      >
        {name}
      </span>
      <img
        src={genderImg}
        alt={sex}
        className="w-full h-full bg-transparent font-[#FFFFFF]"
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
