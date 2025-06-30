import { useLopHocPhan } from "@/context/_context";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

type User = { maSV: number; tenSV: string };
type GiangVien = { maGV: number; tenGV: string };

export default function PeopleScreen() {
  const { id } = useLopHocPhan();
  const [users, setUsers] = useState<User[]>([]);
  const [gv, setGv] = useState<GiangVien | null>(null);

  useEffect(() => {
    if (!id) return;

    fetch(`http://192.168.1.104:3000/lophocphan/thanhphan?maLHP=${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("📦 Dữ liệu API trả về:", data);
        setUsers(data.sinhViens || []);
        setGv(data.giangVien || null);
      });
  }, [id]);

  return (
    <View style={{ padding: 16 }}>
      {gv && (
        <View style={{ marginBottom: 20, backgroundColor: "#1f2937", padding: 12, borderRadius: 8 }}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>👨‍🏫 Giảng viên: {gv.tenGV}</Text>
          <Text style={{ color: "#ccc" }}>Mã GV: {gv.maGV}</Text>
        </View>
      )}

      {users.length === 0 && (
        <Text style={{ color: "#888" }}>Không có sinh viên nào trong lớp học phần này.</Text>
      )}

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
            <Text style={{ color: "#fff", fontWeight: "bold" }}>{item.tenSV}</Text>
            <Text style={{ color: "#aaa" }}>Mã SV: {item.maSV}</Text>
          </View>
        )}
      />
    </View>
  );
}
