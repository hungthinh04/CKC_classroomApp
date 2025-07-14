const { sql, pool } = require("../config/db");

// exports.getLopHocPhanByGiangVien = async (req, res) => {
//   const maGV = req.user.id;

//   try {
//     const result = await pool
//       .request()
//       .input('MaGV', sql.Int, maGV)
//       .query(`
//         SELECT * FROM LOPHOCPHAN
//         WHERE MaGV = @MaGV AND TrangThai = 1
//       `);

//     res.status(200).json(result.recordset);
//   } catch (err) {
//     console.error('❌ Lỗi lấy lớp học phần giảng viên:', err);
//     res.status(500).json({ message: 'Không thể lấy lớp học phần' });
//   }
// };

// exports.getLopHocPhanByGiangVien = async (req, res) => {
//   const userId = req.user.id;  // ID của giảng viên, từ user đã xác thực (JWT)
//   console.log("ID Giảng viên: ", userId);

//   try {
//     // Truy vấn cơ sở dữ liệu để lấy danh sách lớp học phần của giảng viên
//     const resultGV = await pool.request()
//       .input("MaGV", sql.Int, maGV)
//       .query("SELECT MaGV FROM GIANGVIEN WHERE MaTK = @userId");

//     if (!resultGV.recordset[0]) {
//       return res.status(404).json({ message: "Không tìm thấy sinh viên" });
//     }
//     const maSV = resultSV.recordset[0].MaSinhVien;

//     // Tiếp tục lấy lớp học phần dựa vào MaSinhVien
//     const result = await pool.request()
//       .input("MaSV", sql.VarChar(20), maSV)
//       .query(`
//         SELECT
//           lhp.ID,
//           lhp.TenLHP,
//           lhp.HocKy,
//           lhp.NamHoc,
//           gv.HoGV + ' ' + gv.TenGV AS TenGV,
//           mh.TenMH,
//           lh.MaLop
//         FROM SINHVIEN_LHP svlhp
//         JOIN LOPHOCPHAN lhp ON svlhp.MaLHP = lhp.ID
//         JOIN GIANGVIEN gv ON lhp.MaGV = gv.ID
//         JOIN MONHOC mh ON lhp.MaMH = mh.ID
//         JOIN LOPHOC lh ON lhp.MaLH = lh.ID
//         WHERE svlhp.MaSV = @MaSV AND lhp.TrangThai = 1
//       `);

//     if (result.recordset.length === 0) {
//       return res.status(404).json({ message: "Không tìm thấy lớp học phần cho sinh viên" });
//     }

//     // Gửi kết quả về frontend
//     res.json(result.recordset);
//   } catch (err) {
//     console.error("❌ Lỗi lấy LHP sinh viên:", err);
//     res.status(500).json({ message: "Không thể lấy lớp học phần sinh viên" });
//   }
// };
exports.getLopHocPhanByGiangVien = async (req, res) => {
  const userId = req.user.id;
  try {
    // Lấy MaGV từ bảng GIANGVIEN theo MaTK (userId)
    const gvResult = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .query("SELECT ID FROM GIANGVIEN WHERE MaTK = @UserId");
    if (!gvResult.recordset.length) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });
    }
    const maGV = gvResult.recordset[0].ID;
console.log(maGV, "MaGV");
    // Truy vấn lớp học phần mà giảng viên này tham gia
    const result = await pool.request().input("MaGV", sql.Int, maGV).query(`
        SELECT 
  lhp.ID,
  lhp.TenLHP,
  lhp.HocKy,
  lhp.NamHoc,
  gv.HoGV + ' ' + gv.TenGV AS TenGV,
  mh.TenMH,
  lh.MaLop
FROM GIANGVIEN_LHP gvlhp
JOIN LOPHOCPHAN lhp ON gvlhp.MaLHP = lhp.ID
LEFT JOIN GIANGVIEN gv ON lhp.MaGV = gv.ID
LEFT JOIN MONHOC mh ON lhp.MaMH = mh.ID
LEFT JOIN LOPHOC lh ON lhp.MaLH = lh.ID  -- Đổi JOIN này thành LEFT JOIN
WHERE gvlhp.MaGV = @MaGV

      `);

    if (result.recordset.length === 0) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy lớp học phần cho giảng viên" });
    }

    res.json(result.recordset);
    
  } catch (err) {
    console.error("❌ Lỗi lấy LHP giảng viên:", err);
    res.status(500).json({ message: "Không thể lấy lớp học phần giảng viên" });
  }
};

exports.getMH = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT ID AS maMH, TenMH FROM MONHOC WHERE IsDeleted = 0");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy danh sách môn học" });
  }
};


exports.getLopHocPhanFullInfoByGV = async (req, res) => {
  const maGV = req.user.id;
  try {
    const poolConnection = await pool.connect();
    const result = await poolConnection.request().input("MaGV", sql.Int, maGV)
      .query(`
        SELECT lhp.ID, lhp.TenLHP, lhp.HocKy, lhp.NamHoc, mh.TenMH, lh.TenLop,
               COUNT(DISTINCT sv.ID) AS SoSinhVien,
               COUNT(DISTINCT bt.ID) AS SoBaiTap
        FROM LOPHOCPHAN lhp
        JOIN MONHOC mh ON lhp.MaMH = mh.ID
        JOIN LOPHOC lh ON lhp.MaLH = lh.ID
        LEFT JOIN SINHVIEN sv ON sv.MaLopHoc = lh.ID
        LEFT JOIN BAITAP bt ON bt.MaLHP = lhp.ID
        WHERE lhp.MaGV = @MaGV
        GROUP BY lhp.ID, lhp.TenLHP, lhp.HocKy, lhp.NamHoc, mh.TenMH, lh.TenLop
      `);

    res.status(200).json(result.recordset);
  } catch (err) {
    console.error("❌ Lỗi lấy lớp học phần chi tiết:", err);
    res.status(500).json({ message: "Không thể lấy lớp học phần chi tiết" });
  }
};

exports.getDashboardLHP = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request().input("MaLHP", id).query(`
        SELECT 
          L.TenLHP,
          L.HocKy,
          L.NamHoc,
          (GV.HoGV + ' ' + GV.TenGV) AS TenGV,
          MH.TenMH,
          LH.MaLop,
          (
            SELECT COUNT(*) 
            FROM SINHVIEN_LHP 
            WHERE MaLHP = L.ID
          ) AS TongSinhVien,
          (
            SELECT COUNT(*) 
            FROM BAIVIET 
            WHERE MaLHP = L.ID
          ) AS TongBaiViet,
          (
            SELECT COUNT(*) 
            FROM BAIVIET 
            WHERE MaLHP = L.ID AND LoaiBV = 1
          ) AS TongBaiTap,
          (
            SELECT COUNT(*) 
            FROM SINHVIEN_BAITAP 
            WHERE MaBaiViet IN (
              SELECT ID FROM BAIVIET WHERE MaLHP = L.ID
            )
          ) AS SoLuongDaNop
        FROM LOPHOCPHAN L
        JOIN GIANGVIEN GV ON L.MaGV = GV.ID
        JOIN MONHOC MH ON L.MaMH = MH.ID
        JOIN LOPHOC LH ON L.MaLH = LH.ID
        WHERE L.ID = @MaLHP
      `);

    res.json(result.recordset[0]);
  } catch (error) {
    console.error("Lỗi dashboard:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.getAllGiangVien = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM GIANGVIEN");
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách giảng viên" });
  }
};

exports.getGiangVienByLHP = async (req, res) => {
  const { maLHP } = req.query;
  try {
    const result = await pool.request().input("MaLHP", sql.Int, maLHP).query(`
        SELECT sv.MaSinhVien, sv.HoTen, sv.MaSV
        FROM SINHVIEN_LHP slhp
        JOIN SINHVIEN sv ON slhp.MaSV = sv.ID
        WHERE slhp.MaLHP = @MaLHP
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy sinh viên" });
  }
};
exports.getMaGV = async (req, res) => {
  const userId = req.user.id; // Lấy ID từ thông tin người dùng (JWT)

  try {
    // Lấy MaGV từ bảng GIANGVIEN dựa trên MaTK (MaTK là ID của người dùng)
    const result = await pool
      .request()
      .input("UserId", sql.Int, userId)
      .query("SELECT MaGV FROM GIANGVIEN WHERE MaTK = @UserId");

    // Kiểm tra kết quả và trả về MaGV nếu tìm thấy
    if (!result.recordset.length) {
      return res.status(404).json({ message: "Giảng viên không tìm thấy" });
    }

    const maGV = result.recordset[0].MaGV;
    res.json({ maGV });
  } catch (err) {
    console.error("Lỗi lấy MaGV:", err);
    res.status(500).json({ message: "Không thể lấy MaGV" });
  }
};
