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
  ReferenceInput,
  AutocompleteInput,
} from "react-admin";


const BoMonFilter = [
  <TextInput label="Tìm tên bộ môn" source="TenBM" alwaysOn />,
];

export const BoMonList = () => (
  <List filters={BoMonFilter}>
    <Datagrid rowClick="edit">
      <TextField source="stt" label="STT" />
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
      <TextInput source="tenBM" label="Tên Bộ Môn" />
      <ReferenceInput source="maKhoa" reference="khoa" label="Khoa">
        <AutocompleteInput optionText="TenKhoa" />
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

export const BoMonCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="tenBM" label="Tên Bộ Môn" />
      <ReferenceInput source="maKhoa" reference="khoa" label="Khoa">
        <AutocompleteInput optionText="TenKhoa" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);