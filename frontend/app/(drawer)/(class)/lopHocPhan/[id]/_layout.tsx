import { Stack } from "expo-router";

export default function Layout() {
    return (
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
                name="baiviet/[id]"
                options={{ title: "Chi tiết bài viết" }}
            />
        </Stack>
    );
}
