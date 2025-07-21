// import { useState } from "react";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.tsx";
import TempPage from "./pages/TempPage.tsx";
import MyVideos from "./pages/MyVideosPage"; // Assuming you have a MyVideos component
import AuthLayout from "./layouts/AuthLayout.tsx";
import CharacterSelectPage from "./pages/CharacterSelectPage.tsx";
import VideoCreatePage from "./pages/VideoCreatePage.tsx";
import MyLibraryPage from "./pages/MyLibraryPage.tsx";
import ScriptPage from "./pages/ScriptPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/temp"
          element={
            <MainLayout>
              <TempPage />
            </MainLayout>
          }
        />

        <Route
          path="/myvid"
          element={
            <MainLayout>
              <MyVideos />
            </MainLayout>
          }
        />

        <Route
          path="/char"
          element={
            <MainLayout>
              <CharacterSelectPage />
            </MainLayout>
          }
        />

        <Route
          path="/"
          element={
            <MainLayout>
              <MyLibraryPage />
            </MainLayout>
          }
        />

        <Route
          path="/create"
          element={
            <MainLayout>
              <VideoCreatePage />
            </MainLayout>
          }
        />

        <Route
          path="/script"
          element={
            <MainLayout>
              <ScriptPage />
            </MainLayout>
          }
        />
        <Route path="/auth" element={<AuthLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
