import React from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/Icons/Logo.svg";
import Login from "../assets/Icons/Login.svg";

type HeaderProps = {
  showNavigation?: boolean;
  navigationComponent?: React.ReactNode;
  isFixed?: boolean;
};

const Header: React.FC<HeaderProps> = ({
  showNavigation = false,
  navigationComponent,
  isFixed = false,
}) => {
  const headerClasses = `text-black bg-[#F8F3ED] ${isFixed ? "fixed top-0 left-0 right-0 z-50" : ""}`;

  return (
    <header className={headerClasses}>
      <div className="flex items-center justify-between mt-[44px] mx-[20px] md:mx-[52px] py-4">
        {/* Logo */}
        <div className="flex items-center text-lg font-bold gap-[16px]">
          <Link to="/" className="flex items-center gap-[16px]">
            <img src={Logo} className="w-[32px] h-[32px]" />
            <span className="text-[32px]">EPI-LOG</span>
          </Link>
        </div>

        {/* Optional Navigation - Center */}
        {showNavigation && navigationComponent && (
          <nav className="flex gap-[16px] absolute left-1/2 transform -translate-x-1/2">
            {navigationComponent}
          </nav>
        )}

        {/* Login */}
        <nav className="flex items-center gap-[16px]">
          <Link to="/auth" className="flex items-center gap-[16px]">
            <img src={Login} className="w-[24px] h-[24px]" />
            <span className="text-[20px]">로그인</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
