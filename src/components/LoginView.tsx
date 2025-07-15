// src/components/LoginView.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

interface LoginViewProps {
  onSwitchToSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("로그인 성공! 메인 페이지로 이동합니다.");
    // window.location.href 대신 navigate 함수 사용
    navigate("/");
  };

  return (
    <div className="auth-view active">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl font-bold">다시 오신 걸 환영해요</h2>
        <p className="mt-2 text-gray-500">
          당신의 이야기를 계속 이어가 보세요.
        </p>
      </div>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="이메일"
            className="w-full rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            className="w-full rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-[#C0842B] py-3 font-semibold text-white transition hover:opacity-90"
        >
          로그인
        </button>
        <p className="mt-6 text-center text-sm">
          계정이 없으신가요?{" "}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="font-semibold text-[#C0842B] hover:underline"
          >
            회원가입
          </button>
        </p>
      </form>
    </div>
  );
};

export default LoginView;
