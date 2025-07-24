import React, { useEffect, useState } from "react";

interface MoreCharactersProps {
  names: string[];
  onNameClick: (name: string) => void;
  open: boolean;
}

const EXIT_ANIMATION_TIME = 220;

const MoreCharacters: React.FC<MoreCharactersProps> = ({
  onNameClick,
  open,
  names,
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
        flex flex-col items-stretch bg-white rounded-2xl border-4 border-[#B5AD9F] shadow-lg
        w-[200px] min-h-[144px] py-2 px-0 mb-2
        ${animClass}
      `}
    >
      {names.length === 0 ? (
        <span className="p-6 text-lg text-[#999] font-bold text-center">
          입력 가능한 인물이 없습니다
        </span>
      ) : (
        names.map((name, idx) => (
          <React.Fragment key={name}>
            <button
              className={`
                flex-1 flex items-center justify-center text-center py-2
                text-black font-bold text-[18px]
                bg-white hover:bg-gray-100 transition
                border-0 rounded-none outline-none focus:ring-2 focus:ring-[#B5AD9F]
                ${idx === 0 ? "rounded-t-2xl" : ""}
                ${idx === names.length - 1 ? "rounded-b-2xl" : ""}
              `}
              onClick={() => onNameClick(name)}
              style={{ minHeight: "48px" }}
              type="button"
            >
              {name}
            </button>
            {idx !== names.length - 1 && (
              <div className="w-full h-[3px] bg-black opacity-80" />
            )}
          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default MoreCharacters;
