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
exports.getUserById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM USERS WHERE ID = @ID");

    const user = result.recordset[0];
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({
      id: user.ID, // key quan trọng!
      maNguoiDung: user.MaNguoiDung,
      email: user.Email,
      matKhau: user.MatKhau,
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
      tenLP: lop.TenLP,
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
      .query("SELECT * FROM GIANGVIENN WHERE ID = @ID");

    const gv = result.recordset[0];
    if (!gv)
      return res.status(404).json({ message: "Không tìm thấy giảng viên" });

    res.json({
      id: gv.ID,
      msgv: gv.MSGV,
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
    console.error(err);
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
      ...item,
      id: item.ID,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi truy vấn khoa" });
  }
};exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.request().query(`
      SELECT 
        u.ID,
        u.Email,
        u.MatKhau,
        u.Quyen,
        u.TrangThai,
        u.MaNguoiDung,
        COALESCE(sv.HoTen, gv.HoGV + ' ' + gv.TenGV, u.HoTen) AS HoTen
      FROM USERS u
      LEFT JOIN SINHVIEN sv ON u.ID = sv.MaTK
      LEFT JOIN GIANGVIENN gv ON u.ID = gv.MaTK
    `);

    const total = result.recordset.length;

    res.set("Content-Range", `users 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID,
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
    const sortParam = req.query.sort ? JSON.parse(req.query.sort) : ["ID", "ASC"];
    const [sortField, sortOrder] = sortParam;

    const sortFieldSafe = allowedSortFields.includes(sortField) ? sortField : "ID";

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
        ORDER BY ${sortFieldSafe} ${sortOrder.toUpperCase()}
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
    const result = await pool.request().query("SELECT * FROM GIANGVIENN");
    const total = result.recordset.length;

    res.set("Content-Range", `giangvienn 0-${total - 1}/${total}`);
    res.set("Access-Control-Expose-Headers", "Content-Range");

    const data = result.recordset.map((item) => ({
      ...item,
      id: item.ID,
    }));

    res.json(data);
  } catch (err) {
    console.error(err);
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
exports.addGiangVien = async (req, res) => {
  const {
    msgv,
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
    const result = await pool
      .request()
      .input("MSGV", sql.Char(10), msgv) // Matching the field name correctly here
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
        INSERT INTO GIANGVIENN (MSGV, HoGV, TenGV, NgaySinh, GioiTinh, SDT, MaTK, CCCD, MaBM, DiaChi, TrangThai, MaGiangVien)
        VALUES (@MSGV, @HoGV, @TenGV, @NgaySinh, @GioiTinh, @SDT, @MaTK, @CCCD, @MaBM, @DiaChi, @TrangThai, @MaGiangVien);
        SELECT TOP 1 * FROM GIANGVIENN ORDER BY ID DESC;
      `);

    const gv = result.recordset[0];
    res.status(201).json({ id: gv.ID, ...gv }); // Responding with the newly added lecturer's data
  } catch (err) {
    console.error("Lỗi thêm giảng viên:", err);
    res.status(500).json({ message: "Không thể thêm giảng viên" });
  }
};

exports.updateGiangVien = async (req, res) => {
  const id = parseInt(req.params.id);
  const {
    msgv,
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
      .input("MSGV", sql.Char(10), msgv)
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
          MSGV = @MSGV,
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
      msgv,
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
  const id = req.params.id;
  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM GIANGVIENN WHERE ID = @ID");
    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM GIANGVIENN;
      DBCC CHECKIDENT ('GIANGVIENN', RESEED, @MaxID);
    `);
    res
      .status(200)
      .json({ id: parseInt(id), message: "Xóa giảng viên thành công" });
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
    const maSinhVien = `sv${newUserId}`;
    const email = `${maSinhVien}@ckc.vn`;

    // 2. Cập nhật lại Email + MaNguoiDung
    await pool
      .request()
      .input("Email", sql.NVarChar(100), email)
      .input("MaNguoiDung", sql.VarChar(20), maSinhVien)
      .input("ID", sql.Int, newUserId).query(`
        UPDATE USERS SET Email = @Email, MaNguoiDung = @MaNguoiDung WHERE ID = @ID
        
      `);

    // 3. Thêm vào bảng SINHVIEN
    const result = await pool
      .request()
      .input("MaSinhVien", sql.VarChar(20), maSinhVien)
      .input("MaTK", sql.Int, newUserId)
      .input("MaLopHoc", sql.Int, maLopHoc)
      .input("HoTen", sql.NVarChar(255), hoTen).query(`
        INSERT INTO SINHVIEN (MaSinhVien, MaTK, MaLopHoc, HoTen)
        VALUES (@MaSinhVien, @MaTK, @MaLopHoc, @HoTen);
        SELECT TOP 1 * FROM SINHVIEN ORDER BY ID DESC
      `);

    const inserted = result.recordset[0];
    res.status(201).json({ id: inserted.ID, ...inserted });
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
  const id = req.params.id;
  const { maSinhVien, maTK, maLopHoc, hoTen } = req.body;
  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaSinhVien", sql.VarChar(20), maSinhVien)
      .input("MaTK", sql.Int, maTK)
      .input("MaLopHoc", sql.Int, maLopHoc)
      .input("HoTen", sql.NVarChar(255), hoTen)
      .query(
        `UPDATE SINHVIEN SET MaSinhVien = @MaSinhVien, MaTK = @MaTK, MaLopHoc = @MaLopHoc, HoTen = @HoTen WHERE ID = @ID`
      );

    res.status(200).json({ id, maSinhVien, maTK, maLopHoc, hoTen });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể cập nhật sinh viên" });
  }
};

exports.deleteSinhVien = async (req, res) => {
  const id = req.params.id;
  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM SINHVIEN WHERE ID = @ID");

    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM SINHVIEN;
      DBCC CHECKIDENT ('SINHVIEN', RESEED, @MaxID);
    `);

    res
      .status(200)
      .json({ id: parseInt(id), message: "Xóa sinh viên thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa sinh viên:", err);
    res.status(500).json({ message: "Lỗi khi xóa sinh viên" });
  }
};

exports.addLopHoc = async (req, res) => {
  const { MaLop, TenLP, MaBM } = req.body;
  try {
    await pool
      .request()
      .input("MaLop", sql.VarChar(20), MaLop)
      .input("TenLP", sql.NVarChar(255), TenLP)
      .input("MaBM", sql.Int, MaBM).query(`
        INSERT INTO LOPHOC (MaLop, TenLP, MaBM)
        VALUES (@MaLop, @TenLP, @MaBM)
    `);

    const result = await pool
      .request()
      .query("SELECT TOP 1 * FROM LOPHOC ORDER BY ID DESC");
    const inserted = result.recordset[0];

    res.status(201).json({ id: inserted.ID, ...inserted });
  } catch (err) {
    console.error("Lỗi addLopHoc:", err);
    res.status(500).json({ message: "Không thể thêm lớp học" });
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
    console.log("📥 Body nhận được:", req.body);

    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    console.log("🔍 Cập nhật user:", req.body);

    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaNguoiDung", sql.VarChar(20), maNguoiDung)
      .input("Email", sql.NVarChar(100), email)
      .input("HoTen", sql.NVarChar(255), hoTen)
      .input("MatKhau", sql.NVarChar(255), matKhau)
      .input("Quyen", sql.Int, quyen)
      .input("TrangThai", sql.SmallInt, trangThai).query(`
        UPDATE USERS
        SET MaNguoiDung = @MaNguoiDung,
            Email = @Email,
            MatKhau = @MatKhau,
            HoTen = @HoTen,
            Quyen = @Quyen,
            TrangThai = @TrangThai
        WHERE ID = @ID;
      `);

    res.status(200).json({ id, maNguoiDung, email, matKhau, quyen, trangThai });
  } catch (err) {
    console.error("❌ Lỗi cập nhật user:", err);
    res.status(500).json({ message: "Không thể cập nhật user" });
  }
};

exports.deleteUsers = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM USERS WHERE ID = @ID");

    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM USERS;
      DBCC CHECKIDENT ('USERS', RESEED, @MaxID);
    `);

    res.status(200).json({ id, message: "Đã xóa user" });
  } catch (err) {
    console.error("❌ Lỗi xóa user:", err);
    res.status(500).json({ message: "Không thể xóa user" });
  }
};
// };
exports.updateLopHoc = async (req, res) => {
  const id = parseInt(req.params.id);
  const { maLop, tenLP, maBM } = req.body;

  if (!maLop || !tenLP || !maBM) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    console.log("🔍 Cập nhật lớp học:", req.body);

    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaLop", sql.VarChar(20), maLop)
      .input("TenLP", sql.NVarChar(255), tenLP)
      .input("MaBM", sql.Int, maBM).query(`
        UPDATE LOPHOC
        SET MaLop = @MaLop,
            TenLP = @TenLP,
            MaBM = @MaBM
        WHERE ID = @ID;
      `);

    res.status(200).json({ id, maLop, tenLP, maBM });
  } catch (err) {
    console.error("❌ Lỗi cập nhật lớp học:", err);
    res.status(500).json({ message: "Không thể cập nhật lớp học" });
  }
};

exports.deleteLopHoc = async (req, res) => {
  const id = parseInt(req.params.id);

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM LOPHOC WHERE ID = @ID");

    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM LOPHOC;
      DBCC CHECKIDENT ('LOPHOC', RESEED, @MaxID);
    `);

    res.status(200).json({ id, message: "Đã xóa lớp học" });
  } catch (err) {
    console.error("❌ Lỗi xóa lớp học:", err);
    res.status(500).json({ message: "Không thể xóa lớp học" });
  }
};

exports.addLopHoc = async (req, res) => {
  const { MaLop, TenLP, MaBM } = req.body;
  try {
    await pool
      .request()
      .input("MaLop", sql.VarChar(20), MaLop)
      .input("TenLP", sql.NVarChar(255), TenLP)
      .input("MaBM", sql.Int, MaBM).query(`
        INSERT INTO LOPHOC (MaLop, TenLP, MaBM)
        VALUES (@MaLop, @TenLP, @MaBM)
    `);

    const result = await pool
      .request()
      .query("SELECT TOP 1 * FROM LOPHOC ORDER BY ID DESC");
    const inserted = result.recordset[0];

    res.status(201).json({ id: inserted.ID, ...inserted });
  } catch (err) {
    console.error("Lỗi addLopHoc:", err);
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
  console.log("Dữ liệu thêm lớp học phần:", req.body);
  try {
    await pool
      .request()
      .input("TenLHP", sql.VarChar(20), tenLHP)
      .input("NgayTao", sql.DateTime, ngayTao)
      .input("HocKy", sql.SmallInt, hocKy)
      .input("ChinhSach", sql.SmallInt, chinhSach)
      .input("NamHoc", sql.Int, namHoc)
      .input("MaGV", sql.Int, maGV)
      .input("MaLH", sql.Int, maLH)
      .input("MaMH", sql.Int, maMH)
      .input("LuuTru", sql.SmallInt, luuTru)
      .input("TrangThai", sql.SmallInt, trangThai).query(`
        INSERT INTO LOPHOCPHAN (TenLHP, NgayTao, HocKy, ChinhSach, NamHoc, MaGV, MaLH, MaMH, LuuTru, TrangThai)
        VALUES (@TenLHP, @NgayTao, @HocKy, @ChinhSach, @NamHoc, @MaGV, @MaLH, @MaMH, @LuuTru, @TrangThai);
        
      `);

    const result = await pool
      .request()
      .query("SELECT TOP 1 * FROM LOPHOCPHAN ORDER BY ID DESC");
    const inserted = result.recordset[0];
    const query1 = `INSERT INTO SINHVIEN_LHP (MaSV, MaLHP,TrangThai) SELECT ID, ${inserted.ID}, 1 FROM SINHVIEN WHERE MaLopHoc = ${maLH}`;
    res.status(201).json({ id: inserted.ID, ...inserted });
    await pool.request().query(query1);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể thêm lớp học phần" });
  }
};

exports.updateLopHoc = async (req, res) => {
  const id = parseInt(req.params.id);
  const { maLop, tenLP, maBM } = req.body;

  if (!maLop || !tenLP || !maBM) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    console.log("🔍 Cập nhật lớp học:", req.body);

    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("MaLop", sql.VarChar(20), maLop)
      .input("TenLP", sql.NVarChar(255), tenLP)
      .input("MaBM", sql.Int, maBM).query(`
        UPDATE LOPHOC
        SET MaLop = @MaLop,
            TenLP = @TenLP,
            MaBM = @MaBM
        WHERE ID = @ID;
      `);

    res.status(200).json({ id, maLop, tenLP, maBM });
  } catch (err) {
    console.error("❌ Lỗi cập nhật lớp học:", err);
    res.status(500).json({ message: "Không thể cập nhật lớp học" });
  }
};
exports.updateLopHocPhan = async (req, res) => {
  const id = parseInt(req.params.id);
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
  console.log("Dữ liệu update:", req.body);

  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .input("TenLHP", sql.NVarChar(255), tenLHP)
      .input("NgayTao", sql.DateTime, ngayTao)
      .input("HocKy", sql.SmallInt, hocKy)
      .input("ChinhSach", sql.SmallInt, chinhSach)
      .input("NamHoc", sql.Int, namHoc)
      .input("MaGV", sql.Int, maGV)
      .input("MaLH", sql.Int, maLH)
      .input("MaMH", sql.Int, maMH)
      .input("LuuTru", sql.SmallInt, luuTru)
      .input("TrangThai", sql.SmallInt, trangThai).query(`
        UPDATE LOPHOCPHAN
        SET TenLHP = @TenLHP, NgayTao = @NgayTao, HocKy = @HocKy,
            ChinhSach = @ChinhSach, NamHoc = @NamHoc, MaGV = @MaGV,
            MaLH = @MaLH, MaMH = @MaMH, LuuTru = @LuuTru, TrangThai = @TrangThai
        WHERE ID = @ID;
      `);

    res.status(200).json({
      id,
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
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Không thể cập nhật lớp học phần" });
  }
};

exports.deleteLopHocPhan = async (req, res) => {
  const { id } = req.params;
  try {
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM LOPHOCPHAN WHERE ID = @ID");

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
    res.status(500).json({ message: "Không thể xóa lớp học phần" });
  }
};
