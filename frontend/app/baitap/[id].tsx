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
  Modal,
  Pressable,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { BASE_URL } from "@/constants/Link";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/stores/useAuth";

export default function ChiTietBaiTapScreen() {
  const { id } = useLocalSearchParams(); // ID của bài viết
  const user = useAuth(); // Lấy thông tin người dùng từ store
  const [bv, setBv] = useState<any>(null); // Dữ liệu bài tập
  const [tep, setTep] = useState<any>(null); // File đã chọn
  const [nhanXet, setNhanXet] = useState(""); // Nhận xét
  const [loading, setLoading] = useState(false); // Trạng thái loading khi nộp bài
  const [baiNop, setBaiNop] = useState<any[]>([]);
  const [showMenuId, setShowMenuId] = useState<number | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  // Lấy thông tin bài tập từ backend
  useEffect(() => {
    fetch(`${BASE_URL}/baiviet/chitiet/${id}`)
      .then((res) => res.json())
      .then((data) => setBv(data))
      .catch((err) => console.error("❌ Lỗi khi lấy bài tập:", err));
  }, [id]);

 const refreshData = () => {
  axios
    .get(`${BASE_URL}/baiviet/bainop/bv/${id}`)
    .then((res) => {
      setBaiNop(res.data); // Cập nhật lại danh sách bài nộp
    })
    .catch((err) => {
      console.error("❌ Lỗi khi lấy bài nộp:", err);
      Alert.alert("Lỗi", "Không thể tải bài nộp");
    });
};

// Sử dụng trong useEffect khi trang được mở lại
useEffect(() => {
  refreshData(); // Gọi lại dữ liệu mới nhất
}, [id]); // Đảm bảo gọi lại API khi ID thay đổi hoặc quay lại trang


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
  const handleMenuToggle = (id: number) => {
    setShowMenuId(showMenuId === id ? null : id);
  };
   const handleEdit = (submission: any) => {
    setCurrentSubmission(submission);
    setNhanXet(submission.VanBan || ""); // Set nhận xét từ bài nộp
    setTep(submission.File || null); // Nếu có file đính kèm, gán vào tep
    setShowEditModal(true); // Mở modal sửa
  };

  const handleUpdate = async () => {
    if (!nhanXet.trim()) {
      Alert.alert("⚠️ Bạn chưa nhập nhận xét");
      return;
    }

    const formData = new FormData();
    if (tep) {
      formData.append("file", { uri: tep.uri, name: tep.name, type: tep.mimeType || "application/octet-stream" });
    }

    formData.append("MaBV", id);
    formData.append("VanBan", nhanXet);

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.put(`${BASE_URL}/baiviet/${currentSubmission.ID}`, formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        Alert.alert("✅ Sửa bài nộp thành công");
        setBaiNop(baiNop.map(item => item.ID === currentSubmission.ID ? res.data : item)); // Cập nhật lại bài nộp
        setShowEditModal(false); // Đóng modal
      } else {
        Alert.alert("❌", res.data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("❌ Lỗi khi sửa bài nộp:", err);
      Alert.alert("Lỗi", "Không thể kết nối máy chủ");
    }
  };


  const handleDelete = async (id: number) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa bài nộp này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await axios.delete(`${BASE_URL}/baiviet/bainop/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 200) {
              Alert.alert("✅ Đã xóa bài nộp");
              setBaiNop(baiNop.filter((item) => item.ID !== id));
            } else {
              Alert.alert("❌ Xóa thất bại", res.data.message);
            }
          } catch (err) {
            console.error("❌ Lỗi khi xóa bài nộp:", err);
            Alert.alert("Lỗi kết nối");
          }
        },
      },
    ]);
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
      <Text style={styles.meta}>⏰ Hạn nộp: {bv.hanNop?.slice(0, 10)} <Text>Lúc</Text> {bv.hanNop?.slice(12, 19)}</Text>
      <Text style={styles.meta}>👨‍🏫 GV: {bv.tenNguoiDang}</Text>

      {baiNop.map((item) => (
        <View key={item.ID} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.submissionTitle}>{item.sinhVienHoTen}</Text>
            <TouchableOpacity onPress={() => handleMenuToggle(item.ID)} hitSlop={10}>
              <Ionicons name="ellipsis-vertical" size={20} color="#8e97be" />
            </TouchableOpacity>
          </View>

          {showMenuId === item.ID && (
            <View style={styles.menuPopover}>
              <TouchableOpacity onPress={() => handleEdit(item)} style={styles.menuItem}>
                <Ionicons name="create-outline" size={18} color="#4666ec" />
                <Text style={styles.menuText}>Sửa bài nộp</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.ID)} style={styles.menuItem}>
                <Ionicons name="trash-outline" size={18} color="#d92626" />
                <Text style={styles.menuText}>Xóa bài nộp</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.meta}>Ngày nộp: {item.NgayNop.slice(0, 10)}</Text>
          {item.LienKet && (
            <TouchableOpacity onPress={() => Linking.openURL(`${BASE_URL}${item.LienKet}`)}>
              <Text style={styles.link}>Mở bài đã nộp</Text>
            </TouchableOpacity>
          )}
          {item.VanBan && <Text style={styles.comment}>{item.VanBan}</Text>}
        </View>
      ))}

      {/* Modal sửa bài nộp */}
      <Modal visible={showEditModal} transparent animationType="fade" onRequestClose={() => setShowEditModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowEditModal(false)}>
          <View style={styles.modalContent}>
            <TextInput
              value={nhanXet}
              onChangeText={setNhanXet}
              placeholder="✏️ Nhập nhận xét"
              multiline
              numberOfLines={4}
              style={styles.textInput}
            />

            <TouchableOpacity onPress={handleUpdate} style={styles.submitBtn}>
              <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.icon} />
              <Text style={styles.submitBtnText}>Cập nhật bài nộp</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <Text style={styles.cancelBtn}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Chọn tệp, nộp bài */}
      <View style={styles.submitBox}>
        <Text style={styles.sectionLabel}>Nộp bài tập của bạn</Text>
        <TouchableOpacity onPress={chonTep} style={styles.chooseFileBtn}>
          <Text style={styles.chooseFileText}>
            {tep ? `📄 Đã chọn: ${tep.name}` : "📎 Chọn tệp bài tập"}
          </Text>
        </TouchableOpacity>

        {tep && tep.uri && <Image source={{ uri: tep.uri }} style={styles.imagePreview} />}

        <TouchableOpacity
          style={[styles.submitBtn, { backgroundColor: loading ? "#B2DFDB" : "#4666ec" }]}
          onPress={uploadFile}
          disabled={loading}
        >
          <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={styles.icon} />
          <Text style={styles.submitBtnText}>{loading ? "Đang gửi..." : "📤 Gửi bài tập"}</Text>
        </TouchableOpacity>
      </View>
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
  submitBtn: { flexDirection: "row", alignItems: "center", paddingVertical: 14, borderRadius: 10, justifyContent: "center", marginTop: 20, elevation: 5 },
  submitBtnText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  icon: { marginRight: 10 },
  card: { padding: 12, backgroundColor: "#fff", borderRadius: 8, marginBottom: 12, elevation: 4 },
  submissionTitle: { fontSize: 16, fontWeight: "bold" },
  link: { color: "#0284c7", fontSize: 14 },
  comment: { fontSize: 14, color: "#666", marginTop: 6 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuPopover: { position: "absolute", top: 30, right: 0, backgroundColor: "#fff", borderRadius: 8, elevation: 4, padding: 10 },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 8 },
  menuText: { marginLeft: 8, color: "#4666ec", fontWeight: "500" },
  cancelBtn: { color: "#f87171", fontSize: 16, textAlign: "center", marginTop: 19, fontWeight: "bold" },
});