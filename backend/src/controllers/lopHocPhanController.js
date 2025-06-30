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
  JOIN GIANGVIEN gv ON lhp.MaGV = gv.ID
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
