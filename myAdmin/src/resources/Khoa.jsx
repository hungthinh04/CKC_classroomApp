// src/resources/Khoa.js
import { List, Datagrid, TextField, EditButton, Edit, SimpleForm, TextInput, Create, ReferenceInput, AutocompleteInput } from 'react-admin';

export const KhoaList = () => (
  <List>
    <Datagrid rowClick="edit">
     <TextField source="stt" label="STT" />
      <TextField source="MaKhoa" label="Mã Khoa" />
      <TextField source="TenKhoa" label="Tên Khoa" />
      <EditButton />
    </Datagrid>
  </List>
);

export const KhoaEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="maKhoa" label="Mã Khoa" readOnly />
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
