// src/pages/Login.js
import React, { useState } from "react";
import { useNotify, useRedirect } from "react-admin";
import authProvider from "../authProvider";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [matkhau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const notify = useNotify();
  const redirect = useRedirect();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Gọi login từ authProvider
      await authProvider.login({ username: email, password: matkhau });
      redirect("/admin/khoa"); // Sau khi login thành công, chuyển hướng đến trang admin
    } catch (err) {
      setError("Sai email hoặc mật khẩu");
      notify("Sai email hoặc mật khẩu", "error");
    }
  };

  return (
    <div>
      <h2>Đăng nhập Admin</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={matkhau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
};

export default LoginPage;
