// // utils/multer.js
// const multer = require("multer");
// const path = require("path");

// // Cấu hình multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Thư mục lưu file
//   },
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const allowedTypes = ['.pdf', '.docx', '.jpg', '.jpeg', '.png']; // Các loại tệp cho phép

//     // Kiểm tra loại tệp
//     if (!allowedTypes.includes(ext)) {
//       return cb(new Error("Chỉ chấp nhận các file PDF, DOCX, JPG, PNG"));
//     }

//     // Đặt tên tệp với thời gian để tránh trùng lặp
//     cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
//   }
// });

// // Khởi tạo multer với cấu hình storage
// const upload = multer({ storage });

// // Xuất upload để sử dụng trong route
// module.exports = upload;

const multer = require('multer');
const path = require('path');

// Cấu hình multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Đảm bảo tệp được lưu vào thư mục 'uploads'
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  }
});

const upload = multer({ storage });

module.exports = upload;
