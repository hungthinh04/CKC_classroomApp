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
  NumberInput,
  FunctionField,
  ReferenceInput,
  AutocompleteInput,
  SaveButton,
  DateInput,
  maxValue
} from "react-admin";
import { required, regex, minValue } from 'react-admin';  // Chú ý: Thay `pattern` bằng `regex`

const maxDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Thêm một ngày
  return currentDate.toISOString().split('T')[0]; 
}

const GiangVienFilter = [
  <TextInput label="Tìm theo tên" source="TenGV" alwaysOn />,
];

export const GiangVienList = () => (
  <List filters={GiangVienFilter} perPage={10}>
    <Datagrid rowClick="edit">
      <FunctionField label="STT" render={(record, index) => index + 1} />
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
      <TextInput
        source="hoGV"
        label="Họ"
        validate={[required(), regex(/^[A-Za-z\s]+$/, 'Họ không được chứa số')]}
      />
      <TextInput
        source="tenGV"
        label="Tên"
        validate={[required(), regex(/^[A-Za-z\s]+$/, 'Tên không được chứa số')]}
      />
      <DateInput
        source="ngaySinh"
        label="Ngày sinh"
        validate={[required(), minValue('1925-01-01', 'Ngày sinh phải lớn hơn 1925'),  maxValue(maxDate(), 'Ngày sinh không hợp lệ'),]}
      />
      <SelectInput
        source="gioiTinh"
        label="Giới tính"
        choices={[
          { id: 0, name: "Nam" },
          { id: 1, name: "Nữ" },
        ]}
      />
      <TextInput
        source="sdt"
        label="Số điện thoại"
        validate={[
          required(),
          regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
        ]}
      />
      <TextInput
        source="cccd"
        label="CCCD"
        validate={[
          required(),
          regex(/^\d{12}$/, 'CCCD phải có 12 chữ số'),
        ]}
      />
      <TextInput source="diaChi" label="Địa chỉ" />
      <NumberInput source="maTK" label="Mã Tài Khoản" />
      <NumberInput source="maBM" label="Mã Bộ môn" />
      <SelectInput
        source="trangThai"
        label="Trạng thái"
        choices={[
          { id: 0, name: "Đang học" },
          { id: 1, name: "Bị đình chỉ" },
          { id: 2, name: "Đã tốt nghiệp" },
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
      <TextInput
        source="hoGV"
        label="Họ"
        validate={[required(), regex(/^[A-Za-z\s]+$/, 'Họ không được chứa số')]}
      />
      <TextInput
        source="tenGV"
        label="Tên"
        validate={[required(), regex(/^[A-Za-z\s]+$/, 'Tên không được chứa số')]}
      />
      <DateInput
        source="ngaySinh"
        label="Ngày sinh"
        validate={[required(), minValue('1925-01-01', 'Ngày sinh không hợp lệ')]}
      />
      <SelectInput
        source="gioiTinh"
        label="Giới tính"
        choices={[
          { id: 0, name: "Nam" },
          { id: 1, name: "Nữ" },
        ]}
      />
      <TextInput
        source="sdt"
        label="Số điện thoại"
        validate={[
          required(),
          regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
        ]}
      />
      <TextInput
        source="cccd"
        label="CCCD"
        validate={[
          required(),
          regex(/^\d{12}$/, 'CCCD phải có 12 chữ số'),
        ]}
      />
      <TextInput source="diaChi" label="Địa chỉ" />
      <NumberInput source="maTK" label="Mã Tài Khoản" />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn">
        <AutocompleteInput optionText="TenBM" label="Tên Bộ Môn" />
      </ReferenceInput>

      <SelectInput
        source="trangThai"
        label="Trạng thái"
        choices={[
          { id: 0, name: "Đang học" },
          { id: 1, name: "Bị đình chỉ" },
          { id: 2, name: "Đã tốt nghiệp" },
        ]}
      />
      <TextInput source="maGiangVien" label="Mã Giảng Viên" />
      <SaveButton />
    </SimpleForm>
  </Create>
);