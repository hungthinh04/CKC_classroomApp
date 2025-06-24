import { router } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native";
import { useAuth } from "../../stores/useAuth";
import { API_BASE_URL } from "@/constants/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      const users = await res.json();

      const user = users.find(
        (u: any) => u.email === email && u.matKhau === matKhau
      );

      if (user) {
        await login(user);
        router.replace("/(drawer)/(tabs)/homeScreen");
      } else {
        Alert.alert("Sai tài khoản hoặc mật khẩu");
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
