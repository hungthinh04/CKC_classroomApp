import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useAuth } from "../../../stores/useAuth"; // Dùng để truy cập thông tin người dùng
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router"; // Dùng để điều hướng
import AsyncStorage from "@react-native-async-storage/async-storage"; // Dùng để lưu trữ thông tin đăng nhập
import { BASE_URL } from "@/constants/Link";

export default function ProfileScreen() {
  const { user, logout, checkLogin } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    email: user?.email || "",
    hoTen: user?.hoTen || "",
    role: user?.quyen || "",
    matKhau: user?.matKhau || "",
  });

  // Hàm để chuyển sang chế độ chỉnh sửa
  const handleEditToggle = () => {
    setEditing(!editing);
  };

  // Hàm để lưu thông tin đã chỉnh sửa
  const handleSave = async () => {
    try {
      // Gọi API để lưu thay đổi (giả sử có hàm `updateUserProfile` trong `useAuth`)
      console.log("Thông tin đã được cập nhật:", profileData);
      
      // Gọi API để lưu thay đổi (giả sử có hàm `updateUserProfile` trong `useAuth`)
      // await updateUserProfile(profileData);
      
      setEditing(false);
    } catch (error) {
      console.error("Lỗi khi lưu thông tin:", error);
    }
  };

  // Hàm đăng xuất
  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login"); // Điều hướng đến màn hình đăng nhập
  };

  // Cập nhật profileData khi user thay đổi
  useEffect(() => {
    if (user) {
      // Lấy thông tin profile từ API (giả sử bạn đã gọi API để lấy thông tin đầy đủ)
      const fetchProfile = async () => {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/profile`, {
            
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        
        });
        

        const data = await res.json();
        console.log(data, "data");
        setProfileData({
          email: data.email || "",
          hoTen: data.hoTen || "",
          role: data.vaiTro || "",
          matKhau: data.matKhau || "",
        });
      };
      fetchProfile();
    }
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons
          name="arrow-back"
          size={24}
          color="white"
          onPress={() => router.back()} // Quay lại trang trước
        />
        <Text style={styles.title}>Thông Tin Tài Khoản</Text>
      </View>

      <View style={styles.profileContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={profileData.email}
          onChangeText={(text) => setProfileData({ ...profileData, email: text })}
          editable={false}
        />

        <Text style={styles.label}>Họ tên:</Text>
        <TextInput
          style={styles.input}
          value={profileData.hoTen?.toString() ?? ""}
          onChangeText={(text) => setProfileData({ ...profileData, hoTen: text })}
          editable={false}
        />

        {/* <Text style={styles.label}>Vai trò:</Text>
        <TextInput
          style={styles.input}
          value={profileData.role?.toString() ?? ""}
          editable={false}
        />

        <Text style={styles.label}>Mật khẩu:</Text>
        <TextInput
          style={styles.input}
          value={profileData.matKhau}
          onChangeText={(text) => setProfileData({ ...profileData, matKhau: text })}
          editable={editing}
        /> */}

        
      </View>

      <View style={styles.buttonsContainer}>
        {editing ? (
          <Button title="Lưu Thay Đổi" onPress={handleSave} />
        ) : (
          <Button title="Chỉnh Sửa" onPress={handleEditToggle} />
        )}
        <Button title="Đăng Xuất" color="red" onPress={handleLogout} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f0f0f0",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#3b60f3",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  profileContainer: {
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
