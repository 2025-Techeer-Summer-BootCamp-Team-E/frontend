import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import Toggle from "../components/Toggle";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  // 현재 경로에 따라 activeTab 결정
  const getActiveTab = (): "books" | "vlog" => {
    if (location.pathname === "/main") return "books";
    if (location.pathname === "/myvid") return "vlog";
    return "books"; // 기본값
  };

  const [activeTab, setActiveTab] = useState<"books" | "vlog">(getActiveTab());

  // 경로가 변경될 때마다 activeTab 업데이트
  useEffect(() => {
    setActiveTab(getActiveTab());
  }, [location.pathname]);

  // 스크롤 효과
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle이 필요한 페이지인지 확인
  const shouldShowToggle =
    location.pathname === "/main" || location.pathname === "/myvid";

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8F3ED]">
      {shouldShowToggle ? (
        <Header
          showNavigation={true}
          navigationComponent={
            <Toggle selected={activeTab} onSelectionChange={setActiveTab} />
          }
          isScrolled={isScrolled}
        />
      ) : (
        <Header />
      )}
      <main className="flex flex-1 justify-center">{children}</main>
    </div>
  );
};

export default MainLayout;
