// src/resources/Khoa.js
import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';

export const KhoaList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="MaKhoa" label="Mã Khoa" />
      <TextField source="TenKhoa" label="Tên Khoa" />
      <EditButton />
    </Datagrid>
  </List>
);

export const KhoaEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="maKhoa" label="Mã Khoa" />
      <TextInput source="tenKhoa" label="Tên Khoa" />
    </SimpleForm>
  </Edit>
);

export const KhoaCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maKhoa" label="Mã Khoa" />
      <TextInput source="tenKhoa" label="Tên Khoa" />
    </SimpleForm>
  </Create>
);
