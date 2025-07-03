import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { green } from "react-native-reanimated/lib/typescript/Colors";

export default function TaoBaiVietScreen() {
  const { maLHP } = useLocalSearchParams();
  const [noiDung, setNoiDung] = useState("");
  const [hanNop, setHanNop] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [file, setFile] = useState<any>(null);

  const handleFilePick = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (result.type === "success") {
      setFile(result);
    }
  };

  const handleSubmit = async () => {
    if (!noiDung) {
      Alert.alert("Thiếu nội dung", "Hãy nhập nội dung thông báo");
      return;
    }

    const payload = {
      TieuDe: "Thông báo lớp học",
      NoiDung: noiDung,
      LoaiBV: 0,
      MaLHP: parseInt(maLHP as string),
      MaCD: 1,
      GioKetThuc: new Date().toISOString(),
      NgayKetThuc: hanNop.toISOString(),
    };

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://192.168.1.101:3000/baiviet/tao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("➡️ status", res.status);
      if (res.ok) {
        Alert.alert("✅ Thành công", "Bài viết đã được tạo", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("❌ Thất bại", result.message || "Đã xảy ra lỗi");
      }
    } catch (err) {
      console.error("Lỗi gửi bài:", err);
      Alert.alert("❌ Lỗi", "Không thể kết nối đến máy chủ");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Thông báo gì đó cho lớp</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={noiDung}
        onChangeText={setNoiDung}
        multiline
      />

      <Button title="📎 Chọn tệp đính kèm" onPress={handleFilePick} />
      {file && <Text style={{ marginTop: 8, color: "green" }}>📄 {file.name}</Text>}

      <View style={{ marginTop: 20 }}>
        <Button title="📤 Đăng bài" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  label: { fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
});
