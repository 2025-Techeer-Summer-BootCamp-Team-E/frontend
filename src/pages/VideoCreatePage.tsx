import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import CommonButton from "../components/CommonButton"; // 뒤로가기
import Home from "../assets/Icons/Home.svg";
import Plus from "../assets/Icons/Plus.svg";
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
            <iframe
              src={videoUrl}
              title="생성된 영상"
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-[1120px] h-[630px] object-cover border border-gray-400"
              style={{
                borderRadius: "24px",
                boxShadow:
                  "4px 4px 0 rgba(100, 100, 100, 0.5), 4px 4px 0 rgba(100, 100, 100, 0.5)",
              }}
            />
          </div>
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
