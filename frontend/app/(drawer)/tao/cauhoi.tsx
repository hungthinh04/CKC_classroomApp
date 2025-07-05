import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { BASE_URL } from "@/constants/Link";
export default function CauHoiBlock({ baiViet }) {
  const [text, setText] = useState("");
  const [isNop, setIsNop] = useState(false);

  const nop = () => {
    // gọi API nộp câu trả lời
    setIsNop(true);
  };

  return (
    <View style={{ marginTop: 20, backgroundColor: "#f5f5f5", padding: 12, borderRadius: 6 }}>
      <Text style={{ fontWeight: "bold", fontSize: 15, marginBottom: 6 }}>
        Câu trả lời của bạn
      </Text>

      <TextInput
        editable={!isNop}
        value={text}
        onChangeText={setText}
        placeholder="Nhập câu trả lời của bạn"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          padding: 10,
          backgroundColor: isNop ? "#eee" : "#fff",
          marginBottom: 8,
        }}
      />

      <Button title="📤 Nộp bài" onPress={nop} disabled={isNop || !text} />
    </View>
  );
}
