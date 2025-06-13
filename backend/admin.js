import express from 'express';
import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import { createConnection } from 'typeorm';
import { Users } from './models/Users';  // Import các model của bạn
import { GiangVien } from './models/GiangVien'; 
import { SinhVien } from './models/SinhVien';   // Import thêm các model khác nếu cần
const mssql = require('mssql');
const app = express();
const port = 3000;

// Kết nối tới MSSQL bằng TypeORM
createConnection({
  type: 'mssql',
  host: 'localhost',  // Đảm bảo bạn đã cấu hình chính xác thông tin này
  port: 1433,
  username: process.env.DB_USERNAME,  // Thay thế với username MSSQL của bạn
  password: process.env.DB_PASSWORD,  // Thay thế với password MSSQL của bạn
  database: 'CKCClassroom64',  // Tên database của bạn
  synchronize: true,  // Chế độ tự động đồng bộ hóa cơ sở dữ liệu (chỉ dùng trong môi trường phát triển)
  logging: true,
  entities: [
    Users,
    GiangVien,
    SinhVien,
    // Thêm các entity khác của bạn vào đây
  ],
}).then(() => {
  console.log("Connected to MSSQL Database");
}).catch((err) => {
  console.error("Database connection failed: ", err);
});

// Cấu hình AdminJS
const adminJs = new AdminJS({
  resources: [
    {
      resource: Users,  // Tạo resource cho bảng Users
      options: {
        listProperties: ['id', 'maNguoiDung', 'email', 'quyen', 'trangThai'],  // Cấu hình các cột hiển thị khi liệt kê
        editProperties: ['maNguoiDung', 'email', 'matKhau', 'quyen', 'trangThai'],  // Cấu hình các cột có thể chỉnh sửa
        filterProperties: ['email', 'maNguoiDung'],  // Cấu hình các cột có thể dùng để lọc
      },
    },
    {
      resource: GiangVien,  // Tạo resource cho bảng GiangVien
      options: {
        listProperties: ['id', 'hoTen', 'maGiangVien'],
        editProperties: ['hoTen', 'maBM'],
      },
    },
    {
      resource: SinhVien,  // Tạo resource cho bảng SinhVien
      options: {
        listProperties: ['id', 'maSinhVien', 'hoTen', 'maLopHoc'],
        editProperties: ['hoTen', 'maLopHoc'],
      },
    },
    // Thêm các resource khác cho các bảng khác của bạn
  ],
  branding: {
    companyName: 'CKC Classroom',
  },
});

// Cấu hình AdminJS với Express
const adminRouter = AdminJSExpress.buildRouter(adminJs);

// Dùng router này trong express app của bạn
app.use('/admin', adminRouter);

// Chạy server Express
app.listen(port, () => {
  console.log(`AdminJS is running at http://localhost:${port}/admin`);
});
