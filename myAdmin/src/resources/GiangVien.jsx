import {
  List,
  Datagrid,
  TextField,
  EditButton,
  TextInput,
  DateInput,
  NumberInput,
  SelectInput,
  Edit,
  SimpleForm,
  Create,
  SaveButton,
} from "react-admin";

const GiangVienFilter = [
  <TextInput label="Tìm theo tên" source="TenGV" alwaysOn />,
];

export const GiangVienList = () => (
  <List filters={GiangVienFilter} perPage={10}>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="MSGV" label="MSGV" />
      <TextField source="HoGV" label="Họ" />
      <TextField source="TenGV" label="Tên" />
      <TextField source="NgaySinh" label="Ngày sinh" />
      <TextField source="GioiTinh" label="Giới tính" />
      <TextField source="SDT" label="SĐT" />
      <TextField source="CCCD" label="CCCD" />
      <TextField source="DiaChi" label="Địa chỉ" />
      <TextField source="MaTK" label="Mã TK" />
      <TextField source="MaBM" label="Mã Bộ môn" />
      <TextField source="TrangThai" label="Trạng thái" />
      <TextField source="MaGiangVien" label="Mã Giảng Viên" />
      <EditButton />
    </Datagrid>
  </List>
);

export const GiangVienEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="msgv" label="MSGV" />
      <TextInput source="hoGV" label="Họ" />
      <TextInput source="tenGV" label="Tên" />
      <DateInput source="ngaySinh" label="Ngày sinh" />
      <SelectInput
        source="gioiTinh"
        label="Giới tính"
        choices={[
          { id: 0, name: "Nam" },
          { id: 1, name: "Nữ" },
        ]}
      />
      <TextInput source="sdt" label="Số điện thoại" />
      <TextInput source="cccd" label="CCCD" />
      <TextInput source="diaChi" label="Địa chỉ" />
      <NumberInput source="maTK" label="Mã Tài Khoản" />
      <NumberInput source="maBM" label="Mã Bộ môn" />
      <SelectInput
        source="trangThai"
        label="Trạng thái"
        choices={[
          { id: 0, name: "Ngừng hoạt động" },
          { id: 1, name: "Hoạt động" },
        ]}
      />
      <TextInput source="maGiangVien" label="Mã Giảng Viên" />
    </SimpleForm>
  </Edit>
);

export const GiangVienCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="msgv" label="MSGV" />
      <TextInput source="hoGV" label="Họ" />
      <TextInput source="tenGV" label="Tên" />
      <DateInput source="ngaySinh" label="Ngày sinh" />
      <SelectInput
        source="gioiTinh"
        label="Giới tính"
        choices={[
          { id: 0, name: "Nam" },
          { id: 1, name: "Nữ" },
        ]}
      />
      <TextInput source="sdt" label="Số điện thoại" />
      <TextInput source="cccd" label="CCCD" />
      <TextInput source="diaChi" label="Địa chỉ" />
      <NumberInput source="maTK" label="Mã Tài Khoản" />
      <NumberInput source="maBM" label="Mã Bộ môn" />
      <SelectInput
        source="trangThai"
        label="Trạng thái"
        choices={[
          { id: 0, name: "Ngừng hoạt động" },
          { id: 1, name: "Hoạt động" },
        ]}
      />
      <TextInput source="maGiangVien" label="Mã Giảng Viên" />
      <SaveButton />
    </SimpleForm>
  </Create>
);
