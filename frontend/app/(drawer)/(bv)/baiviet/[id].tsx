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
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/stores/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";

export default function BaiVietDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [baiViet, setBaiViet] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState<any>(null);

  const isImage = (url: string) => url.match(/\.(jpeg|jpg|png|gif|webp)$/i);

  const fetchComments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/baiviet/${baiViet.ID}/comments`);
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error("❌ Lỗi lấy nhận xét:", err);
    }
  };

  useEffect(() => {
    fetch(`${BASE_URL}/baiviet/id/${id}`)
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

  useEffect(() => {
    if (baiViet?.ID) {
      fetchComments();
    }
  }, [baiViet?.ID]);

  const submitComment = async () => {
    if (!newComment.trim()) {
      Alert.alert("❌ Lỗi", "Nhận xét không được để trống");
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Vui lòng đăng nhập lại");
        return;
      }

      if (editingComment) {
        // Cập nhật comment
        const res = await fetch(`${BASE_URL}/api/comments/${editingComment.ID}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ noiDung: newComment }),
        });

        if (res.ok) {
          setComments((prev) =>
            prev.map((c) =>
              c.ID === editingComment.ID ? { ...c, NoiDung: newComment } : c
            )
          );
          setNewComment("");
          setEditingComment(null);
        } else {
          Alert.alert("❌ Lỗi", "Không thể cập nhật nhận xét");
        }
      } else {
        // Thêm comment mới
        const postId = parseInt(String(baiViet?.ID));
        const res = await fetch(`${BASE_URL}/baiviet/${postId}/comment`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ noiDung: newComment }),
        });

        if (res.ok) {
          setNewComment("");
          fetchComments();
        } else {
          Alert.alert("❌ Lỗi", "Không thể gửi nhận xét");
        }
      }
    } catch (err) {
      console.error("❌ Lỗi gửi nhận xét:", err);
    }
  };

  const handleDelete = async (commentId: number) => {
    Alert.alert("Xác nhận xoá", "Bạn có chắc muốn xoá nhận xét này?", [
      { text: "Huỷ", style: "cancel" },
      {
        text: "Xoá",
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
              Alert.alert("Vui lòng đăng nhập lại");
              return;
            }

            const res = await fetch(`${BASE_URL}/api/comments/${commentId}`, {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (res.ok) {
              setComments((prev) => prev.filter((c) => c.ID !== commentId));
              if (editingComment?.ID === commentId) {
                setEditingComment(null);
                setNewComment("");
              }
            } else {
              Alert.alert("Lỗi", "Không thể xoá nhận xét");
            }
          } catch (err) {
            console.error("❌ Lỗi khi xoá:", err);
          }
        },
      },
    ]);
  };

  const handleEdit = (comment: any) => {
    setNewComment(comment.NoiDung);
    setEditingComment(comment);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6e81f3" />
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Bài viết chính */}
      <View style={styles.mainCard}>
        <Text style={styles.title}>{baiViet.tieuDe}</Text>
        <Text style={styles.meta}>
          Người đăng: {baiViet.tenNguoiDang || "Không rõ"} ·{" "}
          <Ionicons name="time-outline" size={13} color="#bbb" />
          {" "}
          {new Date(baiViet.ngayTao).toLocaleString("vi-VN")}
        </Text>
        <Text style={styles.content}>{baiViet.noiDung}</Text>

        {baiViet.fileUrl &&
          (isImage(baiViet.fileUrl) ? (
            <Image
              source={{ uri: baiViet.fileUrl }}
              style={styles.postImage}
              resizeMode="cover"
            />
          ) : (
            <TouchableOpacity onPress={() => Linking.openURL(baiViet.fileUrl)}>
              <Text style={styles.fileLink}>
                <Ionicons name="attach-outline" size={15} color="#4ade80" /> Tệp đính kèm
              </Text>
            </TouchableOpacity>
          ))}
      </View>

      {/* Nhận xét */}
      <Text style={styles.commentTitle}>💬 Nhận xét</Text>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.ID.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View style={styles.commentAvatar}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  {item.HoTen ? item.HoTen.charAt(0).toUpperCase() : "U"}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.commentUser}>{item.HoTen}</Text>
                <Text style={styles.commentMeta}>
                  {new Date(item.NgayTao).toLocaleString("vi-VN")}
                </Text>
              </View>
              {item.MaTK === user.id && (
                <View style={styles.commentActions}>
                  <TouchableOpacity
                    onPress={() => handleEdit(item)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="create-outline" size={19} color="#60a5fa" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item.ID)}
                    style={styles.iconBtn}
                  >
                    <Ionicons name="trash-outline" size={19} color="#f87171" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text style={styles.commentText}>{item.NoiDung}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ color: "#aaa", fontStyle: "italic", textAlign: "center" }}>
            Chưa có nhận xét
          </Text>
        }
        style={{ marginBottom: 8 }}
      />

      <View style={styles.commentBox}>
        <TextInput
          value={newComment}
          onChangeText={setNewComment}
          placeholder={
            editingComment
              ? "Chỉnh sửa nhận xét..."
              : "Nhập nhận xét mới..."
          }
          placeholderTextColor="#aaa"
          style={styles.commentInput}
          multiline
        />
        <TouchableOpacity onPress={submitComment} style={styles.sendBtn}>
          <Ionicons
            name={editingComment ? "checkmark-done-outline" : "send-outline"}
            size={21}
            color="#fff"
          />
        </TouchableOpacity>
        {editingComment && (
          <TouchableOpacity
            onPress={() => {
              setEditingComment(null);
              setNewComment("");
            }}
            style={[styles.sendBtn, { backgroundColor: "#222", marginLeft: 5 }]}
          >
            <Ionicons name="close-outline" size={21} color="#f87171" />
          </TouchableOpacity>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 0, backgroundColor: "#161b24" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#161b24",
  },
  mainCard: {
    backgroundColor: "#232d44",
    borderRadius: 16,
    padding: 19,
    margin: 16,
    shadowColor: "#181e35",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    color: "#fff",
    fontSize: 21,
    fontWeight: "bold",
    marginBottom: 7,
    letterSpacing: 0.3,
  },
  meta: {
    color: "#b5badb",
    fontSize: 13.5,
    marginBottom: 12,
    fontStyle: "italic",
    flexDirection: "row",
    alignItems: "center",
  },
  content: {
    color: "#e7ebff",
    fontSize: 16.5,
    marginTop: 2,
    marginBottom: 10,
    lineHeight: 22,
  },
  postImage: {
    width: "100%",
    height: 190,
    borderRadius: 12,
    marginTop: 9,
    backgroundColor: "#1c2235",
  },
  fileLink: {
    color: "#4ade80",
    marginTop: 14,
    fontSize: 15,
    textDecorationLine: "underline",
    padding: 7,
    borderRadius: 7,
    backgroundColor: "#26345a33",
    overflow: "hidden",
    alignSelf: "flex-start",
    fontWeight: "600",
  },
  commentTitle: {
    color: "#fff",
    fontWeight: "bold",
    marginTop: 0,
    marginLeft: 18,
    fontSize: 17,
    marginBottom: 8,
  },
  commentItem: {
    backgroundColor: "#232b3e",
    borderRadius: 11,
    marginHorizontal: 16,
    padding: 12,
    marginBottom: 8,
    shadowColor: "#181e35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.13,
    shadowRadius: 6,
    elevation: 2,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#60a5fa",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  commentUser: {
    color: "#60a5fa",
    fontWeight: "600",
    fontSize: 15,
    marginBottom: 2,
  },
  commentMeta: {
    color: "#bbb",
    fontSize: 12,
    fontStyle: "italic",
  },
  commentText: {
    color: "#e7ebff",
    marginLeft: 3,
    marginTop: 2,
    fontSize: 15,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: "row",
    gap: 7,
  },
  iconBtn: {
    padding: 4,
    borderRadius: 5,
    marginLeft: 3,
  },
  commentBox: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#26345a",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 13,
    backgroundColor: "#161b24",
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#232b3e",
    color: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    fontSize: 15,
    marginRight: 7,
    minHeight: 40,
    maxHeight: 80,
  },
  sendBtn: {
    backgroundColor: "#60a5fa",
    borderRadius: 8,
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
