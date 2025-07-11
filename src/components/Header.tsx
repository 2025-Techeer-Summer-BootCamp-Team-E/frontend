import React from "react";
import Logo from "../assets/Icons/Logo.svg";
import Login from "../assets/Icons/Login.svg";

const Header: React.FC = () => {
  return (
    <header className="text-black bg-[#F8F3ED]">
      <div className="flex items-center justify-between mt-[44px] mx-[52px] py-4">
        <div className="flex items-center text-lg font-bold gap-[16px]">
          <a href="#home" className="flex items-center gap-[16px]">
          <img src={Logo} className="w-[32px] h-[32px]"/>
          <span className="text-[32px]">EPI-LOG</span>
          </a>
        </div>
        <nav className="flex items-center gap-[16px]">
            <a href="#home" className="flex items-center gap-[16px]">
            <img src={Login} className="w-[24px] h-[24px]" />
            <span className="text-[20px]">로그인</span>
            </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
