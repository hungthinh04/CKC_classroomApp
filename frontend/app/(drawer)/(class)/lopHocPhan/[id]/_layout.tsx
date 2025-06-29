import CustomHeader from "@/components/CustomHeader";
import { LopHocPhanProvider } from "@/context/_context";
import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <LopHocPhanProvider>
      <Tabs
        screenOptions={{
          header: () => <CustomHeader />,
          tabBarStyle: {
            backgroundColor: "#f9f9f9", // nền trắng nhạt
            paddingBottom: 6,
            paddingTop: 6,
            borderTopWidth: 0.5,
            borderColor: "#ddd",
          },
          tabBarLabelStyle: {
            fontSize: 12,
          },
          tabBarActiveTintColor: "#007bff", // màu xanh cho tab active
          tabBarInactiveTintColor: "#444",  // màu xám đậm
        }}
      >
        <Tabs.Screen
          name="(tabs)/dashboard"
          options={{
            title: "Bảng tin",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="chat-bubble-outline" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/notifications"
          options={{
            title: "Bài tập trên lớp",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="assignment" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/peopleScreen"
          options={{
            title: "Mọi người",
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="group" size={24} color={color} />
            ),
          }}
        />
      </Tabs>
    </LopHocPhanProvider>
  );
}
