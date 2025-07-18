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
  const [modalVisible, setModalVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleConfirm = () => {
    setModalVisible(false); // 먼저 숨기기
    setTimeout(() => {
      setModalName(null); // 애니메이션 후 완전 제거
      navigate("/script");
    }, 220); // ConfirmModal.tsx의 duration과 맞추세요
  };

  const handleNameClick = (name: string) => {
    setModalName(name);
    setModalVisible(true); // 모달 등장
  };

  const handleCancel = () => {
    setModalVisible(false);
    setTimeout(() => setModalName(null), 220);
  };

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
          <div className="text-[48px] font-bold text-[#252016] font-NanumMyeongjo">
            주인공 선택하기
          </div>
          <div className="mt-1 mb-2 text-base text-[#868686] font-NanumMyeongjo">
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
              <span className="text-[18px] font-NanumSquare font-[1000]">
                인물 더보기
              </span>
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
              <MoreCharacters open={showMore} onNameClick={handleNameClick} />
            </div>
          )}
        </span>

        {modalName && (
          <ConfirmModal
            name={modalName}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            visible={modalVisible}
          />
        )}
      </div>
    </div>
  );
};

export default CharacterSelectPage;
