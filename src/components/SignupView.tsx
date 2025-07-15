// src/components/SignupView.tsx

import React from "react";
import { useNavigate } from "react-router-dom";

interface SignupViewProps {
  onSwitchToLogin: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate(); // useNavigate 훅 선언

  const handleSignup = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert("회원가입 성공! 메인 페이지로 이동합니다.");
    // 변경점: window.location.href 대신 navigate 함수 사용
    navigate("/");
  };

  return (
    <div className="auth-view active">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl font-bold">
          이야기의 끝을 기록해 보세요
        </h2>
        <p className="mt-2 text-gray-500">
          EPILOG와 함께라면 당신도 작가가 될 수 있어요.
        </p>
      </div>
      <form onSubmit={handleSignup}>
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
          <input
            type="text"
            placeholder="닉네임"
            className="w-full rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            required
          />
          <textarea
            placeholder="자신을 나타내는 한 줄 소개를 적어보세요."
            className="h-24 w-full resize-none rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            maxLength={100}
          ></textarea>
        </div>
        <button
          type="submit"
          className="mt-8 w-full rounded-xl bg-[#C0842B] py-3 font-semibold text-white transition hover:opacity-90"
        >
          회원가입
        </button>
        <p className="mt-6 text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-semibold text-[#C0842B] hover:underline"
          >
            로그인
          </button>
        </p>
      </form>
    </div>
  );
};

export default SignupView;
