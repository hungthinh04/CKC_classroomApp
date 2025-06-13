import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import  DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from "expo-router";

export default function TaoBaiVietScreen() {
  const { id: maLHP } = useLocalSearchParams();
  const { user } = useAuth();
const [showDatePicker, setShowDatePicker] = useState(false);
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [loaiBV, setLoaiBV] = useState(1); // 1: bài tập, 0: bài viết
  const [hanNop, setHanNop] = useState(new Date());

  const handleSubmit = async () => {
    if (!tieuDe || !noiDung) {
      Alert.alert("Thiếu thông tin", "Hãy nhập đầy đủ tiêu đề và nội dung");
      return;
    }

    const data: any = {
      maGV: user.id,
      maLHP,
      tieuDe,
      noiDung,
      loaiBV,
      ngayTao: new Date().toISOString(),
    };

    if (loaiBV === 1) data.hanNop = hanNop.toISOString();

    await fetch("http://192.168.1.102:3001/baiviet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    Alert.alert("✅ Thành công", "Đã tạo bài viết!");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput style={styles.input} value={tieuDe} onChangeText={setTieuDe} />

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={noiDung}
        onChangeText={setNoiDung}
        multiline
      />

      <Text style={styles.label}>Loại bài</Text>
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <Button title="📝 Bài viết" onPress={() => setLoaiBV(0)} />
        <View style={{ width: 10 }} />
        <Button title="📂 Bài tập" onPress={() => setLoaiBV(1)} />
      </View>

      <Button
  title={`📅 Hạn nộp: ${hanNop.toLocaleDateString()}`}
  onPress={() => setShowDatePicker(true)}
/>

{showDatePicker && (
  <DateTimePicker
    value={hanNop}
    mode="date"
    display="default"
    onChange={(event, selectedDate) => {
      if (selectedDate) setHanNop(selectedDate);
      setShowDatePicker(false); // 👈 đóng picker sau khi chọn
    }}
  />
)}


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
