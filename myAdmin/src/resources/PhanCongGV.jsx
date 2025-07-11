// src/resources/PhanCongGiangVien.js

import {
  List,
  Datagrid,
  ReferenceField,
  TextField,
  EditButton,
  Create,
  Edit,
  SimpleForm,
  ReferenceInput,
  AutocompleteInput,
  SelectInput,
  FunctionField,
} from "react-admin";

export const PhanCongGiangVienList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField source="MaGV" reference="giangvien" label="Giảng viên" link={false}>
        <FunctionField
          label="Họ và Tên"
          render={(record) =>
            `${record.HoGV || record.hoGV || ""} ${
              record.TenGV || record.tenGV || ""
            }`
          }
        />
      </ReferenceField>
      <ReferenceField link={false}
        source="MaLHP"
        reference="lophocphan"
        label="Lớp học phần"
      >
        <TextField source="TenLHP" />
      </ReferenceField>
      <TextField source="TrangThai" label="Trạng thái" />
      <EditButton />
    </Datagrid>
  </List>
);

export const PhanCongGiangVienCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="maGV" reference="giangvien" label="Giảng viên">
        <AutocompleteInput label="Họ và Tên"
          optionText={(record) => `${record.HoGV} ${record.TenGV}`}
        />
      </ReferenceInput>
      <ReferenceInput
        source="maLHP"
        reference="lophocphan"
        label="Lớp học phần"
      >
        <AutocompleteInput optionText="TenLHP" label="Tên lớp học phần" />
      </ReferenceInput>
      <SelectInput
        source="trangThai"
        label="Trạng thái"
        choices={[
          { id: 1, name: "Hoạt động" },
          { id: 0, name: "Không hoạt động" },
        ]}
        defaultValue={1}
      />
    </SimpleForm>
  </Create>
);

export const PhanCongGiangVienEdit = () => (
  <Edit>
    <SimpleForm>
       <ReferenceInput source="MaGV" reference="giangvien" label="Giảng viên">
        <AutocompleteInput label="Họ và Tên"
          optionText={(record) => `${record.HoGV} ${record.TenGV}`}
        />
      </ReferenceInput>
      <ReferenceInput
        source="MaLHP"
        reference="lophocphan"
        label="Lớp học phần"
      >
        <AutocompleteInput optionText="TenLHP" label="Tên lớp học phần" />
      </ReferenceInput>
      <SelectInput
        source="TrangThai"
        label="Trạng thái"
        defaultValue={1}
        choices={[
          { id: 1, name: "Hoạt động" },
          { id: 0, name: "Không hoạt động" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
