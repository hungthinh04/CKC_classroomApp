import { useLopHocPhan } from "@/context/_context";
import { Ionicons } from "@expo/vector-icons";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CustomHeader() {
  const route = useRoute();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const [title, setTitle] = useState("Lớp học phần");

  const navigation = useNavigation();
  const { tenLHP } = useLopHocPhan();

  useEffect(() => {
    if (!id) return;
    fetch(`http://192.168.1.101:3001/lophophan/${id}`)
      .then((res) => res.json())
      .then((data) => setTitle(data.tenLHP));
  }, [id]);

  const renderIcons = () => {
    switch (route.name) {
      case "(tabs)/dashboard":
        return (
          <>
            <TouchableOpacity>
              <Ionicons name="filter-outline" size={22} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="camera-outline" size={22} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
            </TouchableOpacity>
          </>
        );
      case "(tabs)/notifications":
        return (
          <>
            <TouchableOpacity>
              <Ionicons name="filter-outline" size={22} color="#555" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#555" />
            </TouchableOpacity>
          </>
        );
      case "(tabs)/peopleScreen":
        return (
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#555" />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu trái */}
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Ionicons name="menu" size={24} color="#111" />
      </TouchableOpacity>

      {/* Tên lớp ở giữa */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Icon bên phải */}
      <View style={styles.iconGroup}>{renderIcons()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    paddingHorizontal: 16,
    backgroundColor: "#fff", // Nền trắng
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ddd",

    // Đổ bóng nhẹ (cho Android & iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    marginHorizontal: 12,
  },
  iconGroup: {
    flexDirection: "row",
    gap: 16,
  },
});
