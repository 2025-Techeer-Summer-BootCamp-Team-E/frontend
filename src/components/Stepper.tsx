import React from "react";

interface StepperProps {
  currentStep: number;
}

const steps = [
  { number: 1, label: "주인공 선택" },
  { number: 2, label: "대본 생성" },
  { number: 3, label: "영상 생성" },
];

const Stepper: React.FC<StepperProps> = ({ currentStep }) => {
  return (
    <div className="relative w-[751px] mx-auto">
      {/* 가로 연결선 - 아이콘 중앙 기준 */}
      <div className="absolute top-[24px] left-[24px] w-[calc(100%-48px)] h-[4px] bg-[#C9B9A4] z-0" />

      {/* 스텝 그룹 */}
      <div className="flex justify-between relative z-10">
        {steps.map((step) => {
          const isActive = step.number === currentStep;

          return (
            <div key={step.number} className="flex flex-col items-center">
              {/* 아이콘 */}
              <div
                className={`grid place-items-center w-12 h-12 rounded-full text-[24px] font-bold leading-none font-noto ${
                  isActive
                    ? "bg-[#4E3C21] text-white"
                    : "bg-white border-[2px] border-[#C9B9A4] text-[#C9B9A4]"
                }`}
              >
                {step.number}
              </div>

              {/* 라벨 */}
              <span className="mt-2 text-[16px] font-bold text-[#4E3C21] font-noto whitespace-nowrap text-center">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stepper;
