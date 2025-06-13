import { View, Text, StyleSheet } from 'react-native';

export default function Archived() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📌 Danh sách bài tập đã lưu</Text>
      {/* Sau này fetch từ nhiều lớp học */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#111', padding: 16 },
  title: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
