import { useLopHocPhan } from "@/context/_context";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { API_BASE_URL } from "@/constants/api";
export default function PeopleScreen() {
    const { id, tenLHP } = useLopHocPhan();
    type User = {
        maSV: string;
        hoSV: string;
        tenSV: string;
        // add other fields if needed
    };
    const [users, setUsers] = useState<User[]>([]);
    const [giangVien, setGiangVien] = useState<any>(null);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            // 1. Fetch lớp học phần
            const lhpRes = await fetch(`${API_BASE_URL}/lophophan/${id}`);
            const lhp = await lhpRes.json();

            // 2. Fetch giảng viên từ maGV
            const gvRes = await fetch(
                `${API_BASE_URL}/giangvien?id=${lhp.maGV}`
            );
            const [gv] = await gvRes.json();
            setGiangVien(gv);

            // 3. Fetch sinh viên
            const sv_lhpRes = await fetch(
                `${API_BASE_URL}/sinhvien_lhp?maLHP=${id}`
            );
            const sv_lhp = await sv_lhpRes.json();

            const svs = await Promise.all(
                sv_lhp.map(async (item: any) => {
                    const res = await fetch(
                        `${API_BASE_URL}/sinhvien?maSV=${item.maSV}`
                    );
                    const [sv] = await res.json();
                    return sv;
                })
            );

            setUsers(svs);
        };

        fetchData();
    }, [id]);


    return (
        <View style={{ flex: 1, backgroundColor: "#fff" }}>
            {/* === GIẢNG VIÊN === */}
            {giangVien && (
                <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: "600", color: "#1d4ed8" }}>
                        Giảng viên
                    </Text>
                    <View
                        style={{
                            height: 1,
                            backgroundColor: "#cbd5e1",
                            marginTop: 4,
                            marginBottom: 16,
                        }}
                    />
                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: "#0f766e",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                                {giangVien.tenGV?.charAt(0) || "G"}
                            </Text>
                        </View>
                        <Text style={{ fontWeight: "500", fontSize: 15, color: "#111" }}>
                            {giangVien.hoGV} {giangVien.tenGV}
                        </Text>
                    </View>
                </View>
            )}

            {/* === BẠN HỌC === */}
            <View style={{ paddingHorizontal: 16 }}>
                <Text style={{ fontSize: 18, fontWeight: "600", color: "#1d4ed8" }}>
                    Bạn học
                </Text>
                <View
                    style={{
                        height: 1,
                        backgroundColor: "#cbd5e1",
                        marginTop: 4,
                        marginBottom: 16,
                    }}
                />
            </View>

            <FlatList
                contentContainerStyle={{ paddingHorizontal: 16 }}
                data={users}
                keyExtractor={(item) => item.maSV.toString()}
                renderItem={({ item }) => (
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            marginBottom: 12,
                        }}
                    >
                        <View
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                backgroundColor: "#0f766e",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 12,
                            }}
                        >
                            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>
                                {item.tenSV?.charAt(0) || "?"}
                            </Text>
                        </View>

                        <Text style={{ fontWeight: "500", fontSize: 15, color: "#111" }}>
                            {item.hoSV} {item.tenSV}
                        </Text>
                    </View>
                )}
            />
        </View>
    );


}