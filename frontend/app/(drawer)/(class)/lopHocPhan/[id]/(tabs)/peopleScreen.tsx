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
  ScrollView,
} from "react-native";
import { BASE_URL } from "@/constants/Link";
import AsyncStorage from "@react-native-async-storage/async-storage";

type User = {
  maSV: number;
  tenSV: string;
  avatar?: string;
};

type GiangVien = {
  maGV: number;
  tenGV: string;
  avatar?: string;
};

export default function PeopleScreen() {
  const { id } = useLopHocPhan();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [giangViens, setGiangViens] = useState<GiangVien[]>([]);

  const isGV = user?.role === 1;

  // Fetch danh sách giảng viên + sinh viên của lớp học phần
  const fetchData = async () => {
    try {
      const [gvRes, svRes] = await Promise.all([
        fetch(`${BASE_URL}/lophocphan/${id}/giangvien`).then((res) =>
          res.json()
        ),
        fetch(`${BASE_URL}/lophocphan/${id}/sinhvien`).then((res) =>
          res.json()
        ),
      ]);
      setGiangViens(gvRes || []);
      setUsers(svRes || []);
    } catch (err) {
      console.error("❌ Lỗi lấy danh sách:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [id])
  );

  // Thêm sinh viên hoặc giảng viên vào lớp (sử dụng router push tới màn riêng hoặc có thể làm Alert.prompt/email)
  const handleAdd = (type: "sinhvien" | "giangvien") => {
    router.push(`/nguoidung/add${type}?maLHP=${id}`);
  };

  // Xóa sinh viên khỏi lớp
  const handleRemoveSinhVien = (maSV: number) => {
  Alert.alert("Xác nhận", "Bạn có chắc muốn xóa sinh viên khỏi lớp?", [
    { text: "Hủy", style: "cancel" },
    {
      text: "Xóa",
      style: "destructive",
      onPress: async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            Alert.alert("Chưa đăng nhập!");
            return;
          }
          const res = await fetch(
            `${BASE_URL}/lophocphan/${id}/remove-sinhvien`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
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


  // Xóa giảng viên khỏi lớp
  const handleRemoveGiangVien = (maGV: number) => {
  // Không cho phép tự xóa bản thân
  if (user?.maGV === maGV) {
    Alert.alert("Bạn không thể xóa chính mình khỏi lớp này!");
    return;
  }

  Alert.alert("Xác nhận", "Bạn có chắc muốn xóa giảng viên khỏi lớp?", [
    { text: "Hủy", style: "cancel" },
    {
      text: "Xóa",
      style: "destructive",
      onPress: async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (!token) {
            Alert.alert("Chưa đăng nhập!");
            return;
          }
          const res = await fetch(
            `${BASE_URL}/lophocphan/${id}/remove-giangvien`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
              },
              body: JSON.stringify({ maGV }),
            }
          );
          const result = await res.json();
          if (res.ok) {
            Alert.alert("✅", "Đã xoá giảng viên");
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
    <ScrollView style={styles.container}>
      {/* Danh sách giảng viên */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>👨‍🏫 Giảng viên:</Text>
        {giangViens.length === 0 ? (
          <Text style={styles.noDataText}>
            Chưa có giảng viên trong lớp học phần này.
          </Text>
        ) : (
          giangViens.map((gv) => (
            <View key={gv.maGV} style={styles.giangVienCard}>
              <Image
                source={{
                  uri: gv.avatar || "https://i.pravatar.cc/300?u=gv" + gv.maGV,
                }}
                style={styles.avatar}
              />
              <Text style={styles.userName}>{gv.tenGV}</Text>
              {isGV && (
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveGiangVien(gv.maGV)}
                >
                  <Text style={styles.removeButtonText}>❌</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </View>

      {/* Nút thêm giảng viên/sinh viên */}
      {isGV && (
        <View style={styles.buttonContainer}>
          <Button
            title="📨 Mời giảng viên"
            onPress={() => handleAdd("giangvien")}
            color="#4666ec"
          />
          <Button
            title="📨 Mời sinh viên"
            onPress={() => handleAdd("sinhvien")}
            color="#00bcd4"
          />
        </View>
      )}

      {/* Danh sách sinh viên */}
      <Text style={[styles.cardTitle, { marginBottom: 8 }]}>👥 Sinh viên:</Text>
      {users.length === 0 ? (
        <Text style={styles.noDataText}>
          Không có sinh viên nào trong lớp học phần này.
        </Text>
      ) : (
        users.map((item) => (
          <View key={item.maSV} style={styles.userCard}>
            <Image
              source={{
                uri: item.avatar || "https://i.pravatar.cc/300?u=" + item.maSV,
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
        ))
      )}
      {/* Lưu ý: Nếu sinh viên nhiều, đổi sang FlatList (tương tự cũ) */}
    </ScrollView>
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
    color: "#aaa",
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 4,
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
    marginBottom: 8,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2a2a2a",
    padding: 10,
    marginBottom: 8,
    borderRadius: 6,
  },
  giangVienCard: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
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
    marginLeft: 8,
  },
  removeButtonText: {
    color: "#fff",
  },
});
