import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, Alert, TextInput, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";

export default function AddLopHocPhan1() {
  const [lophocphanList, setLophocphanList] = useState([]); // Danh sách lớp học phần
  const [selectedLHP, setSelectedLHP] = useState(""); // Mã lớp học phần người dùng chọn
  const [userId, setUserId] = useState(null); // Lưu id sinh viên từ API
  const [loading, setLoading] = useState(false); // Loading state
  const [inputLHP, setInputLHP] = useState(""); // Trạng thái mã lớp học phần nhập vào

  // Lấy thông tin người dùng (Sinh viên) từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (res.ok) {
          const data = await res.json();
          if (data && data.ID) {
            setUserId(data.ID); // Lưu id sinh viên vào state
          } else {
            console.error("User data is invalid:", data);
          }
        } else {
          console.error("Error fetching user info:", res.status);
        }
      } catch (e) {
        console.error("Error fetching user info: ", e);
      }
    };

    fetchUserInfo();
  }, []); // Chạy một lần khi component mount

  // Lấy danh sách lớp học phần
  useEffect(() => {
    const fetchLopHocPhan = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/lophocphan/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error("Không thể lấy danh sách lớp học phần");
        }

        const data = await res.json();
        setLophocphanList(data);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể lấy danh sách lớp học phần");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLopHocPhan();
  }, []);

  const handleJoinLHP = async () => {
    if (!inputLHP) {
      Alert.alert("Lỗi", "Vui lòng nhập mã lớp học phần!");
      return;
    }

    const matchedLHP = lophocphanList.find((lophocphan) => lophocphan.MaLop === inputLHP);
    if (!matchedLHP) {
      Alert.alert("Lỗi", "Không tìm thấy lớp học phần với mã đã nhập.");
      return;
    }

    setSelectedLHP(matchedLHP.id); // Chọn lớp học phần nếu mã trùng khớp

    if (!userId) {
      Alert.alert("Lỗi", "Vui lòng đăng nhập lại để tham gia lớp học phần.");
      return;
    }

    const token = await AsyncStorage.getItem("token");
    try {
      const response = await fetch(`${BASE_URL}/api/sinhvien/lophocphan/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          studentId: userId,
          lophocphanId: selectedLHP,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", result.message || "Đã tham gia lớp học phần!");
      } else {
        Alert.alert("Lỗi", result.message || "Không thể tham gia lớp học phần.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tham gia lớp học phần.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chọn lớp học phần để tham gia</Text>

      {/* Nhập mã lớp học phần */}
      <Text>Mã lớp học phần:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TextInput
          value={inputLHP}
          onChangeText={setInputLHP}
          style={styles.input}
          placeholder="Nhập mã lớp học phần"
        />
      )}

      {/* Button để tham gia lớp học phần */}
      <Button title="Tham gia lớp học phần" onPress={handleJoinLHP} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f4f4f4",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
    paddingLeft: 10,
  },
});
