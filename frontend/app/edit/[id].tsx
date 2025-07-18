import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { Picker } from '@react-native-picker/picker';
import { router, useLocalSearchParams } from "expo-router";

export default function EditLopHocPhan() {
  const { id } = useLocalSearchParams();
  const [tenLHP, setTenLHP] = useState("");
  const [hocKy, setHocKy] = useState(1);
  const [namHoc, setNamHoc] = useState(getCurrentYear());
  const [monHocList, setMonHocList] = useState([]);
  const [selectedMonHoc, setSelectedMonHoc] = useState(""); // Lưu ID
  const [loading, setLoading] = useState(false);

  function getCurrentYear() {
    const d = new Date(); const y = d.getFullYear(); const m = d.getMonth() + 1;
    return m >= 7 ? y + 1 : y;
  }

  // Fetch list môn học
  useEffect(() => {
    const fetchMonHoc = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/api/monhoc/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMonHocList(data);
      } catch (err) {
        Alert.alert("Lỗi", "Không thể lấy danh sách môn học");
      }
    };
    fetchMonHoc();
  }, []);

  // Fetch dữ liệu lớp học phần để fill form
  useEffect(() => {
    const fetchLHP = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/lophocphan/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTenLHP(data.tenLHP || "");
        setHocKy(data.hocKy || 1);
        setNamHoc(data.namHoc || getCurrentYear());
        setSelectedMonHoc(data.maMH?.toString() || "");
      } catch (err) {
        Alert.alert("Lỗi", "Không thể tải dữ liệu lớp học phần");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchLHP();
  }, [id]);

  const handleSubmit = async () => {
    if (!tenLHP.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên lớp học phần!");
      return;
    }
    const token = await AsyncStorage.getItem("token");
    const data = {
      tenLHP,
      hocKy,
      namHoc,
      maMH: Number(selectedMonHoc), // Ép kiểu số!
    };

    try {
      const response = await fetch(`${BASE_URL}/lophocphan/${id}`, {
        method: "PUT", // Sửa dùng PUT
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", result.message || "Đã cập nhật lớp học phần!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Lỗi", result.message || "Cập nhật lớp học phần thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể cập nhật lớp học phần.");
    }
  };

  if (loading) return <Text style={{ padding: 20 }}>Đang tải dữ liệu...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sửa lớp học phần</Text>
      <Text>Tên lớp học phần:</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên lớp học phần"
        value={tenLHP}
        onChangeText={setTenLHP}
      />
      <Text>Tên môn học:</Text>
      <Picker
        selectedValue={selectedMonHoc}
        onValueChange={(itemValue) => setSelectedMonHoc(itemValue)}
        style={styles.picker}
      >
        {monHocList.map((mh) => (
          <Picker.Item label={mh.TenMH} value={mh.maMH} key={mh.maMH} />
        ))}
      </Picker>
      <Text>Học kỳ:</Text>
      <Picker selectedValue={hocKy} onValueChange={setHocKy} style={styles.picker}>
        <Picker.Item label="Học kỳ 1" value={1} />
        <Picker.Item label="Học kỳ 2" value={2} />
      </Picker>
      <Text>Năm học:</Text>
      <TextInput style={styles.input} value={namHoc.toString()} editable={false} />
      <Button title="Cập nhật lớp học phần" onPress={handleSubmit} />
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
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 5,
  },
});
