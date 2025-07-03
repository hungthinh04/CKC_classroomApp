import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Button, Linking } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
export default function ChiTietBaiTapScreen() {
  const { id } = useLocalSearchParams();
  const [bv, setBv] = useState<any>(null);
const [tep, setTep] = useState<any>(null);
  useEffect(() => {
    fetch(`http://192.168.1.104:3000/baiviet/chitiet/${id}`)
      .then((res) => res.json())
      .then((data) => setBv(data))
      .catch(() => {});
  }, [id]);

  const chonTep = async () => {
  const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
  if (res.type === "success") setTep(res);
};

const uploadFile = async () => {
  const formData = new FormData();
  formData.append("file", {
    uri: tep.uri,
    name: tep.name,
    type: "*/*",
  } as any);
  formData.append("MaBaiViet", id);

  try {
    const res = await fetch("http://192.168.1.104:3000/file/upload", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });

    const result = await res.json();
    if (res.ok) alert("✅ Upload thành công!");
    else alert("❌ " + result.message);
  } catch (err) {
    alert("Lỗi khi gửi file");
  }
};

  if (!bv) return null;
console.log("📦 Dữ liệu bài tập:", bv);
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{bv.TieuDe}</Text>
      <Text style={styles.meta}>📌 Mã bài viết: {bv.MaBaiViet}</Text>
      <Text style={styles.meta}>
        🗓️ Ngày tạo: {bv.NgayTao?.slice(0, 10) || "Không rõ"}
      </Text>
      <Text style={styles.meta}>
        ⏰ Hạn nộp: {bv.NgayKetThuc?.slice(0, 10) || "Không rõ"}
      </Text>
      <Text style={styles.meta}>
        👨‍🏫 GV: {bv.HoGV} {bv.TenGV}
      </Text>
      <Text style={styles.content}>{bv.NoiDung}</Text>
      {bv.DuongDanFile && (
  <TouchableOpacity
    style={{ marginTop: 10 }}
    onPress={() => Linking.openURL(`http://192.168.1.104:3000${bv.DuongDanFile}`)}
  >
    <Text style={{ color: "blue" }}>📎 Mở file đính kèm</Text>
  </TouchableOpacity>
)}

      {bv.LoaiBV === 1 && (
  <View>
    <TouchableOpacity onPress={chonTep}>
      <Text style={{ color: "blue" }}>
        {tep ? `📎 ${tep.name}` : "📎 Chọn tệp bài tập"}
      </Text>
    </TouchableOpacity>

    <Button title="📤 Gửi file bài tập" onPress={uploadFile} />
  </View>
)}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#fff", flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  meta: { fontSize: 13, color: "#666", marginBottom: 4 },
  content: { fontSize: 15, marginTop: 12, lineHeight: 22, color: "#333" },
});
