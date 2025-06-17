import {
  List, Datagrid, TextField, EditButton,
  Edit, SimpleForm, TextInput, Create, NumberInput
} from 'react-admin';

export const BoMonList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <TextField source="MaBoMon" />
      <TextField source="TenBM" />
      <TextField source="MaKhoa" />
      <EditButton />
    </Datagrid>
  </List>
);

export const BoMonEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="maBoMon" />
      <TextInput source="tenBM" />
      <NumberInput source="maKhoa" />
    </SimpleForm>
  </Edit>
);

export const BoMonCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="maBoMon" />
      <TextInput source="tenBM" />
      <NumberInput source="maKhoa" />
    </SimpleForm>
  </Create>
);
