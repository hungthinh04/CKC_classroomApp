import { List, Datagrid, TextField, TextInput, Edit, SimpleForm, Create, EditButton } from "react-admin";

export const LopHocList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="MaLop" label="Mã lớp" />
      <TextField source="TenLP" label="Tên lớp" />
      <TextField source="MaBM" label="Mã bộ môn" />
      <EditButton />
    </Datagrid>
  </List>
);

export const LopHocCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="MaLop" label="Mã lớp" />
      <TextInput source="TenLP" label="Tên lớp" />
      <TextInput source="MaBM" label="Mã bộ môn" />
    </SimpleForm>
  </Create>
);

export const LopHocEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="maLop" label="Mã lớp" />
      <TextInput source="tenLP" label="Tên lớp" />
      <TextInput source="maBM" label="Mã bộ môn" />
    </SimpleForm>
  </Edit>
);
