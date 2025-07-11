import React from "react";

const Header: React.FC = () => {
  return (
    <header className="text-white shadow-md">
      <div className="w-full h-[40px] bg-blue-600 container mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-lg font-bold">Techeer</div>
        <nav className="flex space-x-4">
          <a href="#home" className="hover:text-gray-200">
            Home
          </a>
          <a href="#about" className="hover:text-gray-200">
            About
          </a>
          <a href="#contact" className="hover:text-gray-200">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
