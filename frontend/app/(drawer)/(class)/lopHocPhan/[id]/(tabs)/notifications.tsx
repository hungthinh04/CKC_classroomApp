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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const options = [
  { icon: <Ionicons name="create-outline" size={20} color="#000" />, label: "Bài tập", type: 1 },
  { icon: <Ionicons name="clipboard-outline" size={20} color="#000" />, label: "Bài kiểm tra", type: 2 },
  { icon: <Ionicons name="help-circle-outline" size={20} color="#000" />, label: "Câu hỏi", type: 0 },
  { icon: <Ionicons name="book-outline" size={20} color="#000" />, label: "Tài liệu", type: 3 },
  { icon: <Ionicons name="refresh-outline" size={20} color="#000" />, label: "Sử dụng lại bài đăng", type: 4 },
  { icon: <Ionicons name="pricetag-outline" size={20} color="#000" />, label: "Chủ đề", type: 5 },
];

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
      const res = await fetch(`http://192.168.1.101:3000/baiviet/loai?maLHP=${id}&loaiBV=1`);
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
            const res = await fetch(`http://192.168.1.101:3000/baiviet/${id}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            const result = await res.json();
            if (res.ok) {
              alert("✅ Đã xóa bài viết");
              fetchTasks();
            } else {
              alert("❌ Xóa thất bại: " + result.message);
            }
          } catch (err) {
            console.error("❌ Lỗi khi xóa:", err);
            alert("Lỗi kết nối");
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
    router.push(`/taobaitap?maLHP=${id}&loaiBV=${loaiBV}`);
  };

  return (
    <>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item?.id?.toString()}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => {
          const fileUrl = item.duongDanFile ? `http://192.168.1.101:3000${item.duongDanFile}` : null;
          const isImage = fileUrl?.match(/\.(jpg|jpeg|png)$/i);
          const isPDF = fileUrl?.match(/\.pdf$/i);
          const isDOCX = fileUrl?.match(/\.docx$/i);

          return (
            <View style={styles.card}>
              <TouchableOpacity
                style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
                onPress={() => router.push(`/baitap/${item.id}`)}
              >
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#0288d1"
                  style={{ marginRight: 12 }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{item.tieuDe || "Không có tiêu đề"}</Text>
                  <Text style={styles.meta}>Ngày đăng: {item.ngayTao?.slice(0, 10) || "Không rõ"}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Ionicons name="ellipsis-vertical" size={20} color="#888" />
              </TouchableOpacity>
            </View>
          );
        }}
      />

      <View style={styles.fab}>
        <TouchableOpacity onPress={() => setShowModal(true)} style={styles.fabButton}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo</Text>
            {options.map((item, index) => (
              <Pressable
                key={index}
                style={[styles.optionButton, index === 4 && styles.optionBorder]}
                onPress={() => handleCreate(item.type)}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  {item.icon}
                  <Text style={[styles.optionText, { marginLeft: 8 }]}>{item.label}</Text>
                </View>
              </Pressable>
            ))}
            <TouchableOpacity onPress={() => setShowModal(false)}>
              <Text style={{ color: "red", marginTop: 12, textAlign: "center" }}>Hủy</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    elevation: 2,
  },
  title: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#111",
  },
  meta: {
    color: "#555",
    fontSize: 13,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
  },
  fabButton: {
    backgroundColor: "#0288d1",
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
    color: "#000",
  },
  optionBorder: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    marginTop: 8,
  },
});
