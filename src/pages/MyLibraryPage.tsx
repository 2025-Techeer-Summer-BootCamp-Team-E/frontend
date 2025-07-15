import React from "react";
import CommonButton from "../components/CommonButton";
import ThumbnailFetch from "../components/ThumbnailFetch";
import Toggle from "../components/Toggle";
import VideoInfoFetch from "../components/VideoInfoFetch";
import ActCharacterCard from "../components/ActCharacterCard";

const MyLibrary: React.FC = () => {
  return (
    <div>
      <Toggle />
      <CommonButton />
      <ThumbnailFetch />
      <VideoInfoFetch />
      <ActCharacterCard />
    </div>
  );
};

export default MyLibrary;
