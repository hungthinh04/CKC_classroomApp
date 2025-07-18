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
      {/* Có thể ẩn password, chỉ dùng để test */}
      <TextField source="matKhau" label="Mật Khẩu" />
      <FunctionField
        label="Quyền"
        render={record =>
          record.quyen === 0 ? "Sinh viên" :
          record.quyen === 1 ? "Giảng viên" :
          "Admin"
        }
      />
      <FunctionField
        label="Trạng Thái"
        render={record =>
          record.trangThai === 1 ? "Đang Học" :
          record.trangThai === 2 ? "Đã Tốt Nghiệp" :
          "Bị Đình Chỉ"
        }
      />
      <EditButton />
    </Datagrid>
  </List>
);

export const UserEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="maNguoiDung" label="Mã Người Dùng" />
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
          { id: 1, name: "Đang Hoạt động" },
          { id: 2, name: "Đã Tốt Nghiệp" },
          { id: 0, name: "Bị Đình Chỉ" },
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
// );  tương tự cho bảng ng dùng liist