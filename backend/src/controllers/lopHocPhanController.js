const { pool, sql } = require("../config/db");

exports.getLopHocPhanById = async (req, res) => {
  const { id } = req.params;
  try {
    // Lấy thông tin lớp học phần + join GIANGVIEN
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query(`
        SELECT 
          LHP.*, 
          GV.HoGV, 
          GV.TenGV 
        FROM LOPHOCPHAN LHP
        LEFT JOIN GIANGVIEN GV ON LHP.MaGV = GV.MaGV
        WHERE LHP.ID = @ID
      `);

    if (!result.recordset[0]) {
      return res.status(404).json({ message: "Không tìm thấy lớp học phần" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy lớp học phần" });
  }
};

exports.getBaiTapByLopHocPhan = async (req, res) => {
  const { maLHP } = req.query;
  try {
    const result = await pool.request().input("MaLHP", sql.Int, parseInt(maLHP))
      .query(`
        SELECT ID, TieuDe, NgayTao, NgayKetThuc, GioKetThuc
        FROM BAIVIET
        WHERE MaLHP = @MaLHP AND LoaiBV = 1
        ORDER BY NgayTao DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi lấy danh sách bài tập:", err);
    res.status(500).json({ message: "Lỗi server khi lấy bài tập" });
  }
};
exports.getGiangVienVaSinhVien = async (req, res) => {
  const maLHP = req.query.maLHP;

  try {
    // Lấy danh sách giảng viên từ GIANGVIEN_LHP
    const resultGV = await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT gv.ID AS maGV, gv.HoGV + ' ' + gv.TenGV AS tenGV
        FROM GIANGVIEN_LHP glhp
        JOIN GIANGVIEN gv ON glhp.MaGV = gv.ID
        WHERE glhp.MaLHP = @MaLHP
      `);

    // Lấy danh sách sinh viên từ SINHVIEN_LHP
    const resultSV = await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT sv.ID AS maSV, sv.HoTen AS tenSV
        FROM SINHVIEN_LHP slhp
        JOIN SINHVIEN sv ON slhp.MaSV = sv.ID
        WHERE slhp.MaLHP = @MaLHP
      `);

    const giangViens = resultGV.recordset;
    const sinhViens = resultSV.recordset;
    console.log(giangViens, "Giảng viên:");
    console.log(sinhViens, "Sinh viên:");
    res.json({ giangViens, sinhViens });
  } catch (err) {
    console.error("Lỗi truy vấn:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};


exports.addSinhVien = async (req, res) => {
  const { maLHP } = req.params;
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Thiếu email" });

  try {
    // 1. Tìm ID tài khoản người dùng từ email
    const userRes = await pool
      .request()
      .input("Email", sql.VarChar, email)
      .query("SELECT ID FROM USERS WHERE Email = @Email AND Quyen = 0");

    if (userRes.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }

    const maTK = userRes.recordset[0].ID;

    // 2. Tìm ID sinh viên tương ứng với tài khoản đó
    const svRes = await pool
      .request()
      .input("MaTK", sql.Int, maTK)
      .query("SELECT ID FROM SINHVIEN WHERE MaTK = @MaTK");

    if (svRes.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "Tài khoản này chưa được đăng ký làm sinh viên" });
    }

    const maSV = svRes.recordset[0].ID;

    // 3. Kiểm tra sinh viên đã có trong lớp chưa
    const checkExist = await pool
      .request()
      .input("MaSV", sql.Int, maSV)
      .input("MaLHP", sql.Int, maLHP)
      .query(
        "SELECT * FROM SINHVIEN_LHP WHERE MaSV = @MaSV AND MaLHP = @MaLHP"
      );

    if (checkExist.recordset.length > 0) {
      return res
        .status(409)
        .json({ message: "Sinh viên đã nằm trong lớp học phần này" });
    }

    // 4. Thêm vào lớp học phần
    await pool
      .request()
      .input("MaSV", sql.Int, maSV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, 1) // hoặc 0 nếu mặc định
      .query(`
        INSERT INTO SINHVIEN_LHP (MaSV, MaLHP, TrangThai)
        VALUES (@MaSV, @MaLHP, @TrangThai)
      `);

    res.json({ message: "✅ Đã thêm sinh viên vào lớp học phần" });
  } catch (err) {
    console.error("❌ Lỗi thêm sinh viên:", err);
    res.status(500).json({ message: "Lỗi khi thêm sinh viên" });
  }
};

exports.addGiangVien = async (req, res) => {
  const { maLHP } = req.params;
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Thiếu email" });

  try {
    // Lấy ID user
   const userRes = await pool.request()
  .input("Email", sql.VarChar, email)
  .query("SELECT ID FROM USERS WHERE Email = @Email AND Quyen = 1");

if (userRes.recordset.length === 0)
  return res.status(404).json({ message: "Không tìm thấy giảng viên" });

const maTK = userRes.recordset[0].ID;

// Lấy ID GIANGVIEN
const gvRes = await pool.request()
  .input("MaTK", sql.Int, maTK)
  .query("SELECT ID FROM GIANGVIEN WHERE MaTK = @MaTK");

if (gvRes.recordset.length === 0)
  return res.status(404).json({ message: "Tài khoản chưa đăng ký làm giảng viên" });

    // Lấy ID giảng viên
      if (gvRes.recordset.length === 0)
      return res.status(404).json({ message: "Tài khoản chưa đăng ký làm giảng viên" });

    const maGV = gvRes.recordset[0].ID;

    // Kiểm tra đã có trong lớp chưa
    const checkExist = await pool.request()
      .input("MaGV", sql.Int, maGV)
      .input("MaLHP", sql.Int, maLHP)
      .query("SELECT * FROM GIANGVIEN_LHP WHERE MaGV = @MaGV AND MaLHP = @MaLHP");

    if (checkExist.recordset.length > 0)
      return res.status(409).json({ message: "Giảng viên đã có trong lớp học phần này" });

    // Thêm mới
    await pool.request()
      .input("MaGV", sql.Int, maGV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, 1)
      .query(`
        INSERT INTO GIANGVIEN_LHP (MaGV, MaLHP, TrangThai)
        VALUES (@MaGV, @MaLHP, @TrangThai)
      `);

    res.json({ message: "✅ Đã thêm giảng viên vào lớp học phần" });
  } catch (err) {
    console.error("❌ Lỗi thêm GV:", err);
    res.status(500).json({ message: "Lỗi khi thêm giảng viên" });
  }
};

exports.removeGiangVien = async (req, res) => {
  const { maLHP } = req.params;
  const { maGV } = req.body;
  const currentUserId = req.user?.id;

  try {
    // Lấy ID của giảng viên hiện tại
    const currentGVRes = await pool
      .request()
      .input("MaTK", sql.Int, currentUserId)
      .query("SELECT ID FROM GIANGVIEN WHERE MaTK = @MaTK");
    const currentGVId = currentGVRes.recordset[0]?.ID;

    if (parseInt(maGV) === currentGVId) {
      return res.status(403).json({ message: "Bạn không thể xóa chính mình khỏi lớp học phần!" });
    }

    await pool
      .request()
      .input("MaLHP", sql.Int, maLHP)
      .input("MaGV", sql.Int, maGV)
      .query("DELETE FROM GIANGVIEN_LHP WHERE MaLHP = @MaLHP AND MaGV = @MaGV");

    res.json({ message: "Đã xóa giảng viên khỏi lớp học phần" });
  } catch (err) {
    console.error("❌ Lỗi xóa giảng viên:", err);
    res.status(500).json({ message: "Lỗi khi xóa giảng viên" });
  }
};



exports.removeSinhVien = async (req, res) => {
  const { maLHP } = req.params;
  const { maSV } = req.body;

  if (!maSV) return res.status(400).json({ message: "Thiếu mã sinh viên" });

  try {
    await pool
      .request()
      .input("MaLHP", sql.Int, maLHP)
      .input("MaSV", sql.Int, maSV)
      .query("DELETE FROM SINHVIEN_LHP WHERE MaLHP = @MaLHP AND MaSV = @MaSV");

    res.json({ message: "Đã xóa sinh viên khỏi lớp học phần" });
  } catch (err) {
    console.error("❌ Lỗi xóa sinh viên:", err);
    res.status(500).json({ message: "Lỗi khi xóa sinh viên" });
  }
};
// exports.addLopHocPhan = async (req, res) => {
//   const { tenLHP, hocKy, namHoc, maMH, trangThai } = req.body;

//   const userId = req.user?.id;
//   console.log(req.body, "Dữ liệu lớp học phần");
//   console.log(userId, "ID Giảng viên");
//   if (!userId) {
//     return res.status(400).json({ message: "Không thể xác định giảng viên, vui lòng đăng nhập lại." });
//   }

//   try {
//     // Lấy ID giảng viên từ bảng GIANGVIEN dựa trên MaTK
//     const resultGV = await pool
//       .request()
//       .input("userId", sql.Int, userId)
//       .query("SELECT ID FROM GIANGVIEN WHERE MaTK = @userId");

//     if (!resultGV.recordset.length) {
//       return res.status(404).json({ message: "Giảng viên không tìm thấy" });
//     }
//     const maGV = resultGV.recordset[0].ID;

//     // Lấy MaMH từ tên môn học
//     const checkMonHoc = await pool
//   .request()
//   .input("MaMH", sql.Int, maMH)
//   .query("SELECT * FROM MONHOC WHERE ID = @MaMH");

// if (!checkMonHoc.recordset.length) {
//   return res.status(400).json({ message: "Môn học không hợp lệ" });
// }
//     // Thêm lớp học phần vào bảng LOPHOCPHAN
//     await pool
//   .request()
//   .input("TenLHP", sql.NVarChar(255), tenLHP)
//   .input("HocKy", sql.SmallInt, hocKy)
//   .input("NamHoc", sql.Int, namHoc)
//   .input("MaGV", sql.Int, maGV)
//   .input("MaMH", sql.Int, maMH) // Dùng biến maMH từ req.body
//   .input("TrangThai", sql.SmallInt, trangThai || 1)
//   .query(`
//     INSERT INTO LOPHOCPHAN (TenLHP, HocKy, NamHoc, MaGV, MaMH, TrangThai)
//     VALUES (@TenLHP, @HocKy, @NamHoc, @MaGV, @MaMH, @TrangThai);
//     SELECT SCOPE_IDENTITY() AS ID;
//   `);

//     res.status(201).json({ message: "Lớp học phần đã được tạo." });
//   } catch (error) {
//     console.error("Lỗi khi thêm lớp học phần:", error);
//     res.status(500).json({ message: "Không thể thêm lớp học phần." });
//   }
// };


exports.addLopHocPhan = async (req, res) => {
  const { tenLHP, hocKy, namHoc, maMH, trangThai } = req.body;

  const userId = req.user?.id;
  console.log(req.body, "Dữ liệu lớp học phần");
  console.log(userId, "ID Giảng viên");
  if (!userId) {
    return res.status(400).json({ message: "Không thể xác định giảng viên, vui lòng đăng nhập lại." });
  }

  try {
    // Lấy ID giảng viên từ bảng GIANGVIEN dựa trên MaTK
    const resultGV = await pool
      .request()
      .input("userId", sql.Int, userId)
      .query("SELECT ID FROM GIANGVIEN WHERE MaTK = @userId");

    if (!resultGV.recordset.length) {
      return res.status(404).json({ message: "Giảng viên không tìm thấy" });
    }
    const maGV = resultGV.recordset[0].ID;

    // Lấy MaMH từ tên môn học
    const checkMonHoc = await pool
      .request()
      .input("MaMH", sql.Int, maMH)
      .query("SELECT * FROM MONHOC WHERE ID = @MaMH");

    if (!checkMonHoc.recordset.length) {
      return res.status(400).json({ message: "Môn học không hợp lệ" });
    }

    // 1. Thêm lớp học phần vào bảng LOPHOCPHAN và lấy ID vừa tạo
    const insertLHP = await pool
      .request()
      .input("TenLHP", sql.NVarChar(255), tenLHP)
      .input("HocKy", sql.SmallInt, hocKy)
      .input("NamHoc", sql.Int, namHoc)
      .input("MaGV", sql.Int, maGV)
      .input("MaMH", sql.Int, maMH)
      .input("TrangThai", sql.SmallInt, trangThai || 1)
      .query(`
        INSERT INTO LOPHOCPHAN (TenLHP, HocKy, NamHoc, MaGV, MaMH, TrangThai)
        OUTPUT Inserted.ID
        VALUES (@TenLHP, @HocKy, @NamHoc, @MaGV, @MaMH, @TrangThai)
      `);

    const newLHPId = insertLHP.recordset[0].ID;

    // 2. Mapping vào GIANGVIEN_LHP
    await pool.request()
      .input("MaGV", sql.Int, maGV)
      .input("MaLHP", sql.Int, newLHPId)
      .input("TrangThai", sql.SmallInt, 1)
      .query(`
        INSERT INTO GIANGVIEN_LHP (MaGV, MaLHP, TrangThai)
        VALUES (@MaGV, @MaLHP, @TrangThai)
      `);

    res.status(201).json({ message: "Lớp học phần đã được tạo." });
  } catch (error) {
    console.error("Lỗi khi thêm lớp học phần:", error);
    res.status(500).json({ message: "Không thể thêm lớp học phần." });
  }
};


// api/lophocphan/:maLHP/giangvien
exports.getGiangViensOfLHP = async (req, res) => {
  const maLHP = req.params.maLHP || req.query.maLHP;
  try {
    const result = await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT gv.ID AS maGV, gv.HoGV + ' ' + gv.TenGV AS tenGV, us.Email, us.HoTen, us.ID AS userId
        FROM GIANGVIEN_LHP glhp
        JOIN GIANGVIEN gv ON glhp.MaGV = gv.ID
        JOIN USERS us ON gv.MaTK = us.ID
        WHERE glhp.MaLHP = @MaLHP
      `);

    res.json(result.recordset); // [{maGV, tenGV, ...}]
  } catch (err) {
    console.error("Lỗi lấy giảng viên:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// api/lophocphan/:maLHP/sinhvien
exports.getSinhViensOfLHP = async (req, res) => {
  const maLHP = req.params.maLHP || req.query.maLHP;
  try {
    const result = await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT sv.ID AS maSV, sv.HoTen AS tenSV, us.Email, us.HoTen, us.ID AS userId
        FROM SINHVIEN_LHP slhp
        JOIN SINHVIEN sv ON slhp.MaSV = sv.ID
        JOIN USERS us ON sv.MaTK = us.ID
        WHERE slhp.MaLHP = @MaLHP
      `);

    res.json(result.recordset); // [{maSV, tenSV, ...}]
  } catch (err) {
    console.error("Lỗi lấy sinh viên:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};



// api/lophocphan/thanhphan?maLHP=xx
exports.getThanhPhanLopHocPhan = async (req, res) => {
  const maLHP = req.query.maLHP;
  try {
    // Lấy giảng viên
    const gvRes = await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT gv.ID AS maGV, gv.HoGV + ' ' + gv.TenGV AS tenGV, us.Email, us.HoTen, us.ID AS userId
        FROM GIANGVIEN_LHP glhp
        JOIN GIANGVIEN gv ON glhp.MaGV = gv.ID
        JOIN USERS us ON gv.MaTK = us.ID
        WHERE glhp.MaLHP = @MaLHP
      `);
    // Lấy sinh viên
    const svRes = await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT sv.ID AS maSV, sv.HoTen AS tenSV, us.Email, us.HoTen, us.ID AS userId
        FROM SINHVIEN_LHP slhp
        JOIN SINHVIEN sv ON slhp.MaSV = sv.ID
        JOIN USERS us ON sv.MaTK = us.ID
        WHERE slhp.MaLHP = @MaLHP
      `);

    res.json({
      giangViens: gvRes.recordset,
      sinhViens: svRes.recordset,
    });
  } catch (err) {
    console.error("Lỗi lấy thành phần lớp học phần:", err);
    res.status(500).json({ message: "Lỗi server" });
  }
};

exports.luuTruLop = async (req, res) => {
  const { id } = req.params;
  console.log(id," ID lớp học phần để lưu trữ");
  try {
      await pool.request()
      .input("ID", sql.Int, id)
      .query("UPDATE LOPHOCPHAN SET TrangThai = 0 WHERE ID = @ID");

    res.json({ success: true, message: "Đã bỏ lưu trữ lớp học phần!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật!", error });
  }
};


exports.removeLuuTru = async (req, res) => {
  const { id } = req.params;  // Lấy ID lớp học phần từ params
  try {
    // Cập nhật trạng thái của lớp học phần thành 1 (bỏ lưu trữ)
    await pool.request()
      .input("ID", sql.Int, id)
      .query("UPDATE LOPHOCPHAN SET TrangThai = 1 WHERE ID = @ID");

    res.json({ success: true, message: "Đã bỏ lưu trữ lớp học phần!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật!", error });
  }
};


exports.getLhpLuuTru = async (req, res) => {
  const userId = req.user.id;  // lấy userId từ JWT hoặc params (tuỳ thuộc vào cách bạn xác thực)
console.log(userId, "User ID Giảng viên");
  try {
    // Truy vấn lấy các lớp học phần có trạng thái "TrangThai = 0"
    const result = await pool.request()
      .input("UserId", sql.Int, userId)
      .query(`
        SELECT * FROM LOPHOCPHAN
        WHERE MaGV = @UserId AND TrangThai = 0
      `);
console.log(result.recordset, "LHP đã lưu trữ");
    res.json(result.recordset);  // trả về danh sách lớp học phần đã lưu trữ
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi lấy lớp học phần đã lưu trữ", error });
  }
};