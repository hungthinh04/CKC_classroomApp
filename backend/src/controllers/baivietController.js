const { pool, sql } = require('../config/db');

// exports.getBaiVietByLopHocPhan = async (req, res) => {
//   const maLHP = req.params.id;

//   try {
//     const result = await pool.request()
//       .input('maLHP', sql.Int, maLHP)
//       .query(`
//         SELECT bv.ID, bv.TieuDe, bv.NoiDung, bv.LoaiBV, bv.NgayTao,
//                gv.HoTen AS TenGiangVien
//         FROM BAIVIET bv
//         JOIN GIANGVIEN gv ON bv.MaGV = gv.ID
//         WHERE bv.MaLHP = @maLHP
//         ORDER BY bv.NgayTao DESC
//       `);

//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Lỗi truy vấn bài viết' });
//   }
// };


exports.getBaiVietByLHP = async (req, res) => {
  const { maLHP } = req.query;
  try {
    const result = await pool.request()
      .input('MaLHP', sql.Int, maLHP)
      .query('SELECT * FROM BAIVIET WHERE MaLHP = @MaLHP');
    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy bài viết' });
  }
  console.log("query:", req.query);
};

exports.createBaiViet = async (req, res) => {
  const maGV = req.params.id;
  const { maLHP, tieuDe, noiDung, loaiBV } = req.body;

  try {
    const result = await pool.request()
      .input('tieuDe', sql.NVarChar, tieuDe)
      .input('noiDung', sql.Text, noiDung)
      .input('loaiBV', sql.NVarChar, loaiBV)
      .input('maLHP', sql.Int, maLHP)
      .input('maGV', sql.Int, maGV)
      .query(`
        INSERT INTO BAIVIET (TieuDe, NoiDung, LoaiBV, MaLHP, MaGV)
        OUTPUT INSERTED.*
        VALUES (@tieuDe, @noiDung, @loaiBV, @maLHP, @maGV)
      `);

    res.status(201).json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể tạo bài viết' });
  }
};

