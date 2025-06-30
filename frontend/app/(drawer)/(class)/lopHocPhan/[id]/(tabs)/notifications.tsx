import { useLopHocPhan } from "@/context/_context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button } from "@react-navigation/elements";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

  const fetchTasks = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.104:3000/baiviet/loai?maLHP=${id}&loaiBV=1`
      );
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("❌ Lỗi khi gọi API:", err);
    }
  };

  const handleDelete = async (id: number) => {
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
        fetchTasks(); // Refresh lại danh sách
      } else {
        alert("❌ Xóa thất bại: " + result.message);
      }
    } catch (err) {
      console.error("❌ Lỗi khi xóa:", err);
      alert("Lỗi kết nối");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [id])
  );

  return (
    <>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item?.id?.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>
              {item.tieuDe || "📝 Không có tiêu đề"}
            </Text>
            <Text style={styles.meta}>Mã bài viết: {item.maBaiViet}</Text>
            <Text style={styles.meta}>
              Ngày tạo: {item.ngayTao ? item.ngayTao.slice(0, 10) : "Chưa có"}
            </Text>
            <Text style={styles.meta}>
              Hạn nộp:{" "}
              {item.ngayKetThuc ? item.ngayKetThuc.slice(0, 10) : "Không rõ"}
            </Text>
            <Text style={styles.content}>{item.noiDung}</Text>
            <TouchableOpacity
              style={{ marginTop: 8 }}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={{ color: "red" }}>🗑 Xóa bài viết</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <Button onPress={() => router.push(`/taobaitap?maLHP=${id}`)}>
        Tạo bài tập
      </Button>
    </>
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
