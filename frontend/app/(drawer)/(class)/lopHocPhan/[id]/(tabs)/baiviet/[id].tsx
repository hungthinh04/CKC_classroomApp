import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "@/stores/useAuth";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Import Ionicons

export default function BaiVietDetail() {
  const { id } = useLocalSearchParams(); // Nhận id bài viết từ URL
  const { user } = useAuth();
  const navigation = useNavigation();
  const [baiViet, setBaiViet] = useState<any>(null); // Dữ liệu bài viết
  const [giangVien, setGiangVien] = useState<any>(null); // Dữ liệu giảng viên
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch bài viết từ API
    fetch(`${API_BASE_URL}/baiviet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBaiViet(data);

        // Kiểm tra nếu bài viết có maLHP (mã lớp học phần)
        if (data.maLHP) {
          // Fetch thông tin lớp học phần từ maLHP
          fetch(`${API_BASE_URL}/lophophan/${data.maLHP}`)
            .then((res) => res.json())
            .then((lhpData) => {
              // Kiểm tra nếu lớp học phần có maGV (mã giảng viên)
              if (lhpData.maGV) {
                // Fetch thông tin giảng viên từ maGV
                fetch(`${API_BASE_URL}/giangvien/${lhpData.maGV}`)
                  .then((res) => res.json())
                  .then((gvData) => {
                    setGiangVien(gvData); // Lưu thông tin giảng viên
                  })
                  .catch((err) => console.error("Lỗi fetch giảng viên:", err));
              }
            })
            .catch((err) => console.error("Lỗi fetch lớp học phần:", err));
        }

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
      {/* Thanh header với mũi tên quay lại và icon ba chấm
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconWrapper}>

          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconWrapper}>
          <Ionicons name="ellipsis-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View> */}

      {/* Thông tin người đăng */}
      <View style={styles.postCard}>
        <View style={styles.inlineNotify}>
          <View style={styles.avatar}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {giangVien ? giangVien.hoGV.charAt(0) : "H"} {/* Hiển thị chữ cái đầu tiên của giảng viên */}
            </Text>
          </View>
          <View>
            <Text style={styles.author}>
              {giangVien ? `${giangVien.hoGV} ${giangVien.tenGV}` : "Giảng viên"}
            </Text>
            <Text style={styles.date}>
              {new Date(baiViet.ngayTao).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Đường kẻ ngăn cách */}
        <View style={styles.divider} />

        {/* Nội dung bài viết */}
        {baiViet.noiDung.split('\n').map((line: string, index: number) => (
          <Text key={index} style={styles.content}>
            {line}
          </Text>
        ))}


        {/* Đường kẻ ngăn cách */}
        <View style={styles.divider} />

        {/* Nhận xét */}
        <TextInput
          style={styles.commentInput}
          placeholder="Thêm nhận xét trong lớp học"
          placeholderTextColor="#2563eb"
          multiline
          autoCorrect
          autoCapitalize="sentences"
          keyboardType="default"
          textBreakStrategy="simple"
        />
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
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#f1f5f9", // Nền màu sáng cho header
    alignItems: "center",
  },
  iconWrapper: {
    padding: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111827",
    marginBottom: 12,
  },
  postCard: {
    backgroundColor: "#fff", // Xóa background màu trắng trong postCard
    padding: 14,
    marginBottom: 14,
    // Không có viền và borderRadius nữa
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
  inlineNotify: {
    flexDirection: "row",
    alignItems: "center",
  },
  author: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
  date: {
    fontSize: 12,
    color: "#6b7280",
  },
  divider: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 12,
  },
  content: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  commentInput: {
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#f9fafb",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
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
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    fontWeight: "bold",
  },
});
