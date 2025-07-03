import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
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
  const { user } = useAuth();
  const fetchData = async () => {
    try {
      const res = await fetch(`http://192.168.1.104:3000/lophocphan/${id}`);
      const res1 = await fetch(`http://192.168.1.104:3000/baiviet/${id}`);

      const data = await res.json();
      const data1 = await res1.json();

      setLop(data);
      setBaiViet(data1);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
    }
  };

  
  const handleDelete = (id: number) => {
  Alert.alert(
    "Xác nhận xóa",
    "Bạn có chắc chắn muốn xóa bài viết này?",
    [
      {
        text: "Hủy",
        style: "cancel",
      },
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
              fetchData(); // làm mới lại danh sách
            } else {
              alert("❌ Xóa thất bại: " + result.message);
            }
          } catch (err) {
            console.error("❌ Lỗi khi xóa:", err);
            alert("Lỗi kết nối");
          }
        },
      },
    ]
  );
};

  useFocusEffect(
    useCallback(() => {
      if (id) fetchData();
    }, [id])
  );

  // if (!lop) return null;
  console.log(id, tenLHP, baiViet);
  return (
    <ScrollView style={styles.container}>
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

      {/* Danh sách bài viết */}
      <TouchableOpacity
        style={styles.newPostBtn}
        onPress={() => router.push(`/tao/taobaiviet?maLHP=${id}`)}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          <Ionicons
            name="pencil"
            size={13}
            style={{ width: 20 }}
            color="white"
          />{" "}
          Thông báo mới
        </Text>
      </TouchableOpacity>
      {baiViet.filter((bv) => bv.LoaiBV === 0).length === 0 ? (
        <Text style={{ textAlign: "center", color: "#666" }}>
          Chưa có bài viết nào.
        </Text>
      ) : (
        baiViet
          .filter((bv) => bv.LoaiBV === 0) // 👈 Chỉ lấy bài viết LoaiBV === 0
          .map((bv) => (
            <TouchableOpacity
              key={bv.ID}
              style={styles.postCard}
              onPress={() => router.push(`../../../../(bv)/baiviet/${bv.ID}`)}
            >
              <View style={styles.postHeader}>
                <View style={styles.avatar}>
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    {user?.email?.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View>
                  <Text style={styles.postDate}>
                    {bv.NgayTao
                      ? new Date(bv.NgayTao).toLocaleDateString("vi-VN")
                      : "Không rõ"}
                  </Text>
                </View>
              </View>
              <Text style={styles.postTitle}>{bv.TieuDe}</Text>
              <Text style={styles.postContent}>{bv.NoiDung}</Text>
                <TouchableOpacity
              style={{ marginTop: 8 }}
              onPress={() => handleDelete(bv.ID)}
            >
              <Text style={{ color: "red" }}>🗑 Xóa bài viết</Text>
            </TouchableOpacity>
            </TouchableOpacity>
          ))
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
    backgroundColor: "#e0e7ff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 16,
  },
  coverImg: {
    height: 100,
    width: "100%",
    resizeMode: "cover",
  },
  headerContent: {
    padding: 12,
  },
  className: {
    fontSize: 18,
    fontWeight: "bold",
  },
  classMeta: {
    color: "#555",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  postCard: {
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
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

  newPostBtn: {
    backgroundColor: "#6a63ee",
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 16,
  },

  postAuthor: {
    fontWeight: "bold",
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
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#4f46e5",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});
