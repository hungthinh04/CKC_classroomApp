// adminController.js

const { pool, sql } = require('../config/db');

exports.addKhoa = async (req, res) => {
  const { maKhoa, tenKhoa } = req.body;

  try {
    await pool.request()
      .input('MaKhoa', sql.VarChar, maKhoa)
      .input('TenKhoa', sql.NVarChar, tenKhoa)
      .query(
        `INSERT INTO KHOA (MaKhoa, TenKhoa)
         VALUES (@MaKhoa, @TenKhoa)`
      );
    res.status(201).json({ message: 'Khoa đã được thêm' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể thêm khoa' });
  }
};

exports.updateKhoa = async (req, res) => {
  const { id, maKhoa, tenKhoa } = req.body;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .input('MaKhoa', sql.VarChar, maKhoa)
      .input('TenKhoa', sql.NVarChar, tenKhoa)
      .query(
        `UPDATE KHOA SET MaKhoa = @MaKhoa, TenKhoa = @TenKhoa
         WHERE ID = @ID`
      );
    res.status(200).json({ message: 'Khoa đã được cập nhật' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể cập nhật khoa' });
  }
};

exports.deleteKhoa = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .query(`DELETE FROM KHOA WHERE ID = @ID`);
    res.status(200).json({ message: 'Khoa đã được xóa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể xóa khoa' });
  }
};

// adminController.js

exports.addBoMon = async (req, res) => {
  const { maBoMon, tenBoMon, maKhoa } = req.body;

  try {
    await pool.request()
      .input('MaBoMon', sql.VarChar, maBoMon)
      .input('TenBoMon', sql.NVarChar, tenBoMon)
      .input('MaKhoa', sql.Int, maKhoa)
      .query(
        `INSERT INTO BOMON (MaBoMon, TenBM, MaKhoa)
         VALUES (@MaBoMon, @TenBoMon, @MaKhoa)`
      );
    res.status(201).json({ message: 'Bộ môn đã được thêm' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể thêm bộ môn' });
  }
};

exports.updateBoMon = async (req, res) => {
  const { id, maBoMon, tenBoMon, maKhoa } = req.body;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .input('MaBoMon', sql.VarChar, maBoMon)
      .input('TenBoMon', sql.NVarChar, tenBoMon)
      .input('MaKhoa', sql.Int, maKhoa)
      .query(
        `UPDATE BOMON SET MaBoMon = @MaBoMon, TenBM = @TenBoMon, MaKhoa = @MaKhoa
         WHERE ID = @ID`
      );
    res.status(200).json({ message: 'Bộ môn đã được cập nhật' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể cập nhật bộ môn' });
  }
};

exports.deleteBoMon = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .query(`DELETE FROM BOMON WHERE ID = @ID`);
    res.status(200).json({ message: 'Bộ môn đã được xóa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể xóa bộ môn' });
  }
};

// adminController.js

exports.addBoMon = async (req, res) => {
  const { maBoMon, tenBoMon, maKhoa } = req.body;

  try {
    await pool.request()
      .input('MaBoMon', sql.VarChar, maBoMon)
      .input('TenBoMon', sql.NVarChar, tenBoMon)
      .input('MaKhoa', sql.Int, maKhoa)
      .query(
        `INSERT INTO BOMON (MaBoMon, TenBM, MaKhoa)
         VALUES (@MaBoMon, @TenBoMon, @MaKhoa)`
      );
    res.status(201).json({ message: 'Bộ môn đã được thêm' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể thêm bộ môn' });
  }
};

exports.updateBoMon = async (req, res) => {
  const { id, maBoMon, tenBoMon, maKhoa } = req.body;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .input('MaBoMon', sql.VarChar, maBoMon)
      .input('TenBoMon', sql.NVarChar, tenBoMon)
      .input('MaKhoa', sql.Int, maKhoa)
      .query(
        `UPDATE BOMON SET MaBoMon = @MaBoMon, TenBM = @TenBoMon, MaKhoa = @MaKhoa
         WHERE ID = @ID`
      );
    res.status(200).json({ message: 'Bộ môn đã được cập nhật' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể cập nhật bộ môn' });
  }
};

exports.deleteBoMon = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .query(`DELETE FROM BOMON WHERE ID = @ID`);
    res.status(200).json({ message: 'Bộ môn đã được xóa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể xóa bộ môn' });
  }
};

// adminController.js

exports.addMonHoc = async (req, res) => {
  const { maMonHoc, tenMonHoc, tinChi, maBoMon } = req.body;

  try {
    await pool.request()
      .input('MaMonHoc', sql.VarChar, maMonHoc)
      .input('TenMonHoc', sql.NVarChar, tenMonHoc)
      .input('TinChi', sql.Int, tinChi)
      .input('MaBoMon', sql.Int, maBoMon)
      .query(
        `INSERT INTO MONHOC (MaMonHoc, TenMH, TinChi, MaBM)
         VALUES (@MaMonHoc, @TenMonHoc, @TinChi, @MaBoMon)`
      );
    res.status(201).json({ message: 'Môn học đã được thêm' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể thêm môn học' });
  }
};

exports.updateMonHoc = async (req, res) => {
  const { id, maMonHoc, tenMonHoc, tinChi, maBoMon } = req.body;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .input('MaMonHoc', sql.VarChar, maMonHoc)
      .input('TenMonHoc', sql.NVarChar, tenMonHoc)
      .input('TinChi', sql.Int, tinChi)
      .input('MaBoMon', sql.Int, maBoMon)
      .query(
        `UPDATE MONHOC SET MaMonHoc = @MaMonHoc, TenMH = @TenMonHoc, TinChi = @TinChi, MaBM = @MaBoMon
         WHERE ID = @ID`
      );
    res.status(200).json({ message: 'Môn học đã được cập nhật' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể cập nhật môn học' });
  }
};

exports.deleteMonHoc = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.request()
      .input('ID', sql.Int, id)
      .query(`DELETE FROM MONHOC WHERE ID = @ID`);
    res.status(200).json({ message: 'Môn học đã được xóa' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Không thể xóa môn học' });
  }
};
