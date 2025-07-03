import { useState } from "react";
import { View, Text, TextInput, Button, Alert, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
      const res = await fetch(`http://192.168.1.101:3000/lophocphan/${maLHP}/add-sinhvien`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email }),
      });

      const result = await res.json();
      if (res.ok) {
        Alert.alert("✅ Thành công", "Đã mời sinh viên", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("❌ Lỗi", result.message || "Không thể mời sinh viên");
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
      <Button title="📨 Mời" onPress={handleInvite} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  label: { fontWeight: "bold", marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 16,
  },
});
