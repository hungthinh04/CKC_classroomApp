import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { Ionicons } from "@expo/vector-icons";

export default function TaoBaiVietScreen() {
  const { maLHP } = useLocalSearchParams();
  const [noiDung, setNoiDung] = useState("");
  const [hanNop, setHanNop] = useState(new Date());
  const [anh, setAnh] = useState(null);
  const [tep, setTep] = useState(null);

  // Chọn ảnh
  const chonAnh = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaType.Image,
      allowsMultipleSelection: false,
      quality: 1,
    });

    if (!res.canceled && res.assets?.length > 0) {
      const asset = res.assets[0];
      setAnh(asset);
    }
  };

  // Xóa ảnh
  const xoaAnh = () => setAnh(null);

  // Chọn file doc/pdf
  const chonTep = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!res.canceled && res.assets?.length > 0) {
      const asset = res.assets[0];
      setTep(asset);
    }
  };

  // Xóa file
  const xoaTep = () => setTep(null);

  // Submit
  const handleSubmit = async () => {
    if (!noiDung) {
      Alert.alert("Thiếu nội dung", "Hãy nhập nội dung thông báo");
      return;
    }
    const formData = new FormData();
    formData.append("TieuDe", "Thông báo lớp học");
    formData.append("NoiDung", noiDung);
    formData.append("LoaiBV", "0");
    formData.append("MaLHP", maLHP?.toString());
    formData.append("MaCD", "1");
    formData.append("GioKetThuc", new Date().toISOString());
    formData.append("NgayKetThuc", hanNop.toISOString());

    if (anh) {
      formData.append("file", {
        uri: anh.uri,
        name: anh.fileName || `image_${Date.now()}.jpg`,
        type: anh.type || "image/jpeg",
      });
    }
    if (tep) {
      formData.append("file", {
        uri: tep.uri,
        name: tep.name || `tep-${Date.now()}`,
        type: tep.mimeType || "application/octet-stream",
      });
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/baiviet/tao`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        Alert.alert("✅ Thành công", "Bài viết đã được tạo", [
          { text: "OK", onPress: () => router.replace(`/(drawer)/lopHocPhan/${maLHP}/(tabs)/dashboard`) },
        ]);
        setNoiDung("");
        setAnh(null);
        setTep(null);
      } else {
        Alert.alert("❌ Thất bại", result.message || "Đã xảy ra lỗi");
      }
    } catch (err) {
      console.error("Lỗi gửi bài:", err);
      Alert.alert("❌ Lỗi", "Không thể kết nối đến máy chủ");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 10,
        gap: 4,
        alignSelf: "flex-start",
      }}
      onPress={() => router.replace(`/(drawer)/lopHocPhan/${maLHP}/(tabs)/dashboard`)}
    >
      <Ionicons name="arrow-back" size={22} color="#60a5fa" />
      <Text style={{ color: "#60a5fa", fontWeight: "bold", fontSize: 16 }}>Quay lại</Text>
    </TouchableOpacity>
      <Text style={styles.header}>Tạo thông báo mới cho lớp</Text>
      <Text style={styles.label}>Nội dung thông báo</Text>
      <TextInput
        style={styles.input}
        value={noiDung}
        onChangeText={setNoiDung}
        multiline
        placeholder="Nhập nội dung thông báo..."
        placeholderTextColor="#adb5bd"
      />

      {/* Chọn ảnh + nút bỏ chọn ảnh */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}>
        {/* <TouchableOpacity style={styles.attachBtn} onPress={chonAnh} activeOpacity={0.85}>
          <Ionicons name="images-outline" size={18} color="#4666ec" />
          <Text style={styles.attachBtnText}>
            {anh ? "Chọn lại ảnh" : "Chọn ảnh"}
          </Text>
        </TouchableOpacity> */}
        {anh && (
          <TouchableOpacity
            style={[styles.attachBtn, { backgroundColor: "#ffe0e0" }]}
            onPress={xoaAnh}
            activeOpacity={0.85}
          >
            <Ionicons name="close-circle-outline" size={18} color="#e11d48" />
            <Text style={[styles.attachBtnText, { color: "#e11d48" }]}>Bỏ chọn ảnh</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hiển thị ảnh đã chọn */}
      {anh && (
        <View style={styles.imgItem}>
          <Image
            source={{ uri: anh.uri }}
            style={{ width: 120, height: 120, borderRadius: 12, marginRight: 8 }}
          />
        </View>
      )}

      {/* Chọn tệp + nút bỏ chọn tệp */}
      <View style={{ flexDirection: "row", gap: 12, marginBottom: 10 }}>
        <TouchableOpacity style={styles.attachBtn} onPress={chonTep} activeOpacity={0.85}>
          <Ionicons name="attach" size={18} color="#4666ec" />
          <Text style={styles.attachBtnText}>
            {tep ? "Chọn lại tệp" : "Chọn tệp đính kèm"}
          </Text>
        </TouchableOpacity>
        {tep && (
          <TouchableOpacity
            style={[styles.attachBtn, { backgroundColor: "#ffe0e0" }]}
            onPress={xoaTep}
            activeOpacity={0.85}
          >
            <Ionicons name="close-circle-outline" size={18} color="#e11d48" />
            <Text style={[styles.attachBtnText, { color: "#e11d48" }]}>Bỏ chọn tệp</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Hiển thị file đã chọn */}
      {tep && (
        <View style={styles.fileInfo}>
          <Ionicons name="document-text-outline" size={19} color="#10b981" />
          <Text style={styles.fileName}>{tep.name}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: !noiDung ? "#a5b4fc" : "#4666ec" },
        ]}
        onPress={handleSubmit}
        disabled={!noiDung}
        activeOpacity={0.88}
      >
        <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 7 }} />
        <Text style={styles.submitBtnText}>Đăng bài</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fb", padding: 20 },
  header: {
    fontSize: 20,
    color: "#243665",
    fontWeight: "bold",
    marginBottom: 18,
    marginTop: 5,
    letterSpacing: 0.2,
  },
  label: {
    color: "#465980",
    fontWeight: "600",
    marginBottom: 7,
    fontSize: 15,
    marginLeft: 1,
  },
  input: {
    borderWidth: 0,
    backgroundColor: "#fff",
    color: "#242b3a",
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 11,
    minHeight: 90,
    fontSize: 16,
    marginBottom: 13,
    shadowColor: "#b4bdfc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 1,
  },
  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e4e9fa",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 13,
    alignSelf: "flex-start",
    marginBottom: 6,
    marginTop: 2,
  },
  attachBtnText: {
    color: "#4666ec",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 8,
  },
  imgItem: {
    position: "relative",
    marginBottom: 8,
    marginTop: 10,
    alignSelf: "flex-start",
  },
  deleteBtn: {
    position: "absolute",
    top: -10,
    right: -10,
    zIndex: 2,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 2,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9faf3",
    borderRadius: 7,
    padding: 8,
    marginTop: 7,
    marginBottom: 10,
    alignSelf: "flex-start",
    gap: 6,
  },
  fileName: {
    color: "#111",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 6,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingVertical: 14,
    justifyContent: "center",
    marginTop: 22,
    elevation: 2,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});