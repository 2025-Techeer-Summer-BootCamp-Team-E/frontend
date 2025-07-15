import React from "react";
import CommonButton from "../components/CommonButton";
import ThumbnailFetch from "../components/ThumbnailFetch";
import Toggle from "../components/Toggle";
import VideoInfoFetch from "../components/VideoInfoFetch";
import BackIcon from "../assets/Icons/BackIcon.svg";

const MyLibrary: React.FC = () => {
  return (
    <div>
      <Toggle />
      <CommonButton icon={<img src={BackIcon} />}>
        대본으로 돌아가기
      </CommonButton>
      <ThumbnailFetch />
      <VideoInfoFetch />
    </div>
  );
};

export default MyLibrary;
