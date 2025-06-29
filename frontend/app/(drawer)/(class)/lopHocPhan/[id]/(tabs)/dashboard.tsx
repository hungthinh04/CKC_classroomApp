import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ImageBackground,
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
  const { id } = useLopHocPhan();
  const [lop, setLop] = useState<LopHocPhan | null>(null);
  const [baiViet, setBaiViet] = useState<BaiViet[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://192.168.1.105:3000/lophocphan/${id}`);
        const res1 = await fetch(`http://192.168.1.105:3000/baiviet/${id}`);
        const data = await res.json();
        const data1 = await res1.json();

        setLop(data);
        setBaiViet(data1);
      } catch (err) {
        console.error("Lỗi khi lấy bài viết:", err);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {/* Header - nằm ngoài ScrollView để chiếm toàn chiều ngang */}
      <View style={styles.headerWrapper}>
        <ImageBackground
          source={require("../../../../../../assets/images/icon.png")}
          style={styles.headerBox}
          imageStyle={styles.imageStyle}
        >
          <View style={styles.overlayText}>
            <Text style={styles.headerTitle}>{lop?.tenLHP || "Tên lớp học"}</Text>
            <Text style={styles.headerSubtitle}>
              {lop ? `HK${lop.hocKy} - Năm học: ${lop.namHoc}` : "HK - Năm học:"}
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* Nội dung cuộn */}
      <ScrollView style={styles.container}>
        <View style={styles.bodyContainer}>
          <TouchableOpacity
            style={styles.newPostButton}
            onPress={() => router.push("/taobaiviet")}
          >
            <Ionicons name="create-outline" size={18} color="#1a73e8" />
            <Text style={styles.newPostText}>Thông báo mới</Text>
          </TouchableOpacity>

          {baiViet.length === 0 ? (
            <Text style={{ textAlign: "center", color: "#666" }}>
              Chưa có bài viết nào.
            </Text>
          ) : (
            baiViet.map((bv) => (
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
                  <Text style={styles.postDate}>
                    {bv.NgayTao
                      ? new Date(bv.NgayTao).toLocaleDateString("vi-VN")
                      : "Không rõ"}
                  </Text>
                </View>
                <Text style={styles.postTitle}>{bv.TieuDe}</Text>
                <Text style={styles.postContent}>{bv.NoiDung}</Text>
                <TouchableOpacity>
                  <Text style={styles.commentAction}>
                    Thêm nhận xét trong lớp học
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {user?.quyen === 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/taobaiviet")}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
  },
  headerWrapper: {
    backgroundColor: "#000", // fallback khi ảnh chưa load
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    overflow: "hidden",
  },
  headerBox: {
    width: "100%",
    height: 140,
   
  },
  overlayText: {
    position: "absolute",
    top: 12,
    left: 12,
  },
  imageStyle: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  headerSubtitle: {
    color: "#fff",
    fontSize: 14,
  },
  bodyContainer: {
    paddingHorizontal: 12,
  },
  newPostButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#e8f0fe",
    paddingVertical: 12,
    borderRadius: 999,
    marginBottom: 16,
    width: "100%",
    alignSelf: "center",
  },
  newPostText: {
    marginLeft: 8,
    color: "#1a73e8",
    fontWeight: "bold",
    fontSize: 14,
  },
  postCard: {
    backgroundColor: "#f1f3f4",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  commentAction: {
    marginTop: 12,
    color: "#5f6368",
    fontSize: 13,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    paddingTop: 10,
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
