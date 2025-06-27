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
    fetch(`http://192.168.1.103:3001/lophophan/${id}`)
      .then((res) => res.json())
      .then((data) => setTitle(data.tenLHP));
  }, [id]);

  const renderIcons = () => {
    switch (route.name) {
      case "(tabs)/dashboard":
        return (
          <>
            <TouchableOpacity>
              <Ionicons name="filter-outline" size={22} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="camera-outline" size={22} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#ccc" />
            </TouchableOpacity>
          </>
        );
      case "(tabs)/notifications":
        return (
          <>
            <TouchableOpacity>
              <Ionicons name="filter-outline" size={22} color="#ccc" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons name="ellipsis-vertical" size={20} color="#ccc" />
            </TouchableOpacity>
          </>
        );
      case "(tabs)/peopleScreen":
        return (
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={20} color="#ccc" />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Menu trái */}
      <TouchableOpacity>
        <Ionicons
          name="menu"
          size={24}
          color="#ccc"
          onPress={() => navigation.openDrawer()}
        />
      </TouchableOpacity>

      {/* Tên lớp (ở giữa) */}
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
    backgroundColor: "#1f1f1f",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "bold",
    color: "#4f83ff",
    marginHorizontal: 12,
  },
  iconGroup: {
    flexDirection: "row",
    gap: 16,
  },
});
