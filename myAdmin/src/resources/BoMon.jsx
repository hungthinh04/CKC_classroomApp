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
  FunctionField,
} from "react-admin";


const BoMonFilter = [
  <TextInput label="Tìm tên bộ môn" source="TenBM" alwaysOn />,
];

export const BoMonList = () => (
  <List filters={BoMonFilter}>
    <Datagrid rowClick="edit">
      <TextField source="stt" label="STT" />

      <TextField source="MaBoMon" label="Mã Bộ Môn" />
      <TextField source="TenBM" label="Tên Bộ Môn" />
      <TextField source="MaKhoa" label="Mã Khoa" />
      <EditButton />
    </Datagrid>
  </List>
);

export const BoMonEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="maBoMon" label="Mã Bộ Môn" />
      <TextInput source="tenBM" label="Tên Bộ Môn" />
      <NumberInput source="maKhoa" label="Mã Khoa" />
    </SimpleForm>
  </Edit>
);

export const BoMonCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maBoMon" label="Mã Bộ Môn" />
      <TextInput source="tenBM" label="Tên Bộ Môn" />
      <NumberInput source="maKhoa" label="Mã Khoa" />
    </SimpleForm>
  </Create>
);
