// src/resources/LopHoc.js

import {


  List,
  TextField,
  Datagrid,
  TextInput,
  Edit,
  SimpleForm,
  Create,
  EditButton,
  ReferenceInput,
  AutocompleteInput,
  FunctionField,
  ReferenceField
} from "react-admin";

export const LopHocList = () => (
   <List>
    <Datagrid rowClick="edit">
      {/* <FunctionField label="STT" render={(record, index) => index + 1} /> */}
      <TextField source="maLop" label="Mã lớp" />
      <TextField source="tenLP" label="Tên lớp" />
      {/* Thay mã bộ môn thành tên bộ môn */}
      <ReferenceField source="maBM" reference="bomon" label="Bộ môn" link={false}>
        <TextField source="TenBM"/>
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);

export const LopHocCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maLop" label="Mã lớp" readOnly/>
      <TextInput source="tenLP" label="Tên lớp" />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn">
        <AutocompleteInput optionText="TenBM" label="Tên bộ môn"/>
      </ReferenceInput>
    </SimpleForm>
  </Create>
);

export const LopHocEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="maLop" label="Mã lớp" readOnly/>
      <TextInput source="tenLP" label="Tên lớp" />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn">
        <AutocompleteInput optionText="TenBM" label="Tên bộ môn"/>
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
