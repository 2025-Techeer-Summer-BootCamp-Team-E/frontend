import React, { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axios from "axios";
import { ENDPOINTS } from "../api/endpoints";

// 사용자 정보 타입
interface User {
  id: number;
  login_id: string;
  nickname: string;
  created_at: string;
  updated_at: string;
}

// 로그인 요청 타입
interface LoginRequest {
  login_id: string;
  password: string;
}

// 회원가입 요청 타입
interface SignupRequest {
  login_id: string;
  password: string;
  password_confirm: string;
  nickname?: string;
}

// API 응답 타입
interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

// Auth Context 타입
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  signup: (data: SignupRequest) => Promise<void>;
  logout: () => void;
}

// Context 생성
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// Provider Props 타입
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider 컴포넌트
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 localStorage에서 토큰 복원
  useEffect(() => {
    const savedToken = localStorage.getItem("auth_token");
    const savedUser = localStorage.getItem("auth_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${savedToken}`;
    } else {
      // 토큰이 없으면 Authorization 헤더 제거
      delete axios.defaults.headers.common["Authorization"];
    }
    setIsLoading(false);
  }, []);

  // 토큰 저장 함수(by React 상태 업데이트)
  const saveAuth = (token: string, user: User) => {
    setToken(token); // 로그인 시 토큰 저장
    setUser(user); // 로그인 시 사용자 정보 저장
    localStorage.setItem("auth_token", token); // 로컬 스토리지에 토큰 저장
    localStorage.setItem("auth_user", JSON.stringify(user)); // 로컬 스토리지에 사용자 정보 저장
    // axios 기본 헤더에 토큰 설정 => 모든 API 요청에 자동으로 토큰 포함
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  // 토큰 제거 함수 (로그아웃 시 실행)
  const clearAuth = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("auth_token"); // 로컬 스토리지에서 제거
    localStorage.removeItem("auth_user");
    // axios 헤더에서 토큰 제거
    delete axios.defaults.headers.common["Authorization"];
  };

  // 로그인 함수
  const login = async (data: LoginRequest): Promise<void> => {
    try {
      // 로그인 요청 시에는 Authorization 헤더 없이 요청
      const response = await axios.post<AuthResponse>(
        ENDPOINTS.auth.login,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { access_token, user } = response.data;
      saveAuth(access_token, user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // 회원가입 함수
  const signup = async (data: SignupRequest): Promise<void> => {
    try {
      // 회원가입 요청 시에도 Authorization 헤더 없이 요청
      const response = await axios.post<AuthResponse>(
        ENDPOINTS.auth.signup,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const { access_token, user } = response.data;
      saveAuth(access_token, user);
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      // 서버에 로그아웃 요청 (선택사항)
      if (token) {
        await axios.post(ENDPOINTS.auth.logout);
      }
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      // 로컬 토큰은 항상 제거 (에러가 발생해도)
      clearAuth();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    isLoading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
