import BaiVietDetail from "@/app/(drawer)/(class)/lopHocPhan/[id]/(tabs)/baiviet/[id]";
import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import { Link } from "expo-router";
import {
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LopHocPhanDetail() {
  const { id, tenLHP } = useLopHocPhan();
  const [lop, setLop] = useState<any>(null);
  const [baiViet, setBaiViet] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      const [resLHP, resGV, resBV] = await Promise.all([
        fetch(`${API_BASE_URL}/lophophan/${id}`),
        fetch(`${API_BASE_URL}/giangvien`),
        fetch(`${API_BASE_URL}/baiviet?maLHP=${id}`),
      ]);

      const lhp = await resLHP.json();
      const gvs = await resGV.json();
      const bvs = await resBV.json();

      const gv = gvs.find((g: any) => Number(g.id) === lhp.maGV);
      lhp.tenGV = gv ? `${gv.hoGV} ${gv.tenGV}` : "Không rõ";

      setLop(lhp);
      setBaiViet(bvs);
    };
    fetchData();
  }, [id]);

  if (!lop) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Header lớp */}
      <View style={styles.header}>
        <ImageBackground
          source={require("../../../../../../assets/images/icon.png")} // ← thay đúng path của bạn
          resizeMode="cover"
          style={styles.coverImg}
          imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }} // bo góc phần ảnh
        >
          <View style={styles.overlay}>
            <Text style={styles.className}>{lop.tenLHP}</Text>
            <Text style={styles.classMeta}>{lop.tenGV}</Text>
            <Text style={styles.classMeta}>
              Học kỳ {lop.hocKy} - Năm học {lop.namHoc}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Bảng tin lớp học */}
      <Text style={styles.sectionTitle}>Bảng tin lớp học</Text>

      {/* Thông báo gì đó cho lớp */}
      <View style={styles.postCard}>
        <View style={styles.inlineNotify}>
          <View style={styles.avatar}>
            <Text style={{ color: "#fff", fontWeight: "bold" }}>
              {lop.tenGV?.charAt(0) || "H"}
            </Text>
          </View>
          <TextInput
            style={styles.notifyInput}
            placeholder="Thông báo tin gì đó cho lớp"
            placeholderTextColor="#444"
            multiline
            autoCorrect={true}
            autoCapitalize="sentences"
            keyboardType="default"
            textBreakStrategy="simple"
          />
        </View>
      </View>

      {/* Các bài viết */}
      
      {baiViet.map((bv) => (
        <Link
          key={bv.id}
          href={`/(drawer)/(class)/lopHocPhan/${id}/(tabs)/baiviet/${bv.id}`}
          asChild
        >
          <TouchableOpacity>
            <View style={styles.postCard}>
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {lop.tenGV?.charAt(0)}
                  </Text>
                </View>

                <View>
                  <Text style={styles.postAuthor}>{lop.tenGV}</Text>
                  <Text style={styles.postDate}>
                    {new Date(bv.ngayTao).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text style={styles.postTitle}>{bv.tieuDe}</Text>
              <Text style={styles.postContent}>{bv.noiDung}</Text>
              <View style={styles.commentBox}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Thêm nhận xét trong lớp học"
                  placeholderTextColor="#2563eb"
                  multiline
                  autoCorrect={true}
                  autoCapitalize="sentences"
                  keyboardType="default"
                  textBreakStrategy="simple"
                />
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      ))}

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
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // Chỉnh màu chữ thành trắng
  },
  classMeta: {
    color: "#fff", // Chỉnh màu chữ thành trắng
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 10,
    color: "#111827",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  postCard: {
    backgroundColor: "#ffffff", // trắng nền
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb", // viền xám nhạt
    padding: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2, // để có đổ bóng nhẹ (Android)
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#1d4ed8", // xanh dương đậm hơn
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  postAuthor: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#111827",
  },
  postDate: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  postTitle: {
    fontWeight: "600",
    fontSize: 16,
    marginTop: 4,
    marginBottom: 4,
  },
  postContent: {
    fontSize: 14,
    color: "#444",
    lineHeight: 20,
  },
  commentBox: {
    backgroundColor: "#f1f5f9", // nền xám nhạt
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0", // viền xám nhạt
  },
  commentText: {
    color: "#2563eb",
    fontSize: 14,
    fontWeight: "500",
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
  commentInput: {
    fontSize: 14,
    color: "#111827",
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  notifyInput: {
    fontSize: 14,
    color: "#111827",
    flex: 1,
    backgroundColor: "#f9fafb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
});
