import React from "react";
import CommonButton from "../components/CommonButton";
import ThumbnailFetch from "../components/ThumbnailFetch";
import Toggle from "../components/Toggle";
import BooksSection from "../components/BooksSection";
import VideoInfoFetch from "../components/VideoInfoFetch";
import ActCharacterCard from "../components/ActCharacterCard";
import BackIcon from "../assets/Icons/BackIcon.svg";
import Stepper from "../components/Stepper";
import Script from "../components/Script";

const MyLibrary: React.FC = () => {
  return (
    <div>
      <div className="p-8">
      <Script sceneTitle="Scene #1">
        {`
        (나직하지만 힘 있는 목소리로) 
        …내관이 고하더군. 이 하전, 그 아이에게 사약을 내렸다고. 어명이라 했지. 
        허나, 나는 안다. 그 어명이 누구의 입에서 나왔는지를.`}
      </Script>
    </div>
      <Stepper currentStep={3} />
      <BooksSection />
      <Toggle />
      <CommonButton icon={<img src={BackIcon} />}>
        대본으로 돌아가기
      </CommonButton>
      <ThumbnailFetch />
      <ActCharacterCard />
      <VideoInfoFetch />
    </div>
  );
};

export default MyLibrary;
