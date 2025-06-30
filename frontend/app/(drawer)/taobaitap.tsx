import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaoBaiTapScreen() {
  const { maLHP } = useLocalSearchParams();
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [hanNop, setHanNop] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmit = async () => {
    if (!tieuDe || !noiDung) {
      Alert.alert(
        "⚠️ Thiếu thông tin",
        "Vui lòng nhập đầy đủ tiêu đề và nội dung"
      );
      return;
    }

    const payload = {
      TieuDe: "Thông báo lớp học",
      NoiDung: noiDung,
      LoaiBV: 1,
      MaLHP: parseInt(maLHP as string),
      MaCD: 1,
      GioKetThuc: new Date().toISOString(),
      NgayKetThuc: hanNop.toISOString(),
    };

    console.log("📦 Payload gửi đi:", payload);

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://192.168.1.104:3000/baiviet/tao", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      console.log("📦 Kết quả:", result);

      if (res.ok) {
        Alert.alert("✅ Thành công", "Bài tập đã được tạo", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("❌ Thất bại", result.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi bài tập:", err);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tiêu đề bài tập</Text>
      <TextInput
        style={styles.input}
        value={tieuDe}
        onChangeText={setTieuDe}
        placeholder="Nhập tiêu đề..."
      />

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={noiDung}
        onChangeText={setNoiDung}
        multiline
        placeholder="Mô tả bài tập..."
      />

      <Text style={styles.label}>Hạn nộp</Text>
      <Button
        title={hanNop.toLocaleString("vi-VN")}
        onPress={() => setShowDatePicker(true)}
      />
      {showDatePicker && (
        <DateTimePicker
          value={hanNop}
          mode="datetime"
          onChange={(_, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setHanNop(selectedDate);
          }}
        />
      )}

      <View style={{ marginTop: 20 }}>
        <Button title="📤 Tạo bài tập" onPress={handleSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  label: { fontWeight: "bold", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
});
