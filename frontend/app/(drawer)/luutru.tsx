import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { useNavigation } from "expo-router";

const LhpLuuTruScreen = () => {
  const [lophocphanLuuTru, setLophocphanLuuTru] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchLhpLuuTru = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const res = await fetch(`${BASE_URL}/lophocphan/luutru`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
console.log(data, "Dữ liệu lớp học phần đã lưu trữ:"); // Debug log để kiểm tra dữ liệu trả về
        // Kiểm tra xem dữ liệu trả về có phải là mảng không
        if (Array.isArray(data)) {
          setLophocphanLuuTru(data);  // Nếu là mảng thì cập nhật state
        } else {
          console.error("Dữ liệu không phải mảng:", data);
          setLophocphanLuuTru([]);  // Trường hợp không phải mảng, set là mảng rỗng
        }
      } catch (error) {
        console.error("Error fetching LHP:", error);
        Alert.alert("Lỗi", "Không thể tải danh sách lớp học phần đã lưu trữ.");
        setLophocphanLuuTru([]);  // Khi có lỗi, set mảng rỗng
      }
    };

    fetchLhpLuuTru();
  }, []);

  const handleCardPress = (id) => {
    navigation.push({
      pathname: "/lophocphan/detail",
      params: { id },
    });
  };

  // Hàm xử lý bỏ lưu trữ
  const handleBoLuuTru = async (cls) => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/lophocphan/${cls.id}/bo-luu-tru`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const result = await res.json();
      if (result.success) {
        Alert.alert("Thành công", "Đã bỏ lưu trữ lớp học phần!");
        navigation.navigate("HomeScreen"); // Quay lại trang HomeScreen
      } else {
        Alert.alert("Lỗi", result.message || "Không thể bỏ lưu trữ.");
      }
    } catch (err) {
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái.");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Các lớp học phần đã lưu trữ</Text>

      {Array.isArray(lophocphanLuuTru) && lophocphanLuuTru.length === 0 ? (
        <Text style={styles.noDataText}>Không có lớp học phần đã lưu trữ.</Text>
      ) : (
        // Đảm bảo rằng lophocphanLuuTru là mảng trước khi gọi map
        Array.isArray(lophocphanLuuTru) && lophocphanLuuTru.length > 0 ? (
          lophocphanLuuTru.map((cls) => (
            <View key={cls.id} style={styles.card}>
              <TouchableOpacity
                style={styles.cardContent}
                onPress={() => handleCardPress(cls.id)}
              >
                <Text style={styles.className}>{cls.tenLHP}</Text>
                <Text style={styles.classTerm}>HK{cls.hocKy} - Năm học: {cls.namHoc}</Text>
              </TouchableOpacity>

              {/* Nút Bỏ lưu trữ */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleBoLuuTru(cls)}
              >
                <Ionicons name="archive-outline" size={18} color="#fff" />
                <Text style={styles.removeButtonText}>Bỏ lưu trữ</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDataText}>Dữ liệu không hợp lệ hoặc không có lớp học phần.</Text>
        )
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  className: {
    fontSize: 16,
    fontWeight: "bold",
  },
  classTerm: {
    fontSize: 14,
    color: "#777",
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4ae3a",
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginTop: 10,
    justifyContent: "center",
  },
  removeButtonText: {
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 6,
  },
  noDataText: {
    textAlign: "center",
    fontSize: 16,
    color: "#777",
  },
});

export default LhpLuuTruScreen;
