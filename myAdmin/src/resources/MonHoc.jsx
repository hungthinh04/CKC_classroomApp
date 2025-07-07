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
  AutocompleteInput,
  ReferenceInput,
} from "react-admin";

export const MonHocList = () => (
  <List>
    <Datagrid rowClick="edit" >
      {/* <TextField source="id" label="ID" /> */}
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
      {/* <TextInput source="id" disabled /> */}
      <TextInput source="tenMH" label="Tên môn học" />
      <NumberInput source="tinChi" label="Tín chỉ" />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn" perPage={100}>
        <AutocompleteInput optionText="TenBM" label="Tên Bộ Môn"/>
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);

// Form tạo môn học mới
export const MonHocCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="tenMH" label="Tên môn học" />
      <NumberInput source="tinChi" label="Tín chỉ" />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn" perPage={100}>
        <AutocompleteInput optionText="TenBM" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);