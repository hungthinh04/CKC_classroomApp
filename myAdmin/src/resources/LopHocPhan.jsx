// src/resources/LopHocPhan.js
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  Show,
  SimpleShowLayout,
  DateField,
  NumberField,
} from "react-admin";

export const LopHocPhanList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="TenLHP" label="Tên LHP" />
      <DateField source="NgayTao" label="Ngày Tạo" />
      <NumberField source="HocKy" label="Học Kỳ" />
      <NumberField source="ChinhSach" label="Chính Sách" />
      <NumberField source="NamHoc" label="Năm Học" />
      <NumberField source="MaGV" label="Mã GV" />
      <NumberField source="MaLH" label="Mã Lớp Học" />
      <NumberField source="MaMH" label="Mã Môn Học" />
      <NumberField source="LuuTru" label="Lưu Trữ" />
      <NumberField source="TrangThai" label="Trạng Thái" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const LopHocPhanEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="tenLHP" label="Tên LHP" />
      <DateInput source="ngayTao" label="Ngày Tạo" />
      <NumberInput source="hocKy" label="Học Kỳ" />
      <NumberInput source="chinhSach" label="Chính Sách" />
      <NumberInput source="namHoc" label="Năm Học" />
      <NumberInput source="maGV" label="Mã GV" />
      <NumberInput source="maLH" label="Mã Lớp Học" />
      <NumberInput source="maMH" label="Mã Môn Học" />
      <NumberInput source="luuTru" label="Lưu Trữ" />
      <NumberInput source="trangThai" label="Trạng Thái" />
    </SimpleForm>
  </Edit>
);

export const LopHocPhanCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="tenLHP" label="Tên LHP" />
      <DateInput source="ngayTao" label="Ngày Tạo" />
      <NumberInput source="hocKy" label="Học Kỳ" />
      <NumberInput source="chinhSach" label="Chính Sách" />
      <NumberInput source="namHoc" label="Năm Học" />
      <NumberInput source="maGV" label="Mã GV" />
      <NumberInput source="maLH" label="Mã Lớp Học" />
      <NumberInput source="maMH" label="Mã Môn Học" />
      <NumberInput source="luuTru" label="Lưu Trữ" />
      <NumberInput source="trangThai" label="Trạng Thái" />
    </SimpleForm>
  </Create>
);
