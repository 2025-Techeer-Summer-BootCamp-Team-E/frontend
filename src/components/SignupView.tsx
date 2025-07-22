// src/components/SignupView.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface SignupViewProps {
  onSwitchToLogin: () => void;
}

const SignupView: React.FC<SignupViewProps> = ({ onSwitchToLogin }) => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    login_id: "",
    password: "",
    password_confirm: "",
    nickname: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 폼 입력 처리
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 회원가입 처리
  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signup(formData);
      alert("회원가입 성공! 메인 페이지로 이동합니다.");
      navigate("/");
    } catch (error: unknown) {
      console.error("Signup error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message || "회원가입에 실패했습니다."
        );
      } else {
        setError("회원가입에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
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

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup}>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            name="login_id"
            placeholder="로그인 ID"
            value={formData.login_id}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password_confirm"
            placeholder="비밀번호 확인"
            value={formData.password_confirm}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            required
            disabled={isLoading}
          />
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={formData.nickname}
            onChange={handleChange}
            className="w-full rounded-xl border border-[#E6DBCB] bg-white p-3 transition focus:border-[#C0842B] focus:outline-none focus:ring-2 focus:ring-[#C0842B]/30"
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full rounded-xl bg-[#C0842B] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "회원가입 중..." : "회원가입"}
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
