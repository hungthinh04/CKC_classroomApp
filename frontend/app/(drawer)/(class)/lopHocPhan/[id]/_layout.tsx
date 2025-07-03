import CustomHeader from "@/components/CustomHeader";
import { LopHocPhanProvider } from "@/context/_context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function Layout() {
  return (
    <LopHocPhanProvider>
      <Tabs
        screenOptions={({ route }) => ({
          header: () => <CustomHeader />,
          tabBarStyle: {
            backgroundColor: "#f1f5f9", // màu nền nhẹ giống Google Classroom
            height: 60,
            paddingBottom: 4,
            paddingTop: 6,
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarActiveTintColor: "#0288d1", // xanh dương cho tab được chọn
          tabBarInactiveTintColor: "#333",
          tabBarIconStyle: { marginBottom: -2 },
          tabBarItemStyle: {
            borderRadius: 8,
            marginHorizontal: 4,
          },
          tabBarActiveBackgroundColor: "#e1f5fe", // nền xanh nhạt khi active
        })}
      >
        <Tabs.Screen
          name="(tabs)/dashboard"
          options={{
            title: "Bảng tin",
            tabBarIcon: ({ color }) => (
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/notifications"
          options={{
            title: "Bài tập trên lớp",
            tabBarIcon: ({ color }) => (
              <Ionicons name="clipboard-outline" size={22} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/peopleScreen"
          options={{
            title: "Mọi người",
            tabBarIcon: ({ color }) => (
              <Ionicons name="people-outline" size={22} color={color} />
            ),
          }}
        />
      </Tabs>
    </LopHocPhanProvider>
  );
}
