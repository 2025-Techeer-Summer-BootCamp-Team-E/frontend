// import { useState } from "react";
import "./App.css";
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainLayout from "./Layouts/MainLayout";
import MyLibrary from "./pages/MyLibraryPage";
import MyVideos from "./pages/MyVideosPage"; // Assuming you have a MyVideos component
import AuthLayout from "./Layouts/AuthLayout";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainLayout>
              <MyLibrary />
            </MainLayout>
          }
        />
        <Route
          path="/temp"
          element={
            <MainLayout>
              <MyVideos />
            </MainLayout>
          }
        />
        <Route path="/auth" element={<AuthLayout />} />
      </Routes>
    </Router>
  );
};

export default App;
