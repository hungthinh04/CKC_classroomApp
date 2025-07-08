const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Lấy token từ header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

  try {
    // Xác thực token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng vào request (ID và role)
    next();  // Tiến hành tiếp tục xử lý request
  } catch (err) {
    // Nếu token không hợp lệ, trả về lỗi 403 (Forbidden)
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};


module.exports.authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Lưu thông tin người dùng vào request (ID và role)
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token không hợp lệ" });
  }
};