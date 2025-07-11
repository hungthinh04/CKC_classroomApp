const { pool, sql } = require("../config/db");

exports.getBaiTapByLHP = async (req, res) => {
  const { maLHP } = req.query; // Lấy MaLHP từ query param
  try {
    const result = await pool.request().input("MaLHP", sql.Int, maLHP).query(`
        SELECT 
          bv.ID, bv.TieuDe, bv.NgayTao, bv.NoiDung, bv.LoaiBV, 
          bv.MaBaiViet, bv.TrangThai, gv.TenGV, gv.HoGV, bv.NgayKetThuc
        FROM BAIVIET bv
        JOIN LOPHOCPHAN lhp ON bv.MaLHP = lhp.ID
        JOIN GIANGVIEN gv ON lhp.MaGV = gv.ID
        WHERE bv.MaLHP = @MaLHP AND bv.LoaiBV = 1
        ORDER BY bv.NgayTao DESC
      `);
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy bài tập" });
  }
};
