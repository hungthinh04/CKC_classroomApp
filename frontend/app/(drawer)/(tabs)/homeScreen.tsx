import { Ionicons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../../stores/useAuth";

type LopHocPhan = {
  id: number;
  tenLHP: string;
  hocKy: number;
  namHoc: number;
  maGV: number;
  tenGV?: string;
  moTa?: string;
};

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [lophocphan, setLophocphan] = useState<LopHocPhan[]>([]);

  const navigation = useNavigation();
  const handleLogout = async () => {
    await logout();
    router.replace("/(auth)/login");
  };
  const fetchLHP = async () => {
    try {
      const [resLHP, resGV] = await Promise.all([
        fetch(`${API_BASE_URL}/lophophan`),
        fetch(`${API_BASE_URL}/giangvien`),
      ]);
      const lhpData = await resLHP.json();
      const gvData = await resGV.json();

      const combined = lhpData.map((l: LopHocPhan) => {
        const gv = gvData.find((g: any) => Number(g.id) === Number(l.maGV));
        return {
          ...l,
          tenGV: gv ? `${gv.hoGV} ${gv.tenGV}` : "Không rõ",
        };
      });

      setLophocphan(combined);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchLHP();
  }, []);

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
          <Text style={{ color: "#fff", fontWeight: "bold" }}>U</Text>
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
        {lophocphan.map((cls, i) => (
          <TouchableOpacity
            key={cls.id}
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/(drawer)/(class)/lopHocPhan/[id]/(tabs)/dashboard",
                params: { id: cls.id.toString(), tenLHP: cls.tenLHP }, // 👈 truyền tên lớp
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
        ))}
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
