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
import {
  createScriptAsync,
  createScriptProcessingStream,
  type ScriptSSEEventData,
} from "../api/characterApi";
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

  // 대본 생성 관련 상태 추가
  const [isScriptProcessing, setIsScriptProcessing] = useState(false);
  const [scriptProgress, setScriptProgress] = useState<string>("");
  const [scriptCleanup, setScriptCleanup] = useState<(() => void) | null>(null);

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

    // 캐시된 스크립트가 없으면 비동기 API 호출
    setIsScriptLoading(true);
    setScriptCharacterName(characterName);
    setScriptProgress("대본 생성 시작 중...");
    setIsScriptProcessing(true);

    try {
      // 비동기 대본 생성 API 호출
      const scriptResponse = await createScriptAsync(characterId);

      // 응답 타입에 따라 처리
      if ("task_id" in scriptResponse) {
        // 새로운 대본 생성이 필요한 경우 (비동기)
        console.log("새로운 대본 생성 시작:", scriptResponse);
        setScriptProgress("대본 생성 중...");

        // SSE 연결 설정
        let cleanupFunc: (() => void) | null = null;

        const createScriptSSEConnection = async () => {
          cleanupFunc = await createScriptProcessingStream(
            scriptResponse.task_id,
            (eventData: ScriptSSEEventData) => {
              console.log("Script SSE Event received:", eventData);

              if (eventData.event === "connected") {
                const message = "연결 성공! AI가 대본을 생성하고 있어요";
                console.log("🔗 [Script SSE] 연결 성공 - 메시지:", message);
                setScriptProgress(message);
              } else if (eventData.event === "progress") {
                const message = "대본 생성 중... 잠시만 기다려주세요";
                console.log("📊 [Script SSE] 진행 중 - 메시지:", message);
                setScriptProgress(message);
              } else if (eventData.event === "completed") {
                const message = `대본 생성 완료! ${eventData.data.scene_count}개의 장면이 생성되었습니다.`;
                console.log("✅ [Script SSE] 완료 - 메시지:", message);
                setScriptProgress(message);

                // 완료된 대본 정보 저장
                if (eventData.data.scenes) {
                  const scriptData = {
                    script_id: eventData.data.script_id || "",
                    characterId: characterId,
                    scenes: eventData.data.scenes,
                  };

                  // 새로 생성된 스크립트를 캐시에 저장 (원본으로)
                  setScriptCache(characterId, characterName, scriptData, false);

                  // 페이지 이동
                  navigate("/script", {
                    state: {
                      scriptData,
                      characterName,
                      characterId,
                    },
                  });
                }

                // 2초 후 모달 닫기
                setTimeout(() => {
                  setScriptCleanup(null);
                  setIsScriptProcessing(false);
                  setScriptProgress("");
                  setScriptCharacterName("");
                }, 2000);
              } else if (eventData.event === "error") {
                const message = `오류가 발생했어요: ${eventData.data.error_message || "알 수 없는 오류"}`;
                console.log("❌ [Script SSE] 오류 - 메시지:", message);
                setScriptProgress(message);
                setScriptCleanup(null);
                setIsScriptProcessing(false);
                setScriptProgress("");
                setScriptCharacterName("");
                alert(
                  `대본 생성 중 오류가 발생했습니다: ${eventData.data.error_message || "알 수 없는 오류"}`
                );
              }
            },
            (error) => {
              console.error("Script SSE Error:", error);
              setScriptProgress("연결 오류가 발생했어요");
              setScriptCleanup(null);
              setIsScriptProcessing(false);
              setScriptProgress("");
              setScriptCharacterName("");
            },
            () => {
              console.log("Script SSE stream completed");
              setScriptCleanup(null);
            }
          );

          if (cleanupFunc) {
            setScriptCleanup(() => cleanupFunc);
          }
        };

        await createScriptSSEConnection();
      } else {
        // 이미 대본이 존재하는 경우 (동기)
        console.log("기존 대본 조회:", scriptResponse);
        const scriptData = {
          script_id: scriptResponse.script_id,
          characterId: characterId,
          scenes: scriptResponse.scenes,
        };

        // 기존 대본을 캐시에 저장 (원본으로)
        setScriptCache(characterId, characterName, scriptData, false);

        // 페이지 이동
        navigate("/script", {
          state: {
            scriptData,
            characterName,
            characterId,
          },
        });
      }
    } catch (error) {
      console.error("Failed to create script:", error);

      // 에러 타입에 따른 상세 메시지
      let errorMessage = "대본 생성에 실패했습니다.";

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number };
          code?: string;
        };
        if (axiosError.response?.status === 500) {
          errorMessage = `서버에서 대본 생성 중 오류가 발생했습니다.`;
        } else if (axiosError.response?.status === 404) {
          errorMessage = "해당 캐릭터를 찾을 수 없습니다.";
        } else if (axiosError.code === "ERR_NETWORK") {
          errorMessage = "네트워크 연결을 확인해주세요.";
        }
      }

      alert(errorMessage);
    } finally {
      setIsScriptLoading(false);
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

  // SSE 연결 정리
  useEffect(() => {
    return () => {
      if (scriptCleanup) {
        scriptCleanup();
      }
    };
  }, [scriptCleanup]);

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

      {/* 대본 생성 처리 로딩 모달 */}
      {isScriptProcessing && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 flex flex-col items-center max-w-md">
            <div className="w-24 h-24 mb-4">
              {/* 로딩 애니메이션 - 회전하는 원 */}
              <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-[#DCAC62]"></div>
            </div>
            <p className="text-lg font-semibold text-gray-700 text-center mb-3">
              『{scriptCharacterName}』의 대본을 생성하고 있어요!
            </p>
            <div className="text-sm text-gray-500 text-center space-y-1">
              <p>🤖 AI가 캐릭터를 분석 중입니다</p>
              <p>📝 대본과 장면을 생성하고 있어요</p>
              <p className="text-xs text-gray-400 mt-2">{scriptProgress}</p>
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
