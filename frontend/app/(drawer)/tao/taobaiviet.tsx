import { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function TaoBaiVietScreen() {
  const { maLHP } = useLocalSearchParams();
  const [noiDung, setNoiDung] = useState("");
  const [hanNop, setHanNop] = useState(new Date());
  const [tep, setTep] = useState<any>(null); // ✅ dùng biến này duy nhất

  const chonTep = async () => {
  const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
  if (!res.canceled && res.assets?.length > 0) {
    const asset = res.assets[0];
    const originalUri = asset.uri;
    const fileName = asset.name || `tep-${Date.now()}`;
    const newPath = FileSystem.documentDirectory + encodeURIComponent(fileName);

    try {
      await FileSystem.copyAsync({ from: originalUri, to: newPath });

      // console.log("✅ Đã copy xong file:", newPath);

      setTep({
        ...asset,
        uri: newPath,
        name: fileName,
      });
    } catch (err) {
      console.error("❌ Lỗi khi copy file:", err);
      Alert.alert("Lỗi", "Không thể xử lý tệp đính kèm");
    }
  }
};


  const handleSubmit = async () => {
    if (!noiDung) {
      Alert.alert("Thiếu nội dung", "Hãy nhập nội dung thông báo");
      return;
    }

    const formData = new FormData();
    formData.append("TieuDe", "Thông báo lớp học");
    formData.append("NoiDung", noiDung);
    formData.append("LoaiBV", "0");
    formData.append("MaLHP", maLHP?.toString());
    formData.append("MaCD", "1");
    formData.append("GioKetThuc", new Date().toISOString());
    formData.append("NgayKetThuc", hanNop.toISOString());

    if (tep) {
      formData.append("file", {
        uri: tep.uri,
        name: tep.name,
        type: tep.mimeType || "application/octet-stream",
      } as any);
    }

    try {
      const token = await AsyncStorage.getItem("token");
    
      const res = await fetch("http://192.168.1.104:3000/baiviet/tao", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ❌ Không set Content-Type
        "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await res.json();
      console.log("➡️ status", res.status);
      if (res.ok) {
        Alert.alert("✅ Thành công", "Bài viết đã được tạo", [
          { text: "OK", onPress: () => router.back() },
        ]);
        // Reset form
        setNoiDung("");
        setTep(null);
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

      <Button title="📎 Chọn tệp đính kèm" onPress={chonTep} />
      {tep && (
        <Text style={{ marginTop: 8, color: "green" }}>📄 {tep.name}</Text>
      )}

      <View style={{ marginTop: 20 }}>
        <Button
  title="📤 Đăng bài"
  onPress={handleSubmit}
  disabled={!noiDung || (tep && !tep.uri.startsWith("file://"))}
/>

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
