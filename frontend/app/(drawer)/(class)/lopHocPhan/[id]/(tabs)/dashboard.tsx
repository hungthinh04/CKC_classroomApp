import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BASE_URL } from "@/constants/Link";
import { Pressable } from "react-native";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BaiViet = {
  ID: number;
  TieuDe: string;
  NgayTao?: string;
  NoiDung: string;
  LoaiBV: number;
  MaLHP: number;
  MaGV?: number;
  MaTK?: number;
  MaBaiViet?: string;
  TrangThai?: number;
  HoGV: string;
  TenGV: string;
};

type LopHocPhan = {
  id: number;
  tenLHP: string;
  hocKy: number;
  namHoc: number;
  maGV: number;
  tenGV?: string;
  tenMH?: string;
  maLop?: string;
  NgayTao?: string;
};

export default function LopHocPhanDetail() {
  const { id, tenLHP } = useLopHocPhan();
  const [lop, setLop] = useState<LopHocPhan | null>(null);
  const { MaLHP } = useLocalSearchParams();
  const maLHP = parseInt(MaLHP as string);
  const [baiViet, setBaiViet] = useState<BaiViet[]>([]);
  const { user } = useAuth(); // Lấy thông tin người dùng
  const [showMenuId, setShowMenuId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/lophocphan/${id}`);
      const res1 = await fetch(`${BASE_URL}/baiviet/${id}`);

      const data = await res.json();
      const data1 = await res1.json();

      setLop(data);
      setBaiViet(data1);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
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
              alert("✅ Đã xóa bài viết");
              fetchData();
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
      if (id) fetchData();
    }, [id])
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header lớp */}
      <View style={styles.header}>
        <Image
          source={require("../../../../../../assets/images/icon.png")}
          style={styles.coverImg}
        />
        <View style={styles.headerContent}>
          <Text style={styles.className}>{tenLHP}</Text>
          <Text style={styles.classMeta}>
            GV: {baiViet[0]?.HoGV} {baiViet[0]?.TenGV}
          </Text>
          <Text style={styles.classMeta}>
            Ngày tạo:{" "}
            {lop?.NgayTao
              ? new Date(lop.NgayTao).toLocaleDateString("vi-VN")
              : "Không rõ"}
          </Text>
        </View>
      </View>

      {/* Nút tạo thông báo mới */}
      <TouchableOpacity
        style={styles.newPostBtn}
        onPress={() => {
          if (user?.role === 1) {
            // Kiểm tra nếu người dùng là giáo viên
            router.push(`/tao/taobaiviet?maLHP=${id}`);
          } else {
            Alert.alert("Thông báo", "Chỉ giáo viên mới có thể tạo bài viết.");
          }
        }}
        activeOpacity={0.88}
      >
        <Ionicons name="pencil" size={18} color="white" />
        <Text style={styles.newPostBtnText}>Thông báo mới</Text>
      </TouchableOpacity>

      {/* Danh sách bài viết */}
      <Text style={styles.sectionTitle}>Thông báo lớp</Text>
      {baiViet
        .filter((bv) => bv.LoaiBV === 0)
        .map((bv) => (
          <View key={bv.ID} style={styles.postCard}>
            {/* Dấu ba chấm tuyệt đối góc phải trên */}
            <TouchableOpacity
              style={styles.ellipsisBtn}
              onPress={() => setShowMenuId(showMenuId === bv.ID ? null : bv.ID)}
              hitSlop={12}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#8e97be" />
            </TouchableOpacity>

            {/* Card clickable cho Xem chi tiết */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={{ flex: 1 }}
              onPress={() => router.push(`../../../../(bv)/baiviet/${bv.ID}`)}
            >
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text
                    style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                  >
                    {bv.HoGV ? bv.HoGV.charAt(0).toUpperCase() : "U"}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.postAuthor}>
                    {bv.HoGV} {bv.TenGV}
                  </Text>
                  <Text style={styles.postDate}>
                    {bv.NgayTao
                      ? new Date(bv.NgayTao).toLocaleDateString("vi-VN")
                      : "Không rõ"}
                  </Text>
                </View>
              </View>
              <Text style={styles.postTitle}>{bv.TieuDe}</Text>
              <Text style={styles.postContent}>{bv.NoiDung}</Text>
            </TouchableOpacity>

            {/* Menu popover khi bấm dấu ba chấm */}
            {showMenuId === bv.ID &&
              user?.role === 1 && ( // Kiểm tra role của người dùng
                <>
                  <Pressable
                    style={StyleSheet.absoluteFill}
                    onPress={() => setShowMenuId(null)}
                  />
                  <View style={styles.menuPopover}>
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setShowMenuId(null);
                        router.push(`../../../../(bv)/baiviet/edit/${bv.ID}`);
                      }}
                    >
                      <Ionicons
                        name="create-outline"
                        size={17}
                        color="#4666ec"
                      />
                      <Text style={styles.menuText}>Sửa bài viết</Text>
                    </TouchableOpacity>
                    <View style={styles.menuDivider} />
                    <TouchableOpacity
                      style={styles.menuItem}
                      onPress={() => {
                        setShowMenuId(null);
                        handleDelete(bv.ID);
                      }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={17}
                        color="#d92626"
                      />
                      <Text style={[styles.menuText, { color: "#d92626" }]}>
                        Xóa bài viết
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
          </View>
        ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eef1fa",
    flex: 1,
    padding: 0,
  },
  header: {
    backgroundColor: "#6e81f3",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: "hidden",
    marginBottom: 18,
    elevation: 8,
    shadowColor: "#6e81f3",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 16,
  },
  coverImg: {
    height: 110,
    width: "100%",
    resizeMode: "cover",
    opacity: 0.25,
    position: "absolute",
    top: 0,
    left: 0,
  },
  headerContent: {
    padding: 22,
    paddingTop: 46,
  },
  className: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 7,
    letterSpacing: 0.3,
  },
  classMeta: {
    color: "#d1dcfc",
    fontSize: 14,
    marginBottom: 2,
    fontWeight: "400",
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 7,
    color: "#243665",
  },
  newPostBtn: {
    flexDirection: "row",
    backgroundColor: "#4666ec",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginTop: -28,
    marginBottom: 15,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 5,
    gap: 7,
  },
  newPostBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#8c98c5",
    fontSize: 15,
    marginTop: 25,
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: "#243665",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
  },
  ellipsisBtn: {
    position: "absolute",
    top: 9,
    right: 9,
    padding: 4,
    zIndex: 5,
  },

  menuPopover: {
    position: "absolute",
    top: 38,
    right: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.17,
    shadowRadius: 7,
    minWidth: 122,
    paddingVertical: 7,
    zIndex: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
    paddingHorizontal: 17,
  },
  menuText: {
    fontSize: 14.5,
    marginLeft: 7,
    color: "#273262",
    fontWeight: "600",
  },
  menuDivider: {
    height: 1,
    backgroundColor: "#f0f1f6",
    marginHorizontal: 10,
  },

  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 7,
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4666ec",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 7,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.19,
    shadowRadius: 4,
    elevation: 2,
  },
  postAuthor: {
    fontWeight: "600",
    fontSize: 14.5,
    color: "#283971",
    marginBottom: 1,
  },
  postDate: {
    fontSize: 12,
    color: "#8e97be",
    fontWeight: "400",
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 16.5,
    marginTop: 2,
    color: "#273262",
  },
  postContent: {
    marginTop: 6,
    fontSize: 14,
    color: "#3b415a",
    lineHeight: 19,
  },
  deleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
    gap: 3,
  },
  deleteBtnText: {
    color: "#d92626",
    fontSize: 13.5,
    fontWeight: "600",
    marginLeft: 2,
  },
});
