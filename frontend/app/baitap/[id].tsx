import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Button,
  Linking,
  Alert,
  TextInput,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import axios from "axios";

export default function ChiTietBaiTapScreen() {
  const { id } = useLocalSearchParams(); // ID của bài viết
  const [bv, setBv] = useState<any>(null); // Dữ liệu bài tập
  const [tep, setTep] = useState<any>(null); // File đã chọn
  const [nhanXet, setNhanXet] = useState(""); // Nhận xét
  const [loading, setLoading] = useState(false); // Trạng thái loading khi nộp bài

  // Lấy thông tin bài tập từ backend
  useEffect(() => {
    fetch(`http://192.168.1.104:3000/baiviet/chitiet/${id}`)
      .then((res) => res.json())
      .then((data) => setBv(data))
      .catch((err) => console.error("❌ Lỗi khi lấy bài viết:", err));
  }, [id]);

  // Chọn tệp
  const chonTep = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      const originalUri = asset.uri;
      const fileName = asset.name || `tep-${Date.now()}`;
      const newPath =
        FileSystem.documentDirectory + encodeURIComponent(fileName); // tránh lỗi tên

      try {
        // Copy file từ content:// hoặc uri lạ sang file://
        await FileSystem.copyAsync({
          from: originalUri,
          to: newPath,
        });

        setTep({
          ...asset,
          uri: newPath, // ✅ uri chuẩn, luôn file://
          name: fileName,
        });
      } catch (err) {
        console.error("❌ Lỗi khi copy file:", err);
        Alert.alert("Lỗi", "Không thể xử lý tệp đính kèm");
      }
    }
  };

  // Gửi file và nhận xét
  const uploadFile = async () => {
    if (!tep && !nhanXet.trim()) {
      Alert.alert("⚠️ Bạn chưa chọn tệp hoặc nhập nhận xét");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    // Gửi file nếu có
    if (tep) {
      formData.append("file", {
        uri: tep.uri,
        name: tep.name,
        type: tep.mimeType || "application/octet-stream",
      } as any);
    }

    // Gửi nhận xét
    formData.append("MaBV", id);
    formData.append("VanBan", nhanXet);

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        "http://192.168.1.104:3000/baiviet/nopbai",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        const fileUrl = res.data.fileUrl
          ? `http://192.168.1.104:3000${res.data.fileUrl}`
          : null;
        Alert.alert("✅ Nộp bài thành công", "", [
          {
            text: "Ok",
            onPress: () => {
              // Tuỳ bạn, hoặc chuyển trang
             router.back();
            },
          },
        ]);
        // setTep(null);
        // setNhanXet("");
      } else {
        Alert.alert("❌", res.data.message);
      }
    } catch (err: any) {
      console.error("❌ Lỗi gửi bài:", err?.message || err);
      if (err.response?.data) {
        console.error("🧨 Lỗi từ backend:", err.response.data);
      }
      Alert.alert("Lỗi", "Không thể kết nối máy chủ");
    } finally {
      setLoading(false);
    }
  };

  // Hàm gửi bài
  const handleSubmit = async () => {
    if (loading) return; // Tránh gửi nhiều lần
    const formData = new FormData();

    // Gửi file nếu có
    if (tep) {
      formData.append("file", {
        uri: tep.uri,
        name: tep.name,
        type: tep.mimeType || "application/octet-stream", // Đảm bảo gửi file với đúng type
      } as any);
    }

    // Gửi nhận xét
    formData.append("MaBV", id);
    formData.append("VanBan", nhanXet);

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        "http://192.168.1.104:3000/baiviet/nopbai",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        const fileUrl = res.data.fileUrl
          ? `http://192.168.1.104:3000${res.data.fileUrl}`
          : null;

        Alert.alert(
          "✅ Thành công",
          `Thành công${fileUrl ? `\nFile: ${fileUrl}` : ""}`,
          [
            {
              text: "Xem bài viết",
              onPress: () => {
                // Tuỳ bạn, hoặc chuyển trang
                router.replace({
  pathname: "/(drawer)/(class)/lopHocPhan/[id]/(tabs)/dashboard",
  params: { id: bv.MaLHP?.toString() },
});

              },
            },
          ]
        );
      } else {
        Alert.alert("❌ Thất bại", res.data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi bài:", err);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
    }
  };

  if (!bv) return null;

  const fileUrl = bv.DuongDanFile
    ? `http://192.168.1.104:3000${bv.DuongDanFile}`
    : null;

  return (
    <ScrollView style={styles.container}>
      {/* Tiêu đề bài viết */}
      <Text style={styles.title}>{bv.TieuDe}</Text>

      {/* Nội dung bài viết */}
      <Text style={styles.content}>{bv.NoiDung}</Text>

      {/* Thông tin metadata */}
      <View style={styles.metaBox}>
        <Text style={styles.meta}>🧾 Mã: {bv.MaBaiViet}</Text>
        <Text style={styles.meta}>🗓 Ngày tạo: {bv.NgayTao?.slice(0, 10)}</Text>
        <Text style={styles.meta}>
          ⏰ Hạn nộp: {bv.NgayKetThuc?.slice(0, 10)}
        </Text>
        <Text style={styles.meta}>
          👨‍🏫 GV: {bv.HoGV} {bv.TenGV}
        </Text>
      </View>

      {/* File đính kèm */}
      {fileUrl && (
        <TouchableOpacity
          style={styles.attachment}
          onPress={() => Linking.openURL(fileUrl)}
        >
          <Text style={styles.attachmentText}>📎 Xem file đính kèm</Text>
        </TouchableOpacity>
      )}

      {/* Nộp bài */}
      {bv.LoaiBV === 1 && (
        <View style={styles.submitBox}>
          <Text style={styles.sectionLabel}>Nộp bài tập của bạn</Text>

          {/* Hiển thị tên tệp khi đã chọn */}
          <TouchableOpacity onPress={chonTep} style={{ marginBottom: 12 }}>
            <Text style={{ color: "#007bff" }}>
              {tep ? `📄 Đã chọn: ${tep.name}` : "📎 Chọn tệp bài tập"}
            </Text>
          </TouchableOpacity>

          {/* Nếu là file ảnh, hiển thị ảnh */}
          {tep &&
            tep.uri &&
            (tep.mimeType?.includes("image") ? (
              <Image source={{ uri: tep.uri }} style={styles.imagePreview} />
            ) : null)}

          {/* Nhận xét cho bài tập */}
          <TextInput
            value={nhanXet}
            onChangeText={setNhanXet}
            placeholder="✏️ Nhận xét cho bài tập (tuỳ chọn)"
            multiline
            numberOfLines={4}
            style={styles.textInput}
          />

          {/* Nút gửi bài */}
          <Button
            title={loading ? "Đang gửi..." : "📤 Gửi bài tập"}
            onPress={uploadFile}
            disabled={loading}
            color="#0ea5e9"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f9fafb", flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1e293b",
  },
  content: { fontSize: 16, color: "#374151", marginBottom: 12, lineHeight: 22 },
  metaBox: {
    marginBottom: 16,
    backgroundColor: "#e5e7eb",
    padding: 12,
    borderRadius: 8,
  },
  meta: { fontSize: 13, color: "#374151", marginBottom: 4 },
  attachment: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#e0f2fe",
    borderRadius: 8,
    marginBottom: 20,
  },
  attachmentText: { color: "#0284c7", fontWeight: "bold" },
  submitBox: { borderTopWidth: 1, borderColor: "#ccc", paddingTop: 16 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: "#1e293b",
  },
  imagePreview: {
    width: "100%",
    height: 200,
    marginTop: 12,
    borderRadius: 6,
    resizeMode: "contain",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
});
