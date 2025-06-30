import { useLopHocPhan } from "@/context/_context";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

type BaiViet = {
  id: number;
  tieuDe: string;
  noiDung: string;
  ngayTao?: string | null;
  ngayKetThuc?: string | null;
  loaiBV: number;
  maBaiViet: string;
  trangThai: number;
};

export default function BaiTapScreen() {
  const { id } = useLopHocPhan();
  const [tasks, setTasks] = useState<BaiViet[]>([]);

  useEffect(() => {
    if (!id) {
      console.warn("⚠️ Thiếu ID lớp học phần");
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await fetch(`http://192.168.1.104:3000/baiviet/loai?maLHP=${id}&loaiBV=1`);
        const data = await res.json();
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
          <Text style={styles.title}>{item.tieuDe || "📝 Không có tiêu đề"}</Text>
          <Text style={styles.meta}>Mã bài viết: {item.maBaiViet}</Text>
          <Text style={styles.meta}>Ngày tạo: {item.ngayTao ? item.ngayTao.slice(0, 10) : "Chưa có"}</Text>
          <Text style={styles.meta}>Hạn nộp: {item.ngayKetThuc ? item.ngayKetThuc.slice(0, 10) : "Không rõ"}</Text>
          <Text style={styles.content}>{item.noiDung}</Text>
        </View>
      )}
    />
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
});
