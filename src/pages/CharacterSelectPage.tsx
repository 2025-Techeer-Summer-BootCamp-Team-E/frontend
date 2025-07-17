import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import ActCharacterCard from "../components/ActCharacterCard";
import CommonButton from "../components/CommonButton";
import Stepper from "../components/Stepper";
import BackIcon from "../assets/Icons/BackIcon.svg";
import MoreCharacters from "../components/MoreCharacters";
import Down_flag from "../assets/Icons/Down_flag.svg";
import ConfirmModal from "../components/ConfirmModal";

const CharacterSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);
  const [modalName, setModalName] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleConfirm = () => {
    // 실제 진행 로직(예: 페이지 이동 등) 추가
    setModalName(null);
    navigate("/script");
  };

  // 모달에서 취소
  const handleCancel = () => {
    setModalName(null);
  }; // ...기존 코드

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80); // 80px 넘으면 효과 적용
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      <Header
        showNavigation={true}
        navigationComponent={<Stepper currentStep={1} />}
        isScrolled={isScrolled}
      />

      <main className="pt-[180px] flex flex-col flex-1 items-center">
        <div className="w-full max-w-6xl flex flex-col items-center pb-6">
          <div className="text-[48px] font-bold text-[#252016]">
            주인공 선택하기
          </div>
          <div className="mt-1 mb-2 text-base text-[#958A7A]">
            브이로그의 주인공이 될 등장인물을 선택해주세요.
          </div>
        </div>

        <div
          className="bg-white mx-auto w-[calc(100vw-128px)]"
          style={{
            background: "white",
            boxShadow: "inset 0 0 0 4px #ACACAC", // 안쪽(border처럼) 테두리
          }}
        >
          {/* 캐릭터 카드 리스트 */}
          <div className="py-10">
            <ActCharacterCard />
          </div>

          {/* 인물 더보기 + 안내문구 */}
          <div className="flex justify-end items-center p-2">
            <span className="text-[#959595] text-sm mr-2 font-bold">
              원하는 인물이 없나요?
            </span>
            <button
              className="border border-[#D2C8BA] bg-white rounded-lg text-[#75624E] flex items-center justify-center w-[150px] h-[40px]"
              onClick={() => setShowMore((prev) => !prev)}
            >
              <span className="text-[16px] font-bold">인물 더보기</span>
              <img src={Down_flag} alt="더보기" className="ml-2" />
            </button>
          </div>
        </div>
      </main>

      {/* 하단 돌아가기 버튼 */}
      <div className="flex">
        <span>
          <CommonButton
            icon={<img src={BackIcon} alt="뒤로가기" className="mr-2" />}
            className="w-[280px] h-[60px] mb-11 mt-10"
            onClick={() => navigate("/main")}
          >
            <span className="text-[20px]">내 서재로 돌아가기</span>
          </CommonButton>
        </span>

        <span className="flex justify-end w-full max-w-[calc(100vw-128px)] mr-2 mt-2">
          {showMore && (
            <div>
              <MoreCharacters onNameClick={setModalName} />
            </div>
          )}
        </span>

        {modalName && (
          <ConfirmModal
            name={modalName}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterSelectPage;
