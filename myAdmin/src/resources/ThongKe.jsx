import React, { useEffect, useState } from "react";
import { useNotify, useRefresh } from "react-admin";
import { Card, CardContent, Typography } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const ThongKeList = () => {
  const [chartData, setChartData] = useState([]);
  const notify = useNotify();
  const refresh = useRefresh();

  useEffect(() => {
    fetch("https://ckc-classroomapp.onrender.com/admin/thongke")
      .then((response) => response.json())
      .then((res) => {
        const data = [
          { name: "Sinh viên", value: res.sinhVien },
          { name: "Giảng viên", value: res.giangVien },
          { name: "Lớp học phần", value: res.lopHocPhan },
          { name: "Khoa", value: res.khoa },
          { name: "Bộ môn", value: res.boMon },
          { name: "Bài viết", value: res.baiViet },
          { name: "Người dùng", value: res.sinhVien + res.giangVien },
        ];
        setChartData(data);
      })
      .catch((error) => {
        console.error("Error fetching stats:", error);
        notify("Lỗi khi tải dữ liệu thống kê", { type: "warning" });
      });
  }, [refresh, notify]);

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Thống kê hệ thống
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ThongKeList;
