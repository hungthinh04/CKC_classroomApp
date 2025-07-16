// src/providers/authProvider.js
import axios from "axios";

const authProvider = {
  login: async ({ username, password }) => {
    try {
      // Gửi yêu cầu login đến API backend
      const response = await axios.post("https://ckc-classroomappp.onrender.com/api/login", {
        email: username,
        matkhau: password,
      });

      const { token } = response.data;
      // Lưu token vào localStorage hoặc sessionStorage
      localStorage.setItem("token", token);

      // Nếu thành công, return nothing (hoặc redirect)
      return Promise.resolve();
    } catch (error) {
      return Promise.reject("Sai email hoặc mật khẩu");
    }
  },

  logout: () => {
    // Xóa token khi đăng xuất
    localStorage.removeItem("token");
    return Promise.resolve();
  },

  checkAuth: () => {
    // Kiểm tra xem token có tồn tại trong localStorage không
    return localStorage.getItem("token") ? Promise.resolve() : Promise.reject();
  },

  checkError: (error) => {
    // Kiểm tra lỗi từ API
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      return Promise.reject();
    }
    return Promise.resolve();
  },

  getPermissions: () => {
    // Lấy thông tin quyền của người dùng từ token
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = JSON.parse(atob(token.split(".")[1])); // Giải mã JWT token
      return Promise.resolve(decoded.role);
    }
    return Promise.reject();
  },
};

export default authProvider;
