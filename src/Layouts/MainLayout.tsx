import React from "react";
import Header from "../components/Header";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8F3ED] border border-black">
      <Header />
      <main className="flex flex-1 justify-center">{children}</main>
    </div>
  );
};

export default MainLayout;
