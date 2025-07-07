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
  SelectInput,
  FunctionField,
} from "react-admin";

// List Users
export const UserList = () => (
  <List>
    <Datagrid rowClick="edit">
      <FunctionField label="STT" render={(record, index) => index + 1} />
      <TextField source="maNguoiDung" label="Mã Người Dùng" />
      <TextField source="email" label="Email" />
      <TextField source="hoTen" label="Họ Tên" />
      <TextField source="matKhau" label="Mật Khẩu" />
      <TextField source="quyen" label="Quyền" />
      <TextField source="trangThai" label="Trạng Thái" />
      <EditButton />
    </Datagrid>
  </List>
);

// Edit User
export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="maNguoiDung" label="Mã Người Dùng"  />
      <TextInput source="email" label="Email" />
      <TextInput source="matKhau" label="Mật Khẩu" />
      <TextInput source="hoTen" label="Họ Tên" />
      <SelectInput
        source="quyen"
        label="Quyền"
        choices={[
          { id: 0, name: "Sinh viên" },
          { id: 1, name: "Giảng viên" },
          { id: 2, name: "Admin" },
        ]}
      />
      <SelectInput
        source="trangThai"
        label="Trạng Thái"
        choices={[
          { id: 1, name: "Đang Học" },
          { id: 0, name: "Bị Đình Chỉ" },
          { id: 2, name: "Đã Tốt Nghiệp" },
        ]}
      />
    </SimpleForm>
  </Edit>
);

// (Nếu cần create thì cũng dùng camelCase tương tự)


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
