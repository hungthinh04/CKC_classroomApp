import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  NumberInput
} from "react-admin";


export const SinhVienFilter = [
  <TextInput label="Tìm theo họ tên" source="hoTen" alwaysOn />,
];

export const SinhVienList = () => (
  <List filters={SinhVienFilter}>
    <Datagrid rowClick="edit">
      <TextField source="MaSinhVien" label="Mã SV" />
      <TextField source="HoTen" label="Họ tên" />
      <TextField source="MaTK" label="Mã TK" />
      <TextField source="MaLopHoc" label="Mã lớp học" />
      <EditButton />
    </Datagrid>
  </List>
);

export const SinhVienEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="MaSinhVien" label="Mã sinh viên" />
      <TextInput source="HoTen" label="Họ tên" />
      <NumberInput source="MaTK" label="Mã tài khoản" />
      <NumberInput source="MaLopHoc" label="Mã lớp học" />
    </SimpleForm>
  </Edit>
);

export const SinhVienCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maSinhVien" label="Mã sinh viên" />
      <NumberInput source="maTK" label="Mã tài khoản" />
      <NumberInput source="maLopHoc" label="Mã lớp học" />
      <TextInput source="hoTen" label="Họ tên" />
    </SimpleForm>
  </Create>
);