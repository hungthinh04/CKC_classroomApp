import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from "react-native";
import { useAuth } from "../../../stores/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "@/constants/Link";
import { LinearGradient } from "expo-linear-gradient";
import { useIsFocused } from "@react-navigation/native";

type LopHocPhan = {
  id: number;
  tenLHP: string;
  hocKy: number;
  namHoc: number;
  maGV: number;
  tenGV?: string;
  tenMH?: string;
  maLop?: string;
};

export default function HomeScreen() {
  const { user, logout, checkLogin, setUser } = useAuth();
  const [lophocphan, setLophocphan] = useState<LopHocPhan[]>([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/api/users/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data); // Giả sử useAuth có setUser
        }
      } catch (e) {
        // ignore
      }
    };
    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };
  const fetchLHP = async () => {
    try {
      if (!user?.id) return;
      const token = await AsyncStorage.getItem("token");
      const isGV = user.role === 1;
      const endpoint = isGV
        ? `/api/giangvien/${user.id}/lophocphan`
        : `/api/sinhvien/${user.id}/lophocphan`;

      const res = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error("Không thể lấy danh sách lớp học phần");
      }

      const data = await res.json();

      setLophocphan(
        Array.isArray(data)
          ? data.map((item: any) => ({
              id: item.ID,
              tenLHP: item.TenLHP,
              hocKy: item.HocKy,
              namHoc: item.NamHoc,
              maGV: item.MaGV,
              tenGV: item.TenGV || "",
              tenMH: item.TenMH || "",
              maLop: item.MaLop || "",
            }))
          : []
      );
    } catch (error) {
      console.error("Fetch LHP error:", error);
      setLophocphan([]);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    if (user?.id && isFocused) {
      fetchLHP();
    }
  }, [user, isFocused]);

  const getInitial = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const handleMenuOption = (option: string) => {
    if (option === "logout") {
      Alert.alert("Đăng xuất", "Bạn có chắc muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        { text: "Đồng ý", onPress: handleLogout },
      ]);
    } else if (option === "profile") {
      router.push(`/profile/${user?.id}`);
    }
  };

  const handleEditLHP = (id: number) => {
router.push(`/tao/edit/${id}?maLHP=abc&loaiBV=1`);

};

  const handleCardMenu = (cls: LopHocPhan) => {
    Alert.alert(
      "Tuỳ chọn lớp học phần",
      cls.tenLHP,
      [
        {
          text: "Chỉnh sửa",
          onPress: () => handleEditLHP(cls.id),
        },
        {
          text: "Huỷ",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  const handleAddLHP = () => {
    router.push("/tao/addLHP");
  };

  const isGV = user?.role === 1;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={26}
          color="white"
          onPress={() => navigation.openDrawer()}
        />
        <Text style={styles.title}>
          <Text style={{ fontWeight: "700" }}>CKC</Text> Classroom
        </Text>
        <View style={styles.avatar}>
          <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 17 }}>
            {getInitial()}
          </Text>
        </View>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color="white"
          onPress={() =>
            Alert.alert("Menu", "Chọn một hành động", [
              {
                text: "Xem thông tin tài khoản",
                onPress: () => handleMenuOption("profile"),
              },
              {
                text: "Đăng xuất",
                onPress: () => handleMenuOption("logout"),
              },
            ])
          }
        />
      </View>
      {/* Weekly Box */}
      <LinearGradient
        colors={["#6e81f3", "#a6b5fa"]}
        style={styles.weekBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <View style={styles.weekContent}>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "600" }}>
            Tuần này
          </Text>
          <Text style={{ color: "#fff", fontSize: 13, marginTop: 3 }}>
            Hiện không có bài tập nào
          </Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.link}>Xem danh sách việc cần làm</Text>
        </TouchableOpacity>
      </LinearGradient>
      {/* Class Cards */}
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {lophocphan.length === 0 ? (
          <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
            Không có lớp học phần nào.
          </Text>
        ) : (
          lophocphan.map((cls) => (
            <View key={cls.id} style={styles.cardWrapper}>
              <TouchableOpacity
                style={styles.card}
                activeOpacity={0.82}
                onPress={() =>
                  router.push({
                    pathname:
                      "/(drawer)/(class)/lopHocPhan/[id]/(tabs)/dashboard",
                    params: { id: cls.id.toString(), tenLHP: cls.tenLHP },
                  })
                }
              >
                <Image
                  source={require("../../../assets/images/icon.png")}
                  style={styles.bgImage}
                  blurRadius={2}
                />
                <View style={styles.overlay} />
                <View style={styles.cardContent}>
                  <View style={styles.classInfo}>
                    <Text style={styles.className}>{cls.tenLHP}</Text>
                    <Text style={styles.term}>
                      HK{cls.hocKy} – Năm học: {cls.namHoc}
                    </Text>
                  </View>
                  <Text style={styles.subject}>{cls.tenGV}</Text>
                </View>
              </TouchableOpacity>
              {/* Nút 3 chấm, render nằm ngoài card */}
              <TouchableOpacity
                style={styles.cardMenu}
                onPress={() => handleCardMenu(cls)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="ellipsis-vertical" size={20} color="white" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      {/* FAB: Nút thêm lớp học phần */}
      {isGV && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddLHP}
          activeOpacity={0.82}
        >
          <Ionicons name="add" size={34} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#141927",
    paddingTop: 30,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(36,37,86,0.98)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.5,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#6e81f3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#6e81f3",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  weekBox: {
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#6e81f3",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },
  weekContent: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 4,
  },
  link: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "#3b60f3",
    paddingHorizontal: 8,
    paddingVertical: 7,
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 7,
  },
  scroll: {
    flex: 1,
  },
  card: {
    height: 125,
    borderRadius: 18,
    marginBottom: 20,
    overflow: "hidden",
    position: "relative",
    justifyContent: "flex-end",
    backgroundColor: "#242556",
    shadowColor: "#242556",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 7,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
    opacity: 0.3,
  },
  overlay: {
    backgroundColor: "rgba(36,37,86,0.6)",
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    position: "absolute",
    bottom: 16,
    left: 20,
    right: 30,
  },
  classInfo: {
    flexDirection: "column",
    marginBottom: 7,
  },
  className: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  subject: {
    color: "#d3dafc",
    fontSize: 13,
    fontWeight: "400",
    marginTop: 4,
  },
  term: {
    color: "#b1bcfa",
    fontSize: 13,
    fontStyle: "italic",
    marginTop: 0,
  },
  cardMenu: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(45, 47, 95, 0.7)",
    borderRadius: 13,
    padding: 4,
  },
  addButton: {
    position: "absolute",
    bottom: 30,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3b60f3",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#242556",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 10,
  },
});
