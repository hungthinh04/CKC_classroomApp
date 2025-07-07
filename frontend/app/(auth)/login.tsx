import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../stores/useAuth";
import { BASE_URL } from "@/constants/Link";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [matKhau, setMatKhau] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, matKhau }),
      });

      const data = await res.json();

      if (res.ok) {
        await login(data);
        router.replace("/(drawer)/(tabs)/homeScreen");
      } else {
        Alert.alert(data.message || "Sai tài khoản hoặc mật khẩu");
      }
    } catch (err) {
      Alert.alert("Lỗi kết nối");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginBox}>
        <Text style={styles.title}>Đăng nhập</Text>

        <Text style={styles.label}>Email</Text>
        <TextInput
          placeholder="Nhập email của bạn"
          placeholderTextColor="#b2b8cd"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <Text style={styles.label}>Mật khẩu</Text>
        <View style={styles.passwordRow}>
          <TextInput
            placeholder="Nhập mật khẩu"
            placeholderTextColor="#b2b8cd"
            secureTextEntry={!showPass}
            value={matKhau}
            onChangeText={setMatKhau}
            style={[styles.input, { flex: 1 }]}
          />
          <Pressable onPress={() => setShowPass(!showPass)} style={{ marginLeft: 8 }}>
            <Ionicons
              name={showPass ? "eye" : "eye-off"}
              size={23}
              color="#7a81a1"
            />
          </Pressable>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6e81f3",
    justifyContent: "center",
    alignItems: "center",
  },
  loginBox: {
    width: "93%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    shadowColor: "#5a60d1",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 14,
    elevation: 10,
  },
  title: {
    fontSize: 25,
    color: "#273365",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 22,
    letterSpacing: 0.5,
  },
  label: {
    fontSize: 14,
    color: "#565b7b",
    marginBottom: 7,
    marginTop: 9,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1.2,
    borderColor: "#b5b8e2",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 11,
    marginBottom: 7,
    fontSize: 15,
    color: "#2e365a",
    backgroundColor: "#f5f7fe",
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#4666ec",
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: "center",
    marginTop: 18,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 7,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.4,
  },
});
