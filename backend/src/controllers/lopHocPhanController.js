const { pool, sql } = require("../config/db");

exports.getLopHocPhanById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.request()
      .input('ID', sql.Int, id)
      .query('SELECT * FROM LOPHOCPHAN WHERE ID = @ID');
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy lớp học phần' });
  }
};