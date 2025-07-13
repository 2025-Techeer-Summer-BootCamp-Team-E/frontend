import React from "react";
import TempComponent from "../components/TempComponent";
import CommonButton from "../components/CommonButton";
import Toggle from "../components/Toggle";

const MyLibrary: React.FC = () => {
  return (
    <div>
      <Toggle />
      <TempComponent />
      <CommonButton />
    </div>
  );
};

export default MyLibrary;
