// TabsLayout.tsx
import CustomHeader from "@/components/CustomHeader";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                header: () => <CustomHeader />,
                tabBarStyle: {
                    backgroundColor: "#000",
                    paddingBottom: 6,
                    paddingTop: 6,
                },
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
        </Tabs>
    );
}
