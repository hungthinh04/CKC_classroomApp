import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { Picker } from '@react-native-picker/picker';
import { router } from "expo-router";

export default function AddLopHocPhan() {
  const [tenLHP, setTenLHP] = useState("");
  const [hocKy, setHocKy] = useState(1);
  const [namHoc, setNamHoc] = useState(getCurrentYear());
 const [monHocList, setMonHocList] = useState([]);
const [selectedMonHoc, setSelectedMonHoc] = useState(""); // Lưu ID

  function getCurrentYear() {
    const d = new Date(); const y = d.getFullYear(); const m = d.getMonth() + 1;
    return m >= 7 ? y + 1 : y;
  }

  useEffect(() => {
  const fetchMonHoc = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/api/monhoc/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMonHocList(data);
      if (data.length > 0) setSelectedMonHoc(data[0].maMH); // Lưu ý: dùng maMH (ID)
    } catch (err) {
      Alert.alert("Lỗi", "Không thể lấy danh sách môn học");
    }
  };
  fetchMonHoc();
}, []);

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
  maMH: Number(selectedMonHoc), // ÉP KIỂU SỐ! Quan trọng!
};

    console.log(data, "Dữ liệu gửi đi");
    try {
      const response = await fetch(`${BASE_URL}/lophocphan/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        Alert.alert("Thành công", result.message || "Đã tạo lớp học phần!", [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ]);
        // Có thể reset form tại đây nếu muốn nhập thêm
        setTenLHP(""); setHocKy(1); setNamHoc(getCurrentYear());
      } else {
        Alert.alert("Lỗi", result.message || "Tạo lớp học phần thất bại");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể tạo lớp học phần.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm lớp học phần</Text>
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
      <Button title="Tạo lớp học phần" onPress={handleSubmit} />
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
