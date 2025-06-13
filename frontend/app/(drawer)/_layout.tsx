import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

export default function RootLayout() {
  return (
    <Drawer screenOptions={{ headerShown: false }}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          title: "Lớp học",
          drawerIcon: ({ color }) => (
            <Ionicons name="school-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="todo"
        options={{
          title: "Việc cần làm",
          drawerIcon: ({ color }) => (
            <Ionicons name="list-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="archived"
        options={{
          title: "Lớp đã lưu trữ",
          drawerIcon: ({ color }) => (
            <Ionicons name="archive-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
