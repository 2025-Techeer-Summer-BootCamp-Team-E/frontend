// src/pages/ScriptPage.tsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Stepper from "../components/Stepper";
import Script from "../components/Script"; // (장면 하나짜리 박스 컴포넌트)
import Regenerating from "../assets/Icons/Regenerating.svg"; // 재생성 아이콘
import FrontCharacterCard from "../components/FrontCharacterCard";
import CommonButton from "../components/CommonButton";
import BackIcon from "../assets/Icons/BackIcon.svg";
import VideoIcon from "../assets/Icons/VideoIcon.svg"; // 영상 생성 아이콘
import { createScript, type ScriptApiResponse } from "../api/characterApi";
import { useAppStore } from "../stores/appStore";
import ConfirmModal from "../components/ConfirmModal";

const ScriptPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Zustand store 사용
  const {
    currentBookSession,
    isBookSessionValid,
    setScriptCache,
    getScriptCache,
  } = useAppStore();

  // CharacterSelectPage에서 전달받은 데이터
  const { scriptData, characterName, characterId } =
    (location.state as {
      scriptData?: ScriptApiResponse;
      characterName?: string;
      characterId?: number;
    }) || {};

  // 최초 대본(A), 재생성 대본(B) 상태 분리
  const [originalScript, setOriginalScript] =
    useState<ScriptApiResponse | null>(scriptData || null);
  const [regeneratedScript, setRegeneratedScript] =
    useState<ScriptApiResponse | null>(null);

  // 현재 보여주는 대본이 original인지 regenerated인지
  const [viewMode, setViewMode] = useState<"original" | "regenerated">(
    "original"
  );
  // 재생성 안내 모달
  const [showRegenerateModal, setShowRegenerateModal] = useState(false);
  // 재생성 중 상태
  const [isRegenerating, setIsRegenerating] = useState(false);
  // 재생성 버튼 비활성화(한 번만 가능)
  const [regenerateUsed, setRegenerateUsed] = useState(false);

  // 툴팁 상태
  const [showTooltip, setShowTooltip] = useState(false);

  const selectedName = characterName || "홍선군";
  const selectedSex = "남성"; // 기본값, 추후 캐릭터 데이터에서 가져올 수 있음

  // 하드코딩된 예시 대본 (fallback용)
  const fallbackScripts = [
    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,
    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,
    `
    (나직하지만 힘 있는 목소리로)
    …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지.
    허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`,
  ];

  // 캐시에서 스크립트 로드 및 초기 설정
  useEffect(() => {
    const actualCharacterId = characterId || originalScript?.characterId;

    if (actualCharacterId) {
      const cachedScripts = getScriptCache(actualCharacterId);

      // 캐시에서 스크립트 복원
      if (cachedScripts.original && !originalScript) {
        setOriginalScript(cachedScripts.original);
      }
      if (cachedScripts.regenerated) {
        setRegeneratedScript(cachedScripts.regenerated);
        setRegenerateUsed(true);
        setViewMode("regenerated"); // 재생성된 대본이 있으면 그것을 먼저 보여줌
      }

      // 새로운 원본 스크립트가 있으면 캐시에 저장
      if (originalScript && characterName) {
        setScriptCache(actualCharacterId, characterName, originalScript, false);
      }
    }
  }, [
    originalScript,
    characterName,
    characterId,
    getScriptCache,
    setScriptCache,
  ]);

  // 스크립트 데이터가 없으면 적절한 페이지로 리다이렉트
  useEffect(() => {
    if (!originalScript) {
      console.warn("스크립트 데이터가 없습니다.");
      if (isBookSessionValid()) {
        navigate("/char");
      } else {
        navigate("/");
      }
    }
  }, [originalScript, navigate, isBookSessionValid]);

  // 현재 보여줄 대본 데이터
  const currentScriptData =
    viewMode === "original" ? originalScript : regeneratedScript;

  // API 응답에서 스크립트 텍스트 추출
  const getScriptsFromData = () => {
    if (!currentScriptData?.scenes) {
      return fallbackScripts;
    }
    return currentScriptData.scenes.map((scene) => {
      const lines = scene.lines
        .map((line) => `${line.speaker}: ${line.line_ko}`)
        .join("\n");
      const background = scene.background ? `배경: ${scene.background}` : "";
      const mood = scene.mood ? `분위기: ${scene.mood}` : "";
      return `${background ? background + "\n" : ""}${mood ? mood + "\n" : ""}${lines}`;
    });
  };

  // 재생성 버튼 클릭 시 안내 모달
  const handleRegenerateClick = () => {
    setShowRegenerateModal(true);
  };

  // 안내 모달에서 확인 시 재생성 진행
  const handleRegenerateConfirm = async () => {
    setShowRegenerateModal(false);
    const actualCharacterId = characterId || originalScript?.characterId;
    if (!actualCharacterId) return;

    setIsRegenerating(true);
    try {
      const newScriptData = await createScript(actualCharacterId);
      setRegeneratedScript(newScriptData);
      setViewMode("regenerated");
      setRegenerateUsed(true);

      // 재생성된 대본을 캐시에 저장
      if (characterName) {
        setScriptCache(actualCharacterId, characterName, newScriptData, true);
      }
    } catch (error) {
      console.error("스크립트 재생성 실패:", error);
      alert("스크립트 재생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsRegenerating(false);
    }
  };

  // 안내 모달에서 취소
  const handleRegenerateCancel = () => {
    setShowRegenerateModal(false);
  };

  // 기존/재생성 대본 전환 버튼
  const renderSwitchButtons = () => {
    if (!regeneratedScript) return null;
    return (
      <div className="flex gap-2 mb-2 justify-end">
        <button
          className={`px-4 py-1 rounded font-semibold border ${viewMode === "original" ? "bg-[#DCAC62] text-white" : "bg-white text-[#DCAC62] border-[#DCAC62]"}`}
          onClick={() => setViewMode("original")}
        >
          기존 대본 보기
        </button>
        <button
          className={`px-4 py-1 rounded font-semibold border ${viewMode === "regenerated" ? "bg-[#DCAC62] text-white" : "bg-white text-[#DCAC62] border-[#DCAC62]"}`}
          onClick={() => setViewMode("regenerated")}
        >
          재생성 대본 보기
        </button>
      </div>
    );
  };

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    if (isBookSessionValid() && currentBookSession) {
      navigate("/char", {
        state: {
          characters: currentBookSession.characters,
          bookTitle: currentBookSession.bookTitle,
          bookId: currentBookSession.bookId,
        },
      });
    } else {
      navigate("/");
    }
  };

  const scripts = getScriptsFromData();

  return (
    <div className="min-h-screen bg-[#F8F3ED]">
      {/* 1) Header + Stepper */}
      <Header
        showNavigation
        navigationComponent={<Stepper currentStep={2} />}
      />

      {/* 2) 타이틀 영역 */}
      <main className="flex justify-center mt-[140px]">
        <div className="w-[751px] mx-auto mt-6">
          <div className="flex flex-col items-center">
            <h1 className="text-[40px] text-[#2C2C2C] font-NanumMyeongjo font-bold">
              스크립트 검토
            </h1>
            <p className="mt-2 text-[16px] text-[#424242] font-nanumGothic">
              AI가 생성한 브이로그 스크립트입니다.
            </p>
          </div>
        </div>
      </main>

      {/* 3) 캐릭터 카드 + 대본 박스 */}
      <div className="flex justify-center items-start mt-[22px] mr-[80px]">
        {/* 캐릭터 카드 */}
        <div className="flex-none w-[183.74px] h-[194px]">
          <FrontCharacterCard name={selectedName} sex={selectedSex} />
        </div>

        {/* 래퍼: 버튼을 절대 위치시키기 위한 relative 부모 */}
        <div className="flex justify-center ml-[37.26px]">
          <div className="relative">
            {/* 기존/재생성 대본 전환 버튼 */}
            {renderSwitchButtons()}
            {/* 실제 컨테이너 (패딩 포함) */}
            <div
              className="
                w-[1206px] h-[661px]
                bg-white rounded-[30px]
                shadow-[0_4px_8.7px_rgba(0,0,0,0.25)]
                p-[23.78px_20px_57.78px_41px]
                box-border
              "
            >
              {/* 스크롤 래퍼 */}
              <div
                className={`
                w-full h-full
                overflow-y-scroll overflow-x-hidden

                /* WebKit 스크롤바 너비 */
                [&::-webkit-scrollbar]:w-[20px]

                /* 트랙 스타일 */
                [&::-webkit-scrollbar-track]:bg-[#F9F9F9]
                [&::-webkit-scrollbar-track]:rounded-[30px]
                [&::-webkit-scrollbar-track]:border-[2px]
                [&::-webkit-scrollbar-track]:border-solid
                [&::-webkit-scrollbar-track]:border-[#B2B2B2]

                /* Thumb 스타일 */
                [&::-webkit-scrollbar-thumb]:box-border
                [&::-webkit-scrollbar-thumb]:bg-[#A2A2A2]
                [&::-webkit-scrollbar-thumb]:rounded-[30px]
                [&::-webkit-scrollbar-thumb]:border-[3px]
                [&::-webkit-scrollbar-thumb]:border-solid
                [&::-webkit-scrollbar-thumb]:border-transparent
                [&::-webkit-scrollbar-thumb]:bg-clip-content
              `}
              >
                <div className="space-y-[34px] w-[1102px]">
                  {scripts.map((text, idx) => (
                    <Script
                      key={`${currentScriptData?.script_id || "fallback"}-${idx}`}
                      sceneTitle={`Scene #${idx + 1}`}
                    >
                      {text}
                    </Script>
                  ))}
                </div>
              </div>
            </div>

            {/* 절대 위치 재생성 버튼 - 마우스 이벤트를 위한 wrapper */}
            <div
              className="
                absolute
                bottom-[calc(100%+22px)]    /* 컨테이너 테두리 기준 22px 위 */
                right-[15px]
              "
              onMouseEnter={() => {
                console.log("마우스 진입:", regenerateUsed);
                if (regenerateUsed) setShowTooltip(true);
              }}
              onMouseLeave={() => {
                console.log("마우스 나감");
                setShowTooltip(false);
              }}
            >
              <button
                onClick={handleRegenerateClick}
                disabled={isRegenerating || regenerateUsed}
                className="
                  flex items-center gap-[6px] h-[27px]
                  font-nanumGothic font-semibold text-[20px] text-black
                  cursor-pointer hover:underline transition
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                <img
                  src={Regenerating}
                  alt="재생성"
                  className={`w-[24px] h-[24px] ${isRegenerating ? "animate-spin" : ""}`}
                />
                <div className="relative">
                  {isRegenerating
                    ? "생성중..."
                    : regenerateUsed
                      ? "재생성 완료"
                      : "재생성"}

                  {/* 툴팁: regenerateUsed일 때만 렌더링, showTooltip으로 애니메이션 제어 */}
                  {regenerateUsed && (
                    <div
                      className={`
                        absolute bottom-[200%] translate-x-[-50%] bg-white flex justify-center items-center px-5 text-left text-base font-normal text-black w-[20rem] h-[5rem] rounded-[1.25rem] shadow-[0px_4px_8px_rgba(0,0,0,0.25)] z-[1] 
                        after:absolute after:bottom-[-0.9rem] after:left-1/2 after:translate-x-[-50%] after:content-[''] after:border-l-[0.625rem] after:border-l-transparent after:border-r-[0.625rem] after:border-r-transparent after:border-t-[1rem] after:border-t-white after:z-[2]
                        transition-all duration-300 ease-in-out transform
                        ${
                          showTooltip
                            ? "opacity-100 scale-100 translate-y-0"
                            : "opacity-0 scale-95 translate-y-1"
                        }
                      `}
                    >
                      재생성은 캐릭터당 1회만 가능합니다.
                    </div>
                  )}
                </div>
              </button>
            </div>
            {/* 재생성 안내 모달 */}
            {showRegenerateModal && (
              <ConfirmModal
                name={selectedName}
                message={
                  "대본 재생성은 캐릭터당 1회만 가능합니다. 정말 재생성 하시겠습니까?"
                }
                onConfirm={handleRegenerateConfirm}
                onCancel={handleRegenerateCancel}
                visible={showRegenerateModal}
                confirmText="재생성"
              />
            )}

            {/* 4) 하단 버튼들 */}
            <CommonButton
              icon={
                <img
                  src={BackIcon}
                  alt="뒤로가기"
                  className="w-[20px] h-[20px]"
                />
              }
              onClick={handleGoBack}
              className="
                absolute
                top-[calc(100%+19px)]                 /* 컨테이너 아래에서 19px 아래 */
                right-[calc(100%+39px)]       /* 컨테이너 왼쪽에서 39px 왼쪽 */
                w-[280px] h-[64px]
                flex items-center justify-center gap-[21px]
                font-nanumGothic font-semibold text-[20px] text-black
              "
            >
              인물선택으로 돌아가기
            </CommonButton>

            <CommonButton
              icon={
                <img
                  src={VideoIcon}
                  alt="영상 생성"
                  className="w-[20px] h-[20px]"
                />
              }
              onClick={() => console.log("영상 생성")}
              className="
                absolute
                top-[calc(100%+19px)]                /* 컨테이너 아래에서 19px 아래 */
                left-[calc(100%+39px)]        /* 컨테이너 오른쪽에서 39px 오른쪽 */
                w-[207px] h-[64px]
                flex items-center justify-center gap-[26px]
                font-nanumGothic font-semibold text-[20px] text-black
              "
            >
              영상생성
            </CommonButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptPage;
