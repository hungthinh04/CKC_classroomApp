import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { Ionicons } from "@expo/vector-icons";

export default function MoiGiangVienScreen() {
  const { maLHP } = useLocalSearchParams();
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    if (!email) {
      Alert.alert("⚠️ Vui lòng nhập email giảng viên");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/lophocphan/${maLHP}/add-giangvien`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (res.ok) {
        Alert.alert("✅ Thành công", "Đã mời giảng viên", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("❌ Lỗi", result.message || "Không thể mời giảng viên");
      }
    } catch (err) {
      console.error("❌ Lỗi:", err);
      Alert.alert("Lỗi", "Không kết nối được đến máy chủ");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>📧 Nhập email giảng viên:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="giangvien@example.com"
        autoCapitalize="none"
        keyboardType="email-address"
      />

      {/* Nút mời giảng viên */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: email ? "#6EC1E4" : "#D1EAF9" }, // Màu xanh nước
        ]}
        onPress={handleInvite}
        disabled={!email}
      >
        <Ionicons name="mail" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}> Mời Giảng viên</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F8FF", // Màu nền xanh nước
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2C3E50",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#A1C6EA", // Màu viền nhạt xanh nước
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#34495E",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
