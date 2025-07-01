import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Alert, Button, FlatList, Text, View } from "react-native";

type User = { maSV: number; tenSV: string };
type GiangVien = { maGV: number; tenGV: string };

export default function PeopleScreen() {
  const { id } = useLopHocPhan();
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [gv, setGv] = useState<GiangVien | null>(null);

  const isGV = user?.role === 1;
  console.log(isGV);
  console.log(user);
  console.log(users);
  const fetchData = async () => {
    try {
      const res = await fetch(
        `http://192.168.1.104:3000/lophocphan/thanhphan?maLHP=${id}`
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
            `http://192.168.1.104:3000/lophocphan/${id}/add-${type}`,
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

  return (
    <View style={{ padding: 16 }}>
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
                padding: 10,
                backgroundColor: "#2a2a2a",
                marginBottom: 8,
                borderRadius: 6,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                {item.tenSV}
              </Text>
              <Text style={{ color: "#aaa" }}>Mã SV: {item.maSV}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}
