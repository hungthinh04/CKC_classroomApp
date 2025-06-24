import { useLopHocPhan } from "@/context/_context";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { API_BASE_URL } from "@/constants/api";
type BaiViet = {
  id: number;
  tieuDe: string;
  noiDung: string;
  ngayKetThuc?: string;
  loaiBV: number;
  maLHP: number;
};

export default function BaiTapScreen() {
  const { id, tenLHP } = useLopHocPhan();
  console.log("🔥 Tab Notifications ID:", id);

  const [tasks, setTasks] = useState<BaiViet[]>([]);

  useEffect(() => {
    if (!id) {
      console.warn("⚠️ Thiếu ID lớp học phần");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          `${API_BASE_URL}/baiviet?maLHP=${id}&loaiBV=1`
        );
        const data = await res.json();
        console.log("📦 Dữ liệu bài tập:", data);
        setTasks(data);
      } catch (err) {
        console.error("❌ Lỗi khi gọi API:", err);
      }
    };

    fetchTasks();
  }, [id]);

  return (
    <FlatList
      data={tasks}
      keyExtractor={(item) => item?.id?.toString()}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.iconCircle}>
              <Text style={styles.iconText}>📄</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item?.tieuDe || "Không có tiêu đề"}</Text>
              <Text style={styles.date}>
                Hạn: {item?.ngayKetThuc ? item.ngayKetThuc.slice(0, 10) : "Không rõ"}
              </Text>
            </View>
          </View>
        </View>

      )}
    />
  );
}
const styles = StyleSheet.create({
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12, // Nếu chưa hỗ trợ thì dùng marginRight trong iconCircle
  },

  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12, // <-- đảm bảo cách đều
  },


  iconText: {
    fontSize: 18,
    color: "#fff",
  },

  title: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#111",
  },

  date: {
    color: "#6b7280",
    marginTop: 4,
    fontSize: 13,
  },

  card: {
    backgroundColor: "#f8fafc", // sáng nhẹ
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },


});