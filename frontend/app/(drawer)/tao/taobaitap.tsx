import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as FileSystem from "expo-file-system";
import * as DocumentPicker from "expo-document-picker";
import { useLocalSearchParams, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { BASE_URL } from "@/constants/Link";
import axios from "axios";

export default function TaoBaiTapScreen() {
  const { loaiBV = "1", maLHP } = useLocalSearchParams();
  const loai = parseInt(loaiBV.toString());

  if (loai === 0) return <FormCauHoi maLHP={maLHP?.toString()} />;
  if (loai === 1) return <FormTuLuan maLHP={maLHP?.toString()} />;
  if (loai === 2) return <FormKiemTra maLHP={maLHP?.toString()} />;
  if (loai === 3) return <FormTaiLieu maLHP={maLHP?.toString()} />;

  return <Text>Loại bài viết chưa được hỗ trợ</Text>;
}

function BaseForm({
  title,
  maLHP,
  loaiBV,
  submitLabel,
}: {
  title: string;
  maLHP?: string;
  loaiBV: number;
  submitLabel: string;
}) {
  const [tieuDe, setTieuDe] = useState("");
  const [noiDung, setNoiDung] = useState("");
  const [hanNop, setHanNop] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tep, setTep] = useState<any>(null);
  const [sending, setSending] = useState(false);

  const chonTep = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });

    if (!res.canceled && res.assets && res.assets.length > 0) {
      const asset = res.assets[0];
      const originalUri = asset.uri;
      const fileName = asset.name || `tep-${Date.now()}`;
      const newPath =
        FileSystem.documentDirectory + encodeURIComponent(fileName);

      try {
        await FileSystem.copyAsync({
          from: originalUri,
          to: newPath,
        });

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
    if (!tieuDe.trim()) {
      Alert.alert("Chưa nhập tiêu đề");
      return;
    }
    if (!noiDung.trim()) {
      Alert.alert("Chưa nhập nội dung");
      return;
    }

    setSending(true);
    const formData = new FormData();
    formData.append("TieuDe", tieuDe);
    formData.append("NoiDung", noiDung);
    formData.append("MaLHP", maLHP || "");
    formData.append("LoaiBV", loaiBV.toString());
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
      const res = await axios.post(`${BASE_URL}/baiviet/tao`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.status === 201) {
        const fileUrl = res.data.fileUrl
          ? `${BASE_URL}${res.data.fileUrl}`
          : null;

        Alert.alert(
          "✅ Thành công",
          `${submitLabel} thành công${fileUrl ? `\nFile: ${fileUrl}` : ""}`,
          [
            {
              text: "Xem danh sách",
              onPress: () => {
                router.replace(`/(drawer)/lopHocPhan/${maLHP}/(tabs)/notifications`);
              },
            },
          ]
        );
        setTieuDe("");
        setNoiDung("");
        setTep(null);
      } else {
        Alert.alert("❌ Thất bại", res.data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi bài:", err);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={styles.bg}>
      <View style={styles.card}>

        <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 4,
          marginBottom: 10,
          alignSelf: "flex-start",
        }}
        onPress={() => router.replace(`/(drawer)/lopHocPhan/${maLHP}/(tabs)/notifications`)}
      >
        <Ionicons name="arrow-back" size={22} color="#60a5fa" />
        <Text style={{ color: "#60a5fa", fontWeight: "bold", fontSize: 16 }}>Quay lại</Text>
      </TouchableOpacity>
        <Text style={styles.header}>{title}</Text>

        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.input}
          value={tieuDe}
          onChangeText={setTieuDe}
          placeholder="Nhập tiêu đề..."
          placeholderTextColor="#abb0be"
        />

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={[styles.input, { minHeight: 90, maxHeight: 170 }]}
          value={noiDung}
          onChangeText={setNoiDung}
          multiline
          placeholder="Nhập mô tả..."
          placeholderTextColor="#abb0be"
        />

        <Text style={styles.label}>Hạn nộp</Text>
        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.83}
        >
          <Ionicons name="calendar-outline" size={19} color="#4666ec" />
          <Text style={styles.dateBtnText}>
            {hanNop
              ? ` ${hanNop.toLocaleString("vi-VN")}`
              : " Đặt thời gian đến hạn"}
          </Text>
        </TouchableOpacity>

        <DateTimePickerModal
          isVisible={showDatePicker}
          mode="datetime"
          date={hanNop || new Date()}
          is24Hour={true}
          onConfirm={(date) => {
            setShowDatePicker(false);
            setHanNop(date);
          }}
          onCancel={() => setShowDatePicker(false)}
          minimumDate={new Date()} // Không cho chọn ngày trong quá khứ
        />

        <TouchableOpacity
          style={styles.attachBtn}
          onPress={chonTep}
          activeOpacity={0.86}
        >
          <Ionicons name="attach" size={18} color="#1d4ed8" />
          <Text style={styles.attachText}>
            {tep ? ` ${tep.name}` : " Chọn tệp đính kèm"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            {
              backgroundColor:
                !tieuDe.trim() || !noiDung.trim() || sending
                  ? "#b2c4f4"
                  : "#4666ec",
            },
          ]}
          onPress={handleSubmit}
          disabled={!tieuDe.trim() || !noiDung.trim() || sending}
          activeOpacity={0.88}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={20}
            color="#fff"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.submitBtnText}>
            {sending ? "Đang gửi..." : submitLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function FormCauHoi({ maLHP }: { maLHP?: string }) {
  return (
    <BaseForm
      title="Tạo câu hỏi"
      maLHP={maLHP}
      loaiBV={0}
      submitLabel="📨 Hỏi"
    />
  );
}

function FormTuLuan({ maLHP }: { maLHP?: string }) {
  return (
    <BaseForm
      title="Tạo bài tập"
      maLHP={maLHP}
      loaiBV={1}
      submitLabel="📤 Giao bài tập"
    />
  );
}

function FormKiemTra({ maLHP }: { maLHP?: string }) {
  return (
    <BaseForm
      title="Tạo bài kiểm tra"
      maLHP={maLHP}
      loaiBV={2}
      submitLabel="📤 Tạo bài kiểm tra"
    />
  );
}

function FormTaiLieu({ maLHP }: { maLHP?: string }) {
  return (
    <BaseForm
      title="Tạo tài liệu"
      maLHP={maLHP}
      loaiBV={3}
      submitLabel="📚 Đăng tài liệu"
    />
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: "#f5f7fb",
    justifyContent: "center",
    paddingHorizontal: 0,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    padding: 18,
    shadowColor: "#4666ec",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.13,
    shadowRadius: 14,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    color: "#243665",
    fontWeight: "bold",
    marginBottom: 16,
    letterSpacing: 0.2,
    textAlign: "center",
  },
  label: {
    color: "#465980",
    fontWeight: "600",
    marginBottom: 7,
    fontSize: 15,
    marginLeft: 1,
    marginTop: 9,
  },
  input: {
    borderWidth: 0,
    backgroundColor: "#f4f7fc",
    color: "#242b3a",
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 9,
    fontSize: 16,
    marginBottom: 7,
    shadowColor: "#b4bdfc",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.09,
    shadowRadius: 6,
    elevation: 1,
  },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e4e9fa",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 13,
    alignSelf: "flex-start",
    marginBottom: 4,
    marginTop: 2,
  },
  dateBtnText: {
    color: "#4666ec",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 4,
  },
  attachBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e7edfa",
    borderRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
    marginTop: 8,
    marginBottom: 9,
  },
  attachText: {
    color: "#273262",
    fontWeight: "600",
    fontSize: 15,
    marginLeft: 7,
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 11,
    paddingVertical: 14,
    justifyContent: "center",
    marginTop: 22,
    elevation: 2,
    marginBottom: 6,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});
