import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  ImageBackground,
  Modal,
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
  const { user } = useAuth();

  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [showMenu, setShowMenu] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`http://192.168.1.101:3000/lophocphan/${id}`);
      const res1 = await fetch(`http://192.168.1.101:3000/baiviet/${id}`);

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
            const res = await fetch(`http://192.168.1.101:3000/baiviet/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
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

  const handleEdit = (id: number) => {
    setShowMenu(false);
    alert(`🔧 Chức năng chỉnh sửa sẽ cập nhật sau (ID: ${id})`);
    // Sau này dùng: router.push(`/chinhsuabaiviet?id=${id}`);
  };

  useFocusEffect(
    useCallback(() => {
      if (id) fetchData();
    }, [id])
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <ImageBackground
          source={require("../../../../../../assets/images/icon.png")}
          style={styles.coverImg}
          imageStyle={{ borderTopLeftRadius: 10, borderTopRightRadius: 10 }}
        >
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
        </ImageBackground>
      </View>

      {/* Nút tạo bài viết */}
      <TouchableOpacity
        style={styles.newPostBtn}
        onPress={() => router.push(`/taobaiviet?maLHP=${id}`)}
      >
        <Text style={{ color: "black", fontWeight: "bold" }}>
          Thông báo mới
        </Text>
      </TouchableOpacity>

      {/* Danh sách bài viết */}
      {baiViet.filter((bv) => bv.LoaiBV === 0).length === 0 ? (
        <Text style={{ textAlign: "center", color: "#666" }}>
          Chưa có bài viết nào.
        </Text>
      ) : (
        baiViet
          .filter((bv) => bv.LoaiBV === 0)
          .map((bv) => (
            <TouchableOpacity
              key={bv.ID}
              style={styles.postCard}
              onPress={() => router.push(`../../../../(bv)/baiviet/${bv.ID}`)}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.postHeader}>
                  <View style={styles.avatar}>
                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                      {user?.email?.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.postDate}>
                    {bv.NgayTao
                      ? new Date(bv.NgayTao).toLocaleDateString("vi-VN")
                      : "Không rõ"}
                  </Text>
                </View>

                {/* Dấu 3 chấm */}
                <TouchableOpacity
                  onPress={() => {
                    setSelectedPostId(bv.ID);
                    setShowMenu(true);
                  }}
                >
                  <MaterialIcons name="more-vert" size={24} color="black" />
                </TouchableOpacity>
              </View>

              <Text style={styles.postTitle}>{bv.TieuDe}</Text>
              <Text style={styles.postContent}>{bv.NoiDung}</Text>
            </TouchableOpacity>
          ))
      )}

      {/* Menu 3 chấm */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPressOut={() => setShowMenu(false)}
        >
          <View style={styles.menuBox}>
            <TouchableOpacity
              style={styles.menuItemBox}
              onPress={() => {
                if (selectedPostId !== null) {
                  handleEdit(selectedPostId);
                }
              }}
            >
              <Text style={styles.menuItem}>✏️ Chỉnh sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItemBox}
              onPress={() => {
                if (selectedPostId !== null) {
                  handleDelete(selectedPostId);
                }
                setShowMenu(false);
              }}
            >
              <Text style={[styles.menuItem, { color: "red" }]}>🗑 Xoá</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
    overflow: "hidden",
    marginBottom: 16,
  },
  coverImg: {
    width: "100%",
  },
  headerContent: {
    padding: 12,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    height: 125,
    gap: 5,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  classMeta: {
    color: "#eee",
  },
  newPostBtn: {
    backgroundColor: "#BBDEFB",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
  },
  postCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    marginTop: 12,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  postDate: {
    fontSize: 12,
    color: "#666",
  },
  postTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginTop: 4,
  },
  postContent: {
    marginTop: 6,
    fontSize: 13,
    color: "#333",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    minWidth: 140,
    elevation: 5,
  },
  menuItemBox: {
    paddingVertical: 8,
  },
  menuItem: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
