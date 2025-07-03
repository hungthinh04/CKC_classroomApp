import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button,
} from "react-native";
import { useAuth } from "@/stores/useAuth";
import { useNavigation } from "@react-navigation/native";

export default function BaiVietDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const navigation = useNavigation();
  const [baiViet, setBaiViet] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://192.168.1.101:3000/baiviet/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setBaiViet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch bài viết:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  if (!baiViet) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Không tìm thấy bài viết</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{baiViet.tieuDe}</Text>
      <Text style={styles.meta}>
        Người đăng: GV#{baiViet.maGV} –{" "}
        {baiViet.loaiBV === 1 ? "Bài tập" : "Bài viết"}
      </Text>
      {baiViet.hanNop && (
        <Text style={styles.deadline}>🕒 Hạn nộp: {baiViet.hanNop}</Text>
      )}
      <Text style={styles.content}>{baiViet.noiDung}</Text>

      {user?.quyen === 1 && baiViet.loaiBV === 1 && (
        <Button
          title="📤 Nộp bài"
          onPress={() => navigation.navigate("nopbai", { id: baiViet.id })}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#111" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
  },
  title: { color: "#fff", fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  meta: { color: "#aaa", fontStyle: "italic", marginBottom: 4 },
  deadline: { color: "#f87171", fontWeight: "600", marginBottom: 8 },
  content: { color: "#ddd", fontSize: 16, marginTop: 10 },
});
