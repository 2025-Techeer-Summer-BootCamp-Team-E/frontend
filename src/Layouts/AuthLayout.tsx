// src/Layouts/AuthLayout.tsx

import React, { useState, useEffect } from "react";
import LoginView from "../components/LoginView";
import SignupView from "../components/SignupView";

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
      {/* 로고 */}
      <div
        className="mb-8 cursor-pointer text-center"
        onClick={() => (window.location.href = "/")}
      >
        {/* 로고와 텍스트를 가로로 정렬하기 위해 flex 사용 */}
        <div className="flex flex-col items-center justify-center">
          <svg
            className="mx-auto h-12 w-12 text-[#C0842B]"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9 4V20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 10L17 12L13 14V10Z"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-2 text-3xl font-bold font-['Lora']">EPILOG</span>
        </div>
      </div>

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
