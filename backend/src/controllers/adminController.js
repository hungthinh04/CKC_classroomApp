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
      id: user.id,
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
      .query("SELECT * FROM GIANGVIEN WHERE ID = @ID");

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
      tenLP: item.TenLP,
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
        COALESCE(sv.HoTen, gv.HoGV + ' ' + gv.TenGV, u.HoTen) AS HoTen
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
    const sortParam = req.query.sort ? JSON.parse(req.query.sort) : ["ID", "ASC"];
    const [sortField, sortOrder] = sortParam;

    const sortFieldSafe = allowedSortFields.includes(sortField) ? sortField : "ID";
    const sortOrderSafe = sortOrder && sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const range = req.query.range ? JSON.parse(req.query.range) : [0, 9];
    const [start, end] = range;
    const limit = end - start + 1;

    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    const tenBM = filter.TenBM || "";

    const result = await pool
      .request()
      .input("TenBM", sql.NVarChar, `%${tenBM}%`)
      .input("start", sql.Int, start)
      .input("limit", sql.Int, limit)
      .query(`
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

    res.set("Content-Range", `bomon ${start}-${start + result.recordset.length - 1}/${total}`);
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

exports.deleteBoMon = async (id) => {
  try {
    // Bước 1: Kiểm tra xem có bản ghi nào tham chiếu trong bảng NHANXET không
    const checkRecords = await pool
      .request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM NHANXET WHERE MaBV = @ID");

    if (checkRecords.recordset.length > 0) {
      // Bước 2: Xóa các bản ghi trong NHANXET
      await pool
        .request()
        .input("ID", sql.Int, id)
        .query("DELETE FROM NHANXET WHERE MaBV = @ID");
    }

    // Bước 3: Xóa bản ghi trong BOMON
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM BOMON WHERE ID = @ID");

    console.log(
      "Bộ môn đã được xóa và các bản ghi liên quan trong NHANXET đã được xóa."
    );
  } catch (err) {
    console.error("Lỗi khi xóa bộ môn:", err);
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
  // const { id } = req.params;
  const id = parseInt(req.params.id);

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
 
    // Insert user vào bảng USERS
    const userResult = await pool
      .request()
      .input("Email", sql.NVarChar(100), "")
      .input("MatKhau", sql.NVarChar(255), "defaultPassword")
      .input("Quyen", sql.Int, 1) // Giảng viên
      .input("TrangThai", sql.SmallInt, 1) // Hoạt động
      .query(`
        INSERT INTO USERS (Email, MatKhau, Quyen, TrangThai)
        VALUES (@Email, @MatKhau, @Quyen, @TrangThai);
        SELECT SCOPE_IDENTITY() AS MaTK;
      `);

    const maTK = userResult.recordset[0].MaTK;

    const email = `gv${maTK}@ckc.vn`;

    // Cập nhật lại email
    await pool
      .request()
      .input("Email", sql.NVarChar(100), email)
      .input("ID", sql.Int, maTK)
      .query("UPDATE USERS SET Email = @Email WHERE ID = @ID");

    const maGiangVien = `GV${maTK.toString().padStart(3, "0")}`;

    // Insert giảng viên vào bảng GIANGVIEN
    const giangVienResult = await pool
      .request()
      .input("MSGV", sql.VarChar(10), `gv${maTK}`)
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
      .input("MaGiangVien", sql.NVarChar(20), maGiangVien)
      .query(`
        INSERT INTO GIANGVIEN (MSGV, HoGV, TenGV, NgaySinh, GioiTinh, SDT, MaTK, CCCD, MaBM, DiaChi, TrangThai, MaGiangVien)
        VALUES (@MSGV, @HoGV, @TenGV, @NgaySinh, @GioiTinh, @SDT, @MaTK, @CCCD, @MaBM, @DiaChi, @TrangThai, @MaGiangVien);
        SELECT TOP 1 * FROM GIANGVIEN ORDER BY ID DESC;
      `);

    const gv = giangVienResult.recordset[0];

    res.status(201).json({ id: gv.ID, ...gv, email });
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
      .input("MSGV", sql.VarChar(10), msgv)
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
      .query("DELETE FROM GIANGVIEN WHERE ID = @ID");
    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM GIANGVIEN;
      DBCC CHECKIDENT ('GIANGVIEN', RESEED, @MaxID);
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
  const id = parseInt(req.params.id); // ID từ URL

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
  const { tenLP, maBM } = req.body; // Không cần gửi MaLop nữa

  try {
    // Câu lệnh INSERT không cần MaLop nữa vì MaLop tự tăng
    await pool
      .request()
      .input("TenLP", sql.NVarChar(255), tenLP)
      .input("MaBM", sql.Int, maBM).query(`
        INSERT INTO LOPHOC (TenLP, MaBM)
        VALUES (@TenLP, @MaBM);
    `);

    // Lấy bản ghi vừa chèn
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
  const { maNguoiDung, email, matKhau, hoTen, quyen, trangThai } = req.body; // 👈 camelCase đúng như frontend gửi

  if (!maNguoiDung || !email || !matKhau) {
    console.log("📥 Thiếu thông tin:", req.body);
    return res.status(400).json({ message: "Thiếu thông tin cần thiết" });
  }

  try {
    console.log("🔄 Cập nhật USER:", req.body);

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

  if (!tenLP || !maLop || !maBM) {
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
  const { tenLP, maBM } = req.body;

  if (!tenLP || !maBM) {
    return res
      .status(400)
      .json({ message: "Tên lớp và Mã bộ môn không được để trống." });
  }

  try {
    // Bước 1: Thêm lớp học vào bảng mà không cần MaLop (MaLop tự động sinh ra sau)
    await pool
      .request()
      .input("TenLP", sql.NVarChar(255), tenLP) // Truyền tên lớp
      .input("MaBM", sql.Int, maBM) // Truyền mã bộ môn
      .query(`
        INSERT INTO LOPHOC (TenLP, MaBM)
        VALUES (@TenLP, @MaBM);
    `);

    // Bước 2: Lấy lớp học vừa thêm để lấy ID và tự tạo MaLop
    const result = await pool
      .request()
      .query("SELECT TOP 1 * FROM LOPHOC ORDER BY ID DESC");

    const inserted = result.recordset[0];
    const maLop = `L${String(inserted.ID).padStart(3, "0")}`; // Tạo mã lớp L001, L002, ...

    // Bước 3: Cập nhật mã lớp vào bảng `LOPHOC`
    await pool
      .request()
      .input("MaLop", sql.VarChar(20), maLop) // Mã lớp mới
      .input("ID", sql.Int, inserted.ID) // ID lớp học vừa chèn
      .query(`
        UPDATE LOPHOC
        SET MaLop = @MaLop
        WHERE ID = @ID
    `);

    // Trả về lớp học đã được tạo
    res.status(201).json({ id: inserted.ID, maLop, ...inserted });
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

    // Nếu cần, có thể thêm sinh viên vào lớp học phần (nếu có dữ liệu về lớp học)
    const query1 = `
      INSERT INTO SINHVIEN_LHP (MaSV, MaLHP, TrangThai)
      SELECT ID, ${inserted.ID}, 1 FROM SINHVIEN WHERE MaLopHoc = ${maLH}
    `;
    await pool.request().query(query1);

    // Trả về kết quả lớp học phần vừa thêm
    res.status(201).json({ id: inserted.ID, ...inserted });
  } catch (err) {
    console.error("Lỗi thêm lớp học phần:", err);
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
    // Bước 1: Xóa các bản ghi liên quan trong bảng SINHVIEN_LHP
    await pool
      .request()
      .input("MaLHP", sql.Int, id)
      .query("DELETE FROM SINHVIEN_LHP WHERE MaLHP = @MaLHP");

    // Bước 2: Xóa bản ghi trong bảng LOPHOCPHAN
    await pool
      .request()
      .input("ID", sql.Int, id)
      .query("DELETE FROM LOPHOCPHAN WHERE ID = @ID");

    // Bước 3: Reset IDENTITY trong bảng LOPHOCPHAN
    await pool.request().query(`
      DECLARE @MaxID INT;
      SELECT @MaxID = ISNULL(MAX(ID), 0) FROM LOPHOCPHAN;
      DBCC CHECKIDENT ('LOPHOCPHAN', RESEED, @MaxID);
    `);

    // Trả về phản hồi thành công
    res
      .status(200)
      .json({ id: parseInt(id), message: "Xóa lớp học phần thành công" });
  } catch (err) {
    console.error("Lỗi khi xóa lớp học phần:", err);
    res.status(500).json({ message: "Không thể xóa lớp học phần" });
  }
};

exports.getAllSinhVienLHP = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT *, ID as id FROM SINHVIEN_LHP");
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
}


exports.getSinhVienLHPById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.request().input("ID", sql.Int, id)
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
    await pool.request()
      .input("ID", sql.Int, id)
      .input("MaSV", sql.Int, maGV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai)
      .query(`
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
    await pool.request().input("ID", sql.Int, id)
      .query("DELETE FROM SINHVIEN_LHP WHERE ID = @ID");
    res.status(200).json({ id, message: "Đã xóa" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa phân công" });
  }
};
exports.addSinhVienLHP = async (req, res) => {
  const { maSV, maLHP, trangThai } = req.body;

  if (!maSV || !maLHP) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết: Mã sinh viên và Mã lớp học phần." });
  }

  try {
    const result = await pool
      .request()
      .input("MaSV", sql.Int, maSV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai || 1)  // Default trangThai = 1
      .query(`
        INSERT INTO SINHVIEN_LHP (MaSV, MaLHP, TrangThai)
        VALUES (@MaSV, @MaLHP, @TrangThai);
        SELECT TOP 1 * FROM SINHVIEN_LHP ORDER BY ID DESC;
      `);

    if (result && result.recordset && result.recordset[0]) {
      const inserted = result.recordset[0];  // Get the inserted record

      // Ensure that the response is wrapped in the 'data' key
      res.status(201).json({
          // Wrap the result in the 'data' key
          id: inserted.ID,  // Ensure 'id' is included
          MaSV: inserted.MaSV,
          MaLHP: inserted.MaLHP,
          TrangThai: inserted.TrangThai,
        
      });
    } else {
      console.error("Lỗi: Không có dữ liệu trả về từ cơ sở dữ liệu.");
      res.status(400).json({ message: "Không có dữ liệu trả về từ cơ sở dữ liệu." });
    }
  } catch (err) {
    console.error("Lỗi thêm phân công giảng viên:", err);
    res.status(500).json({ message: "Lỗi thêm phân công giảng viên" });
  }
};
exports.getAllGiangVienLHP = async (req, res) => {
  try {
    const result = await pool.request().query("SELECT *, ID as id FROM GIANGVIEN_LHP");
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
    const result = await pool.request().input("ID", sql.Int, id)
      .query("SELECT *, ID as id FROM GIANGVIEN_LHP WHERE ID = @ID");
    if (!result.recordset[0])
      return res.status(404).json({ message: "Không tìm thấy bản ghi" });
    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ message: "Lỗi truy vấn" });
  }
};
exports.getBaiVietById = async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    const result = await pool.request()
      .input("ID", sql.Int, id)
      .query("SELECT * FROM BAIVIET WHERE ID = @ID");

    const baiViet = result.recordset[0];

    if (!baiViet) {
      return res.status(404).json({ message: "Không tìm thấy bài viết" });
    }

    // Đảm bảo dữ liệu có trường `id` và đóng gói trong `data`
    res.json({
      data: {
        id: baiViet.ID,  // Đảm bảo có trường `id`
        ...baiViet      // Các trường còn lại
      }
    });
  } catch (err) {
    console.error("Lỗi khi truy vấn bài viết:", err);
    res.status(500).json({ message: "Lỗi truy vấn bài viết" });
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
      .input("TrangThai", sql.SmallInt, trangThai)
      .query(`
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
    await pool.request().input("ID", sql.Int, id)
      .query("DELETE FROM GIANGVIEN_LHP WHERE ID = @ID");
    res.status(200).json({ id, message: "Đã xóa" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi xóa phân công" });
  }
};

exports.addGiangVienLHP = async (req, res) => {
  const { maGV, maLHP, trangThai } = req.body;
  if (!maGV || !maLHP) {
    return res.status(400).json({ message: "Thiếu thông tin cần thiết: Mã giảng viên và Mã lớp học phần." });
  }
  try {
    const result = await pool
      .request()
      .input("MaGV", sql.Int, maGV)
      .input("MaLHP", sql.Int, maLHP)
      .input("TrangThai", sql.SmallInt, trangThai || 1)  // Default trangThai = 1
      .query(`
        INSERT INTO GIANGVIEN_LHP (MaGV, MaLHP, TrangThai)
        VALUES (@MaGV, @MaLHP, @TrangThai);
        SELECT TOP 1 * FROM GIANGVIEN_LHP ORDER BY ID DESC;
      `);

    if (result && result.recordset && result.recordset[0]) {
      const inserted = result.recordset[0];  // Get the inserted record

      // Ensure that the response is wrapped in the 'data' key
      res.status(201).json({
          // Wrap the result in the 'data' key
          id: inserted.ID,  // Ensure 'id' is included
          MaGV: inserted.MaGV,
          MaLHP: inserted.MaLHP,
          TrangThai: inserted.TrangThai,
        
      });
    } else {
      console.error("Lỗi: Không có dữ liệu trả về từ cơ sở dữ liệu.");
      res.status(400).json({ message: "Không có dữ liệu trả về từ cơ sở dữ liệu." });
    }
  } catch (err) {
    console.error("Lỗi thêm phân công giảng viên:", err);
    res.status(500).json({ message: "Lỗi thêm phân công giảng viên" });
  }
};
