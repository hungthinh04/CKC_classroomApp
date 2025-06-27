import BaiVietDetail from "@/app/(drawer)/(class)/lopHocPhan/[id]/baiviet/[id]";
import { useLopHocPhan } from "@/context/_context";
import { useAuth } from "@/stores/useAuth";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "@/constants/api";
import { Link } from "expo-router";
import {
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function LopHocPhanDetail() {
    const { id, tenLHP } = useLopHocPhan();
    const [lop, setLop] = useState<any>(null);
    const [baiViet, setBaiViet] = useState<any[]>([]);
    const { user } = useAuth();



    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            const [resLHP, resGV, resBV] = await Promise.all([
                fetch(`${API_BASE_URL}/lophophan/${id}`),
                fetch(`${API_BASE_URL}/giangvien`),
                fetch(`${API_BASE_URL}/baiviet?maLHP=${id}`),
            ]);

            const lhp = await resLHP.json();
            const gvs = await resGV.json();
            const bvs = await resBV.json();

            const gv = gvs.find((g: any) => Number(g.id) === lhp.maGV);
            lhp.tenGV = gv ? `${gv.hoGV} ${gv.tenGV}` : "Không rõ";

            setLop(lhp);
            setBaiViet(bvs);
        };
        fetchData();
    }, [id]);

    if (!lop) return null;

    return (
        <ScrollView style={styles.container}>
            {/* Header lớp */}
            <View style={styles.header}>
                <ImageBackground
                    source={require("../../../../../../assets/images/icon.png")}
                    resizeMode="cover"
                    style={styles.coverImg}
                    imageStyle={{ borderRadius: 12 }} // bo tròn cả 4 góc
                >
                    <View style={styles.overlay}>
                        <Text style={styles.className}>{lop.tenLHP}</Text>
                        <Text style={styles.classMeta}>{lop.tenGV}</Text>
                        <Text style={styles.classMeta}>
                            Học kỳ {lop.hocKy} - Năm học {lop.namHoc}
                        </Text>
                    </View>
                </ImageBackground>
            </View>

            
            {/* Thông báo gì đó cho lớp */}
            <View style={styles.notifyWrapper}>
                <TouchableOpacity
                    style={styles.newNotifyButton}
                    onPress={() => {
                        // TODO: mở modal hoặc chuyển trang tạo bài viết mới
                    }}
                >
                    <Ionicons name="create-outline" size={18} color="#1d4ed8" style={{ marginRight: 8 }} />
                    <Text style={styles.newNotifyText}>Thông báo mới</Text>
                </TouchableOpacity>
            </View>



            {/* Các bài viết */}

            {baiViet.map((bv) => (
                <Link
                    key={bv.id}
                    href={`/(drawer)/(class)/lopHocPhan/${id}/baiviet/${bv.id}`}
                    asChild
                >
                    <TouchableOpacity>
                        <View style={styles.postCard}>
                            <View style={styles.postHeader}>
                                <View style={styles.avatar}>
                                    <Text style={{ color: "#fff", fontWeight: "bold" }}>
                                        {lop.tenGV?.charAt(0)}
                                    </Text>
                                </View>

                                <View>
                                    <Text style={styles.postAuthor}>{lop.tenGV}</Text>
                                    <Text style={styles.postDate}>
                                        {new Date(bv.ngayTao).toLocaleDateString()}
                                    </Text>
                                </View>
                            </View>
                            <Text style={styles.postTitle}>{bv.tieuDe}</Text>
                            <Text style={styles.postContent}>{bv.noiDung}</Text>
                            <View style={styles.commentBox}>
                                <TextInput
                                    style={styles.commentInput}
                                    placeholder="Thêm nhận xét trong lớp học"
                                    placeholderTextColor="#6b7280"
                                    multiline
                                    autoCorrect={true}
                                    autoCapitalize="sentences"
                                    keyboardType="default"
                                    textBreakStrategy="simple"
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                </Link>
            ))}

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        flex: 1,
        padding: 12,
    },
    header: {
        borderRadius: 10,
        marginBottom: 16,
    },
    coverImg: {
        height: 120,
        width: "100%",
        justifyContent: "flex-end",
    },
    overlay: {
        padding: 10,
    },
    className: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff", // Chỉnh màu chữ thành trắng
    },
    classMeta: {
        color: "#fff", // Chỉnh màu chữ thành trắng
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: "700",
        marginBottom: 10,
        color: "#111827",
    },
    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    postCard: {
        backgroundColor: "#f9f9f9", // ✅ nền xám nhạt giống ảnh
        borderRadius: 12,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
      
    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#1d4ed8", 
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    postAuthor: {
        fontWeight: "bold",
        fontSize: 14,
        color: "#1f2937", 
    },
      
    postDate: {
        fontSize: 12,
        color: "#6b7280", 
        marginTop: 2,
    },
      
    postTitle: {
        fontWeight: "600",
        fontSize: 15,
        color: "#111827", // ✅ đậm hơn một chút
        marginTop: 4,
        marginBottom: 4,
    },
      
    postContent: {
        fontSize: 14,
        color: "#374151", // ✅ xám nhẹ, dễ đọc
        lineHeight: 20,
    },
      
    commentBox: {
        borderTopWidth: 1,
        borderColor: "#e2e8f0",
        marginTop: 16,
        paddingTop: 8,
      },
    commentText: {
        color: "#2563eb",
        fontSize: 14,
        fontWeight: "500",
    },
    inlineNotify: {
        flexDirection: "row",
        alignItems: "center",
    },
    notifyText: {
        fontSize: 14,
        color: "#444",
        flexShrink: 1,
    },
    commentInput: {
        fontSize: 14,
        color: "#1f2937", // ✅ xám đậm như mẫu
        paddingVertical: 6,
        paddingHorizontal: 0,
        borderRadius: 0,
        backgroundColor: "transparent",
        borderWidth: 0, 
      },
      
    notifyInput: {
        fontSize: 14,
        color: "#111827",
        flex: 1,
        backgroundColor: "#f9fafb",
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    }, notifyWrapper: {
        alignItems: "center", 
        marginBottom: 16,
    },

    newNotifyButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", 
        backgroundColor: "#e0f2fe",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 999,
        width: "100%",
        maxWidth: 360,
    },

    newNotifyText: {
        fontSize: 15,
        fontWeight: "600",
        color: "#1d4ed8",
    },
      

});