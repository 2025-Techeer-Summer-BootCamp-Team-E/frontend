import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Logo from "../assets/icons/Logo.svg";
import Login from "../assets/icons/Login.svg";

type HeaderProps = {
  showNavigation?: boolean;
  navigationComponent?: React.ReactNode; // Toggle, Stepper, 또는 다른 네비게이션 컴포넌트
  isScrolled?: boolean; // 스크롤 상태
};

const Header: React.FC<HeaderProps> = ({
  showNavigation = false,
  navigationComponent,
  isScrolled = false,
}) => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header
      className="h-[10rem] text-black fixed top-0 left-0 right-0 z-10 transition-all duration-300"
      style={{
        backgroundColor: isScrolled
          ? "rgba(248, 243, 237, 0.8)"
          : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled
          ? "1px solid rgba(255, 255, 255, 0.2)"
          : "none",
        contain: "layout",
      }}
    >
      <div className="h-[88px] flex justify-between mt-[44px] mx-[20px] md:mx-[52px]">
        {/* Logo */}
        <div className="self-start flex items-center text-lg font-bold gap-[1rem]">
          <Link to="/" className="flex items-center gap-[1rem]">
            <img src={Logo} className="w-[2rem] h-[2rem]" />
            <span className="text-[2rem] text-[#3D3D3D] font-crimson">
              EPI-LOG
            </span>
          </Link>
        </div>

        {/* Flexible Navigation - 페이지별로 다른 컴포넌트 가능 */}
        <nav
          className="self-end absolute left-1/2 transform -translate-x-1/2"
          style={{ contain: "layout" }}
        >
          {/* 항상 공간을 확보하되 조건부로 표시 */}
          <div
            className={`transition-opacity duration-300 ${
              showNavigation && navigationComponent
                ? "opacity-100"
                : "opacity-0 pointer-events-none"
            }`}
          >
            {navigationComponent || <div className="h-[44px] w-[200px]"></div>}
          </div>
        </nav>

        <nav
          className="self-start flex items-center gap-[16px] min-w-[200px] justify-end"
          style={{ contain: "layout" }}
        >
          {isAuthenticated ? (
            <div className="flex items-center gap-[16px]">
              <span className="text-[16px] text-gray-600 whitespace-nowrap">
                안녕하세요, {user?.nickname || "사용자"}님
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-[8px] text-[20px] font-bold hover:text-[#C0842B] transition-colors whitespace-nowrap"
              >
                <img src={Login} className="w-[24px] h-[24px]" />
                <span>로그아웃</span>
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-[16px] whitespace-nowrap"
            >
              <img src={Login} className="w-[24px] h-[24px]" />
              <span className="text-[20px] font-bold">로그인</span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
