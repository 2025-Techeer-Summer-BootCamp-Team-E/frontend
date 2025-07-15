// src/Layouts/AuthLayout.tsx

import React, { useState, useEffect } from "react";
import LoginView from "../components/LoginView";
import SignupView from "../components/SignupView";
import { Link } from "react-router-dom";

// icons
import Logo from "../assets/icons/Logo.svg"; // Assuming you have a logo image in this path

const AuthLayout: React.FC = () => {
  const [view, setView] = useState<"login" | "signup">("login");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode");
    if (mode === "signup") {
      setView("signup");
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FBF9F4] p-8 font-['Noto_Sans_KR'] text-[#3D3D3D]">
      <Link to="/" className="mb-8 cursor-pointer text-center">
        <div className="flex items-center justify-center">
          <img
            src={Logo}
            alt="EPILOG Logo"
            className="mx-4 w-[2rem] text-[#3D3D3D]"
          />
          <span className="text-[2rem] font-bold font-crimson">EPILOG</span>
        </div>
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-black/5 bg-[#FBF9F4] p-10 shadow-xl">
        {view === "login" ? (
          <LoginView onSwitchToSignup={() => setView("signup")} />
        ) : (
          <SignupView onSwitchToLogin={() => setView("login")} />
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
