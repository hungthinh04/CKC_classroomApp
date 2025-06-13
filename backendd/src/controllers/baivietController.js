const { pool, sql } = require('../config/db');

exports.getBaiVietByLopHocPhan = async (req, res) => {
  const maLHP = req.params.id;

  try {
    const result = await pool.request()
      .input('maLHP', sql.Int, maLHP)
      .query(`
        SELECT bv.ID, bv.TieuDe, bv.NoiDung, bv.LoaiBV, bv.NgayTao,
               gv.HoTen AS TenGiangVien
        FROM BAIVIET bv
        JOIN GIANGVIEN gv ON bv.MaGV = gv.ID
        WHERE bv.MaLHP = @maLHP
        ORDER BY bv.NgayTao DESC
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Lỗi truy vấn bài viết' });
  }
};
