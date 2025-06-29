import { useLopHocPhan } from "@/context/_context";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";

export default function PeopleScreen() {
  const { id, tenLHP } = useLopHocPhan();
  type User = {
    maSV: string;
    hoSV: string;
    tenSV: string;
    // add other fields if needed
  };
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (!id) return;
    fetch(`http://192.168.1.105:3001/sinhvien_lhp?maLHP=${id}`)
      .then((res) => res.json())
      .then(async (list) => {
        const svs = await Promise.all(
          list.map(async (item: any) => {
            const res = await fetch(
              `http://192.168.1.105:3001/sinhvien?maSV=${item.maSV}`
            );
            const [sv] = await res.json();
            return sv;
          })
        );
        setUsers(svs);
      });
  }, [id]);

  return (
    <FlatList
      contentContainerStyle={{ padding: 16 }}
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
            {item.hoSV} {item.tenSV}
          </Text>
          <Text style={{ color: "#aaa" }}>Mã SV: {item.maSV}</Text>
        </View>
      )}
    />
  );
}
