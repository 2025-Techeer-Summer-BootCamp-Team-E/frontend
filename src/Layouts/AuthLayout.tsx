import React from "react";
import Header from "../components/Header";

type AuthLayoutProps = {
  children: React.ReactNode;
};

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-[#F8F3ED] border border-black">
      <Header />
      <main className="flex flex-1 justify-center">{children}</main>
    </div>
  );
};

export default AuthLayout;
