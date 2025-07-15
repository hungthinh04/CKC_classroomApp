import { router, useLocalSearchParams } from "expo-router";
import { use, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Modal,
  Pressable,
  Linking,
  ScrollView,
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
  const { user, setUser } = useAuth();
  const [bv, setBv] = useState<any>(null); // Dữ liệu bài tập
  const [tep, setTep] = useState<any>(null); // File đã chọn
  const [nhanXet, setNhanXet] = useState(""); // Nhận xét
  const [loading, setLoading] = useState(false);
  const [baiNop, setBaiNop] = useState<any[]>([]);
  const [showMenuId, setShowMenuId] = useState<number | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<any>(null);
  const [sv, setSv] = useState<any>(null);

  useEffect(() => {
    fetch(`${BASE_URL}/baiviet/chitiet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu bài tập: ", data);
        setBv(data);
      })
      .catch((err) => console.error("❌ Lỗi khi lấy bài tập:", err));
  }, [id]);

  useEffect(() => {
    const fetchMaSV = async () => {
      // const userId = user.id; // Lấy user.id từ context hoặc state
      const token = await AsyncStorage.getItem("token"); // Lấy token từ AsyncStorage

      if (!token) {
        Alert.alert("Lỗi", "Vui lòng đăng nhập lại.");
        return;
      }

      try {
        // Gọi API backend để lấy MaSinhVien
        const response = await fetch(`${BASE_URL}/api/getMaSV/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json(); // Lấy MaSinhVien từ response
          console.log("MaSinhVien:", data);
          setSv(data);
        }
      } catch (err) {
        console.error("❌ Lỗi ko lấy MaSV: ", err);
        Alert.alert("Lỗi", "Không thể lấy thông tin mã sinh viên.");
      }
    };
    fetchMaSV();
  }, []);
  // Lấy thông tin bài tập từ backend

  // Lấy bài đã nộp
  const refreshData = async () => {
  if (!bv?.MaLHP || !sv) return; // Kiểm tra nếu thiếu dữ liệu

  try {
    const res = await axios.get(`${BASE_URL}/baiviet/bainop/bv/${id}`, {
      params: {
        maSV: sv,
        maLHP: bv?.MaLHP,
      },
    });

    if (res.data && res.data.length > 0) {
      // Nếu có bài nộp rồi
      console.log("Bài đã nộp:", res.data);
      setBaiNop(res.data);
      // Alert.alert("Thông báo", "Bạn đã nộp bài rồi.");
    } else {
      // Nếu không có bài nộp
      setBaiNop([]);
    }
  } catch (err) {
    console.error("❌ Lỗi khi lấy bài nộp:", err);
    Alert.alert("Lỗi", "Không thể tải bài nộp");
  }
};


  // Fetch bài đã nộp khi có đủ dữ liệu
  useEffect(() => {
    if (bv && bv.MaLHP && user?.id) {
      refreshData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bv, sv]);

  // Chọn tệp
  const chonTep = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      const originalUri = asset.uri;
      const fileName = asset.name || `tep-${Date.now()}`;
      const newPath =
        FileSystem.documentDirectory + encodeURIComponent(fileName);

      try {
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

  // Nộp bài mới
  const uploadFile = async () => {
    if (!tep && !nhanXet.trim()) {
      Alert.alert("⚠️ Bạn chưa chọn tệp hoặc nhập nhận xét");
      return;
    }

    setLoading(true);
    const formData = new FormData();

    if (tep) {
      formData.append("file", {
        uri: tep.uri,
        name: tep.name,
        type: tep.mimeType || "application/octet-stream",
      });
    }

    formData.append("MaBaiViet", id);
    formData.append("VanBan", nhanXet);
    formData.append("MaLHP", bv.MaLHP);

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.post(`${BASE_URL}/baiviet/nopbai`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        Alert.alert("✅ Nộp bài thành công");
        setTep(null);
        setNhanXet("");
        refreshData();
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

  // Quản lý menu bài nộp (Sửa/Xóa)
  const handleMenuToggle = (id: number) => {
    setShowMenuId(showMenuId === id ? null : id);
  };

  // Bắt đầu sửa bài nộp
  const handleEdit = (submission:any) => {
    console.log(submission, "Bắt đầu sửa bài nộp");
  setCurrentSubmission(submission);
  setNhanXet(submission.VanBan || "");
  setTep(null); // Xử lý tệp nếu cần
  setShowEditModal(true); // Mở modal sửa bài nộp
};

const handleUpdate = async () => {
   if (!nhanXet.trim()) {
      Alert.alert("⚠️ Bạn chưa nhập nhận xét");
      return;
   }

   const formData = new FormData();
   if (tep) {
      formData.append("file", {
         uri: tep.uri,
         name: tep.name,
         type: tep.mimeType || "application/octet-stream",
      });
   }

   formData.append("MaBV", id);
   formData.append("VanBan", nhanXet);

   try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.put(
         `${BASE_URL}/baiviet/capnhat/${currentSubmission.ID}`,
         formData,
         {
            headers: {
               Authorization: `Bearer ${token}`,
               "Content-Type": "multipart/form-data",
            },
         }
      );

      if (res.status === 200) {
         Alert.alert("✅ Sửa bài nộp thành công");
         setShowEditModal(false);
         refreshData();
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
            refreshData();
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

  if (!bv) return null;

  return (
  <ScrollView style={styles.container}>
    {/* Nút Quay lại */}
    <TouchableOpacity
      style={styles.backBtn}
      onPress={() =>
        router.replace(`../(class)/lopHocPhan/${bv?.MaLHP}/(tabs)/notifications`)
      }
    >
      <Ionicons name="arrow-back" size={22} color="#4666ec" />
      <Text style={styles.backText}>Quay lại</Text>
    </TouchableOpacity>

    {/* Thông tin bài tập */}
    <Text style={styles.title}>{bv.tieuDe}</Text>
    <Text style={styles.content}>{bv.noiDung}</Text>
    <Text style={styles.meta}>
      ⏰ Hạn nộp: {bv.hanNop?.slice(0, 10)} <Text>Lúc</Text>{" "}
      {bv.hanNop?.slice(12, 19)}
    </Text>
    <Text style={styles.meta}>👨‍🏫 GV: {bv.tenNguoiDang}</Text>

    {/* Ô nộp bài */}
    <View style={styles.submitBox}>
      <Text style={styles.sectionLabel}>Nộp bài tập của bạn</Text>
      
      {baiNop.length > 0 ? (
        // Nếu đã nộp bài, hiển thị tùy chọn sửa
        <>
          <Text>Bạn đã nộp bài rồi.</Text>
          <TouchableOpacity
            onPress={() => handleEdit(baiNop[0])}
            style={styles.chooseFileBtn}
          >
            <Text style={styles.chooseFileText}>Sửa bài nộp</Text>
          </TouchableOpacity>
        </>
      ) : (
        // Nếu chưa nộp bài, cho phép nộp bài
        <>
          <TouchableOpacity onPress={chonTep} style={styles.chooseFileBtn}>
            <Text style={styles.chooseFileText}>
              {tep ? `📄 Đã chọn: ${tep.name}` : "📎 Chọn tệp bài tập"}
            </Text>
          </TouchableOpacity>
          {tep && tep.uri && (
            <Image source={{ uri: tep.uri }} style={styles.imagePreview} />
          )}
          <TextInput
            value={nhanXet}
            onChangeText={setNhanXet}
            placeholder="✏️ Nhập nhận xét"
            multiline
            style={styles.textInput}
          />
          <TouchableOpacity
            style={[
              styles.submitBtn,
              { backgroundColor: loading ? "#B2DFDB" : "#4666ec" },
            ]}
            onPress={uploadFile}
            disabled={loading}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.submitBtnText}>
              {loading ? "Đang gửi..." : "📤 Gửi bài tập"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>

    {/* Modal sửa bài nộp */}
    <Modal
      visible={showEditModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowEditModal(false)}
    >
      <Pressable
        style={styles.modalOverlay}
        onPress={() => setShowEditModal(false)}
      >
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
            <Ionicons
              name="cloud-upload-outline"
              size={20}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.submitBtnText}>Cập nhật bài nộp</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowEditModal(false)}>
            <Text style={styles.cancelBtn}>Huỷ</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  </ScrollView>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f0f8ff" },
  backBtn: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  backText: {
    color: "#4666ec",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 12,
  },
  content: { fontSize: 16, color: "#374151", marginBottom: 12, lineHeight: 22 },
  meta: { fontSize: 14, color: "#4666ec", marginBottom: 4 },
  attachment: {
    padding: 12,
    backgroundColor: "#e0f7fa",
    borderRadius: 8,
    marginBottom: 20,
  },
  attachmentText: { color: "#0284c7", fontWeight: "bold" },
  submitBox: {
    marginTop: 0,
    borderTopWidth: 1,
    borderColor: "#ccc",
    paddingTop: 16,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
    marginBottom: 12,
  },
  chooseFileBtn: { marginBottom: 12 },
  chooseFileText: { color: "#007bff", fontWeight: "600" },
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
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    marginTop: 0,
    elevation: 5,
  },
  submitBtnText: { fontSize: 16, color: "#fff", fontWeight: "600" },
  icon: { marginRight: 10 },
  card: {
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 4,
  },
  submissionTitle: { fontSize: 16, fontWeight: "bold" },
  link: { color: "#0284c7", fontSize: 14, marginTop: 8 },
  comment: { fontSize: 14, color: "#666", marginTop: 6 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuPopover: {
    position: "absolute",
    top: 30,
    right: 0,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 4,
    padding: 10,
  },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 8 },
  menuText: { marginLeft: 8, color: "#4666ec", fontWeight: "500" },
  cancelBtn: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
    marginTop: 19,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  noDataText: { color: "#888", marginBottom: 8 },
});
