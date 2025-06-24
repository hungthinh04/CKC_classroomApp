import { LopHocPhanProvider } from "@/context/_context";
import { Stack } from "expo-router";
import TabsLayout from "."; // 👈 import component Tabs

export default function Layout() {
  return (
    <LopHocPhanProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)/dashboard"
          options={{ title: "Bảng tin lớp học" }}
        />
        <Stack.Screen
          name="(tabs)/baiviet/[id]"
          options={{ title: "Chi tiết bài viết" }}
        />
      </Stack>
    </LopHocPhanProvider>
  );
}
