import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Platform,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { Ionicons } from "@expo/vector-icons";

export default function TaoBaiVietScreen() {
  const { maLHP } = useLocalSearchParams();
  const [noiDung, setNoiDung] = useState("");
  const [hanNop, setHanNop] = useState(new Date());
  const [tep, setTep] = useState<any>(null);

  const chonTep = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!res.canceled && res.assets?.length > 0) {
      const asset = res.assets[0];
      const originalUri = asset.uri;
      const fileName = asset.name || `tep-${Date.now()}`;
      const newPath = FileSystem.documentDirectory + encodeURIComponent(fileName);

      try {
        await FileSystem.copyAsync({ from: originalUri, to: newPath });
        setTep({
          ...asset,
          uri: newPath,
          name: fileName,
        });
      } catch (err) {
        console.error("❌ Lỗi khi copy file:", err);
        Alert.alert("Lỗi", "Không thể xử lý tệp đính kèm");
      }
    }
  };

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

    if (tep) {
      formData.append("file", {
        uri: tep.uri,
        name: tep.name,
        type: tep.mimeType || "application/octet-stream",
      } as any);
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/baiviet/tao`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // KHÔNG set Content-Type, để fetch tự set boundary
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        Alert.alert("✅ Thành công", "Bài viết đã được tạo", [
          { text: "OK", onPress: () => router.back() },
        ]);
        setNoiDung("");
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
    <View style={styles.container}>
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

      <TouchableOpacity style={styles.attachBtn} onPress={chonTep} activeOpacity={0.85}>
        <Ionicons name="attach" size={18} color="#4666ec" />
        <Text style={styles.attachBtnText}>
          {tep ? "Chọn lại tệp đính kèm" : "Chọn tệp đính kèm"}
        </Text>
      </TouchableOpacity>

      {tep && (
        <View style={styles.fileInfo}>
          <Ionicons name="document-text-outline" size={19} color="#10b981" />
          <Text style={styles.fileName}>{tep.name}</Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.submitBtn,
          {
            backgroundColor: !noiDung
              ? "#a5b4fc"
              : "#4666ec",
          },
        ]}
        onPress={handleSubmit}
        disabled={!noiDung || (tep && !tep.uri.startsWith("file://"))}
        activeOpacity={0.88}
      >
        <Ionicons name="cloud-upload-outline" size={20} color="#fff" style={{ marginRight: 7 }} />
        <Text style={styles.submitBtnText}>Đăng bài</Text>
      </TouchableOpacity>
    </View>
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
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e9faf3",
    borderRadius: 7,
    padding: 8,
    marginTop: 7,
    marginBottom: 15,
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
