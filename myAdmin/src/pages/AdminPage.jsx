import React from "react";
import { Navigate } from "react-router-dom";  // Thay 'Redirect' bằng 'Navigate'

const AdminPage = () => {
  const token = localStorage.getItem("token");

  // Kiểm tra token và quyền admin
  if (!token) {
    return <Navigate to="/login" />; // Nếu không có token, chuyển hướng về trang login
  }

  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.Quyen !== 2) {
    return <Navigate to="/login" />; // Nếu không phải admin, chuyển hướng về login
  }

  return (
    <div>
      <h2>Chào mừng Admin</h2>
      <p>Chúc mừng, bạn đã đăng nhập với quyền Admin.</p>
      {/* Các tính năng quản lý tại đây */}
    </div>
  );
};

export default AdminPage;
