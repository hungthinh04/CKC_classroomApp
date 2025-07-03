import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Text,
  View,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
  const [gv, setGv] = useState<GiangVien | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [addType, setAddType] = useState<"sinhvien" | "giangvien" | null>(null);
  const [inputEmail, setInputEmail] = useState("");

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

  const openAddModal = (type: "sinhvien" | "giangvien") => {
    setAddType(type);
    setInputEmail("");
    setShowModal(true);
  };

  const handleAddUser = async () => {
    if (!inputEmail || !addType) return;
    try {
      const res = await fetch(
        `http://192.168.1.101:3000/lophocphan/${id}/add-${addType}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: inputEmail }),
        }
      );
      const result = await res.json();
      if (res.ok) {
        Alert.alert("✅ Thành công", result.message);
        setShowModal(false);
        fetchData();
      } else {
        Alert.alert("❌ Thất bại", result.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      Alert.alert("❌ Lỗi kết nối", "Không thể kết nối máy chủ");
    }
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
              `http://192.168.1.101:3000/lophocphan/${id}/remove-sinhvien`,
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
    <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 8 }}>
      {/* Giảng viên */}
      <View style={{ paddingHorizontal: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Giáo viên</Text>
          {isGV && (
            <TouchableOpacity onPress={() => openAddModal("giangvien")}>
              <Ionicons name="person-add-outline" size={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>

        {gv && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
            }}
          >
            <Image
              source={{
                uri: gv.avatar || "https://i.pravatar.cc/300?u=" + gv.maGV,
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 12,
              }}
            />
            <Text>{gv.tenGV}</Text>
          </View>
        )}
      </View>

      {/* Học viên */}
      <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={{ fontWeight: "bold", fontSize: 16 }}>Học viên</Text>
          {isGV && (
            <TouchableOpacity onPress={() => openAddModal("sinhvien")}>
              <Ionicons name="person-add-outline" size={20} color="#333" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8 }}
        data={users}
        keyExtractor={(item) => item.maSV.toString()}
        renderItem={({ item }) => (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 10,
              borderBottomColor: "#eee",
              borderBottomWidth: 1,
            }}
          >
            <Image
              source={{
                uri: item.avatar || "https://i.pravatar.cc/300?u=" + item.maSV,
              }}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                marginRight: 12,
              }}
            />
            <Text style={{ flex: 1 }}>{item.tenSV}</Text>
            {isGV && (
              <TouchableOpacity onPress={() => handleRemoveSinhVien(item.maSV)}>
                <Ionicons name="ellipsis-vertical" size={20} color="#555" />
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Modal nhập email */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setShowModal(false)}
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 12,
              width: "80%",
            }}
          >
            <Text style={{ fontWeight: "bold", marginBottom: 10 }}>
              {addType === "sinhvien"
                ? "📨 Thêm sinh viên"
                : "📨 Thêm giảng viên"}
            </Text>
            <TextInput
              placeholder="Nhập email người dùng..."
              value={inputEmail}
              onChangeText={setInputEmail}
              style={{
                borderWidth: 1,
                borderColor: "#ccc",
                borderRadius: 8,
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginBottom: 12,
              }}
            />
            <TouchableOpacity
              onPress={handleAddUser}
              style={{
                backgroundColor: "#0288d1",
                paddingVertical: 10,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: "#fff", textAlign: "center" }}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
