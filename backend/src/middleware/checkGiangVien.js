const { pool, sql } = require('../config/db');
const jwt = require("jsonwebtoken");
// module.exports = async (req, res, next) => {
//   const userId = req.user.id;

//   try {
//     const result = await pool.request()
//       .input('id', sql.Int, userId)
//       .query('SELECT Quyen FROM USERS WHERE ID = @id');

//     const user = result.recordset[0];
//     if (!user || (user.Quyen !== 1 && user.Quyen !== 2)) {  // Giảng Viên (Quyen = 1) hoặc Admin (Quyen = 2)
//       return res.status(403).json({ message: 'Bạn không có quyền Giảng Viên hoặc Admin' });
//     }

//     next();  // Tiếp tục nếu là Giảng Viên hoặc Admin
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Lỗi kiểm tra quyền' });
//   }
// };


const checkGiangVien = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Thiếu token" });
  }
console.log(authHeader)
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // payload có id, email, quyen
    if (decoded.quyen === 1) {
      return res.status(403).json({ message: "Chỉ giảng viên mới được phép thao tác" });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
};

module.exports = checkGiangVien;
