import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { BASE_URL } from "@/constants/Link";

type User = {
  maSV: number;
  tenSV: string;
  avatar?: string;
};

type GiangVien = {
  maGV: number;
  tenGV: string;
};

export default function PeopleScreen() {
  const { id } = useLopHocPhan();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [gv, setGv] = useState<GiangVien | null>(null);

  const isGV = user?.role === 1;

  const fetchData = async () => {
    try {
      const res = await fetch(`${BASE_URL}/lophocphan/thanhphan?maLHP=${id}`);
      const data = await res.json();
      setUsers(data.sinhViens || []);
      setGv(data.giangVien || null);
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [id])
  );

  const handleAdd = (type: "sinhvien" | "giangvien") => {
    Alert.prompt(
      `Thêm ${type === "sinhvien" ? "sinh viên" : "giảng viên"}`,
      "Nhập email người dùng:",
      async (email) => {
        if (!email) return;

        try {
          const res = await fetch(`${BASE_URL}/lophocphan/${id}/add-${type}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          const result = await res.json();
          if (res.ok) {
            Alert.alert("✅ Thành công", result.message);
            fetchData();
          } else {
            Alert.alert("❌ Thất bại", result.message || "Có lỗi xảy ra");
          }
        } catch (err) {
          Alert.alert("❌ Lỗi kết nối", "Không thể kết nối máy chủ");
        }
      }
    );
  };

  const handleRemoveSinhVien = (maSV: number) => {
    Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sinh viên khỏi lớp?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await fetch(
              `${BASE_URL}/lophocphan/${id}/remove-sinhvien`,
              {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ maSV }),
              }
            );
            const result = await res.json();
            if (res.ok) {
              Alert.alert("✅", "Đã xoá sinh viên");
              fetchData();
            } else {
              Alert.alert("❌", result.message || "Lỗi xảy ra");
            }
          } catch (err) {
            Alert.alert("❌", "Không thể kết nối máy chủ");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Hiển thị giảng viên */}
      {gv && (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>👨‍🏫 Giảng viên: {gv.tenGV}</Text>
          <Text style={styles.cardText}>Mã GV: {gv.maGV}</Text>
        </View>
      )}

      {/* Nút thêm người */}
      {isGV && (
        <View style={styles.buttonContainer}>
          <Button
            title="📨 Mời giảng viên"
            onPress={() => router.push(`/nguoidung/addgiangvien?maLHP=${id}`)}
            color="#4666ec"
          />
          <Button
            title="📨 Mời sinh viên"
            onPress={() => router.push(`/nguoidung/addsinhvien?maLHP=${id}`)}
            color="#00bcd4"
          />
        </View>
      )}

      {/* Danh sách sinh viên */}
      {users.length === 0 ? (
        <Text style={styles.noDataText}>
          Không có sinh viên nào trong lớp học phần này.
        </Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.maSV.toString()}
          renderItem={({ item }) => (
            <View style={styles.userCard}>
              <Image
                source={{
                  uri:
                    item.avatar || "https://i.pravatar.cc/300?u=" + item.maSV,
                }}
                style={styles.avatar}
              />
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.tenSV}</Text>
                <Text style={styles.userId}>Mã SV: {item.maSV}</Text>
              </View>
              {isGV && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveSinhVien(item.maSV)}
                >
                  <Text style={styles.removeButtonText}>❌ Xoá</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#fff",
    flex: 1,
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#1f2937",
    padding: 12,
    borderRadius: 8,
  },
  cardTitle: {
    color: "#fff",
    fontWeight: "bold",
  },
  cardText: {
    color: "#ccc",
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 12,
  },
  noDataText: {
    color: "#888",
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: "#444",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: "#fff",
    fontWeight: "bold",
  },
  userId: {
    color: "#aaa",
  },
  removeButton: {
    backgroundColor: "#e57373",
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  removeButtonText: {
    color: "#fff",
  },
});
