import { useState } from "react";
import axios from "axios";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

  const chonTep = async () => {
  const res = await DocumentPicker.getDocumentAsync({ type: "*/*" });

  if (!res.canceled && res.assets && res.assets.length > 0) {
    const asset = res.assets[0];
    const originalUri = asset.uri;
    const fileName = asset.name || `tep-${Date.now()}`;
    const newPath = FileSystem.documentDirectory + encodeURIComponent(fileName); // tránh lỗi tên

    try {
      // Copy file từ content:// hoặc uri lạ sang file://
      await FileSystem.copyAsync({
        from: originalUri,
        to: newPath,
      });

      setTep({
        ...asset,
        uri: newPath, // ✅ uri chuẩn, luôn file://
        name: fileName,
      });
    } catch (err) {
      console.error("❌ Lỗi khi copy file:", err);
      Alert.alert("Lỗi", "Không thể xử lý tệp đính kèm");
    }
  }
};


  const handleSubmit = async () => {
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
      console.log("📡 Gửi tới:", "http://192.168.1.104:3000/baiviet/tao");
      console.log("📎 file:", tep);
      console.log("📤 form:", formData);
      console.log("📎 File uri:", tep.uri);
      console.log("📤 FormData:", formData);
      // React Native FormData does not support .entries(), so log fields manually
      console.log("🧾 TieuDe :", tieuDe);
      console.log("🧾 NoiDung :", noiDung);
      console.log("🧾 MaLHP :", maLHP || "");
      console.log("🧾 LoaiBV :", loaiBV.toString());
      console.log("🧾 MaCD :", "1");
      console.log("🧾 GioKetThuc :", new Date().toISOString());
      console.log("🧾 NgayKetThuc :", hanNop.toISOString());
      if (tep) {
        console.log("🧾 file :", tep);
      }

      const res = await axios.post(
        "http://192.168.1.104:3000/baiviet/tao",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.status === 201) {
        const fileUrl = res.data.fileUrl
          ? `http://192.168.1.104:3000${res.data.fileUrl}`
          : null;

        Alert.alert(
          "✅ Thành công",
          `${submitLabel} thành công${fileUrl ? `\nFile: ${fileUrl}` : ""}`,
          [
            {
              text: "Xem bài viết",
              onPress: () => {
                // tuỳ bạn, hoặc chuyển trang
                router.back();
              },
            },
          ]
        );
      } else {
        Alert.alert("❌ Thất bại", res.data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error("❌ Lỗi gửi bài:", err);
      Alert.alert("Lỗi", "Không thể kết nối đến máy chủ");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>

      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.input}
        value={tieuDe}
        onChangeText={setTieuDe}
        placeholder="Nhập tiêu đề..."
      />

      <Text style={styles.label}>Nội dung</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        value={noiDung}
        onChangeText={setNoiDung}
        multiline
        placeholder="Nhập mô tả..."
      />

      <Text style={styles.label}>Hạn nộp</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={{ marginTop: 16 }}
      >
        <Text style={{ color: "blue" }}>
          {hanNop
            ? `📅 Thời gian đến hạn: ${hanNop.toLocaleString("vi-VN")}`
            : "📅 Đặt thời gian đến hạn"}
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
      />

      <TouchableOpacity onPress={chonTep} style={{ marginTop: 12 }}>
        <Text style={{ color: "blue" }}>
          {tep ? `📎 ${tep.name}` : "📎 Chọn tệp đính kèm"}
        </Text>
      </TouchableOpacity>

      <View style={{ marginTop: 20 }}>
        <Button title={submitLabel} onPress={handleSubmit} />
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
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 16 },
  label: { fontWeight: "bold", marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 6,
    marginTop: 4,
  },
});
