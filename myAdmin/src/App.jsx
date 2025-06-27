// src/App.js
import React from "react";
import { Admin, Resource } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import authProvider from "./authProvider"; // Import authProvider
import { KhoaList, KhoaCreate, KhoaEdit } from "./resources/Khoa";
import { BoMonList, BoMonCreate, BoMonEdit } from "./resources/BoMon";
import { MonHocList, MonHocCreate, MonHocEdit } from "./resources/MonHoc";
import { GiangVienList, GiangVienCreate, GiangVienEdit } from "./resources/GiangVien";
import { SinhVienCreate, SinhVienEdit, SinhVienList } from "./resources/SinhVien";
import { UserEdit, UserList } from "./resources/Users";
import { LopHocCreate, LopHocEdit, LopHocList } from "./resources/LopHoc";
import { LopHocPhanCreate, LopHocPhanEdit, LopHocPhanList } from "./resources/LopHocPhan";

const dataProvider = simpleRestProvider("http://localhost:3000/admin");

function App() {
  return (
    <Admin dataProvider={dataProvider} authProvider={authProvider}>
      <Resource name="khoa" options={{ label: "Khoa" }} list={KhoaList} create={KhoaCreate} edit={KhoaEdit} />
      <Resource name="bomon" options={{ label: "Bộ Môn" }} list={BoMonList} create={BoMonCreate} edit={BoMonEdit} />
      <Resource name="monhoc" options={{ label: "Môn Học" }} list={MonHocList} create={MonHocCreate} edit={MonHocEdit} />
      <Resource name="giangvien" options={{ label: "Giảng Viên" }} list={GiangVienList} create={GiangVienCreate} edit={GiangVienEdit} />
      <Resource name="sinhvien" options={{ label: "Sinh Viên" }} list={SinhVienList} create={SinhVienCreate} edit={SinhVienEdit} />
      <Resource name="users" options={{ label: "Người Dùng" }} list={UserList}  edit={UserEdit} />
      <Resource name="lophoc" options={{ label: "Lớp Học" }} list={LopHocList} create={LopHocCreate} edit={LopHocEdit} />
      <Resource name="lophocphan" options={{ label: "Lớp Học Phần" }} list={LopHocPhanList} create={LopHocPhanCreate} edit={LopHocPhanEdit} />
    </Admin>
  );
}

export default App;
