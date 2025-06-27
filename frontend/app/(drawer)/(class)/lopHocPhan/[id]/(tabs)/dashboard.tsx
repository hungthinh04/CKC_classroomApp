import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type BaiViet = {
  ID: number;
  tieuDe: string;
  noiDung: string;
  loaiBV: string;
  NgayTao?: string;
  maLHP: number;
  maGV: number;

};

export default function LopHocPhanDetail() {
  const { id, tenLHP } = useLopHocPhan();
  const [lop, setLop] = useState<any>(null);
  const [baiViet, setBaiViet] = useState<BaiViet[]>([]);
  const { user } = useAuth();
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
    try {
      const res = await fetch(`http://192.168.1.104:3000/baiviet?maLHP=${id}`);
      const data = await res.json();
      setBaiViet(data);
    } catch (err) {
      console.error("Lỗi khi lấy bài viết:", err);
    }
  };
    fetchData();
  }, [id]);

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
<Text style={styles.classMeta}>GV: {user?.email}</Text><Text style={styles.classMeta}>
  Ngày tạo: {baiViet[0]?.NgayTao ? new Date(baiViet[0].NgayTao).toLocaleDateString('vi-VN') : "Không rõ"}
</Text>

        </View>
      </View>

      {/* Danh sách bài viết */}
      <Text style={styles.sectionTitle}>Bảng tin lớp học</Text>
      {baiViet.map((bv) => (
        <TouchableOpacity
          key={bv.ID}
          style={styles.postCard}
          onPress={() => router.push(`../../../../(bv)/baiviet/${bv.ID}`)}
        >
          <View style={styles.postHeader}>
            <View style={styles.avatar}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {/* {lop.tenGV?.charAt(0)} */}
              </Text>
            </View>
            <View>
              {/* <Text style={styles.postAuthor}>{lop.tenGV}</Text> */}
              <Text style={styles.postDate}>
                {new Date(bv.ngayTao).toLocaleDateString()}
              </Text>
            </View>
          </View>
          <Text style={styles.postTitle}>{bv.tieuDe}</Text>
          <Text style={styles.postContent}>{bv.noiDung}</Text>
        </TouchableOpacity>
      ))}

      {user?.quyen === 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push("/taobaiviet")}
        >
          <Ionicons name="add" size={28} color="white" />
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
