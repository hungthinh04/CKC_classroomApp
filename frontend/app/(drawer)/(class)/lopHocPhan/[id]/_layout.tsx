import CustomHeader from "@/components/CustomHeader";
import { LopHocPhanProvider } from "@/context/_context";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function Layout() {
  return (
    <LopHocPhanProvider>
      <Tabs
        screenOptions={{
          header: () => <CustomHeader />,
          tabBarStyle: {
            backgroundColor: "#4f83ff",
            borderTopWidth: 0,
            paddingBottom: 6,
            paddingTop: 6,
            height: 70,
          },
          tabBarLabelStyle: {
            fontSize: 14, 
            fontWeight: "600",
            color: "#fff",
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#b0bec5",
        }}
      >
        <Tabs.Screen
          name="(tabs)/dashboard"
          options={{
            title: "Bảng tin",
            tabBarIcon: ({ color }) => (
              <Ionicons name="home" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/notifications"
          options={{
            title: "Bài tập",
            tabBarIcon: ({ color }) => (
              <Ionicons name="book" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="(tabs)/peopleScreen"
          options={{
            title: "Người dùng",
            tabBarIcon: ({ color }) => (
              <Ionicons name="people" size={24} color={color} />
            ),
          }}
        />
        {/* <Tabs.Screen
          name="(tabs)/material"
          options={{
            title: "Tài liệu",
            tabBarIcon: ({ color }) => (
              <Ionicons name="document-text" size={24} color={color} />
            ),
          }}
        /> */}
      </Tabs>
    </LopHocPhanProvider>
  );
}
