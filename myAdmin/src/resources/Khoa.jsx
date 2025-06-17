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

export const KhoaList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="MaKhoa" />
      <TextField source="TenKhoa" />
      <EditButton />
    </Datagrid>
  </List>
);

export const KhoaEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="maKhoa" />
      <TextInput source="tenKhoa" />
    </SimpleForm>
  </Edit>
);

export const KhoaCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maKhoa" />
      <TextInput source="tenKhoa" />
    </SimpleForm>
  </Create>
);
