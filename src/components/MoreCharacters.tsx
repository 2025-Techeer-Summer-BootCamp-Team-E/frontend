import React, { useEffect, useState } from "react";

const names = [
  "정 대식",
  "정 대일",
  "정 대이",
  "정 대삼",
  "정 대사",
  "파우스트",
  "데미안",
  "후치 네드발",
  "카리나",
  "최대7글자까지",
];

interface MoreCharactersProps {
  onNameClick: (name: string) => void;
  open: boolean;
}

const EXIT_ANIMATION_TIME = 220;

const MoreCharacters: React.FC<MoreCharactersProps> = ({
  onNameClick,
  open,
}) => {
  const [show, setShow] = useState(false);
  const [anim, setAnim] = useState<"none" | "enter" | "entered" | "exit">(
    "none"
  );

  useEffect(() => {
    if (open) {
      setShow(true);
      setAnim("enter");
      const t = setTimeout(() => setAnim("entered"), 16);
      return () => clearTimeout(t);
    } else if (show) {
      setAnim("exit");
      const t = setTimeout(() => {
        setShow(false);
        setAnim("none");
      }, EXIT_ANIMATION_TIME);
      return () => clearTimeout(t);
    }
  }, [open, show]);

  if (!show) return null;

  let animClass = "";
  if (anim === "enter") animClass = "more-characters-appear";
  else if (anim === "entered")
    animClass = "more-characters-appear more-characters-appear-active";
  else if (anim === "exit")
    animClass = "more-characters-exit more-characters-exit-active";

  return (
    <div
      className={`
        flex flex-row items-end bg-white rounded-2xl border-4 border-[#B5AD9F] shadow-lg px-2 py-1 mt-2 w-fit
        ${animClass}
      `}
    >
      {names.map((name, idx) => (
        <React.Fragment key={name}>
          <button
            className="h-28 px-2 flex items-end justify-center text-black font-extrabold text-[18px] transition hover:bg-gray-100"
            style={{
              writingMode: "vertical-rl",
              textOrientation: "upright",
              letterSpacing: "0.15em",
            }}
            onClick={() => onNameClick(name)}
          >
            {name}
          </button>
          {idx !== names.length - 1 && (
            <div className="h-28 w-[2px] bg-black opacity-80 rounded"></div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default MoreCharacters;
