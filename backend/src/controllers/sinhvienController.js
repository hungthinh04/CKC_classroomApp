const { pool, sql } = require('../config/db');


// exports.getSinhVienByLHP = async (req, res) => {
//   const { maLHP } = req.query;
//   try {
//     const result = await pool.request()
//       .input('MaLHP', sql.Int, maLHP)
//       .query(`
//         SELECT sv.MaSinhVien, sv.HoTen, sv.ID AS MaSV
//         FROM SINHVIEN_LHP slhp
//         JOIN SINHVIEN sv ON slhp.MaSV = sv.ID
//         WHERE slhp.MaLHP = @MaLHP
//       `);
//     res.json(result.recordset);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Lỗi khi lấy sinh viên' });
//   }
// };
