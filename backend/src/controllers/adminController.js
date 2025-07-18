// adminController.js

const { parse } = require("path");
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
exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.request()
      .input("ID", sql.Int, id)
      .query(`
        SELECT 
          u.ID,
          u.Email,
          u.MatKhau,
          u.Quyen,
          u.TrangThai,
          u.MaNguoiDung,
          COALESCE(sv.HoTen, 
            CASE WHEN gv.HoGV IS NOT NULL THEN gv.HoGV + ' ' + gv.TenGV ELSE NULL END, 
            u.HoTen) AS HoTen
        FROM USERS u
        LEFT JOIN SINHVIEN sv ON u.ID = sv.MaTK
        LEFT JOIN GIANGVIEN gv ON u.ID = gv.MaTK
        WHERE u.ID = @ID
      `);

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({
      id: user.ID,
      maNguoiDung: user.MaNguoiDung,
      email: user.Email,
      matKhau: user.MatKhau,
      hoTen: user.HoTen,
      quyen: user.Quyen,
      trangThai: user.TrangThai,
    });
  } catch (err) {
    console.error("Lỗi lấy user:", err);
    res.status(500).json({ message: "Lỗi truy vấn user" });
  }
};


exports.getLopHocById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM LOPHOC WHERE ID = @ID");

    const lop = result.recordset[0];
    if (!lop)
      return res.status(404).json({ message: "Không tìm thấy lớp học" });

    res.json({
      id: lop.ID,
      maLop: lop.MaLop,
      tenLop: lop.TenLop,
      ngayTao: lop.NgayTao,
      maBM: lop.MaBM,
    });
  } catch (err) {
    console.error("Lỗi getOne lớp học:", err);
    res.status(500).json({ message: "Lỗi truy vấn lớp học" });
  }
};

exports.getBoMonById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT ID, TenBM, MaKhoa FROM BOMON WHERE ID = @ID");

    const boMon = result.recordset[0];
    if (!boMon)
      return res.status(404).json({ message: "Không tìm thấy bộ môn" });

    // Quan trọng: phải trả về key `id`
    res.json({
      id: boMon.ID,
      tenBM: boMon.TenBM,
      maKhoa: boMon.MaKhoa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn bộ môn" });
  }
};

exports.getLopHocPhanById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM LOPHOCPHAN WHERE ID = @ID");

    const lopHopPhan = result.recordset[0];
    if (!lopHopPhan)
      return res.status(404).json({ message: "Không tìm thấy lớp học phần" });

    res.json({ data: { id: lopHopPhan.ID, ...lopHopPhan } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn lớp học phần" });
  }
};

exports.getMonHocById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT ID, TenMH, TinChi, MaBM FROM MONHOC WHERE ID = @ID");

    const monHoc = result.recordset[0];
    if (!monHoc)
      return res.status(404).json({ message: "Không tìm thấy môn học" });

    // Quan trọng: phải trả về key `id`
    res.json({
      id: monHoc.ID,
      tenMH: monHoc.TenMH,
      tinChi: monHoc.TinChi,
      maBM: monHoc.MaBM,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn môn học" });
  }
};

exports.getGiangVienById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM GIANGVIEN WHERE ID = @ID");

    const gv = result.recordset[0];
    if (!gv)
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });

    res.json({
      id: gv.ID,
      maGV: gv.MaGV,
      hoGV: gv.HoGV,
      tenGV: gv.TenGV,
      ngaySinh: gv.NgaySinh,
      gioiTinh: gv.GioiTinh,
      sdt: gv.SDT,
      cccd: gv.CCCD,
      diaChi: gv.DiaChi,
      maTK: gv.MaTK,
      maBM: gv.MaBM,
      trangThai: gv.TrangThai,
      maGiangVien: gv.MaGiangVien,
    });
  } catch (err) {
    console.error("Lỗi khi lấy giảng viên:", err);
    res.status(500).json({ message: "Lỗi truy vấn giảng viên" });
  }
};

exports.getSinhVienById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM SINHVIEN WHERE ID = @ID");

    const sv = result.recordset[0];
    if (!sv)
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });

    res.json({ id: sv.ID, ...sv });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn sinh viên" });
  }
};

exports.getAllKhoa = async (req, res) => {
  try {
    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const [start, end] = range;

    const result = await pool.request().query("SELECT * FROM KHOA");

    const sliced = result.recordset.slice(start, end + 1);
    const total = result.recordset.length;

    res.set("Content-Range", `khoa ${start}-${end}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = sliced.map((item, index) => ({
      ...item,
      id: item.ID,
      stt: start + index + 1,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn khoa" });
  }
};

exports.getAllLopHopPhan = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM LOPHOCPHAN");
    const total = result.recordset.length;

    res.set("Content-Range", `lophopphan 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn lớp học phần" });
  }
};

exports.getAllLopHoc = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM LOPHOC");
    const total = result.recordset.length;

    res.set("Content-Range", `lophoc 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      id: item.ID,
      maLop: item.MaLop,
      tenLop: item.TenLop,
      ngayTao: item.NgayTao,
      maBM: item.MaBM,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn khoa" });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        u.ID,
        u.Email,
        u.MatKhau,
        u.Quyen,
        u.TrangThai,
        u.MaNguoiDung,
        -- Lấy tên ưu tiên: SV > GV > Admin
        COALESCE(sv.HoTen, 
          CASE WHEN gv.HoGV IS NOT NULL THEN gv.HoGV + ' ' + gv.TenGV ELSE NULL END, 
          u.HoTen) AS HoTen
      FROM USERS u
      LEFT JOIN SINHVIEN sv ON u.ID = sv.MaTK
      LEFT JOIN GIANGVIEN gv ON u.ID = gv.MaTK
    `);

    const total = result.recordset.length;

    res.set("Content-Range", `users 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      id: item.ID,
      maNguoiDung: item.MaNguoiDung,
      email: item.Email,
      matKhau: item.MatKhau,
      hoTen: item.HoTen,
      quyen: item.Quyen,
      trangThai: item.TrangThai,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn users" });
  }
};


exports.getAllSinhVien = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM SINHVIEN");
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
    res.status(500).json({ message: "Lỗi truy vấn sinh vien" });
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
    const allowedSortFields = ["ID", "TenBM", "MaKhoa"];
    const sortParam = req.query.sort
      ? JSON.parse(req.query.sort)
      : ["ID", "ASC"];
    const [sortField, sortOrder] = sortParam;

    const sortFieldSafe = allowedSortFields.includes(sortField)
      ? sortField
      : "ID";
    const sortOrderSafe =
      sortOrder && sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const [start, end] = range;
    const limit = end - start + 1;

    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const tenBM = filter.TenBM || "";

    const result = await pool
      .request()
      .input("TenBM", sql.NVarChar, `%${tenBM}%`)
      .input("start", sql.Int, start)
      .input("limit", sql.Int, limit).query(`
        SELECT 
          BM.ID, 
          BM.TenBM, 
          BM.MaKhoa, 
          K.TenKhoa  
        FROM BOMON BM
        JOIN KHOA K ON BM.MaKhoa = K.ID
        WHERE BM.TenBM LIKE @TenBM
        ORDER BY ${sortFieldSafe} ${sortOrderSafe}
        OFFSET @start ROWS FETCH NEXT @limit ROWS ONLY
      `);

    // Lấy tổng số lượng
    const countResult = await pool
      .request()
      .input("TenBM", sql.NVarChar, `%${tenBM}%`)
      .query(`SELECT COUNT(*) as total FROM BOMON WHERE TenBM LIKE @TenBM`);

    const total = countResult.recordset[0].total;

    res.set(
      "Content-Range",
      `bomon ${start}-${start + result.recordset.length - 1}/${total}`
    );
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item, index) => ({
      ...item,
      id: item.ID,
      stt: start + index + 1,
    }));

    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi truy vấn bộ môn:", err);
    res.status(500).json({ message: "Lỗi truy vấn bộ môn" });
  }
};

exports.addKhoa = async (req, res) => {
  console.log("Dữ liệu nhận được:", req.body);
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

// adminController.js

exports.addBoMon = async (req, res) => {
  const { tenBM, maKhoa } = req.body;

  try {
    // Thêm bản ghi
    await pool
      .request()
      .input("TenBM", sql.NVarChar, tenBM)
      .input("MaKhoa", sql.Int, maKhoa).query(`
        INSERT INTO BOMON (TenBM, MaKhoa)
        VALUES (@TenBM, @MaKhoa)
      `);

    // Lấy bản ghi mới nhất theo ID
    const result = await pool.request().query(`
      SELECT TOP 1 * FROM BOMON ORDER BY ID DESC
    `);

    const inserted = result.recordset[0];

    res.status(201).json({
      id: inserted.ID,
      tenBM: inserted.TenBM,
      maKhoa: inserted.MaKhoa,
    });
  } catch (err) {
    console.log("Dữ liệu nhận được:", req.body);
    console.error("❌ Lỗi thêm bộ môn:", err);
    res.status(500).json({ message: "Không thể thêm bộ môn" });
  }
};

exports.deleteBoMon = async (req, res) => {
  const id = req.params.id; // Lấy ID từ tham số URL

  // Kiểm tra xem ID có phải là số hợp lệ không
  if (isNaN(id) || id <= 0) {
    return res.status(400).json({ message: "ID không hợp lệ." });
  }

  try {
    // Kiểm tra xem bộ môn có đang được tham chiếu trong bảng NHANXET không
    const checkRecords = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM NHANXET WHERE MaBV = @ID");

    if (checkRecords.recordset.length > 0) {
      // Xóa các bản ghi trong NHANXET
      await pool
        .request()
        .input("ID", sql.Int, id)
        .query("DELETE FROM NHANXET WHERE MaBV = @ID");
    }

    // Xóa bộ môn khỏi bảng BOMON
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM BOMON WHERE ID = @ID");
    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM BOMON;
      DBCC CHECKIDENT ('BOMON', RESEED, @MaxID);
    `);
    console.log(
      "Bộ môn đã được xóa và các bản ghi liên quan trong NHANXET đã được xóa."
    );
    res.status(200).json({ message: "Xóa bộ môn thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa bộ môn:", err);
    res.status(500).json({ message: "Lỗi khi xóa bộ môn" });
  }
};

exports.addMonHoc = async (req, res) => {
  const { tenMH, tinChi, maBM } = req.body;

  try {
    await pool
      .request()
      .input("TenMH", sql.NVarChar, tenMH)
      .input("TinChi", sql.Int, tinChi)
      .input("MaBM", sql.Int, maBM).query(`
        INSERT INTO MONHOC (TenMH, TinChi, MaBM)
        VALUES (@TenMH, @TinChi, @MaBM)
    `);

    // Lấy bản ghi vừa được thêm vào
    const result = await pool.request().query(`
      SELECT TOP 1 * FROM MONHOC ORDER BY ID DESC
    `);

    const inserted = result.recordset[0];

    // Đảm bảo trả về dữ liệu theo cấu trúc mong đợi
    res.status(201).json({
      id: inserted.ID,
      tenMH: inserted.TenMH,
      tinChi: inserted.TinChi,
      maBM: inserted.MaBM,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể thêm môn học" });
  }
};

exports.updateBoMon = async (req, res) => {
  const id = parseInt(req.params.id); // 👈 thay vì lấy từ req.body
  const { maBoMon, tenBM, maKhoa } = req.body;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("TenBM", sql.NVarChar, tenBM)
      .input("MaKhoa", sql.Int, maKhoa).query(`
        UPDATE BOMON SET TenBM = @TenBM, MaKhoa = @MaKhoa
         WHERE ID = @ID
      `);
    res.status(200).json({
      id,
      tenBM,
      maKhoa,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể cập nhật bộ môn" });
  }
};
exports.updateMonHoc = async (req, res) => {
  const id = parseInt(req.params.id);
  const { tenMH, tinChi, maBM } = req.body;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("TenMH", sql.NVarChar, tenMH)
      .input("TinChi", sql.Int, tinChi)
      .input("MaBM", sql.Int, maBM).query(`
        UPDATE MONHOC SET TenMH = @TenMH, TinChi = @TinChi, MaBM = @MaBM
        WHERE ID = @ID
    `);

    // Trả về dữ liệu đã được cập nhật
    res.status(200).json({
      id,
      tenMH,
      tinChi,
      maBM,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể cập nhật môn học" });
  }
};

exports.deleteMonHoc = async (req, res) => {
  const id = req.params.id;

  try {
    // Kiểm tra Môn học có được sử dụng trong lớp học phần không
    const checkClassAssignments = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM LOPHOCPHAN WHERE MaMH = @ID");

    if (checkClassAssignments.recordset.length > 0) {
      return res
        .status(400)
        .json({
          message:
            "Môn học này đang được sử dụng trong lớp học phần, không thể xóa!",
        });
    }

    // Xóa Môn học
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM MONHOC WHERE ID = @ID");

    // Cập nhật lại giá trị IDENTITY cho bảng MONHOC
    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM MONHOC;
      DBCC CHECKIDENT ('MONHOC', RESEED, @MaxID);
    `);

    res
      .status(200)
      .json({ id: parseInt(id), message: "Xóa môn học thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa môn học:", err);
    res.status(500).json({ message: "Lỗi khi xóa môn học" });
  }
};

exports.getAllLopHocPhan = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM LOPHOCPHAN");
    const total = result.recordset.length;

    res.set("Content-Range", `lophocphan 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID, // 👈 React Admin bắt buộc
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn lớp học phần" });
  }
};
exports.getLopHocPhanById = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM LOPHOCPHAN WHERE ID = @ID");

    const lopHopPhan = result.recordset[0];
    if (!lopHopPhan)
      return res.status(404).json({ message: "Không tìm thấy lớp học phần" });

    res.json({
      id: lopHopPhan.ID,
      tenLHP: lopHopPhan.TenLHP,
      ngayTao: lopHopPhan.NgayTao,
      hocKy: lopHopPhan.HocKy,
      chinhSach: lopHopPhan.ChinhSach,
      namHoc: lopHopPhan.NamHoc,
      maGV: lopHopPhan.MaGV,
      maLH: lopHopPhan.MaLH,
      maMH: lopHopPhan.MaMH,
      luuTru: lopHopPhan.LuuTru,
      trangThai: lopHopPhan.TrangThai,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn lớp học phần" });
  }
};

//quan li giang vien

exports.getAllGiangVien = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT * FROM GIANGVIEN");
    const total = result.recordset.length;

    res.set("Content-Range", `giangvien 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID,
    }));

    res.json(data);
  } catch (err) {
    console.error("Lỗi khi lấy giảng viên:", err);
    res.status(500).json({ message: "Lỗi truy vấn giảng viên" });
  }
};
// exports.addGiangVien = async (req, res) => {
//   const { hoTen, maBM, role } = req.body; // role: 1 -> Giảng viên, 0 -> Sinh viên

//   try {
//     // Kiểm tra xem có tồn tại role không, nếu không trả về lỗi
//     if (role !== 1 && role !== 0) {
//       return res.status(400).json({ message: "Role không hợp lệ!" });
//     }

//     // Lấy Mã Tài Khoản cuối cùng trong bảng USERS để tăng ID mới
//     const resultMaTK = await pool
//       .request()
//       .query("SELECT TOP 1 ID FROM USERS ORDER BY ID DESC");

//     const lastMaTK = resultMaTK.recordset[0]?.ID || 0; // ID người dùng cuối cùng
//     const newMaTK = lastMaTK + 1; // Tăng thêm 1 để tạo ra ID mới cho người dùng

//     // Thêm tài khoản vào bảng USERS (giảng viên hoặc sinh viên)
//     const roleStr = role === 1 ? "Giảng viên" : "Sinh viên"; // Xác định vai trò
//     const insertUserResult = await pool
//       .request()
//       .input("ID", sql.Int, newMaTK)
//       .input(
//         "Email",
//         sql.NVarChar(100),
//         `${role === 1 ? "gv" : "sv"}${newMaTK}@ckc.vn`
//       ) // Tạo email dựa trên role
//       .input("MatKhau", sql.NVarChar(255), "defaultPassword") // Mật khẩu mặc định
//       .input("Quyen", sql.Int, role) // Quyền (1 = Giảng viên, 0 = Sinh viên)
//       .input("TrangThai", sql.SmallInt, 1) // Trang thái người dùng (1: Hoạt động)
//       .query(`
//         INSERT INTO USERS (ID, Email, MatKhau, Quyen, TrangThai)
//         VALUES (@ID, @Email, @MatKhau, @Quyen, @TrangThai);
//         SELECT TOP 1 * FROM USERS WHERE ID = @ID;
//       `);

//     const newUser = insertUserResult.recordset[0];

//     // Tạo mã tài khoản cho giảng viên hoặc sinh viên
//     const newMaNguoiDung = `${role === 1 ? "gv" : "sv"}${newUser.ID}`;

//     // Cập nhật lại MaNguoiDung cho người dùng vừa thêm
//     await pool
//       .request()
//       .input("MaNguoiDung", sql.VarChar(20), newMaNguoiDung)
//       .input("ID", sql.Int, newUser.ID)
//       .query("UPDATE USERS SET MaNguoiDung = @MaNguoiDung WHERE ID = @ID");

//     // Thêm giảng viên vào bảng GIANGVIEN hoặc sinh viên vào bảng SINHVIEN
//     if (role === 1) {
//       // Nếu là giảng viên
//       // Thêm giảng viên vào bảng GIANGVIEN
//       const insertGiangVienResult = await pool
//         .request()
//         .input("MaGiangVien", sql.VarChar(20), `gv${newUser.ID}`)
//         .input("HoTen", sql.NVarChar(255), hoTen)
//         .input("MaTK", sql.Int, newUser.ID) // ID tài khoản của giảng viên
//         .input("MaBM", sql.Int, maBM) // Mã bộ môn
//         .query(`
//           INSERT INTO GIANGVIEN (MaGiangVien, HoTen, MaTK, MaBM)
//           VALUES (@MaGiangVien, @HoTen, @MaTK, @MaBM);
//           SELECT TOP 1 * FROM GIANGVIEN WHERE MaGiangVien = @MaGiangVien;
//         `);
//       const insertedGiangVien = insertGiangVienResult.recordset[0];

//       res.status(201).json({
//         id: insertedGiangVien.ID,
//         maGiangVien: insertedGiangVien.MaGiangVien,
//         hoTen: insertedGiangVien.HoTen,
//         maTK: insertedGiangVien.MaTK,
//         maBM: insertedGiangVien.MaBM,
//       });
//     } else {
//       // Nếu là sinh viên
//       // Thêm sinh viên vào bảng SINHVIEN
//       const insertSinhVienResult = await pool
//         .request()
//         .input("MaSinhVien", sql.VarChar(20), `sv${newUser.ID}`)
//         .input("HoTen", sql.NVarChar(255), hoTen)
//         .input("MaTK", sql.Int, newUser.ID) // ID tài khoản của sinh viên
//         .input("MaLopHoc", sql.Int, 1) // Giả sử MaLopHoc mặc định là 1
//         .query(`
//           INSERT INTO SINHVIEN (MaSinhVien, HoTen, MaTK, MaLopHoc)
//           VALUES (@MaSinhVien, @HoTen, @MaTK, @MaLopHoc);
//           SELECT TOP 1 * FROM SINHVIEN WHERE MaSinhVien = @MaSinhVien;
//         `);
//       const insertedSinhVien = insertSinhVienResult.recordset[0];

//       res.status(201).json({
//         id: insertedSinhVien.ID,
//         maSinhVien: insertedSinhVien.MaSinhVien,
//         hoTen: insertedSinhVien.HoTen,
//         maTK: insertedSinhVien.MaTK,
//         maLopHoc: insertedSinhVien.MaLopHoc,
//       });
//     }
//   } catch (err) {
//     console.error(err);
//     res
//       .status(500)
//       .json({ message: "Không thể thêm giảng viên hoặc sinh viên" });
//   }
// };

const removeDiacritics = (str) => {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};
exports.addGiangVien = async (req, res) => {
  const {
    hoGV,
    tenGV,
    ngaySinh,
    gioiTinh,
    sdt,
    maBM,
    cccd,
    diaChi,
    trangThai,
  } = req.body;

  try {
    // Bước 1: Thêm user vào bảng USERS (không set ID)
    const userResult = await pool
      .request()
      .input("Email", sql.NVarChar(100), "")  // Email tạm để sau này cập nhật
      .input("MatKhau", sql.NVarChar(255), "defaultPassword")
      .input("Quyen", sql.Int, 1) // Giảng viên
      .input("TrangThai", sql.SmallInt, 1) // Hoạt động
      .query(`
        INSERT INTO USERS (Email, MatKhau, Quyen, TrangThai)
        VALUES (@Email, @MatKhau, @Quyen, @TrangThai);
        SELECT SCOPE_IDENTITY() AS MaTK;
      `);

    const maTK = userResult.recordset[0].MaTK;
    const maGV1 = userResult.recordset[0].ID;

    const email = `gv${maTK}@ckc.vn`; // Tạo email giảng viên

    // Cập nhật lại email cho người dùng mới
    await pool
      .request()
      .input("Email", sql.NVarChar(100), email)
      .input("ID", sql.Int, maTK)
      .query("UPDATE USERS SET Email = @Email WHERE ID = @ID");

    // Bước 2: Tạo `MaGiangVien` từ `MaTK`
    const maGiangVien = `gv${maTK}`; // Sử dụng `gv${maTK}` làm mã giảng viên

    // Bước 3: Insert giảng viên vào bảng GIANGVIEN
    const giangVienResult = await pool
      .request()
      .input("MaGV", sql.VarChar(10), maGV1)
      .input("HoGV", sql.NVarChar(255), hoGV)
      .input("TenGV", sql.NVarChar(255), tenGV)
      .input("NgaySinh", sql.DateTime, ngaySinh)
      .input("GioiTinh", sql.SmallInt, gioiTinh)
      .input("SDT", sql.VarChar(20), sdt)
      .input("MaTK", sql.Int, maTK)
      .input("CCCD", sql.NVarChar(20), cccd)
      .input("MaBM", sql.Int, maBM)
      .input("DiaChi", sql.Text, diaChi)
      .input("TrangThai", sql.SmallInt, trangThai)
      .input("MaGiangVien", sql.NVarChar(20), maGiangVien) // Tạo `MaGiangVien` là `gv{MaTK}`
      .query(`
        INSERT INTO GIANGVIEN (MaGV, HoGV, TenGV, NgaySinh, GioiTinh, SDT, MaTK, CCCD, MaBM, DiaChi, TrangThai, MaGiangVien)
        VALUES (@MaGV, @HoGV, @TenGV, @NgaySinh, @GioiTinh, @SDT, @MaTK, @CCCD, @MaBM, @DiaChi, @TrangThai, @MaGiangVien);
        SELECT TOP 1 * FROM GIANGVIEN ORDER BY ID DESC;
      `);

    const gv = giangVienResult.recordset[0];

    // 3. Cập nhật lại MaGV cho đúng mã, không cần phải chèn giá trị vào MaGV
    const maGV = gv.ID; // MaGV tự động tăng, đã có trong bảng GIANGVIEN

    await pool
      .request()
      .input("MaGV", sql.Int, maGV)
      .input("ID", sql.Int, gv.ID)
      .query(`UPDATE GIANGVIEN SET MaGV = @MaGV WHERE ID = @ID`);

    // 4. Trả về
    res.status(201).json({ id: gv.ID, ...gv, email, MaGV: maGV });
  } catch (err) {
    console.error("Lỗi thêm giảng viên:", err);
    res.status(500).json({ message: "Không thể thêm giảng viên" });
  }
};



exports.updateGiangVien = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    maGV,
    hoGV,
    tenGV,
    ngaySinh,
    gioiTinh,
    sdt,
    maTK,
    cccd,
    maBM,
    diaChi,
    trangThai,
    maGiangVien,
  } = req.body;

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaGV", sql.Int, maGV)
      .input("HoGV", sql.NVarChar(255), hoGV)
      .input("TenGV", sql.NVarChar(255), tenGV)
      .input("NgaySinh", sql.DateTime, ngaySinh)
      .input("GioiTinh", sql.SmallInt, gioiTinh)
      .input("SDT", sql.VarChar(20), sdt)
      .input("MaTK", sql.Int, maTK)
      .input("CCCD", sql.NVarChar(20), cccd)
      .input("MaBM", sql.Int, maBM)
      .input("DiaChi", sql.Text, diaChi)
      .input("TrangThai", sql.SmallInt, trangThai)
      .input("MaGiangVien", sql.NVarChar(20), maGiangVien).query(`
        UPDATE GIANGVIEN SET
          MaGV = @MaGV,
          HoGV = @HoGV,
          TenGV = @TenGV,
          NgaySinh = @NgaySinh,
          GioiTinh = @GioiTinh,
          SDT = @SDT,
          MaTK = @MaTK,
          CCCD = @CCCD,
          MaBM = @MaBM,
          DiaChi = @DiaChi,
          TrangThai = @TrangThai,
          MaGiangVien = @MaGiangVien
        WHERE ID = @ID;
      `);

    res.status(200).json({
      id,
      maGV,
      hoGV,
      tenGV,
      ngaySinh,
      gioiTinh,
      sdt,
      maTK,
      cccd,
      maBM,
      diaChi,
      trangThai,
      maGiangVien,
    });
  } catch (err) {
    console.error("Lỗi update giảng viên:", err);
    res.status(500).json({ message: "Không thể cập nhật giảng viên" });
  }
};

exports.deleteGiangVien = async (req, res) => {
  const id = parseInt(req.params.id); // ID bảng GIANGVIEN

  try {
    // 1. Lấy MaGV và MaTK theo id
    const gvResult = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT MaGV, MaTK FROM GIANGVIEN WHERE ID = @ID");
    if (!gvResult.recordset.length) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });
    }
    const maGV = gvResult.recordset[0].MaGV;
    const maTK = gvResult.recordset[0].MaTK;

    // 2. Kiểm tra có lớp học phần nào còn tham chiếu
    const lhpResult = await pool
      .request()
      .input("MaGV", sql.Int, id) // chú ý: MaGV ở LOPHOCPHAN là ID của GV (không phải MaGV)
      .query("SELECT * FROM LOPHOCPHAN WHERE MaGV = @MaGV");
    if (lhpResult.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Giảng viên này đang dạy lớp học phần, không thể xóa!" });
    }

    // 3. Xóa khỏi bảng phân công GIANGVIEN_LHP
    await pool.request().input("MaGV", sql.Int, id).query("DELETE FROM GIANGVIEN_LHP WHERE MaGV = @MaGV");

    // 4. Xóa tài liệu (nếu có)
    await pool.request().input("MaGV", sql.Int, id).query("DELETE FROM TAILIEU WHERE MaGV = @MaGV");

    // 5. Xóa các bài viết (nếu cần, hoặc gán MaTK = null tuỳ business rule)
    await pool.request().input("MaTK", sql.Int, maTK).query("DELETE FROM BAIVIET WHERE MaTK = @MaTK");

    // 6. Xóa chính giảng viên
    await pool.request().input("ID", sql.Int, id).query("DELETE FROM GIANGVIEN WHERE ID = @ID");

    // 7. Xóa user
    await pool.request().input("ID", sql.Int, maTK).query("DELETE FROM USERS WHERE ID = @ID");
 await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM GIANGVIEN;
      DBCC CHECKIDENT ('GIANGVIEN', RESEED, @MaxID);
    `);
    res.status(200).json({ message: "Xóa giảng viên thành công", id });
  } catch (err) {
    console.error("Lỗi khi xóa giảng viên:", err);
    res.status(500).json({ message: "Lỗi khi xóa giảng viên" });
  }
};

exports.addSinhVien = async (req, res) => {
  const { hoTen, maLopHoc } = req.body;
  try {
    // 1. Thêm user mới (không set ID)
    const userInsert = await pool
      .request()
      .input("Email", sql.NVarChar(100), "") // để trống tạm, gán sau
      .input("MatKhau", sql.NVarChar(255), "defaultPassword")
      .input("Quyen", sql.Int, 0) // 0 = sinh viên
      .input("TrangThai", sql.SmallInt, 1).query(`
        INSERT INTO USERS (Email, MatKhau, Quyen, TrangThai)
        VALUES (@Email, @MatKhau, @Quyen, @TrangThai);
        SELECT SCOPE_IDENTITY() AS ID;
      `);

    const newUserId = userInsert.recordset[0].ID;
    const maSV = `sv${newUserId}`;
    const email = `${maSV}@ckc.vn`;

    // 2. Cập nhật lại Email + MaNguoiDung
    await pool
      .request()
      .input("Email", sql.NVarChar(100), email)
      .input("MaNguoiDung", sql.VarChar(20), maSV)
      .input("ID", sql.Int, newUserId).query(`
        UPDATE USERS SET Email = @Email, MaNguoiDung = @MaNguoiDung WHERE ID = @ID
        
      `);

    // 3. Thêm vào bảng SINHVIEN
    const insertResult = await pool
      .request()
      .input("MaTK", sql.Int, newUserId)
      .input("MaLopHoc", sql.Int, maLopHoc)
      .input("HoTen", sql.NVarChar(255), hoTen).query(`
    INSERT INTO SINHVIEN (MaSinhVien, MaTK, MaLopHoc, HoTen)
    VALUES (NULL, @MaTK, @MaLopHoc, @HoTen);

    SELECT TOP 1 * FROM SINHVIEN ORDER BY ID DESC;
  `);

    const inserted = insertResult.recordset[0];
    const maSinhVien = `${inserted.ID}`;

    // 3. Update lại MaSinhVien cho đúng mã
    await pool
      .request()
      .input("MaSinhVien", sql.VarChar(20), maSinhVien)
      .input("ID", sql.Int, inserted.ID)
      .query(`UPDATE SINHVIEN SET MaSinhVien = @MaSinhVien WHERE ID = @ID`);

    // 4. Trả về
    res
      .status(201)
      .json({ id: inserted.ID, ...inserted, MaSinhVien: maSinhVien });
    //   const query1 = `INSERT INTO SINHVIEN_LHP (MaSV, MaLHP) SELECT MaSinhVien, MaLopHoc FROM SINHVIEN WHERE ID = ${inserted.ID}`;
    //   await pool.request().input("ID", sql.Int, inserted.ID).query(`
    //   INSERT INTO SINHVIEN_LHP (MaSV, MaLHP)
    //   SELECT MaTK, MaLopHoc FROM SINHVIEN WHERE ID = ${inserted.ID}
    // `);

    //   await pool.request().query(query1);
  } catch (err) {
    console.error("❌ Lỗi thêm sinh viên:", err);
    res.status(500).json({ message: "Không thể thêm sinh viên" });
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
exports.updateSinhVien = async (req, res) => {
  const id = parseInt(req.params.id); // ID từ URL
console.log(id," id");
  const { MaSinhVien, MaTK, MaLopHoc, HoTen } = req.body;

  console.log(req.body);
  if (!MaTK || !MaLopHoc || !HoTen) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết." });
  }

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaSinhVien", sql.VarChar(20), MaSinhVien)
      .input("MaTK", sql.Int, MaTK)
      .input("MaLopHoc", sql.Int, MaLopHoc)
      .input("HoTen", sql.NVarChar(255), HoTen).query(`
        UPDATE SINHVIEN
        SET MaSinhVien = @MaSinhVien,
            MaTK = @MaTK,
            MaLopHoc = @MaLopHoc,
            HoTen = @HoTen
        WHERE ID = @ID
      `);

    res.status(200).json({ id, MaSinhVien, MaTK, MaLopHoc, HoTen });
  } catch (err) {
    console.error("❌ Lỗi update sinh viên:", err);
    res.status(500).json({ message: "Không thể cập nhật sinh viên" });
  }
};

exports.deleteSinhVien = async (req, res) => {
  const id = parseInt(req.params.id); // ID bảng SINHVIEN

  try {
    // 1. Lấy MaTK theo id
    const svResult = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT MaTK FROM SINHVIEN WHERE ID = @ID");
    if (!svResult.recordset.length) {
      return res.status(404).json({ message: "Không tìm thấy sinh viên" });
    }
    const maTK = svResult.recordset[0].MaTK;

    // 2. Xóa khỏi bảng phân công SINHVIEN_LHP
    await pool.request().input("MaSV", sql.Int, id).query("DELETE FROM SINHVIEN_LHP WHERE MaSV = @MaSV");

    // 3. Xóa nộp bài (nếu cần)
    await pool.request().input("MaSV", sql.Int, id).query("DELETE FROM NOPBAI WHERE MaSV = @MaSV");

    // 4. Xóa chính sinh viên
    await pool.request().input("ID", sql.Int, id).query("DELETE FROM SINHVIEN WHERE ID = @ID");

    // 5. Xóa user
    await pool.request().input("ID", sql.Int, maTK).query("DELETE FROM USERS WHERE ID = @ID");
 await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM SINHVIEN;
      DBCC CHECKIDENT ('SINHVIEN', RESEED, @MaxID);
    `);
    res.status(200).json({ message: "Xóa sinh viên thành công", id });
  } catch (err) {
    console.error("Lỗi khi xóa sinh viên:", err);
    res.status(500).json({ message: "Lỗi khi xóa sinh viên" });
  }
};



// exports.getAllUsers = async (req, res) => {
//   try {
//     const result = await pool.request().query("SELECT * FROM USERS");
//     const total = result.recordset.length;

//     res.set("Content-Range", `users 0-${total - 1}/${total}`);
//     res.set("Access-Control-Expose-Headers", "Content-Range");

//     const data = result.recordset.map((u) => ({
//       ...u,
//       id: u.ID,
//     }));

//     res.json(data);
//   } catch (err) {
//     console.error("❌ Lỗi khi lấy tất cả user:", err);
//     res.status(500).json({ message: "Không thể lấy danh sách user" });
//   }
// };

// exports.getUserById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await pool
//       .request()
//       .input("ID", sql.Int, id)
//       .query("SELECT ID, MaKhoa, TenKhoa FROM KHOA WHERE ID = @ID");

//     const khoa = result.recordset[0];
//     if (!khoa) return res.status(404).json({ message: "Không tìm thấy khoa" });

//     // Quan trọng: phải trả về key `id`
//     res.json({
//       id: khoa.ID,
//       maKhoa: khoa.MaKhoa,
//       tenKhoa: khoa.TenKhoa,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Lỗi truy vấn khoa" });
//   }
// };

// exports.getUserById = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await pool.request()
//       .input("ID", sql.Int, id)
//       .query("SELECT * FROM USERS WHERE ID = @ID");

//     const user = result.recordset[0];
//     if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

//     res.json({ id: user.ID,  });
//   } catch (err) {
//     console.error("❌ Lỗi khi lấy user:", err);
//     res.status(500).json({ message: "Không thể lấy user" });
//   }
// };
exports.updateUsers = async (req, res) => {
  const id = parseInt(req.params.id);
  const { maNguoiDung, email, matKhau, hoTen, quyen, trangThai } = req.body;

  if (!maNguoiDung || !email || !matKhau) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    // 1. Cập nhật bảng USERS
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaNguoiDung", sql.VarChar(20), maNguoiDung)
      .input("Email", sql.NVarChar(100), email)
      .input("MatKhau", sql.NVarChar(255), matKhau)
      .input("HoTen", sql.NVarChar(255), hoTen)
      .input("Quyen", sql.Int, quyen)
      .input("TrangThai", sql.SmallInt, trangThai).query(`
        UPDATE USERS
        SET MaNguoiDung = @MaNguoiDung,
            Email = @Email,
            MatKhau = @MatKhau,
            HoTen = @HoTen,
            Quyen = @Quyen,
            TrangThai = @TrangThai
        WHERE ID = @ID
      `);

    // 2. Nếu là sinh viên, cập nhật luôn bảng SINHVIEN (nếu có)
    exports.updateUsers = async (req, res) => {
  const id = parseInt(req.params.id);
  const { hoTen, matKhau, quyen } = req.body; // quyen: 0 = SV, 1 = GV

  if (!hoTen || !matKhau) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  // Hàm tách họ và tên cho giảng viên
  function splitHoTen(hoTen) {
    if (!hoTen) return { hoGV: '', tenGV: '' };
    const arr = hoTen.trim().split(' ');
    const tenGV = arr.pop();
    const hoGV = arr.join(' ');
    return { hoGV, tenGV };
  }

  try {
    // 1. Update bảng USERS
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("HoTen", sql.NVarChar(255), hoTen)
      .input("MatKhau", sql.NVarChar(255), matKhau)
      .query(`
        UPDATE USERS
        SET HoTen = @HoTen,
            MatKhau = @MatKhau
        WHERE ID = @ID
      `);

    // 2. Đồng bộ tên ở bảng con
    if (quyen === 0) {
      await pool
        .request()
        .input("MaTK", sql.Int, id)
        .input("HoTen", sql.NVarChar(255), hoTen)
        .query(`
          UPDATE SINHVIEN SET HoTen = @HoTen WHERE MaTK = @MaTK
        `);
    } else if (quyen === 1) {
      // Giảng viên: tách thành HoGV và TenGV
      const { hoGV, tenGV } = splitHoTen(hoTen);
      await pool
        .request()
        .input("MaTK", sql.Int, id)
        .input("HoGV", sql.NVarChar(255), hoGV)
        .input("TenGV", sql.NVarChar(255), tenGV)
        .query(`
          UPDATE GIANGVIEN SET HoGV = @HoGV, TenGV = @TenGV WHERE MaTK = @MaTK
        `);
    }

    res.status(200).json({ id, hoTen, matKhau });
  } catch (err) {
    console.error("❌ Lỗi cập nhật user:", err);
    res.status(500).json({ message: "Không thể cập nhật user" });
  }
};

    res.status(200).json({
      id,
      maNguoiDung,
      email,
      matKhau,
      hoTen,
      quyen,
      trangThai,
    });
  } catch (err) {
    res.status(500).json({ message: "Không thể cập nhật user" });
  }
};


exports.deleteUsers = async (req, res) => {
  const id = req.params.id;

  try {
    // Bước 1: Kiểm tra nếu người dùng là Sinh viên
    const checkStudent = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM SINHVIEN WHERE MaTK = @ID");

    // Bước 2: Kiểm tra nếu người dùng là Giảng viên
    const checkTeacher = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM GIANGVIEN WHERE MaTK = @ID");

    if (checkStudent.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Tài khoản này đang là sinh viên, không thể xóa!" });
    }

    if (checkTeacher.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Tài khoản này đang là giảng viên, không thể xóa!" });
    }

    // Bước 3: Xóa tài khoản người dùng
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM USERS WHERE ID = @ID");

    res
      .status(200)
      .json({
        id: parseInt(id),
        message: "Xóa tài khoản người dùng thành công",
      });
  } catch (err) {
    console.error("Lỗi khi xóa tài khoản người dùng:", err);
    res.status(500).json({ message: "Lỗi khi xóa tài khoản người dùng" });
  }
};

// };
exports.updateLopHoc = async (req, res) => {
  const id = parseInt(req.params.id); // ID lớp học từ URL
  const { tenLop, ngayTao, maBM } = req.body; // Nhận thông tin mới từ client

  try {
    // Cập nhật thông tin lớp học trong bảng LOPHOC
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("TenLop", sql.NVarChar, tenLop)
      .input("NgayTao", sql.DateTime, ngayTao)
      .input("MaBM", sql.Int, maBM).query(`
        UPDATE LOPHOC
        SET TenLop = @TenLop, NgayTao = @NgayTao, MaBM = @MaBM
        WHERE ID = @ID;
      `);

    // Trả về thông báo khi cập nhật lớp học thành công
    res.status(200).json({ message: "Lớp học đã được cập nhật" });
  } catch (err) {
    console.error("Lỗi khi cập nhật lớp học:", err);
    res.status(500).json({ message: "Không thể cập nhật lớp học" });
  }
};

exports.deleteLopHoc = async (req, res) => {
  const id = req.params.id;

  try {
    // Bước 1: Kiểm tra xem Lớp học có sinh viên tham gia không
    const checkStudentAssignments = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM SINHVIEN WHERE MaLopHoc = @ID");

    if (checkStudentAssignments.recordset.length > 0) {
      return res
        .status(400)
        .json({ message: "Lớp học này có sinh viên tham gia, không thể xóa!" });
    }

    // Bước 2: Xóa Lớp học
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM LOPHOC WHERE ID = @ID");

    // Cập nhật lại giá trị IDENTITY cho bảng LOPHOC
    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM LOPHOC;
      DBCC CHECKIDENT ('LOPHOC', RESEED, @MaxID);
    `);

    res
      .status(200)
      .json({ id: parseInt(id), message: "Xóa lớp học thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa lớp học:", err);
    res.status(500).json({ message: "Lỗi khi xóa lớp học" });
  }
};
exports.addLopHoc = async (req, res) => {
  const { tenLop, maBM, ngayTao } = req.body;

  // Kiểm tra xem các trường có bị thiếu không
  if (!tenLop || !maBM || !ngayTao) {
    return res
      .status(400)
      .json({ message: "Tên lớp, Mã bộ môn và Ngày tạo không được để trống." });
  }

  try {
    // Bước 1: Thêm lớp học vào bảng LOPHOC mà không cần MaLop (MaLop sẽ tự tạo sau)
    const result = await pool
      .request()
      .input("TenLop", sql.NVarChar(255), tenLop)
      .input("MaBM", sql.Int, maBM)
      .input("NgayTao", sql.DateTime, ngayTao).query(`
        INSERT INTO LOPHOC (TenLop, MaBM, NgayTao)
        VALUES (@TenLop, @MaBM, @NgayTao);
        SELECT SCOPE_IDENTITY() AS ID;  -- Lấy ID của bản ghi vừa thêm
      `);

    const insertedID = result.recordset[0].ID; // Lấy ID lớp học vừa tạo

    // Bước 2: Tạo MaLop dựa trên ID và cập nhật lại MaLop cho lớp học
    const maLop = `L${String(insertedID).padStart(3, "0")}`; // Tạo mã lớp L001, L002, ...

    // Cập nhật MaLop vào lớp học vừa tạo
    await pool
      .request()
      .input("MaLop", sql.VarChar(20), maLop)
      .input("ID", sql.Int, insertedID).query(`
        UPDATE LOPHOC
        SET MaLop = @MaLop
        WHERE ID = @ID;
      `);

    // Trả về thông tin lớp học đã được tạo
    res.status(201).json({ id: insertedID, maLop, tenLop, maBM, ngayTao });
  } catch (err) {
    console.error("Lỗi thêm lớp học:", err);
    res.status(500).json({ message: "Không thể thêm lớp học" });
  }
};

exports.addLopHocPhan = async (req, res) => {
  const {
    tenLHP,
    ngayTao,
    hocKy,
    chinhSach,
    namHoc,
    maGV,
    maLH,
    maMH,
    luuTru,
    trangThai,
  } = req.body;

  // Kiểm tra xem mã giảng viên (MaGV) có tồn tại trong bảng GIANGVIEN không
  const checkGiangVien = await pool
    .request()
    .input("MaGV", sql.Int, maGV)
    .query("SELECT * FROM GIANGVIEN WHERE ID = @MaGV");

  if (!checkGiangVien.recordset.length) {
    return res.status(400).json({ message: "Mã giảng viên không hợp lệ" });
  }

  try {
    // Thêm lớp học phần vào bảng LOPHOCPHAN
    await pool
      .request()
      .input("TenLHP", sql.NVarChar, tenLHP)
      .input("NgayTao", sql.DateTime, ngayTao)
      .input("HocKy", sql.SmallInt, hocKy)
      .input("ChinhSach", sql.SmallInt, chinhSach)
      .input("NamHoc", sql.Int, namHoc)
      .input("MaGV", sql.Int, maGV) // Giảng viên có mã MaGV từ client
      .input("MaLH", sql.Int, maLH) // Lớp học có mã MaLH từ client
      .input("MaMH", sql.Int, maMH) // Môn học có mã MaMH từ client
      .input("LuuTru", sql.SmallInt, luuTru)
      .input("TrangThai", sql.SmallInt, trangThai).query(`
        INSERT INTO LOPHOCPHAN (TenLHP, NgayTao, HocKy, ChinhSach, NamHoc, MaGV, MaLH, MaMH, LuuTru, TrangThai)
        VALUES (@TenLHP, @NgayTao, @HocKy, @ChinhSach, @NamHoc, @MaGV, @MaLH, @MaMH, @LuuTru, @TrangThai);
      `);

    // Lấy bản ghi mới nhất từ bảng LOPHOCPHAN
    const result = await pool
      .request()
      .query("SELECT TOP 1 * FROM LOPHOCPHAN ORDER BY ID DESC");

    const inserted = result.recordset[0];

    const query1 = `
      INSERT INTO SINHVIEN_LHP (MaSV, MaLHP, TrangThai)
      SELECT ID, ${inserted.ID}, 1 FROM SINHVIEN WHERE MaLopHoc = ${maLH};
    `;
    // await pool.request()
    //   .input('MaLHP', sql.Int, inserted.ID)
    //   .input('MaLH', sql.Int, maLH)
    //   .query(query1);

     await pool
      .request()
      .input("MaGV", sql.Int, maGV)
      .input("MaLHP", sql.Int, inserted.ID) // ID lớp học phần
      .input("TrangThai", sql.SmallInt, trangThai || 1) // Default trangThai = 1
      .query(`
        INSERT INTO GIANGVIEN_LHP (MaGV, MaLHP, TrangThai)
        VALUES (@MaGV, @MaLHP, @TrangThai);
    `);

    res.status(201).json({ id: inserted.ID, ...inserted });
    await pool.request().query(query1);
  } catch (err) {
    console.error("Lỗi thêm lớp học phần:", err);
    res.status(500).json({ message: "Không thể thêm lớp học phần" });
  }
};

exports.updateLopHoc = async (req, res) => {
  const id = parseInt(req.params.id);
  const { maLop, tenLop, maBM } = req.body;

  if (!maLop || !tenLop || !maBM) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    console.log("🔍 Cập nhật lớp học:", req.body);

    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaLop", sql.VarChar(20), maLop)
      .input("TenLop", sql.NVarChar(255), tenLop)
      .input("MaBM", sql.Int, maBM).query(`
        UPDATE LOPHOC
        SET MaLop = @MaLop,
            TenLop = @TenLop,
            MaBM = @MaBM
        WHERE ID = @ID;
      `);

    res.status(200).json({ id, maLop, tenLop, maBM });
  } catch (err) {
    console.error("❌ Lỗi cập nhật lớp học:", err);
    res.status(500).json({ message: "Không thể cập nhật lớp học" });
  }
};

exports.updateLopHocPhan = async (req, res) => {
  const id = parseInt(req.params.id); // Nhận ID lớp học phần từ URL
  const {
    tenLHP,
    hocKy,
    namHoc,
    maGV,
    maMH,
    trangThai,
    chinhSach,
    maLH,
    luuTru,
    ngayTao, // Nhận trường NgayTao từ body request
  } = req.body;
  console.log(req.body);
  try {
    // Cập nhật lớp học phần trong bảng LOPHOCPHAN
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("TenLHP", sql.NVarChar, tenLHP)
      .input("HocKy", sql.SmallInt, hocKy)
      .input("NamHoc", sql.Int, namHoc)
      .input("MaGV", sql.Int, maGV)
      .input("MaMH", sql.Int, maMH)
      .input("TrangThai", sql.SmallInt, trangThai)
      .input("ChinhSach", sql.SmallInt, chinhSach)
      .input("MaLH", sql.Int, maLH)
      .input("LuuTru", sql.SmallInt, luuTru)
      .input("NgayTao", sql.DateTime, ngayTao).query(`
        UPDATE LOPHOCPHAN
        SET 
          TenLHP = @TenLHP, 
          HocKy = @HocKy, 
          NamHoc = @NamHoc, 
          MaGV = @MaGV, 
          MaMH = @MaMH, 
          TrangThai = @TrangThai, 
          ChinhSach = @ChinhSach, 
          MaLH = @MaLH, 
          LuuTru = @LuuTru,
          NgayTao = @NgayTao
        WHERE ID = @ID;
      `);

    res.status(200).json({
      id,
      tenLHP,
      hocKy,
      namHoc,
      maGV,
      maMH,
      trangThai,
      chinhSach,
      maLH,
      luuTru,
      ngayTao,
    });
  } catch (err) {
    console.error("Lỗi khi cập nhật lớp học phần:", err);
    res.status(500).json({ message: "Không thể cập nhật lớp học phần" });
  }
};

exports.deleteLopHocPhan = async (req, res) => {
  const id = req.params.id;

  try {
    // Bước 1: Kiểm tra xem Lớp học phần có sinh viên tham gia không
    const checkStudentAssignments = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM SINHVIEN_LHP WHERE MaLHP = @ID");

    if (checkStudentAssignments.recordset.length > 0) {
      return res
        .status(400)
        .json({
          message: "Lớp học phần này có sinh viên tham gia, không thể xóa!",
        });
    }

    // Bước 2: Kiểm tra xem Lớp học phần có giảng viên phân công không
    const checkTeacherAssignments = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM GIANGVIEN_LHP WHERE MaLHP = @ID");

    if (checkTeacherAssignments.recordset.length > 0) {
      return res
        .status(400)
        .json({
          message: "Lớp học phần này có giảng viên phân công, không thể xóa!",
        });
    }

    // Bước 3: Xóa Lớp học phần
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM LOPHOCPHAN WHERE ID = @ID");

    // Bước 4: Cập nhật lại giá trị IDENTITY cho bảng LOPHOCPHAN
    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM LOPHOCPHAN;
      DBCC CHECKIDENT ('LOPHOCPHAN', RESEED, @MaxID);
    `);

    res
      .status(200)
      .json({ id: parseInt(id), message: "Xóa lớp học phần thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa lớp học phần:", err);
    res.status(500).json({ message: "Lỗi khi xóa lớp học phần" });
  }
};

exports.getAllSinhVienLHP = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT *, ID as id FROM SINHVIEN_LHP");
    const total = result.recordset.length;

    res.set("Content-Range", `khoa 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");
    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID, // 👈 React Admin bắt buộc
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn tài liệu" });
  }
};

exports.getSinhVienLHPById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT *, ID as id FROM SINHVIEN_LHP WHERE ID = @ID");
    if (!result.recordset[0])
      return res.status(404).json({ message: "Không tìm thấy bản ghi" });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn" });
  }
};
exports.updateSinhVienLHP = async (req, res) => {
  const id = parseInt(req.params.id);
  const { maGV, maLHP, trangThai } = req.body;
  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaSV", sql.Int, maGV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai).query(`
        UPDATE SINHVIEN_LHP
        SET MaSV = @MaSV, MaLHP = @MaLHP, TrangThai = @TrangThai
        WHERE ID = @ID
      `);
    res.status(200).json({ id, maGV, maLHP, trangThai });
  } catch (err) {
    res.status(500).json({ message: "Lỗi cập nhật phân công" });
  }
};
exports.deleteSinhVienLHP = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM SINHVIEN_LHP WHERE ID = @ID");
    res.status(200).json({ id, message: "Đã xóa" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa phân công" });
  }
};

exports.addSinhVienLHP = async (req, res) => {
  const { maSV, maLHP, trangThai } = req.body;

  if (!maSV || !maLHP) {
    return res.status(400).json({
      message: "Thiếu thông tin cần thiết: Mã sinh viên và Mã lớp học phần.",
    });
  }

  try {
    // 1. Kiểm tra xem đã tồn tại bản ghi này chưa
    const check = await pool
      .request()
      .input("MaSV", sql.Int, maSV)
      .input("MaLHP", sql.Int, maLHP)
      .query(`
        SELECT ID FROM SINHVIEN_LHP WHERE MaSV = @MaSV AND MaLHP = @MaLHP
      `);

    if (check.recordset.length > 0) {
      return res.status(409).json({
        message: "Sinh viên này đã tham gia lớp học phần này!",
        id: check.recordset[0].ID,
      });
    }

    // 2. Thêm bản ghi mới
    const result = await pool
      .request()
      .input("MaSV", sql.Int, maSV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai || 1) // Default = 1
      .query(`
        INSERT INTO SINHVIEN_LHP (MaSV, MaLHP, TrangThai)
        VALUES (@MaSV, @MaLHP, @TrangThai);

        SELECT TOP 1 * FROM SINHVIEN_LHP WHERE MaSV = @MaSV AND MaLHP = @MaLHP ORDER BY ID DESC;
      `);

    const inserted = result.recordset[0];
    res.status(201).json({
      id: inserted.ID,
      MaSV: inserted.MaSV,
      MaLHP: inserted.MaLHP,
      TrangThai: inserted.TrangThai,
    });
  } catch (err) {
    console.error("Lỗi thêm sinh viên vào lớp học phần:", err);
    res.status(500).json({ message: "Lỗi thêm sinh viên vào lớp học phần" });
  }
};

exports.getAllGiangVienLHP = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT *, ID as id FROM GIANGVIEN_LHP");
    const total = result.recordset.length;

    res.set("Content-Range", `khoa 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");
    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID, // 👈 React Admin bắt buộc
    }));
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn tài liệu" });
  }
};

exports.getGiangVienLHPById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT *, ID as id FROM GIANGVIEN_LHP WHERE ID = @ID");
    if (!result.recordset[0])
      return res.status(404).json({ message: "Không tìm thấy bản ghi" });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn" });
  }
};
exports.updateGiangVienLHP = async (req, res) => {
  const id = parseInt(req.params.id);
  const { maGV, maLHP, trangThai } = req.body;

  if (!maGV || maGV === null) {
    return res.status(400).json({ message: "MaGV không được để trống" });
  }

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaGV", sql.Int, maGV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai).query(`
        UPDATE GIANGVIEN_LHP
        SET MaGV = @MaGV, MaLHP = @MaLHP, TrangThai = @TrangThai
        WHERE ID = @ID
      `);

    res.status(200).json({ id, maGV, maLHP, trangThai });
  } catch (err) {
    console.error("Lỗi khi cập nhật phân công giảng viên:", err);
    res.status(500).json({ message: "Lỗi cập nhật phân công giảng viên" });
  }
};

exports.deleteGiangVienLHP = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM GIANGVIEN_LHP WHERE ID = @ID");
    res.status(200).json({ id, message: "Đã xóa" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa phân công" });
  }
};
exports.addGiangVienLHP = async (req, res) => {
  const { maGV, maLHP, trangThai } = req.body;
  if (!maGV || !maLHP) {
    return res.status(400).json({
      message: "Thiếu thông tin: Mã giảng viên (maGV) và mã lớp học phần (maLHP)."
    });
  }
  try {
    // 1. Tra ID của giảng viên theo maGiangVien
    const gvResult = await pool
      .request()
      .input("MaGV", sql.Int, maGV)
      .query("SELECT ID FROM GIANGVIEN WHERE MaGV = @MaGV");

    if (!gvResult.recordset.length) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên!" });
    }
   exports.addGiangVienLHP = async (req, res) => {
  const { maGV, maLHP, trangThai } = req.body; // maGV là mã giảng viên kiểu string (ví dụ 'gv2')
  if (!maGV || !maLHP) {
    return res.status(400).json({
      message: "Thiếu thông tin: Mã giảng viên (maGV) và mã lớp học phần (maLHP)."
    });
  }
  try {
    // 1. Tra ID của giảng viên theo maGiangVien (mã ngoài)
    const gvResult = await pool
      .request()
      .input("MaGiangVien", sql.NVarChar(20), maGV)
      .query("SELECT ID FROM GIANGVIEN WHERE MaGiangVien = @MaGiangVien");

    if (!gvResult.recordset.length) {
      return res.status(404).json({ message: "Không tìm thấy giảng viên!" });
    }
    const gvID = gvResult.recordset[0].ID; // Đổi tên biến tránh trùng

    // 2. Kiểm tra trùng
    const check = await pool
      .request()
      .input("MaGV", sql.Int, gvID)
      .input("MaLHP", sql.Int, maLHP)
      .query("SELECT ID FROM GIANGVIEN_LHP WHERE MaGV = @MaGV AND MaLHP = @MaLHP");

    if (check.recordset.length > 0) {
      return res.status(409).json({
        message: "Giảng viên này đã được phân công vào lớp học phần này!",
        id: check.recordset[0].ID,
      });
    }

    // 3. Thêm bản ghi mới
    const result = await pool
      .request()
      .input("MaGV", sql.Int, gvID)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai || 1)
      .query(`
        INSERT INTO GIANGVIEN_LHP (MaGV, MaLHP, TrangThai)
        VALUES (@MaGV, @MaLHP, @TrangThai);

        SELECT TOP 1 * FROM GIANGVIEN_LHP WHERE MaGV = @MaGV AND MaLHP = @MaLHP ORDER BY ID DESC;
      `);

    const inserted = result.recordset[0];
    res.status(201).json({
      id: inserted.ID,
      MaGV: inserted.MaGV,
      MaLHP: inserted.MaLHP,
      TrangThai: inserted.TrangThai,
    });
  } catch (err) {
    console.error("Lỗi thêm phân công giảng viên:", err);
    res.status(500).json({ message: "Lỗi thêm phân công giảng viên" });
  }
};

    // 3. Thêm bản ghi mới
    const result = await pool
      .request()
      .input("MaGV", sql.Int, maGV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai || 1)
      .query(`
        INSERT INTO GIANGVIEN_LHP (MaGV, MaLHP, TrangThai)
        VALUES (@MaGV, @MaLHP, @TrangThai);

        SELECT TOP 1 * FROM GIANGVIEN_LHP WHERE MaGV = @MaGV AND MaLHP = @MaLHP ORDER BY ID DESC;
      `);

    const inserted = result.recordset[0];
    res.status(201).json({
      id: inserted.ID,
      MaGV: inserted.MaGV,
      MaLHP: inserted.MaLHP,
      TrangThai: inserted.TrangThai,
    });
  } catch (err) {
    console.error("Lỗi thêm phân công giảng viên:", err);
    res.status(500).json({ message: "Lỗi thêm phân công giảng viên" });
  }
};


exports.getTotalSinhVien = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT COUNT(*) AS total FROM SINHVIEN");

    const total = result.recordset[0].total;
    res.status(200).json({ total });
  } catch (err) {
    console.error("Lỗi khi lấy tổng số sinh viên:", err);
    res.status(500).json({ message: "Lỗi khi lấy tổng số sinh viên" });
  }
};

exports.getTotalGiangVien = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT COUNT(*) AS total FROM GIANGVIEN");

    const total = result.recordset[0].total;
    res.status(200).json({ total });
  } catch (err) {
    console.error("Lỗi khi lấy tổng số giảng viên:", err);
    res.status(500).json({ message: "Lỗi khi lấy tổng số giảng viên" });
  }
};

exports.getTotalLopHoc = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT COUNT(*) AS total FROM LOPHOC");

    const total = result.recordset[0].total;
    res.status(200).json({ total });
  } catch (err) {
    console.error("Lỗi khi lấy tổng số lớp học:", err);
    res.status(500).json({ message: "Lỗi khi lấy tổng số lớp học" });
  }
};

exports.getTotalMonHoc = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT COUNT(*) AS total FROM MONHOC");

    const total = result.recordset[0].total;
    res.status(200).json({ total });
  } catch (err) {
    console.error("Lỗi khi lấy tổng số môn học:", err);
    res.status(500).json({ message: "Lỗi khi lấy tổng số môn học" });
  }
};

exports.getTotalLopHocPhan = async (req, res) => {
  try {
    const result = await pool
      .request()
      .query("SELECT COUNT(*) AS total FROM LOPHOCPHAN");

    const total = result.recordset[0].total;
    res.status(200).json({ total });
  } catch (err) {
    console.error("Lỗi khi lấy tổng số lớp học phần:", err);
    res.status(500).json({ message: "Lỗi khi lấy tổng số lớp học phần" });
  }
};

exports.getGiangVienLopHocPhan = async (req, res) => {
  try {
    const result = await pool.request().query(`
        SELECT gv.TenGV, lhp.TenLHP, lhp.NamHoc, lhp.HocKy
        FROM GIANGVIEN gv
        JOIN LOPHOCPHAN lhp ON gv.ID = lhp.MaGV
      `);

    const data = result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.error("Lỗi khi lấy báo cáo phân công giảng viên:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy báo cáo phân công giảng viên" });
  }
};

exports.getSinhVienLopHocPhan = async (req, res) => {
  try {
    const result = await pool.request().query(`
        SELECT sv.HoTen, lhp.TenLHP, lhp.NamHoc, lhp.HocKy
        FROM SINHVIEN sv
        JOIN SINHVIEN_LHP slhp ON sv.ID = slhp.MaSV
        JOIN LOPHOCPHAN lhp ON slhp.MaLHP = lhp.ID
      `);

    const data = result.recordset;
    res.status(200).json(data);
  } catch (err) {
    console.error("Lỗi khi lấy báo cáo sinh viên tham gia lớp học phần:", err);
    res
      .status(500)
      .json({ message: "Lỗi khi lấy báo cáo sinh viên tham gia lớp học phần" });
  }
};

exports.getTotalUsers = async (req, res) => {
  try {
    const result = await pool.request().query(`
        SELECT COUNT(*) AS total 
        FROM USERS
      `);

    const total = result.recordset[0].total;
    res.status(200).json({ total });
  } catch (err) {
    console.error("Lỗi khi lấy tổng số người dùng:", err);
    res.status(500).json({ message: "Lỗi khi lấy tổng số người dùng" });
  }
};


exports.getAllBaiViet = async (req, res) => {
  try {
    // Cho phép sort một số trường
    const allowedSortFields = ["ID", "TieuDe", "LoaiBV", "NgayTao", "MaLHP"];
    const sortParam = req.query.sort ? JSON.parse(req.query.sort) : ["ID", "ASC"];
    const [sortField, sortOrder] = sortParam;

    const sortFieldSafe = allowedSortFields.includes(sortField) ? sortField : "ID";
    const sortOrderSafe = sortOrder && sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Phân trang
    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const [start, end] = range;
    const limit = end - start + 1;

    // Lọc
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const tieuDe = filter.TieuDe || "";
    const loaiBV = filter.LoaiBV !== undefined ? filter.LoaiBV : null; // số, null hoặc undefined

    // Truy vấn dữ liệu (có phân trang và filter)
    let whereSql = "WHERE 1=1";
    if (tieuDe) whereSql += " AND TieuDe LIKE @TieuDe";
    if (loaiBV !== null) whereSql += " AND LoaiBV = @LoaiBV";

    const request = pool.request();
    if (tieuDe) request.input("TieuDe", sql.NVarChar, `%${tieuDe}%`);
    if (loaiBV !== null) request.input("LoaiBV", sql.SmallInt, loaiBV);
    request.input("start", sql.Int, start);
    request.input("limit", sql.Int, limit);

    const query = `
      SELECT bv.*, 
        COALESCE(sv.HoTen, 
          CASE WHEN gv.HoGV IS NOT NULL THEN gv.HoGV + ' ' + gv.TenGV ELSE NULL END, 
          u.HoTen) AS TenNguoiDang
      FROM BAIVIET bv
      LEFT JOIN USERS u ON bv.MaTK = u.ID
      LEFT JOIN SINHVIEN sv ON u.ID = sv.MaTK
      LEFT JOIN GIANGVIEN gv ON u.ID = gv.MaTK
      ${whereSql}
      ORDER BY ${sortFieldSafe} ${sortOrderSafe}
      OFFSET @start ROWS FETCH NEXT @limit ROWS ONLY
    `;

    const result = await request.query(query);

    // Đếm tổng số (cho phân trang)
    const countRequest = pool.request();
    if (tieuDe) countRequest.input("TieuDe", sql.NVarChar, `%${tieuDe}%`);
    if (loaiBV !== null) countRequest.input("LoaiBV", sql.SmallInt, loaiBV);
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM BAIVIET
      ${whereSql}
    `;
    const countResult = await countRequest.query(countQuery);

    const total = countResult.recordset[0].total;

    res.set("Content-Range", `baiviet ${start}-${start + result.recordset.length - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    // Đảm bảo có trường id cho React Admin
    const data = result.recordset.map(item => ({
      ...item,
      id: item.ID,
        tenNguoiDang: item.TenNguoiDang,
    }));

    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi truy vấn bài viết:", err);
    res.status(500).json({ message: "Lỗi truy vấn bài viết" });
  }
};


exports.addBaiViet = async (req, res) => {
  const { tieuDe, noiDung, maTK, maLHP, ngayDang, loai, trangThai } = req.body;
  try {
    await pool.request()
      .input("TieuDe", sql.NVarChar, tieuDe)
      .input("NoiDung", sql.NText, noiDung)
      .input("MaTK", sql.Int, maTK)
      .input("MaLHP", sql.Int, maLHP)
      .input("NgayDang", sql.DateTime, ngayDang)
      .input("Loai", sql.Int, loai)
      .input("TrangThai", sql.SmallInt, trangThai || 1)
      .query(`
        INSERT INTO BAIVIET (TieuDe, NoiDung, MaTK, MaLHP, NgayDang, Loai, TrangThai)
        VALUES (@TieuDe, @NoiDung, @MaTK, @MaLHP, @NgayDang, @Loai, @TrangThai)
      `);

    const result = await pool.request().query(`SELECT TOP 1 * FROM BAIVIET ORDER BY ID DESC`);
    const inserted = result.recordset[0];
    res.status(201).json({ id: inserted.ID, ...inserted });
  } catch (err) {
    console.error("Lỗi thêm bài viết:", err);
    res.status(500).json({ message: "Không thể thêm bài viết" });
  }
};

exports.getBaiVietById = async (req, res) => {
  const id = parseInt(req.params.id);  // Ensure 'id' is an integer
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query(`
        SELECT 
          bv.ID,
          bv.TieuDe,
          bv.NoiDung,
          bv.LoaiBV,
          bv.MaTK,
          u.HoTen AS TenNguoiDang,  -- Get the name of the user who posted
          bv.MaLHP,
          bv.NgayTao,
          bv.HanNop,
          bv.TrangThai,
          bv.MaBaiViet
        FROM BAIVIET bv
        JOIN USERS u ON bv.MaTK = u.ID
        WHERE bv.ID = @ID  -- Filter by ID to fetch specific post
      `);

    // Check if the post exists
    if (!result.recordset[0]) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Return the response in the format that React Admin expects
    const post = result.recordset[0];
    res.json({
        id: post.ID,
        tieuDe: post.TieuDe,
        noiDung: post.NoiDung,
        loaiBV: post.LoaiBV,
        maTK: post.MaTK,
        tenNguoiDang: post.TenNguoiDang,
        maLHP: post.MaLHP,
        ngayTao: post.NgayTao,
        hanNop: post.HanNop,
        trangThai: post.TrangThai,
        maBaiViet: post.MaBaiViet
      
    });
  } catch (err) {
    console.error("Error querying post:", err);
    res.status(500).json({ message: "Lỗi truy vấn bài viết" });
  }
};


exports.updateBaiViet = async (req, res) => {
  const id = parseInt(req.params.id);  // Extract the ID from the request parameters
  const { tieuDe, noiDung, maTK, maLHP, ngayTao, loaiBV, trangThai } = req.body;

  // Ensure that essential fields are provided
  if (!tieuDe || !noiDung || !maTK || !maLHP) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    // Update the post (Bài viết) in the database
    await pool.request()
      .input("ID", sql.Int, id)
      .input("TieuDe", sql.NVarChar, tieuDe)
      .input("NoiDung", sql.NText, noiDung)
      .input("MaTK", sql.Int, maTK)
      .input("MaLHP", sql.Int, maLHP)
      .input("NgayTao", sql.DateTime, ngayTao || new Date())  // Default to current date if not provided
      .input("LoaiBV", sql.Int, loaiBV)  // Use correct column name "LoaiBV"
      .input("TrangThai", sql.SmallInt, trangThai || 1)  // Default to 'active' status (1) if not provided
      .query(`
        UPDATE BAIVIET
        SET TieuDe = @TieuDe, NoiDung = @NoiDung, MaTK = @MaTK, 
            MaLHP = @MaLHP, NgayTao = @NgayTao, LoaiBV = @LoaiBV, TrangThai = @TrangThai
        WHERE ID = @ID;
      `);

    // Respond with the updated post data in the expected format
    res.status(200).json({
     
        id,  // Include the ID of the updated record
        tieuDe,
        noiDung,
        maTK,
        maLHP,
        ngayTao,
        loaiBV,
        trangThai
      
    })
  } catch (err) {
    // Log and handle the error
    console.error("Error updating post:", err);
    res.status(500).json({ message: "Không thể cập nhật bài viết" });
  }
};



exports.deleteBaiViet = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM BAIVIET WHERE ID = @ID");
    res.status(200).json({ id, message: "Đã xóa bài viết" });
  } catch (err) {
    res.status(500).json({ message: "Không thể xóa bài viết" });
  }
};

exports.getTotalBaiViet = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT COUNT(*) AS total FROM BAIVIET");
    res.status(200).json({ total: result.recordset[0].total });
  } catch (err) {
    res.status(500).json({ message: "Lỗi thống kê bài viết" });
  }
};
exports.getTotalTaiLieu = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT COUNT(*) AS total FROM TAILIEU");
    res.status(200).json({ total: result.recordset[0].total });
  } catch (err) {
    res.status(500).json({ message: "Lỗi thống kê tài liệu" });
  }
};

exports.getAllBaiNop = async (req, res) => {
  try {
    // Sort, phân trang, lọc
    const allowedSortFields = ["ID", "MaSV", "MaLHP", "MaBaiViet", "NgayNop"];
    const sortParam = req.query.sort ? JSON.parse(req.query.sort) : ["ID", "ASC"];
    const [sortField, sortOrder] = sortParam;
    const sortFieldSafe = allowedSortFields.includes(sortField) ? sortField : "ID";
    const sortOrderSafe = sortOrder && sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const [start, end] = range;
    const limit = end - start + 1;

    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const maLHP = filter.MaLHP || null;
    const maSV = filter.MaSV || null;
    const maBaiViet = filter.MaBaiViet || null;

    let whereSql = "WHERE 1=1";
    if (maLHP) whereSql += " AND MaLHP = @MaLHP";
    if (maSV) whereSql += " AND MaSV = @MaSV";
    if (maBaiViet) whereSql += " AND MaBaiViet = @MaBaiViet";

    const request = pool.request();
    if (maLHP) request.input("MaLHP", sql.Int, maLHP);
    if (maSV) request.input("MaSV", sql.Int, maSV);
    if (maBaiViet) request.input("MaBaiViet", sql.Int, maBaiViet);
    request.input("start", sql.Int, start);
    request.input("limit", sql.Int, limit);

    const query = `
      SELECT * FROM NOPBAI
      ${whereSql}
      ORDER BY ${sortFieldSafe} ${sortOrderSafe}
      OFFSET @start ROWS FETCH NEXT @limit ROWS ONLY
    `;
    const result = await request.query(query);

    // Đếm tổng
    const countRequest = pool.request();
    if (maLHP) countRequest.input("MaLHP", sql.Int, maLHP);
    if (maSV) countRequest.input("MaSV", sql.Int, maSV);
    if (maBaiViet) countRequest.input("MaBaiViet", sql.Int, maBaiViet);
    const countResult = await countRequest.query(`
      SELECT COUNT(*) AS total FROM NOPBAI ${whereSql}
    `);
    const total = countResult.recordset[0].total;

    res.set("Content-Range", `nopbai ${start}-${start + result.recordset.length - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");
    const data = result.recordset.map(item => ({ ...item, id: item.ID }));
    res.json(data);
  } catch (err) {
    console.error("❌ Lỗi truy vấn bài nộp:", err);
    res.status(500).json({ message: "Lỗi truy vấn bài nộp" });
  }
};

exports.getBaiNopById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM NOPBAI WHERE ID = @ID");
    if (!result.recordset[0])
      return res.status(404).json({ message: "Không tìm thấy bài nộp" });
    res.json({ ...result.recordset[0], id });
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn bài nộp" });
  }
};

exports.addBaiNop = async (req, res) => {
  const { MaSV, MaLHP, MaBaiViet, Diem, FileDinhKem, VanBan, TrangThai, NgayNop } = req.body;
  try {
    await pool.request()
      .input("MaSV", sql.Int, MaSV)
      .input("MaLHP", sql.Int, MaLHP)
      .input("MaBaiViet", sql.Int, MaBaiViet)
      .input("Diem", sql.Float, Diem || null)
      .input("FileDinhKem", sql.NVarChar(255), FileDinhKem || null)
      .input("VanBan", sql.Text, VanBan || null)
      .input("TrangThai", sql.SmallInt, TrangThai || 1)
      .input("NgayNop", sql.DateTime, NgayNop || new Date())
      .query(`
        INSERT INTO NOPBAI (MaSV, MaLHP, MaBaiViet, Diem, FileDinhKem, VanBan, TrangThai, NgayNop)
        VALUES (@MaSV, @MaLHP, @MaBaiViet, @Diem, @FileDinhKem, @VanBan, @TrangThai, @NgayNop)
      `);

    const result = await pool.request().query("SELECT TOP 1 * FROM NOPBAI ORDER BY ID DESC");
    const inserted = result.recordset[0];
    res.status(201).json({ id: inserted.ID, ...inserted });
  } catch (err) {
    console.error("❌ Lỗi thêm bài nộp:", err);
    res.status(500).json({ message: "Không thể thêm bài nộp" });
  }
};

exports.updateBaiNop = async (req, res) => {
  const id = parseInt(req.params.id);
  const { Diem, FileDinhKem, VanBan, TrangThai, NgayNop } = req.body;
  try {
    await pool.request()
      .input("ID", sql.Int, id)
      .input("Diem", sql.Float, Diem || null)
      .input("FileDinhKem", sql.NVarChar(255), FileDinhKem || null)
      .input("VanBan", sql.Text, VanBan || null)
      .input("TrangThai", sql.SmallInt, TrangThai || 1)
      .input("NgayNop", sql.DateTime, NgayNop || new Date())
      .query(`
        UPDATE NOPBAI
        SET Diem = @Diem,
            FileDinhKem = @FileDinhKem,
            VanBan = @VanBan,
            TrangThai = @TrangThai,
            NgayNop = @NgayNop
        WHERE ID = @ID
      `);
    res.status(200).json({ id, Diem, FileDinhKem, VanBan, TrangThai, NgayNop });
  } catch (err) {
    res.status(500).json({ message: "Không thể cập nhật bài nộp" });
  }
};

exports.deleteBaiNop = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await pool.request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM NOPBAI WHERE ID = @ID");
    res.status(200).json({ id, message: "Đã xóa bài nộp" });
  } catch (err) {
    res.status(500).json({ message: "Không thể xóa bài nộp" });
  }
};

exports.getDashboardSummaryById

// adminController.js (bổ sung cuối file)
exports.getDashboardSummary = async (req, res) => {
  try {
    const [
    
      sv,
      gv,
      lh,
      mh,
      lhp,
      users,
      bv,
      tl,
      nopbai,
      k,bm
    ] = await Promise.all([
      pool.request().query("SELECT COUNT(*) as total FROM SINHVIEN"),
      pool.request().query("SELECT COUNT(*) as total FROM GIANGVIEN"),
      pool.request().query("SELECT COUNT(*) as total FROM LOPHOC"),
      pool.request().query("SELECT COUNT(*) as total FROM MONHOC"),
      pool.request().query("SELECT COUNT(*) as total FROM LOPHOCPHAN"),
      pool.request().query("SELECT COUNT(*) as total FROM USERS"),
      pool.request().query("SELECT COUNT(*) as total FROM BAIVIET"),
      pool.request().query("SELECT COUNT(*) as total FROM TAILIEU"),
      pool.request().query("SELECT COUNT(*) as total FROM NOPBAI"),
      
      pool.request().query("SELECT COUNT(*) as total FROM KHOA"),
      pool.request().query("SELECT COUNT(*) as total FROM BOMON"),
    ]);

    res.json({
      sinhVien: sv.recordset[0].total,
      giangVien: gv.recordset[0].total,
      lopHoc: lh.recordset[0].total,
      monHoc: mh.recordset[0].total,
      lopHocPhan: lhp.recordset[0].total,
      users: users.recordset[0].total,
      baiViet: bv.recordset[0].total,
      taiLieu: tl.recordset[0].total,
      baiNop: nopbai.recordset[0].total,
      khoa: k.recordset[0].total,
      boMon: bm.recordset[0].total
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi lấy dashboard tổng hợp" });
  }
};

