const { pool, sql } = require("../config/db");

exports.getLopHocPhanById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM LOPHOCPHAN WHERE ID = @ID");
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi khi lấy lớp học phần" });
  }
};

exports.getBaiTapByLopHocPhan = async (req, res) => {
  const { maLHP } = req.query;
  try {
    const result = await pool.request()
      .input('MaLHP', sql.Int, parseInt(maLHP))
      .query(`
        SELECT ID, TieuDe, NgayTao, NgayKetThuc, GioKetThuc
        FROM BAIVIET
        WHERE MaLHP = @MaLHP AND LoaiBV = 1
        ORDER BY NgayTao DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Lỗi lấy danh sách bài tập:", err);
    res.status(500).json({ message: 'Lỗi server khi lấy bài tập' });
  }
};


exports.getGiangVienVaSinhVien = async (req, res) => {
  const maLHP = req.query.maLHP;

  try {
    const result = await pool.request().input("MaLHP", sql.Int, maLHP).query(`
  SELECT 
    gv.ID AS maGV, gv.HoGV + ' ' + gv.TenGV AS tenGV,
    sv.ID AS maSV, sv.HoTen AS tenSV
  FROM LOPHOCPHAN lhp
  JOIN GIANGVIENN gv ON lhp.MaGV = gv.ID
  JOIN SINHVIEN_LHP slhp ON lhp.ID = slhp.MaLHP
  JOIN SINHVIEN sv ON sv.ID = slhp.MaSV
  WHERE lhp.ID = @MaLHP
`);

    const rows = result.recordset;

    if (rows.length === 0) {
      return res.json({ giangVien: null, sinhViens: [] });
    }

    const giangVien = {
      maGV: rows[0].maGV,
      tenGV: rows[0].tenGV,
    };

    const sinhViens = rows.map((r) => ({
      maSV: r.maSV,
      tenSV: r.tenSV,
    }));

    res.json({ giangVien, sinhViens });
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
    const userRes = await pool.request()
      .input("Email", sql.VarChar, email)
      .query("SELECT ID FROM USERS WHERE Email = @Email AND Quyen = 0");

    if (userRes.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }

    const maTK = userRes.recordset[0].ID;

    // 2. Tìm ID sinh viên tương ứng với tài khoản đó
    const svRes = await pool.request()
      .input("MaTK", sql.Int, maTK)
      .query("SELECT ID FROM SINHVIEN WHERE MaTK = @MaTK");

    if (svRes.recordset.length === 0) {
      return res.status(404).json({ message: "Tài khoản này chưa được đăng ký làm sinh viên" });
    }

    const maSV = svRes.recordset[0].ID;

    // 3. Kiểm tra sinh viên đã có trong lớp chưa
    const checkExist = await pool.request()
      .input("MaSV", sql.Int, maSV)
      .input("MaLHP", sql.Int, maLHP)
      .query("SELECT * FROM SINHVIEN_LHP WHERE MaSV = @MaSV AND MaLHP = @MaLHP");

    if (checkExist.recordset.length > 0) {
      return res.status(409).json({ message: "Sinh viên đã nằm trong lớp học phần này" });
    }

    // 4. Thêm vào lớp học phần
    await pool.request()
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
    // Tìm user có role giảng viên
    const userRes = await pool.request()
      .input("Email", sql.VarChar, email)
      .query("SELECT ID FROM USERS WHERE Email = @Email AND Quyen = 1");

    if (userRes.recordset.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });
    }

    const maTK = userRes.recordset[0].ID;

    // Cập nhật lại lớp học phần
    await pool.request()
      .input("MaTK", sql.Int, maTK)
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        UPDATE LOPHOCPHAN SET MaGV = @MaTK WHERE ID = @MaLHP
      `);

    res.json({ message: "Đã cập nhật giảng viên cho lớp học phần" });
  } catch (err) {
    console.error("❌ Lỗi thêm GV:", err);
    res.status(500).json({ message: "Lỗi khi thêm giảng viên" });
  }
};

exports.removeSinhVien = async (req, res) => {
  const { maLHP } = req.params;
  const { maSV } = req.body;

  if (!maSV) return res.status(400).json({ message: "Thiếu mã sinh viên" });

  try {
    await pool.request()
      .input("MaLHP", sql.Int, maLHP)
      .input("MaSV", sql.Int, maSV)
      .query("DELETE FROM SINHVIEN_LHP WHERE MaLHP = @MaLHP AND MaSV = @MaSV");

    res.json({ message: "Đã xóa sinh viên khỏi lớp học phần" });
  } catch (err) {
    console.error("❌ Lỗi xóa sinh viên:", err);
    res.status(500).json({ message: "Lỗi khi xóa sinh viên" });
  }
};
