import React from "react";
import TempComponent from "../components/TempComponent";
import CommonButton from "../components/CommonButton";
import ThumbnailFetch from "../components/ThumbnailFetch";

const MyLibrary: React.FC = () => {
  return (
    <div>
      <TempComponent />
      <CommonButton />
      <ThumbnailFetch />
    </div>
  );
};

export default MyLibrary;
