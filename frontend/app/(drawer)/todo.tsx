import { View, Text, StyleSheet, FlatList, Alert } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "@/constants/Link";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "@/stores/useAuth";

export default function TodoScreen() {
  const user = useAuth();
  const [baiTap, setBaiTap] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBaiTap = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${BASE_URL}/baiviet/canlam/${user?.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBaiTap(res.data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách bài tập:", err);
      Alert.alert("Lỗi", "Không thể tải bài tập cần làm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBaiTap();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📌 Danh sách bài tập cần làm</Text>
      {loading ? (
        <Text style={styles.emptyText}>Đang tải dữ liệu...</Text>
      ) : baiTap.length === 0 ? (
        <Text style={styles.emptyText}>Không có bài tập cần làm.</Text>
      ) : (
        <FlatList
          data={baiTap}
          keyExtractor={(item) => item.ID.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.TieuDe}</Text>
              <Text style={styles.cardContent}>{item.NoiDung}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#111", padding: 16 },
  title: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  emptyText: {
    textAlign: "center",
    color: "#8c98c5",
    fontSize: 15,
    marginTop: 25,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    marginHorizontal: 20,
    elevation: 5,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#273262",
  },
  cardContent: {
    marginTop: 8,
    fontSize: 14,
    color: "#3b415a",
  },
});
