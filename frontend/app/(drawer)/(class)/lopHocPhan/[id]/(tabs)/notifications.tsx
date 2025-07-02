import { useLopHocPhan } from "@/context/_context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, router } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, Pressable, Linking, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { WebView } from "react-native-webview";  // Để hiển thị PDF
import PDFReader from 'react-native-pdf';  // Nếu muốn sử dụng thư viện PDF chuyên biệt

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
      const res = await fetch(`http://192.168.1.104:3000/baiviet/loai?maLHP=${id}&loaiBV=1`);
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
            const res = await fetch(`http://192.168.1.104:3000/baiviet/${id}`, {
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
        renderItem={({ item }) => {
          // Tạo URL cho file
          const fileUrl = item.duongDanFile ? `http://192.168.1.104:3000${item.duongDanFile}` : null;

          // Kiểm tra loại file
          const isImage = fileUrl?.match(/\.(jpg|jpeg|png)$/i);
          const isPDF = fileUrl?.match(/\.pdf$/i);
          const isDOCX = fileUrl?.match(/\.docx$/i);

          return (
            <TouchableOpacity
              onPress={() => router.push(`/baitap/${item.id}`)}
              style={styles.card}
            >
              <Text style={styles.title}>
                {item.tieuDe || "📝 Không có tiêu đề"}
              </Text>
              <Text style={styles.meta}>Mã bài viết: {item.maBaiViet}</Text>
              <Text style={styles.meta}>
                Ngày tạo: {item.ngayTao?.slice(0, 10) || "Chưa có"}
              </Text>
              <Text style={styles.meta}>
                Hạn nộp: {item.ngayKetThuc?.slice(0, 10) || "Không rõ"}
              </Text>
              <Text style={styles.content}>{item.noiDung}</Text>

              {/* Nếu là ảnh, hiển thị trực tiếp */}
              {isImage ? (
                <Image
                  source={{ uri: fileUrl }}
                  style={{ width: "100%", height: 200, marginTop: 12, borderRadius: 6 }}
                  resizeMode="contain"
                />
              ) : isPDF && fileUrl ? (
                             <TouchableOpacity onPress={() => Linking.openURL(fileUrl)}>
                  <Text style={{ color: 'skyblue', marginTop: 6 }}>📎 Xem PDF</Text>
                </TouchableOpacity>
              ) : isDOCX ? (
                <TouchableOpacity onPress={() => Linking.openURL(fileUrl)}>
                  <Text style={{ color: 'skyblue', marginTop: 6 }}>📎 Xem DOCX</Text>
                </TouchableOpacity>
              ) : (
                // Nếu là file khác, hiển thị liên kết để mở
                fileUrl && (
                  <TouchableOpacity onPress={() => fileUrl && Linking.openURL(fileUrl)}>
                    <Text style={{ color: 'skyblue', marginTop: 6 }}>📎 Xem file đính kèm</Text>
                  </TouchableOpacity>
                )
              )}

              <TouchableOpacity
                style={{ marginTop: 8 }}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: "red" }}>🗑 Xóa bài viết</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          );
        }}
      />

      {/* ➕ Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setShowModal(true)}>
        <Ionicons name="add-circle" size={56} color="#0ea5e9" />
      </TouchableOpacity>

      {/* Modal chọn loại bài đăng */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Tạo</Text>

            {[
              { label: "📝 Bài tập", type: 1 },
              { label: "📋 Bài kiểm tra", type: 2 },
              { label: "❓ Câu hỏi", type: 0 },
              { label: "📚 Tài liệu", type: 3 },
              { label: "♻️ Sử dụng lại bài đăng", type: 4 },
              { label: "🏷️ Chủ đề", type: 5 },
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
              <Text
                style={{ color: "red", marginTop: 12, textAlign: "center" }}
              >
                Hủy
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  title: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
  },
  meta: {
    color: "#ccc",
    fontSize: 13,
  },
  content: {
    color: "#eee",
    marginTop: 6,
    fontSize: 14,
  },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 20,
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
  },
  optionButton: {
    paddingVertical: 10,
  },
  optionText: {
    fontSize: 16,
  },
});
