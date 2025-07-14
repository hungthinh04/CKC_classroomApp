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
  ReferenceField,
  DateInput,
  required,
  maxValue,
  minValue
} from "react-admin";

const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Định dạng ngày dạng YYYY-MM-DD
};
 

export const LopHocList = () => (
   <List>
    <Datagrid rowClick="edit">
      {/* <FunctionField label="STT" render={(record, index) => index + 1} /> */}
      <TextField source="maLop" label="Mã lớp" />
      <TextField source="tenLop" label="Tên lớp" />
      <TextField source="ngayTao" label="Ngày tạo" />
      
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
        <TextInput source="tenLop" label="Tên lớp" />
      <DateInput source="ngayTao" label="Ngày tạo" defaultValue={getCurrentDate()} 
         validate={[required(), minValue('1925-01-01', 'Ngày tạo không hợp lệ'),
          maxValue('2030-01-01', 'Ngày tạo không hợp lệ')]}
      />
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
      <TextInput source="tenLop" label="Tên lớp" />
      <TextInput source="ngayTao" label="Ngày tạo" />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn">
        <AutocompleteInput optionText="TenBM" label="Tên bộ môn"/>
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);
