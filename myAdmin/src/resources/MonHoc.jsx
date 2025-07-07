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
  required, minValue, maxValue,
  ReferenceField
} from "react-admin";
import '../css/styles.css'; // Import custom styles
export const MonHocList = () => (
  <List>
    <Datagrid rowClick="edit" >
      {/* <TextField source="id" label="ID" /> */}
      <TextField source="TenMH" label="Tên môn học" />
      <TextField source="TinChi" label="Tín chỉ" />
      <ReferenceField source="MaBM" reference="bomon" label="Bộ môn" link={false}>
        <TextField source="TenBM"/>
      </ReferenceField>
      <EditButton />
    </Datagrid>
  </List>
);

export const MonHocEdit = () => (
  <Edit>
    <SimpleForm>
      {/* <TextInput source="id" disabled /> */}
      <TextInput source="tenMH" label="Tên môn học" />
      <NumberInput source="tinChi" label="Tín chỉ" 
        validate={[
          required('Tín chỉ là bắt buộc'),
          minValue(0, 'Tín chỉ phải lớn hơn hoặc bằng 0'),
          maxValue(12, 'Tín chỉ không thể lớn hơn 12')
        ]}
      />
      
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn" perPage={100}>
        <AutocompleteInput optionText="TenBM" label="Tên Bộ Môn"/>
      </ReferenceInput>
    </SimpleForm>
  </Edit>
);


export const MonHocCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="tenMH" label="Tên môn học" />
      <NumberInput 
        source="tinChi" 
        label="Tín chỉ" 
        validate={[
          required('Tín chỉ là bắt buộc'),
          minValue(0, 'Tín chỉ phải lớn hơn hoặc bằng 0'),
          maxValue(12, 'Tín chỉ không thể lớn hơn 12')
        ]}
      />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn" perPage={100}>
        <AutocompleteInput optionText="TenBM" />
      </ReferenceInput>
    </SimpleForm>
  </Create>
);
