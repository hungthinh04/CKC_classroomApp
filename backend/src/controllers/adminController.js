// adminController.js

const { pool, sql } = require("../config/db");

exports.getKhoaById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT ID, MaKhoa, TenKhoa FROM KHOA WHERE ID = @ID");

    const khoa = result.recordset[0];
    if (!khoa) return res.status(404).json({ message: "Không tìm thấy khoa" });

    // Quan trọng: phải trả về key `id`
    res.json({
      id: khoa.ID,
      maKhoa: khoa.MaKhoa,
      tenKhoa: khoa.TenKhoa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn khoa" });
  }
};

exports.getBoMonById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT ID, MaBoMon, TenBM, MaKhoa FROM BOMON WHERE ID = @ID");

    const boMon = result.recordset[0];
    if (!boMon)
      return res.status(404).json({ message: "Không tìm thấy bộ môn" });

    // Quan trọng: phải trả về key `id`
    res.json({
      id: boMon.ID,
      maBoMon: boMon.MaBoMon,
      tenBM: boMon.TenBM,
      maKhoa: boMon.MaKhoa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn bộ môn" });
  }
};

exports.getMonHocById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT ID, MaMonHoc, TenMonHoc, TinChi, MaBoMon FROM MONHOC WHERE ID = @ID");

    const monHoc = result.recordset[0];
    if (!monHoc)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    // Quan trọng: phải trả về key `id`
    res.json({
      id: monHoc.ID,
      maMonHoc: monHoc.MaMonHoc,
      tenMonHoc: monHoc.TenMonHoc,
      tinChi: monHoc.TinChi,
      maBoMon: monHoc.MaBoMon,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn môn học" });
  }
};


exports.getAllKhoa = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM KHOA");
    const total = result.recordset.length;

    res.set("Content-Range", `khoa 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID, // 👈 React Admin bắt buộc
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn khoa" });
  }
};

exports.getAllMonHoc = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM MONHOC");
    const total = result.recordset.length;

    res.set("Content-Range", `monhoc 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID, // 👈 React Admin bắt buộc
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn môn học" });
  }
};

exports.getAllBoMon = async (req, res) => {
  try {
    const sortParam = req.query.sort ? JSON.parse(req.query.sort) : ["ID", "ASC"];
    const [sortField, sortOrder] = sortParam;

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const [start, end] = range;

    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const tenBM = filter.TenBM || "";

    const result = await pool
      .request()
      .input("TenBM", sql.NVarChar, `%${tenBM}%`)
      .query(`
        SELECT * FROM BOMON
        WHERE TenBM LIKE @TenBM
        ORDER BY ${sortField} ${sortOrder.toUpperCase()}
      `);

    const sliced = result.recordset.slice(start, end + 1);
    const total = result.recordset.length;

    res.set("Content-Range", `bomon ${start}-${end}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = sliced.map((item, index) => ({
      ...item,
      id: item.ID,
      stt: start + index + 1,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn bộ môn" });
  }
};


exports.addKhoa = async (req, res) => {
  const { maKhoa, tenKhoa } = req.body;

  try {
    const result = await pool
      .request()
      .input("MaKhoa", sql.VarChar(20), maKhoa)
      .input("TenKhoa", sql.NVarChar(255), tenKhoa).query(`
    INSERT INTO KHOA (MaKhoa, TenKhoa)
    VALUES (@MaKhoa, @TenKhoa);

    SELECT TOP 1 * FROM KHOA WHERE MaKhoa = @MaKhoa;
  `);

    const inserted = result.recordset[0];
    res.status(201).json({
      id: inserted.ID,
      maKhoa: inserted.MaKhoa,
      tenKhoa: inserted.TenKhoa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể thêm khoa" });
  }
};
exports.updateKhoa = async (req, res) => {
  const id = parseInt(req.params.id); // ✅ ID phải lấy từ URL
  const { maKhoa, tenKhoa } = req.body;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaKhoa", sql.VarChar(20), maKhoa)
      .input("TenKhoa", sql.NVarChar(255), tenKhoa).query(`
        UPDATE KHOA SET MaKhoa = @MaKhoa, TenKhoa = @TenKhoa
        WHERE ID = @ID
      `);

    res.status(200).json({ id, maKhoa, tenKhoa }); // 👈 cần trả về `id` cho React Admin
  } catch (err) {
    console.error("Lỗi update khoa:", err);
    res.status(500).json({ message: "Không thể cập nhật khoa" });
  }
};

// controllers/khoaController.js
exports.deleteKhoa = async (req, res) => {
  const id = req.params.id;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query(`DELETE FROM KHOA WHERE ID = @ID`);

    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM KHOA;
      DBCC CHECKIDENT ('KHOA', RESEED, @MaxID);
    `);

    res.status(200).json({ id: parseInt(id), message: "Xóa khoa thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa khoa:", err);
    res.status(500).json({ message: "Lỗi khi xóa khoa" });
  }
};

// adminController.js

exports.addBoMon = async (req, res) => {
  const { maBoMon, tenBM, maKhoa } = req.body;

  try {
    // Thêm bản ghi
    await pool
      .request()
      .input("MaBoMon", sql.VarChar, maBoMon)
      .input("TenBM", sql.NVarChar, tenBM)
      .input("MaKhoa", sql.Int, maKhoa).query(`
        INSERT INTO BOMON (MaBoMon, TenBM, MaKhoa)
        VALUES (@MaBoMon, @TenBM, @MaKhoa)
      `);

    // Lấy bản ghi mới nhất theo ID
    const result = await pool.request().query(`
      SELECT TOP 1 * FROM BOMON ORDER BY ID DESC
    `);

    const inserted = result.recordset[0];

    res.status(201).json({
      id: inserted.ID,
      maBoMon: inserted.MaBoMon,
      tenBM: inserted.TenBM,
      maKhoa: inserted.MaKhoa,
    });
  } catch (err) {
    console.log("Dữ liệu nhận được:", req.body);
    console.error("❌ Lỗi thêm bộ môn:", err);
    res.status(500).json({ message: "Không thể thêm bộ môn" });
  }
};

exports.updateBoMon = async (req, res) => {
  const id = parseInt(req.params.id); // 👈 thay vì lấy từ req.body
  const { maBoMon, tenBM, maKhoa } = req.body;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaBoMon", sql.VarChar, maBoMon)
      .input("TenBM", sql.NVarChar, tenBM)
      .input("MaKhoa", sql.Int, maKhoa)
      .query(
        `UPDATE BOMON SET MaBoMon = @MaBoMon, TenBM = @TenBM, MaKhoa = @MaKhoa
         WHERE ID = @ID`
      );
    res.status(200).json({
      id,
      maBoMon,
      tenBM,
      maKhoa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể cập nhật bộ môn" });
  }
};

exports.deleteBoMon = async (req, res) => {
  const { id } = req.params;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query(`DELETE FROM BOMON WHERE ID = @ID`);

    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM BOMON;
      DBCC CHECKIDENT ('BOMON', RESEED, @MaxID);
    `);

    res.status(200).json({ message: "Bộ môn đã được xóa" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể xóa bộ môn" });
  }
};

// adminController.js

exports.addMonHoc = async (req, res) => {
  const { maMonHoc, tenMonHoc, tinChi, maBoMon } = req.body;

  try {
    await pool
      .request()
      .input("MaMonHoc", sql.VarChar, maMonHoc)
      .input("TenMonHoc", sql.NVarChar, tenMonHoc)
      .input("TinChi", sql.Int, tinChi)
      .input("MaBoMon", sql.Int, maBoMon)
      .query(
        `INSERT INTO MONHOC (MaMonHoc, TenMH, TinChi, MaBM)
         VALUES (@MaMonHoc, @TenMonHoc, @TinChi, @MaBoMon)`
      );
    res.status(201).json({ message: "Môn học đã được thêm" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể thêm môn học" });
  }
};

exports.updateMonHoc = async (req, res) => {
  const { id, maMonHoc, tenMonHoc, tinChi, maBoMon } = req.body;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaMonHoc", sql.VarChar, maMonHoc)
      .input("TenMonHoc", sql.NVarChar, tenMonHoc)
      .input("TinChi", sql.Int, tinChi)
      .input("MaBoMon", sql.Int, maBoMon)
      .query(
        `UPDATE MONHOC SET MaMonHoc = @MaMonHoc, TenMH = @TenMonHoc, TinChi = @TinChi, MaBM = @MaBoMon
         WHERE ID = @ID`
      );
    res.status(200).json({ message: "Môn học đã được cập nhật" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể cập nhật môn học" });
  }
};

exports.deleteMonHoc = async (req, res) => {
  const { id } = req.params;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query(`DELETE FROM MONHOC WHERE ID = @ID`);
    res.status(200).json({ message: "Môn học đã được xóa" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể xóa môn học" });
  }
};
