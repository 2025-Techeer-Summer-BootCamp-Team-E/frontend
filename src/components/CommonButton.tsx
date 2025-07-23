import React from "react";
import { twMerge } from "tailwind-merge";

type CommonButtonProps = {
  children: React.ReactNode; // 버튼 안에 들어갈 텍스트 혹은 다른 React 요소
  icon?: React.ReactElement<{ className?: string }>; // 아이콘을 선택적으로 받을 수 있도록 추가
  className?: string; // tailwind-merge를 위해 className을 명시적으로 추가
  onClick?: () => void;
  disabled?: boolean; // 버튼 비활성화 상태
};

// 1rem = 16px
const CommonButton: React.FC<CommonButtonProps> = ({
  children,
  icon,
  className,
  onClick,
  disabled = false,
}) => {
  const iconWithClassName = icon
    ? React.cloneElement(icon, { className: "w-[20px] h-[20px]" })
    : null;

  return (
    // (CSS) align-items:center -> (tailwind) items-center
    <button
      className={twMerge(
        "flex flex-row justify-center gap-[1.25rem] items-center w-[17.5rem] h-[4rem] bg-[#FCFAF7] text-black rounded-full shadow-md",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {iconWithClassName}
      <span className="text-[20px] text-lg font-bold">{children}</span>
    </button>
  );
};

export default CommonButton;
