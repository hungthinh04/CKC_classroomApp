import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Linking,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useAuth } from "@/stores/useAuth";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";

export default function BaiVietDetail() {
  const { id } = useLocalSearchParams(); // Lấy ID từ tham số của URL
  const { user } = useAuth();
  const navigation = useNavigation();
  const [baiViet, setBaiViet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");

  const isImage = (url: string) => url.match(/\.(jpeg|jpg|png|gif|webp)$/i);

  useEffect(() => {
    fetch(`${BASE_URL}/baiviet/id/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dữ liệu bài viết:", data);

        setBaiViet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi fetch bài viết:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    if (baiViet?.ID) {
      fetch(`${BASE_URL}/baiviet/${baiViet.ID}/comments`)
        .then((res) => res.json())

        .then((data) => {
          console.log("Dữ liệu nhận xét:", data); // Kiểm tra dữ liệu nhận được
          setComments(data);
        })
        .catch((err) => console.error("❌ Lỗi lấy comments:", err));
    }
  }, [baiViet?.ID]);

  const submitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("❌ Lỗi", "Nhận xét không được để trống");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const postId = parseInt(String(baiViet?.ID));
      console.log(postId);
      if (!postId) return;

      const res = await fetch(`${BASE_URL}/baiviet/${postId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noiDung: newComment }),
      });
      console.log("Gửi nhận xét:", baiViet.ID, newComment, token);

      if (res.ok) {
        setNewComment("");
        const fresh = await fetch(`${BASE_URL}/baiviet/${baiViet.ID}/comments`);
        setComments(await fresh.json());
      } else {
        Alert.alert("❌ Lỗi", "Không thể gửi nhận xét");
      }
    } catch (err) {
      console.error("❌ Gửi nhận xét lỗi:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#888" />
      </View>
    );
  }

  console.log(comments);
  if (!baiViet) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#fff" }}>Không tìm thấy bài viết</Text>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Text style={styles.title}>{baiViet.tieuDe}</Text>
      <Text style={styles.meta}>
        Người đăng: {baiViet.tenNguoiDang || "Không rõ"} – 🕒{" "}
        {new Date(baiViet.ngayTao).toLocaleString("vi-VN")}
      </Text>

      <Text style={styles.content}>{baiViet.noiDung}</Text>

      {baiViet.fileUrl &&
        (isImage(baiViet.fileUrl) ? (
          <Image
            source={{ uri: baiViet.fileUrl }}
            style={{
              width: "100%",
              height: 200,
              marginTop: 12,
              borderRadius: 8,
            }}
            resizeMode="contain"
          />
        ) : (
          <Text
            style={styles.fileLink}
            onPress={() => Linking.openURL(baiViet.fileUrl)}
          >
            📎 Tải tệp đính kèm
          </Text>
        ))}

      <Text style={styles.commentTitle}>💬 Nhận xét</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.ID.toString()}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentUser}>
              {item.Quyen === 1
                ? `${item.TenNguoiDung} (Giảng viên)` // Nếu là giảng viên, hiển thị "Giảng viên"
                : `${item.TenNguoiDung} (Sinh viên)`}
            </Text>
            <Text style={styles.commentText}>{item.NoiDung}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#aaa", fontStyle: "italic" }}>
            Chưa có nhận xét
          </Text>
        }
        style={{ marginBottom: 8 }}
      />

      <View style={styles.commentBox}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder="Nhập nhận xét..."
          placeholderTextColor="#888"
          style={styles.commentInput}
        />
        <TouchableOpacity onPress={submitComment}>
          <Text style={styles.sendBtn}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
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
  content: { color: "#ddd", fontSize: 16, marginTop: 10 },
  fileLink: {
    color: "#4ADE80",
    marginTop: 12,
    textDecorationLine: "underline",
  },
  commentTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 8,
  },
  commentItem: { marginBottom: 6 },
  commentUser: { color: "#60a5fa", fontWeight: "600" },
  commentText: { color: "#ddd", marginLeft: 4 },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingTop: 8,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#222",
    color: "#fff",
    padding: 8,
    borderRadius: 6,
    marginRight: 8,
  },
  sendBtn: {
    fontSize: 20,
    color: "#4ade80",
  },
});
