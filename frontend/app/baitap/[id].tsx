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
  FlatList,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { BASE_URL } from "@/constants/Link";
import { Ionicons } from "@expo/vector-icons";

export default function ChiTietBaiTapScreen() {
  const { id } = useLocalSearchParams(); // ID của bài viết
  const [bv, setBv] = useState<any>(null); // Dữ liệu bài tập
  const [tep, setTep] = useState<any>(null); // File đã chọn
  const [nhanXet, setNhanXet] = useState(""); // Nhận xét
  const [loading, setLoading] = useState(false); // Trạng thái loading khi nộp bài
  const [baiNop, setBaiNop] = useState<any[]>([]);
  // Lấy thông tin bài tập từ backend
  useEffect(() => {
    fetch(`${BASE_URL}/baiviet/chitiet/${id}`)
      .then((res) => res.json())
      .then((data) => setBv(data))
      .catch((err) => console.error("❌ Lỗi khi lấy bài tập:", err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/baiviet/bainop/bv/${id}`)
      .then((res) => {
        setBaiNop(res.data); // Cập nhật danh sách bài nộp
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy bài nộp:", err);
        Alert.alert("Lỗi", "Không thể tải bài nộp");
      });
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
          uri: newPath,
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

      const res = await axios.post(`${BASE_URL}/baiviet/nopbai`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        const fileUrl = res.data.fileUrl
          ? `${BASE_URL}${res.data.fileUrl}`
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

      const res = await axios.post(`${BASE_URL}/baiviet/nopbai`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        const fileUrl = res.data.fileUrl
          ? `${BASE_URL}${res.data.fileUrl}`
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
                  pathname:
                    "/(drawer)/(class)/lopHocPhan/[id]/(tabs)/dashboard",
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

  const fileUrl = bv.DuongDanFile ? `${BASE_URL}${bv.DuongDanFile}` : null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{bv.tieuDe}</Text>
      <Text style={styles.content}>{bv.noiDung}</Text>
      <Text style={styles.meta}>⏰ Hạn nộp: {bv.hanNop?.slice(0, 10)}</Text>
      <Text style={styles.meta}>👨‍🏫 GV: {bv.tenNguoiDang}</Text>

      {bv.duongDanFile && (
        <TouchableOpacity
          style={styles.attachment}
          onPress={() => Linking.openURL(`${BASE_URL}${bv.duongDanFile}`)}
        >
          <Text style={styles.attachmentText}>📎 Xem file đính kèm</Text>
        </TouchableOpacity>
      )}

      <View style={styles.submitBox}>
        <Text style={styles.sectionLabel}>Nộp bài tập của bạn</Text>
        <TouchableOpacity onPress={chonTep} style={styles.chooseFileBtn}>
          <Text style={styles.chooseFileText}>
            {tep ? `📄 Đã chọn: ${tep.name}` : "📎 Chọn tệp bài tập"}
          </Text>
        </TouchableOpacity>

        {tep && tep.uri && <Image source={{ uri: tep.uri }} style={styles.imagePreview} />}

        <TextInput
          value={nhanXet}
          onChangeText={setNhanXet}
          placeholder="✏️ Nhập nhận xét"
          multiline
          numberOfLines={4}
          style={styles.textInput}
        />

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: loading ? "#B2DFDB" : "#4666ec" }]}
          onPress={uploadFile}
          disabled={loading}
        >
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.submitBtnText}>
            {loading ? "Đang gửi..." : "📤 Gửi bài tập"}
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={baiNop}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.submissionTitle}>{item.sinhVienHoTen}</Text>
            <Text style={styles.meta}>Ngày nộp: {item.NgayNop.slice(0, 10)}</Text>
            {item.LienKet && (
              <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}${item.LienKet}`)}>
                <Text style={styles.link}>Mở bài đã nộp</Text>
              </TouchableOpacity>
            )}
            {item.VanBan && <Text style={styles.comment}>{item.VanBan}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f8ff" },
  title: { fontSize: 22, fontWeight: "bold", color: "#1e293b", marginBottom: 12 },
  content: { fontSize: 16, color: "#374151", marginBottom: 12, lineHeight: 22 },
  meta: { fontSize: 14, color: "#4666ec", marginBottom: 4 },
  attachment: { padding: 12, backgroundColor: "#e0f7fa", borderRadius: 8, marginBottom: 20 },
  attachmentText: { color: "#0284c7", fontWeight: "bold" },
  submitBox: { marginTop: 16, borderTopWidth: 1, borderColor: "#ccc", paddingTop: 16 },
  sectionLabel: { fontSize: 16, fontWeight: "600", color: "#1e293b", marginBottom: 12 },
  chooseFileBtn: { marginBottom: 12 },
  chooseFileText: { color: "#007bff", fontWeight: "600" },
  imagePreview: { width: "100%", height: 200, marginTop: 12, borderRadius: 6, resizeMode: "contain" },
  textInput: { borderWidth: 1, borderColor: "#ccc", borderRadius: 6, padding: 10, marginBottom: 12, backgroundColor: "#fff" },
  submitBtn: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14, borderRadius: 10, justifyContent: "center", marginTop: 20, elevation: 5,
  },
  submitBtnText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  icon: { marginRight: 10 },
  card: { padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 12, elevation: 4 },
  submissionTitle: { fontSize: 16, fontWeight: "bold" },
  link: { color: "#0284c7", fontSize: 14 },
  comment: { fontSize: 14, color: "#666", marginTop: 6 },
});