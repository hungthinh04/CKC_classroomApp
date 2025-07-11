// src/resources/PhanCongSinhVien.js
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

export const PhanCongSinhVienList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="id" />
      <ReferenceField
        source="MaSV"
        reference="sinhvien"
        label="Sinh viên"
        link={false}
      >
        <FunctionField
          label="Họ và Tên"
          render={(record) => `${record.HoTen || ""}`}
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

export const PhanCongSinhVienCreate = () => (
  <Create>
    <SimpleForm>
      <ReferenceInput source="maSV" reference="sinhvien" label="Sinh viên">
        <AutocompleteInput optionText="HoTen" label="Họ và Tên" />
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

export const PhanCongSinhVienEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="maSV" reference="sinhvien" label="Sinh viên">
        <AutocompleteInput label="Họ và Tên"
          optionText={(record) => `${record.HoTen || ""}`}
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
        defaultValue={1}
        choices={[
          { id: 1, name: "Hoạt động" },
          { id: 0, name: "Không hoạt động" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
