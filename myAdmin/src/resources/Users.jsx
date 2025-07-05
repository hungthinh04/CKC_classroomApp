// src/resources/Users.js
import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
} from "react-admin";

export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="MaNguoiDung" label="Mã Người Dùng" />
      <TextField source="Email" label="Email" />
      <TextField source="HoTen" label="Họ Tên" />
      <TextField source="MatKhau" label="Mật Khẩu" />
      <TextField source="Quyen" label="Quyền" />
      <TextField source="TrangThai" label="Trạng Thái" />
      <EditButton />
    </Datagrid>
  </List>
);


export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="maNguoiDung" label="Mã Người Dùng" readOnly  />
      <TextInput source="email" label="Email" />
      <TextInput source="matKhau" label="Mật Khẩu" />
      <TextInput source="HoTen" label="Họ Tên" />
      <TextInput source="quyen" label="Quyền" />
      <TextInput source="trangThai" label="Trạng Thái" />
    </SimpleForm>
  </Edit>
);

// export const UserCreate = () => (
//   <Create>
//     <SimpleForm>
//       <TextInput source="Email" label="Email" />
//       <TextInput source="MatKhau" label="Mật Khẩu" />
//       <TextInput source="Quyen" label="Quyền" />
//       <TextInput source="TrangThai" label="Trạng Thái" />
//     </SimpleForm>
//   </Create>
// );
