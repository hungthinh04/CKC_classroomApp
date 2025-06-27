// app/(drawer)/(class)/lopHocPhan/[id]/classTabs/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ClassTabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#1d4ed8",
                tabBarInactiveTintColor: "#6b7280",
                tabBarStyle: {
                    backgroundColor: "#f8fafc",
                    paddingTop: 4,
                    paddingBottom: 4,
                    height: 60,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: "Bảng tin",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="notifications"
                options={{
                    title: "Bài tập",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="clipboard-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="peopleScreen"
                options={{
                    title: "Mọi người",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
