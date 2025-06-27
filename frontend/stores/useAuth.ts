import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  id: number;
  email: string;
  matKhau: string;
  quyen: number; // 0: GV, 1: SV
  maNguoiDung: string; // 0: GV, 1: SV
  trangThai: number; // 0: GV, 1: SV
  ngayTao?: string;
};


type excerciseList = {
  id: number;
  tieuDe: string;
  noiDung: string;
  ngayTao: string;
  ngayKetThuc?: string;
  trangThai: number; // 0: Chưa nộp, 1: Đã nộp
};

type AuthStore = {
  
  isLoggedIn: boolean;
  user: User | null;
  login: (userData: User) => Promise<void>;
  logout: () => Promise<void>;
  checkLogin: () => Promise<void>;
};

export const useAuth = create<AuthStore>((set) => ({
  isLoggedIn: false,
  user: null,

  login: async (userData) => {
    // Ghi nhận rõ ràng token + user từ backend
    const token = userData.token;
    const user = userData.user;

    if (!token || !user) {
      console.warn("Thiếu token hoặc user khi đăng nhập");
      return;
    }

    await AsyncStorage.setItem("loggedIn", "true");
    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("user", JSON.stringify(user));

    set({ isLoggedIn: true, user });
  },

  logout: async () => {
    await AsyncStorage.removeItem("loggedIn");
    await AsyncStorage.removeItem("user");
    set({ isLoggedIn: false, user: null });
  },

  checkLogin: async () => {
    const value = await AsyncStorage.getItem("loggedIn");
    const userStr = await AsyncStorage.getItem("user");
    const userData = userStr ? JSON.parse(userStr) : null;
    set({ isLoggedIn: value === "true", user: userData });
  },
}));
