import { useLopHocPhan } from "@/context/_context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  Pressable,
  Linking,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "@/constants/Link";

type BaiViet = {
  id: number;
  tieuDe: string;
  noiDung: string;
  ngayTao?: string | null;
  ngayKetThuc?: string | null;
  loaiBV: number;
  maBaiViet: string;
  trangThai: number;
  duongDanFile?: string | null;
};

export default function BaiTapScreen() {
  const { id } = useLopHocPhan();
  const [tasks, setTasks] = useState<BaiViet[]>([]);
  const [showModal, setShowModal] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch(`${BASE_URL}/baiviet/loai?maLHP=${id}&loaiBV=1`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa bài viết này?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            const res = await fetch(`${BASE_URL}/baiviet/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const result = await res.json();
            if (res.ok) {
              Alert.alert("✅ Đã xóa bài viết");
              fetchTasks();
            } else {
              Alert.alert("❌ Xóa thất bại", result.message);
            }
          } catch (err) {
            console.error("❌ Lỗi khi xóa:", err);
            Alert.alert("Lỗi kết nối");
          }
        },
      },
    ]);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [id])
  );

  const handleCreate = (loaiBV: number) => {
    setShowModal(false);
    router.push(`/tao/taobaitap?maLHP=${id}&loaiBV=${loaiBV}`);
  };

  // File helper
  const fileIcon = (fileUrl?: string | null) => {
    if (!fileUrl) return null;
    if (/\.(jpg|jpeg|png)$/i.test(fileUrl)) return <Ionicons name="image" size={18} color="#60a5fa" />;
    if (/\.pdf$/i.test(fileUrl)) return <Ionicons name="document" size={18} color="#f87171" />;
    if (/\.docx?$/i.test(fileUrl)) return <Ionicons name="document-text" size={18} color="#10b981" />;
    return <Ionicons name="attach" size={18} color="#b191ff" />;
  };

  return (
    <View style={styles.root}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={{ padding: 18, paddingBottom: 90 }}
        ListEmptyComponent={
          <Text style={{ color: "#aaa", textAlign: "center", marginTop: 24, fontSize: 15 }}>
            Không có bài tập nào!
          </Text>
        }
        renderItem={({ item }) => {
          const fileUrl = item.duongDanFile
            ? `${BASE_URL}${item.duongDanFile}`
            : null;
          const isImage = fileUrl?.match(/\.(jpg|jpeg|png)$/i);

          return (
            <View style={styles.card}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.title}>
                  <Ionicons name="reader-outline" size={17} color="#4666ec" />{" "}
                  {item.tieuDe || "📝 Không có tiêu đề"}
                </Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)} hitSlop={10}>
                  <Ionicons name="trash-outline" size={20} color="#f87171" />
                </TouchableOpacity>
              </View>
              <Text style={styles.meta}>Mã: <Text style={{ color: "#4666ec" }}>{item.maBaiViet}</Text></Text>
              <Text style={styles.meta}>
                <Ionicons name="calendar-outline" size={13} color="#b5badb" /> Ngày tạo:{" "}
                {item.ngayTao?.slice(0, 10) || "Chưa có"}
              </Text>
              <Text style={styles.meta}>
                <Ionicons name="alarm-outline" size={13} color="#fbbf24" /> Hạn nộp:{" "}
                {item.ngayKetThuc?.slice(0, 10) || "Không rõ"}
              </Text>
              <Text style={styles.content}>{item.noiDung}</Text>

              {/* Preview file đính kèm */}
              {isImage ? (
                <Image
                  source={{ uri: fileUrl }}
                  style={styles.attachImage}
                  resizeMode="cover"
                />
              ) : fileUrl && (
                <TouchableOpacity
                  onPress={() => Linking.openURL(fileUrl)}
                  style={styles.attachBtn}
                >
                  {fileIcon(fileUrl)}
                  <Text style={styles.attachText}>Xem file đính kèm</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={styles.detailBtn}
                onPress={() => router.push(`/baitap/${item.id}`)}
                activeOpacity={0.8}
              >
                <Ionicons name="open-outline" size={18} color="#4666ec" />
                <Text style={styles.detailBtnText}>Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add-circle" size={58} color="#4666ec" style={{ elevation: 8 }} />
      </TouchableOpacity>

      {/* Modal chọn loại bài đăng */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowModal(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo bài mới</Text>
            {[
              { label: "📝 Bài tập", type: 1 },
              { label: "📋 Bài kiểm tra", type: 2 },
              { label: "❓ Câu hỏi", type: 0 },
              { label: "📚 Tài liệu", type: 3 },
            ].map((item, index) => (
              <Pressable
                key={index}
                style={styles.optionButton}
                onPress={() => handleCreate(item.type)}
              >
                <Text style={styles.optionText}>{item.label}</Text>
              </Pressable>
            ))}
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={styles.cancelBtn}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f4f7fc" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 17,
    marginBottom: 16,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {
    color: "#273262",
    fontWeight: "bold",
    fontSize: 16.5,
    marginBottom: 4,
  },
  meta: {
    color: "#888fb0",
    fontSize: 13.2,
    marginBottom: 2,
  },
  content: {
    color: "#363b48",
    marginTop: 8,
    fontSize: 14.5,
    lineHeight: 20,
  },
  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    backgroundColor: "#eff4ff",
    borderRadius: 7,
    paddingVertical: 7,
    paddingHorizontal: 13,
    alignSelf: "flex-start",
  },
  attachText: {
    color: "#4666ec",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14.5,
  },
  attachImage: {
    width: "100%",
    height: 180,
    borderRadius: 9,
    marginTop: 12,
    backgroundColor: "#e6e9f7",
  },
  detailBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
    alignSelf: "flex-end",
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 7,
    backgroundColor: "#e9edfa",
  },
  detailBtnText: {
    color: "#4666ec",
    fontWeight: "700",
    marginLeft: 5,
    fontSize: 14.5,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 26,
    backgroundColor: "#fff",
    borderRadius: 50,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 14,
    elevation: 11,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(36,50,102,0.23)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 9,
    paddingBottom: Platform.OS === "ios" ? 34 : 22,
  },
  modalTitle: {
    fontSize: 19,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#273262",
    letterSpacing: 0.2,
  },
  optionButton: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#e3e8f6",
  },
  optionText: {
    fontSize: 16.7,
    textAlign: "center",
    color: "#4666ec",
    fontWeight: "600",
    letterSpacing: 0.12,
  },
  cancelBtn: {
    color: "#f87171",
    fontSize: 16,
    textAlign: "center",
    marginTop: 19,
    fontWeight: "bold",
  },
});
