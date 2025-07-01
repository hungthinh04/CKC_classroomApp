import { useState } from "react";
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
    if (res.type === "success") setTep(res);
  };

  const handleSubmit = async () => {
    if (!tieuDe || !noiDung) {
      Alert.alert("⚠️ Thiếu thông tin", "Vui lòng nhập tiêu đề và nội dung");
      return;
    }

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
        type: "*/*",
      } as any);
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const res = await fetch("http://192.168.1.104:3000/baiviet/tao", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      const result = await res.json();
      if (res.ok) {
        Alert.alert("✅ Thành công", `${submitLabel} thành công`, [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("❌ Thất bại", result.message || "Có lỗi xảy ra");
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
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={{ marginTop: 16 }}>
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
