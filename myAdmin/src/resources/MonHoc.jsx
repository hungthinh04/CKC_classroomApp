// src/resources/MonHoc.jsx

import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  Create,
} from "react-admin";

export const MonHocList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="MaMonHoc" label="Mã môn học" />
      <TextField source="TenMH" label="Tên môn học" />
      <TextField source="TinChi" label="Tín chỉ" />
      <TextField source="MaBM" label="Mã bộ môn" />
      <EditButton />
    </Datagrid>
  </List>
);

export const MonHocEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="maMonHoc" label="Mã môn học" />
      <TextInput source="tenMH" label="Tên môn học" />
      <NumberInput source="tinChi" label="Tín chỉ" />
      <NumberInput source="maBM" label="Mã bộ môn" />
    </SimpleForm>
  </Edit>
);

export const MonHocCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maMonHoc" label="Mã môn học" />
      <TextInput source="tenMH" label="Tên môn học" />
      <NumberInput source="tinChi" label="Tín chỉ" />
      <NumberInput source="maBM" label="Mã bộ môn" />
    </SimpleForm>
  </Create>
);
