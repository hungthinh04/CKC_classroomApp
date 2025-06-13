const { pool, sql, poolConnect } = require('./src/config/db');

(async () => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT TOP 1 * FROM USERS');
    console.log('Kết nối thành công! Dữ liệu:', result.recordset);
  } catch (err) {
    console.error('Lỗi kết nối DB:', err);
  }
})();
