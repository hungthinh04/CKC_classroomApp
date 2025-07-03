import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useAuth } from "../../stores/useAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch("http://192.168.1.101:3000/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, matKhau }),
      });

      const data = await res.json();

      if (res.ok) {
        await login(data); // lưu thông tin giảng viên, token nếu cần
        router.replace("/(drawer)/(tabs)/homeScreen");
      } else {
        Alert.alert(data.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      Alert.alert("Lỗi kết nối");
    }
  };

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "#fff",
        flex: 1,
        justifyContent: "center",
      }}
    >
      <Text>Email:</Text>
      <TextInput onChangeText={setEmail} style={{ borderWidth: 1 }} />
      <Text>Mật khẩu:</Text>
      <TextInput
        onChangeText={setMatKhau}
        secureTextEntry
        style={{ borderWidth: 1 }}
      />
      <Button title="Đăng nhập" onPress={handleLogin} />
    </View>
  );
}
