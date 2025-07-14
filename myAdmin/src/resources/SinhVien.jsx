import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  NumberInput,
  ReferenceInput,
  AutocompleteInput,
  TextField as ViewField,
  FunctionField,
  ReferenceField,
} from "react-admin";

export const SinhVienFilter = [
  <TextInput label="Tìm theo họ tên" source="HoTen" alwaysOn />,
];

export const SinhVienList = () => (
  <List filters={SinhVienFilter}>
    <Datagrid rowClick="edit">
      <FunctionField label="STT" render={(record, index) => index + 1} />
      <TextField source="MaSinhVien" label="Mã SV" />
      <TextField source="HoTen" label="Họ tên" />
      
      <TextField source="MaTK" label="Mã TK" />
      
      <ReferenceField source="MaLopHoc" reference="lophoc" label="Lớp học" link={false}>
        <TextField source="tenLop" />
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);


export const SinhVienEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="MaSinhVien" label="Mã sinh viên" readOnly />
      <TextInput source="HoTen" label="Họ tên" />
      <NumberInput source="MaTK" label="Mã tài khoản" readOnly />
      <ReferenceInput source="MaLopHoc" reference="lophoc" label="Lớp học">
        <AutocompleteInput optionText="tenLop" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const SinhVienCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maSinhVien" label="Mã sinh viên" readOnly />
      <NumberInput source="maTK" label="Mã tài khoản" readOnly />
      <ReferenceInput source="maLopHoc" reference="lophoc" label="Mã Lớp học">
        <AutocompleteInput optionText="tenLop" label="Tên Lớp Học"/>
      </ReferenceInput>
      <TextInput source="hoTen" label="Họ tên" />
    </SimpleForm>
  </Create>
);
