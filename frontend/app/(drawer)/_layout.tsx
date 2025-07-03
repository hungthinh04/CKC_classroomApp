import { Ionicons } from "@expo/vector-icons";
import { Drawer } from "expo-router/drawer";

// Cấu hình danh sách các màn cần hiển thị trong Drawer
const visibleDrawerItems = {
  "(tabs)": {
    title: "Lớp học",
    icon: "school-outline",
  },
  todo: {
    title: "Việc cần làm",
    icon: "list-outline",
  },
  archived: {
    title: "Lớp đã lưu trữ",
    icon: "archive-outline",
  },
};

export default function RootLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
    >
      {Object.entries(visibleDrawerItems).map(([name, config]) => (
        <Drawer.Screen
          key={name}
          name={name}
          options={{
            title: config.title,
            drawerIcon: ({ color }) => (
              <Ionicons name={config.icon as any} size={22} color={color} />
            ),
          }}
        />
      ))}

      {/* Các route khác vẫn hoạt động, nhưng ẩn khỏi drawer */}
      <Drawer.Screen
        name="tao/taobaitap"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="tao/taobaiviet"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="tao/cauhoi"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="nguoidung/addsinhvien"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="nguoidung/addgiangvien"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="(bv)/baiviet/[id]"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="(class)/lopHocPhan/[id]"
        options={{ drawerItemStyle: { display: "none" } }}
      />
    </Drawer>
  );
}
