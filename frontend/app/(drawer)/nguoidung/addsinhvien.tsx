import { useState } from "react";
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { Ionicons } from "@expo/vector-icons";

export default function MoiSinhVienScreen() {
  const { maLHP } = useLocalSearchParams();
  const [email, setEmail] = useState("");

  const handleInvite = async () => {
    if (!email) {
      Alert.alert("⚠️ Vui lòng nhập email sinh viên");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/lophocphan/${maLHP}/add-sinhvien`, {
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
    <View style={{ flex: 1, backgroundColor: "#f4f7fc" }}>
      {/* Nút quay lại trên đầu */}
      <View style={{ paddingHorizontal: 24, paddingTop: 38, backgroundColor: "#f4f7fc" }}>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 16,
            gap: 7,
            alignSelf: "flex-start",
          }}
          onPress={() => router.replace(`/(drawer)/lopHocPhan/${maLHP}/(tabs)/peopleScreen`)}
        >
          <Ionicons name="arrow-back" size={22} color="#4666ec" />
          <Text style={{ color: "#4666ec", fontWeight: "bold", fontSize: 16 }}>
            Quay lại bảng tin
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form ở giữa */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>📧 Nhập email sinh viên:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="sinhvien@example.com"
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: email ? "#6EC1E4" : "#D1EAF9" },
          ]}
          onPress={handleInvite}
          disabled={!email}
        >
          <Ionicons name="mail" size={18} color="#fff" style={styles.icon} />
          <Text style={styles.buttonText}> Mời sinh viên</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    marginTop: -70, // đẩy lên gần giữa hơn nếu muốn
  },
  label: {
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
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
    marginRight: 8,
  },
  buttonText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
  },
});
