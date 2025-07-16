import React from "react";
import CommonButton from "../components/CommonButton";
import ThumbnailFetch from "../components/ThumbnailFetch";
import Toggle from "../components/Toggle";
import BooksSection from "../components/BooksSection";
import VideoInfoFetch from "../components/VideoInfoFetch";
import ActCharacterCard from "../components/ActCharacterCard";
import BackIcon from "../assets/Icons/BackIcon.svg";
import Stepper from "../components/Stepper";

const MyLibrary: React.FC = () => {
  return (
    <div>
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
