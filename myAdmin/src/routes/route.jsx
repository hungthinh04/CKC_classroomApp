import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";  // Dùng 'Routes' và 'Route' thay cho 'Switch'
import LoginPage from "../pages/Login";
import AdminPage from "../pages/AdminPage";
import App from "../App";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/" element={<App />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
