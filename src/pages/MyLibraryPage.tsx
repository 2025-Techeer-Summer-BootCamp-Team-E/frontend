import React from "react";
import TempComponent from "../components/TempComponent";
import CommonButton from "../components/CommonButton";
import Toggle from "../components/Toggle";
import BooksSection from "../components/BooksSection";

const MyLibrary: React.FC = () => {
  return (
    <div>
      <BooksSection />
      <Toggle />
      <TempComponent />
      <CommonButton />
    </div>
  );
};

export default MyLibrary;
