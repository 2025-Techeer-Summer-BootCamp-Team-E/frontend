import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import type { ApiCharacterType } from "../components/ActCharacterCard";
import Header from "../components/Header";
import ActCharacterCard from "../components/ActCharacterCard";
import CommonButton from "../components/CommonButton";
import Stepper from "../components/Stepper";
import BackIcon from "../assets/icons/BackIcon.svg";
import MoreCharacters from "../components/MoreCharacters";
import Up_flag from "../assets/icons/up_flag.svg";
import Down_flag from "../assets/icons/down_flag.svg";
import ConfirmModal from "../components/ConfirmModal";
import { createScript } from "../api/characterApi";
import { useAppStore } from "../stores/appStore";

const CharacterSelectPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showMore, setShowMore] = useState(false);
  //const [modalName, setModalName] = useState<string | null>(null);
  const [modalCharacter, setModalCharacter] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // 대본 생성 로딩 상태
  const [isScriptLoading, setIsScriptLoading] = useState(false);
  const [scriptCharacterName, setScriptCharacterName] = useState<string>("");

  // Zustand store 사용
  const {
    currentBookSession,
    isBookSessionValid,
    getScriptCache,
    setScriptCache,
    scriptCache,
    clearAllScripts,
  } = useAppStore();

  // MyLibraryPage에서 전달받은 캐릭터 데이터 또는 store에서 가져온 데이터
  const locationState = location.state || {};
  const { characters: locationCharacters, bookTitle: locationBookTitle } =
    locationState;

  // Store의 데이터가 유효하면 사용, 아니면 location.state 사용
  const characters =
    isBookSessionValid() && currentBookSession?.characters
      ? currentBookSession.characters
      : locationCharacters;
  const bookTitle =
    isBookSessionValid() && currentBookSession?.bookTitle
      ? currentBookSession.bookTitle
      : locationBookTitle;

  // 캐릭터 데이터가 없으면 MyLibrary로 리다이렉트
  useEffect(() => {
    if (!characters || !bookTitle) {
      console.warn("캐릭터 또는 책 정보가 없습니다:", {
        characters: !!characters,
        bookTitle: !!bookTitle,
      });
      alert("잘못된 접근입니다. 책을 선택해주세요.");
      navigate("/");
    }
  }, [characters, bookTitle, navigate]);

  // 대본 생성 시작 핸들러
  const handleScriptCreate = async (
    characterId: number,
    characterName: string
  ) => {
    // 먼저 캐시된 스크립트가 있는지 확인
    const cachedScripts = getScriptCache(characterId);

    // 원본 또는 재생성된 대본이 있으면 바로 이동 (원본 우선)
    if (cachedScripts.original || cachedScripts.regenerated) {
      const scriptData = cachedScripts.original || cachedScripts.regenerated;
      console.log("캐시된 스크립트 사용:", characterName);

      navigate("/script", {
        state: {
          scriptData,
          characterName,
          characterId,
        },
      });
      return;
    }

    // 캐시된 스크립트가 없으면 API 호출
    setIsScriptLoading(true);
    setScriptCharacterName(characterName);

    try {
      // 스크립트 생성 API 호출
      const scriptData = await createScript(characterId);

      // 새로 생성된 스크립트를 캐시에 저장 (원본으로)
      setScriptCache(characterId, characterName, scriptData, false);

      // ScriptPage로 네비게이션하면서 스크립트 데이터 전달
      navigate("/script", {
        state: {
          scriptData,
          characterName,
          characterId,
        },
      });
    } catch (error) {
      console.error("스크립트 생성 실패:", error);
      alert("스크립트 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsScriptLoading(false);
      setScriptCharacterName("");
    }
  };

  const handleConfirm = () => {
    if (!modalCharacter) return;
    handleScriptCreate(modalCharacter.id, modalCharacter.name);
    setModalCharacter(null);
    setModalVisible(false);
  };

  const handleNameClick = (name: string) => {
    const character = (characters as ApiCharacterType[]).find(
      (c) => c.characterName === name
    );
    if (character) {
      setModalCharacter({ id: character.id, name: character.characterName }); // ✅ 변경됨
      setModalVisible(true);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
    setTimeout(() => setModalCharacter(null), 220);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80); // 80px 넘으면 효과 적용
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 메인 캐릭터가 배열이면 5개로 슬라이스, 배열 아니면 빈 배열
  const mainCharacters = Array.isArray(characters)
    ? (characters as ApiCharacterType[]).slice(0, 5)
    : [];

  const moreCharacters = Array.isArray(characters)
    ? (characters as ApiCharacterType[]).slice(5).map((c) => c.characterName)
    : [];

  // 내 서재로 돌아가기 안내 모달 상태
  const [showGoHomeModal, setShowGoHomeModal] = useState(false);

  // 내 서재로 돌아가기 버튼 클릭 핸들러
  const handleGoHomeClick = () => {
    // scriptCache에 값이 하나라도 있으면 모달 띄움
    if (scriptCache && Object.keys(scriptCache).length > 0) {
      setShowGoHomeModal(true);
    } else {
      navigate("/");
    }
  };

  // 내 서재로 돌아가기 모달에서 확인
  const handleGoHomeConfirm = () => {
    clearAllScripts();
    setShowGoHomeModal(false);
    navigate("/");
  };

  // 내 서재로 돌아가기 모달에서 취소
  const handleGoHomeCancel = () => {
    setShowGoHomeModal(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* 대본 생성 로딩 모달 */}
      {isScriptLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md">
            <div className="w-24 h-24 mb-4">
              {/* 로딩 애니메이션 - 회전하는 원 */}
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#DCAC62]"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700 text-center mb-3">
              <span className="text-[#DCAC62]">{scriptCharacterName}</span>의{" "}
              <br />
              브이로그 대본을 생성하고 있어요!
            </p>
            <div className="text-sm text-gray-500 text-center space-y-1">
              <p>🤖 AI가 캐릭터의 성격을 분석 중입니다</p>
              <p>✍️ 매력적인 브이로그 대본을 작성 중입니다</p>
              <p>🎬 영상에 맞는 스크립트를 준비 중입니다</p>
              <p className="text-xs text-gray-400 mt-2">
                잠시만 기다려주세요
                <br />곧 완성됩니다!
              </p>
            </div>
          </div>
        </div>
      )}

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
            {bookTitle ? `『${bookTitle}』의 등장인물 중에서 ` : ""}브이로그의
            주인공이 될 등장인물을 선택해주세요.
          </div>
        </div>

        <div
          className="bg-white mx-auto w-[calc(100vw-128px)]"
          style={{
            background: "white",
            boxShadow: "inset 0 0 0 4px #ACACAC",
          }}
        >
          {/* 캐릭터 카드 리스트 */}
          <div className="py-10">
            <ActCharacterCard
              characters={mainCharacters}
              onScriptCreate={handleScriptCreate}
            />
            {/* <ActCharacterCard
              characters={characters}
              onScriptCreate={handleScriptCreate}
            /> */}
          </div>

          {/* 인물 더보기 + 안내문구 + 토글 버튼+토글창 세트 */}
          <div className="flex justify-end items-center p-4">
            <span className="text-[#959595] text-sm mr-2 font-bold">
              원하는 인물이 없나요?
            </span>
            <div className="relative">
              {/* 토글창: 버튼 바로 위에 absolute로 위치 */}
              {showMore && (
                <div className="absolute bottom-[48px] right-0 z-30 w-[220px] max-w-[95vw]">
                  <MoreCharacters
                    open={showMore}
                    onNameClick={handleNameClick}
                    names={moreCharacters}
                  />
                </div>
              )}

              {/* 인물 더보기 버튼 */}
              <button
                className="border border-[#D2C8BA] bg-white rounded-lg text-[#75624E] flex items-center justify-center w-[150px] h-[40px]"
                onClick={() => setShowMore((prev) => !prev)}
              >
                <span className="text-[18px] font-NanumSquare font-[1000]">
                  인물 더보기
                </span>
                <img
                  src={showMore ? Down_flag : Up_flag}
                  alt="더보기"
                  className="ml-2"
                />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 하단 돌아가기 버튼 */}
      <div className="flex">
        <span>
          <CommonButton
            icon={<img src={BackIcon} alt="뒤로가기" className="mr-2" />}
            className="w-[280px] h-[60px] mb-11 mt-10"
            onClick={handleGoHomeClick}
          >
            <span className="text-[20px]">내 서재로 돌아가기</span>
          </CommonButton>
        </span>

        {modalCharacter && (
          <ConfirmModal
            name={modalCharacter.name}
            onConfirm={handleConfirm}
            onCancel={handleCancel}
            visible={modalVisible}
          />
        )}
        {showGoHomeModal && (
          <ConfirmModal
            name={""}
            message={
              "생성한 대본이 초기화됩니다. 정말 내 서재로 돌아가시겠습니까?"
            }
            onConfirm={handleGoHomeConfirm}
            onCancel={handleGoHomeCancel}
            visible={showGoHomeModal}
            confirmText="네, 돌아갈래요"
          />
        )}
      </div>
    </div>
  );
};

export default CharacterSelectPage;
