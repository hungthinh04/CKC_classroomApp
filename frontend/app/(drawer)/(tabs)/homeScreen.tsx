import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../stores/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
  const { user, logout,checkLogin } = useAuth();
  const [lophocphan, setLophocphan] = useState<LopHocPhan[]>([]);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };

  const fetchLHP = async () => {
    try {
      if (!user?.id) return;

      const token = await AsyncStorage.getItem("token");
      const res = await fetch(
        `http://192.168.1.104:3000/api/giangvien/${user.id}/lophocphan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      const mapped = data.map((item: any) => ({
        id: item.ID,
        tenLHP: item.TenLHP,
        hocKy: item.HocKy,
        namHoc: item.NamHoc,
        maGV: item.MaGV,
        tenGV: item.TenGV || item.TenMH || "",
        tenMH: item.TenMH || "",
        maLop: item.MaLop || "",
      }));
      setLophocphan(mapped);
    } catch (error) {
      console.error("Fetch LHP error:", error);
    }
  };

  useEffect(() => {
    const init = async () => {
      await checkLogin(); // Khôi phục thông tin từ AsyncStorage
    };
    init();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchLHP(); // chỉ gọi khi đã có user
    }
  }, [user]);

  const getInitial = () => {
    if (user?.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };
  console.log(lophocphan);
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons
          name="menu"
          size={24}
          color="white"
          onPress={() => navigation.openDrawer()}
        />
        <Text style={styles.title}>
          <Text style={{ fontWeight: "500" }}>CKC</Text> Classroom
        </Text>
        <View style={styles.avatar}>
          <Text style={{ color: "#fff", fontWeight: "bold" }}>{getInitial()}</Text>
        </View>
        <Ionicons
          name="ellipsis-vertical"
          size={24}
          color="white"
          onPress={handleLogout}
        />
      </View>

      {/* Weekly Box */}
      <View style={styles.weekBox}>
        <View style={styles.weekContent}>
          <Text style={{ color: "#fff", fontSize: 20 }}>Tuần này</Text>
          <Text style={{ color: "#fff" }}>Hiện không có bài tập nào</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.link}>Xem danh sách việc cần làm</Text>
        </TouchableOpacity>
      </View>

      {/* Class Cards */}
      <ScrollView style={styles.scroll}>
        {lophocphan.length === 0 ? (
          <Text style={{ color: "white", textAlign: "center", marginTop: 20 }}>
            Không có lớp học phần nào.
          </Text>
        ) : (
          lophocphan.map((cls) => (
            <TouchableOpacity
              key={cls.id}
              style={styles.card}
              onPress={() =>
                router.push({
                  pathname: "/(drawer)/(class)/lopHocPhan/[id]/(tabs)/dashboard",
                  params: { id: cls.id.toString(), tenLHP: cls.tenLHP },
                })
              }
            >
              <Image
                source={require("../../../assets/images/icon.png")}
                style={styles.bgImage}
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
              <Ionicons
                name="ellipsis-vertical"
                size={20}
                color="white"
                style={styles.cardMenu}
              />
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    paddingTop: 22,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "300",
    color: "white",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
  },
  weekBox: {
    borderWidth: 1,
    borderColor: "#9e9696",
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    height: 100,
  },
  weekContent: {
    flexDirection: "column",
    justifyContent: "space-between",
  },
  link: {
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
  },
  scroll: {
    flex: 1,
  },
  card: {
    height: 120,
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    position: "relative",
    flex: 1,
    justifyContent: "space-around",
  },
  classInfo: {
    flexDirection: "column",
    marginBottom: 30,
  },
  bgImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    resizeMode: "cover",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.3)",
    ...StyleSheet.absoluteFillObject,
  },
  cardContent: {
    position: "absolute",
    bottom: 10,
    left: 16,
  },
  className: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  subject: {
    color: "#ddd",
    fontSize: 12,
  },
  term: {
    color: "#bbb",
    fontSize: 12,
    fontStyle: "italic",
  },
  cardMenu: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
