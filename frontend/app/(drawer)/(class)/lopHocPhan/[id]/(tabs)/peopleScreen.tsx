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
} from "react-native";

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
      const res = await fetch(
        `http://192.168.1.101:3000/lophocphan/thanhphan?maLHP=${id}`
      );
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
          const res = await fetch(
            `http://192.168.1.101:3000/lophocphan/${id}/add-${type}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }),
            }
          );

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
              `http://192.168.1.104:3000/lophocphan/${id}/remove-sinhvien`,
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
    <View style={{ padding: 16 }}>
      {/* Hiển thị giảng viên */}
      {gv && (
        <View
          style={{
            marginBottom: 20,
            backgroundColor: "#1f2937",
            padding: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            👨‍🏫 Giảng viên: {gv.tenGV}
          </Text>
          <Text style={{ color: "#ccc" }}>Mã GV: {gv.maGV}</Text>
        </View>
      )}

      {/* Nút thêm người */}
      {isGV && (
        <View style={{ gap: 12, marginBottom: 12 }}>
          <Button
            title="📨 Mời giảng viên"
            onPress={() => router.push(`/addgiangvien?maLHP=${id}`)}
          />
          <Button
            title="📨 Mời sinh viên"
            onPress={() => router.push(`/addsinhvien?maLHP=${id}`)}
          />
        </View>
      )}

      {/* Danh sách sinh viên */}
      {users.length === 0 ? (
        <Text style={{ color: "#888" }}>
          Không có sinh viên nào trong lớp học phần này.
        </Text>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.maSV.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 10,
                backgroundColor: "#2a2a2a",
                marginBottom: 8,
                borderRadius: 6,
              }}
            >
              <Image
                source={{
                  uri:
                    item.avatar || "https://i.pravatar.cc/300?u=" + item.maSV,
                }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  marginRight: 12,
                  backgroundColor: "#444",
                }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {item.tenSV}
                </Text>
                <Text style={{ color: "#aaa" }}>Mã SV: {item.maSV}</Text>
              </View>
              {isGV && (
                <Button
                  title="❌ Xoá"
                  color="red"
                  onPress={() => handleRemoveSinhVien(item.maSV)}
                />
              )}
              <View style={{ flex: 1 }} />
            </View>
          )}
        />
      )}
    </View>
  );
}
