// pages/PostDetail.tsx
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Text, ScrollView, StyleSheet, View } from "react-native";

export default function PostDetail() {
    const [post, setPost] = useState<any>(null);
    const { query } = useRouter(); // Sử dụng query để lấy ID bài viết từ URL
    const postId = query.id;

    useEffect(() => {
        if (postId) {
            const fetchPostDetail = async () => {
                const res = await fetch(`http://192.168.1.102:3001/baiviet/${postId}`);
                const data = await res.json();
                setPost(data);
            };
            fetchPostDetail();
        }
    }, [postId]);

    if (!post) return <Text>Loading...</Text>;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>{post.tieuDe}</Text>
            <Text style={styles.date}>{new Date(post.ngayTao).toLocaleDateString()}</Text>
            <Text style={styles.content}>{post.noiDung}</Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    date: {
        fontSize: 14,
        color: "#888",
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        color: "#333",
    },
});
