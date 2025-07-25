import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CommonButton from "../components/CommonButton"; //뒤로가기
// import BackIcon from "../assets/icons/BackIcon.svg"; // 뒤로가기
import Home from "../assets/icons/Home.svg";
import Plus from "../assets/icons/Plus.svg";
import Stepper from "../components/Stepper";

const VideoCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { videoUrl } = location.state || {};
  const {
    /*videoId, // 실제 api 연동하면 주석 제거
    scriptId,
    title,*/
    characterName,
  } = location.state || {};

  // URL 타입을 감지하고 적절한 임베드 URL로 변환하는 함수
  const getEmbedUrl = (url: string): string => {
    if (!url) return "";

    // YouTube URL 처리
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/
      )?.[1];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // Google Drive URL 처리
    if (url.includes("drive.google.com")) {
      // 일반 구글 드라이브 링크를 임베드 링크로 변환
      const fileId =
        url.match(/\/d\/([^/\n?#]+)/)?.[1] || url.match(/id=([^&\n?#]+)/)?.[1];
      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    // 일반 URL (직접 임베드 가능한 경우)
    return url;
  };

  // 영상 소스 타입을 감지하는 함수
  const getVideoSourceType = (
    url: string
  ): "youtube" | "google-drive" | "other" => {
    if (!url) return "other";

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      return "youtube";
    }

    if (url.includes("drive.google.com")) {
      return "google-drive";
    }

    return "other";
  };

  const embedUrl = getEmbedUrl(videoUrl);
  const sourceType = getVideoSourceType(videoUrl);

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
        navigationComponent={<Stepper currentStep={3} />}
        isScrolled={isScrolled}
      />

      <main className="pt-[180px] flex flex-col flex-1 items-center justify-center">
        <div className="w-full max-w-6xl flex flex-col items-center">
          <div className="text-[48px] font-bold text-[#252016] font-NanumMyeongjo">
            브이로그 완성!
          </div>
          <div className="mt-1 mb-2 text-base text-[#958A7A] font-NanumMyeongjo">
            {characterName} 의 브이로그가 완성되었습니다
          </div>
        </div>

        <section className="flex flex-col items-center justify-center w-full">
          <div className="w-full flex justify-center">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title="생성된 영상"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className="w-[1120px] h-[630px] object-cover border border-gray-400"
                style={{
                  borderRadius: "24px",
                  boxShadow:
                    "4px 4px 0 rgba(100, 100, 100, 0.5), 4px 4px 0 rgba(100, 100, 100, 0.5)",
                }}
              />
            ) : (
              <div className="w-[1120px] h-[630px] flex items-center justify-center bg-gray-200 rounded-[24px] border border-gray-400">
                <p className="text-gray-500 text-lg">
                  영상을 불러올 수 없습니다.
                </p>
              </div>
            )}
          </div>

          {/* 영상 소스 정보 표시 */}
          {sourceType === "google-drive" && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                💡 구글 드라이브 영상이 보이지 않는다면, 파일 공유 설정을
                확인해주세요:
                <br />• 구글 드라이브에서 파일 우클릭 → "공유" → "링크가 있는
                모든 사용자"로 설정
              </p>
            </div>
          )}
        </section>

        <div className="text-left w-full mt-2 font-NanumMyeongjo">
          <div className="font-bold text-[28px] bg-transparent">
            {/* {title} */}
            데모 제목
          </div>
          <div className="font-bold text-[18px] bg-transparent">
            - {characterName} -
          </div>
        </div>

        <div className="fixed right-8 bottom-8 flex flex-col items-end gap-3 z-20">
          <CommonButton
            icon={<img src={Plus} alt="더 만들기" />}
            className="w-[207px] h-[64px]"
            onClick={() => navigate("/")}
          >
            <span className="text-[24px]">더 만들기</span>
          </CommonButton>
          <CommonButton
            icon={<img src={Home} alt="처음으로" />}
            className="w-[207px] h-[64px]"
            onClick={() => navigate("/")}
          >
            <span className="text-[24px]">처음으로</span>
          </CommonButton>
        </div>
      </main>
    </div>
  );
};

export default VideoCreatePage;
