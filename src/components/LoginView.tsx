// src/components/LoginView.tsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface LoginViewProps {
  onSwitchToSignup: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ onSwitchToSignup }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    login_id: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 폼 입력 처리
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 로그인 처리
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await login(formData);
      alert("로그인 성공! 메인 페이지로 이동합니다.");
      navigate("/");
    } catch (error: unknown) {
      console.error("Login error:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { data?: { message?: string } };
        };
        setError(
          axiosError.response?.data?.message || "로그인에 실패했습니다."
        );
      } else {
        setError("로그인에 실패했습니다.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-view active">
      <div className="mb-8 text-center">
        <h2 className="font-serif text-2xl font-bold">다시 오신 걸 환영해요</h2>
        <p className="mt-2 text-gray-500">
          당신의 이야기를 계속 이어가 보세요.
        </p>
      </div>

      {/* 에러 메시지 표시 */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
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
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-8 w-full rounded-xl bg-[#C0842B] py-3 font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "로그인 중..." : "로그인"}
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
