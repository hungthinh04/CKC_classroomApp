// adminRoutes.js

const express = require("express");
const router = express.Router();

const {
  getAllKhoa,
  getAllMonHoc,
  getMonHocById,
  getAllGiangVien,
  addGiangVien,
  updateGiangVien,
  deleteGiangVien,
  getGiangVienById,
  updateSinhVien,
  getAllSinhVien,
  getSinhVienById,
  addSinhVien,
  deleteSinhVien,
  getUserById,
  getAllUsers,
  updateUsers,
  deleteUsers,
  getAllLopHoc,
  getLopHocById,
  addLopHoc,
  updateLopHoc,
  deleteLopHoc,
  getAllLopHocPhan,
  getLopHocPhanById,
  updateLopHocPhan,
  deleteLopHocPhan,
  addLopHocPhan,
  getAllSinhVienLHP,
  getSinhVienLHPById,
  addSinhVienLHP,
  updateSinhVienLHP,
  deleteSinhVienLHP,
  getGiangVienLHPById,
  updateGiangVienLHP,
  deleteGiangVienLHP,
  addGiangVienLHP,
  getAllGiangVienLHP,
  addBaiViet,
  getAllBaiViet,
  getTotalBaiViet,
  updateBaiViet,
  getBaiVietById,
  deleteBaiViet,
  getDashboardSummary,
} = require("../controllers/adminController"); // Import getAllKhoa from adminController
const { getAllBoMon } = require("../controllers/adminController"); // Import getAllKhoa from adminController
const { getBoMonById } = require("../controllers/adminController"); // Import getBoMonById from adminController
const {
  addKhoa,
  updateKhoa,
  deleteKhoa,
  addBoMon,
  updateBoMon,
  deleteBoMon,
  addMonHoc,
  updateMonHoc,
  deleteMonHoc,
} = require("../controllers/adminController");
const { getKhoaById } = require("../controllers/adminController");

//khoa
router.get("/khoa/:id", getKhoaById);
router.get("/khoa", getAllKhoa); // trong adminRoutes
router.post("/khoa", addKhoa);
router.put("/khoa/:id", updateKhoa);
router.delete("/khoa/:id", deleteKhoa);

// Quản lý Bộ môn
router.get("/bomon", getAllBoMon); // Assuming this is to get all BoMon
router.get("/bomon/:id", getBoMonById); // Assuming this is to get BoMon by ID

router.post("/bomon", addBoMon);
router.put("/bomon/:id", updateBoMon);
router.delete("/bomon/:id", deleteBoMon);

// Quản lý Môn học
router.get("/monhoc", getAllMonHoc); // Assuming this is to get all MonHoc
router.get("/monhoc/:id", getMonHocById); // Assuming this is to get MonHoc by ID

router.post("/monhoc", addMonHoc);
router.put("/monhoc/:id", updateMonHoc);
router.delete("/monhoc/:id", deleteMonHoc);

// Giảng viên
router.get("/giangvien", getAllGiangVien); // Lấy tất cả giảng viên
router.get("/giangvien/:id", getGiangVienById); // Lấy giảng viên theo ID
router.post("/giangvien", addGiangVien); // Thêm giảng viên
router.put("/giangvien/:id", updateGiangVien); // Cập nhật giảng viên
router.delete("/giangvien/:id", deleteGiangVien); // Xóa giảng viên

//sinh viên
router.get("/sinhvien", getAllSinhVien); // Lấy tất cả sinh viên
router.get("/sinhvien/:id", getSinhVienById); // Lấy sinh viên theo ID
router.post("/sinhvien", addSinhVien); // Thêm sinh viên
router.put("/sinhvien/:id", updateSinhVien); // Cập nhật sinh viên
router.delete("/sinhvien/:id", deleteSinhVien); // Xóa sinh viên


router.get("/users", getAllUsers); // Lấy tất cả người dùng
router.get("/users/:id", getUserById); // Lấy người dùng theo ID
router.put("/users/:id", updateUsers); // Cập nhật người dùng
router.delete("/users/:id", deleteUsers); // Xóa người dùng


router.get("/lophoc", getAllLopHoc);
router.get("/lophoc/:id", getLopHocById);
router.post("/lophoc", addLopHoc);
router.put("/lophoc/:id", updateLopHoc);
router.delete("/lophoc/:id", deleteLopHoc);

router.get("/lophocphan", getAllLopHocPhan);
router.get("/lophocphan/:id", getLopHocPhanById);
router.post("/lophocphan", addLopHocPhan);
router.put("/lophocphan/:id", updateLopHocPhan);
router.delete("/lophocphan/:id", deleteLopHocPhan);


router.get('/giangvien_lhp', getAllGiangVienLHP);
router.get('/giangvien_lhp/:id', getGiangVienLHPById);
router.post('/giangvien_lhp', addGiangVienLHP);
router.put('/giangvien_lhp/:id', updateGiangVienLHP);
router.delete('/giangvien_lhp/:id', deleteGiangVienLHP);

router.get('/sinhvien_lhp', getAllSinhVienLHP);
router.get('/sinhvien_lhp/:id', getSinhVienLHPById);
router.post('/sinhvien_lhp', addSinhVienLHP);
router.put('/sinhvien_lhp/:id', updateSinhVienLHP);
router.delete('/sinhvien_lhp/:id', deleteSinhVienLHP);

router.post("/baiviet", addBaiViet);
router.get("/baiviet", getAllBaiViet);
router.get("/baiviet/:id", getBaiVietById);
router.put("/baiviet/:id", updateBaiViet);
router.delete("/baiviet/:id", deleteBaiViet);



router.get("/thongke", getDashboardSummary);
// router.get("/baiviet/total", getTotalBaiViet);

// router.post("/tailieu", addTaiLieu);
// router.get("/tailieu", getAllTaiLieu);
// router.get("/tailieu/total", getTotalTaiLieu);


module.exports = router;
