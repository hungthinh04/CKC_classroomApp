import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/stores/useAuth";
import { useNavigation } from "@react-navigation/native";

export default function BaiVietDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [baiViet, setBaiViet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.1.102:3001/baiviet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBaiViet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch bài viết:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Đang tải...</Text>
      </View>
    );
  }

  if (!baiViet) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Không tìm thấy bài viết</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header bài viết */}
      <View style={styles.header}>
        <ImageBackground
          source={require("../../../../assets/images/icon.png")} // ← thay đúng path của bạn
          resizeMode="cover"
          style={styles.coverImg}
          imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }} // bo góc phần ảnh
        >
          <View style={styles.overlay}>
            <Text style={styles.title}>{baiViet.tieuDe}</Text>
            <Text style={styles.author}>Người đăng: {baiViet.maGV}</Text>
            <Text style={styles.date}>
              {new Date(baiViet.ngayTao).toLocaleDateString()}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Bảng tin lớp học */}
      <Text style={styles.sectionTitle}>Bảng tin lớp học</Text>

      {/* Thông báo */}
      <View style={styles.postCard}>
        <View style={styles.inlineNotify}>
          <View style={styles.avatar}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {baiViet.maGV?.charAt(0) || "H"}
            </Text>
          </View>
          <Text style={styles.notifyText}>Thông báo từ giáo viên</Text>
        </View>
      </View>

      {/* Nội dung bài viết */}
      <View style={styles.contentCard}>
        <Text style={styles.content}>{baiViet.noiDung}</Text>
      </View>

      {/* Thêm nhận xét */}
      <View style={styles.commentBox}>
        <Text style={styles.commentText}>Thêm nhận xét trong lớp học</Text>
      </View>

      {/* Nút nộp bài nếu quyền người dùng là sinh viên */}
      {user?.quyen === 1 && baiViet.loaiBV === 1 && (
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => navigation.navigate("nopbai", { id: baiViet.id })}
        >
          <Text style={styles.submitButtonText}>📤 Nộp bài</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 12,
  },
  header: {
    borderRadius: 10,
    marginBottom: 16,
  },
  coverImg: {
    height: 120,
    width: "100%",
    justifyContent: "flex-end",
  },
  overlay: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  author: {
    fontSize: 14,
    color: "#fff",
  },
  date: {
    fontSize: 12,
    color: "#fff",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },
  postCard: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1d4ed8",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  postTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  contentCard: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
  },
  content: {
    fontSize: 14,
    color: "#444",
  },
  commentBox: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
  },
  commentText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#1A73E8",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  submitButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  inlineNotify: {
    flexDirection: "row",
    alignItems: "center",
  },
  notifyText: {
    fontSize: 14,
    color: "#444",
    flexShrink: 1,
  },
});
