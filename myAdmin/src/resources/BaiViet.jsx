import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  EditButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  ReferenceInput,
  AutocompleteInput,
  SelectInput,
  DateInput,
  FunctionField,
} from "react-admin";

// 1. List bài viết
export const BaiVietList = () => (
   <List>
    <Datagrid rowClick="edit">
      <TextField source="id" label="ID" />
      <TextField source="TieuDe" label="Tiêu đề" />
      <TextField source="NoiDung" label="Nội dung" />
      {/* Sửa ở đây: dùng FunctionField */}
      <FunctionField
        source="LoaiBV"
        label="Loại bài"
        render={record =>
          record.LoaiBV === 0 ? "Thông báo"
            : record.LoaiBV === 1 ? "Bài tập"
            : ""}
      />
      {/* <ReferenceField source="MaTK" reference="users" label="Người đăng">
        <TextField source="HoTen" />
      </ReferenceField> */}
      <ReferenceField source="MaLHP" reference="lophocphan" label="Lớp học phần" link={false}>
        <TextField source="TenLHP" />
      </ReferenceField>
      <DateField source="NgayTao" label="Ngày tạo" showTime />
      {/* <DateField source="HanNop" label="Hạn nộp" showTime /> */}
      {/* Sửa ở đây: dùng FunctionField */}
      <FunctionField
        source="TrangThai"
        label="Trạng thái"
        render={record =>
          record.TrangThai === 1 ? "Hiện"
            : record.TrangThai === 0 ? "Ẩn"
            : ""}
      />
      <TextField source="MaBaiViet" label="Mã bài viết" />
      <EditButton />
    </Datagrid>
  </List>
);

// // 2. Form tạo mới bài viết
// export const BaiVietCreate = () => (
//   <Create>
//     <SimpleForm>
//       <TextInput source="TieuDe" label="Tiêu đề" />
//       <TextInput source="NoiDung" label="Nội dung" multiline />
//       <SelectInput source="LoaiBV" label="Loại bài" choices={[
//         { id: 1, name: "Thông báo" },
//         { id: 2, name: "Bài tập" }
//       ]} defaultValue={0} />
//       <ReferenceInput source="MaTK" reference="users" label="Người đăng">
//         <AutocompleteInput optionText="hoTen" label="Tên người đăng" />
//       </ReferenceInput>
//       <ReferenceInput source="MaLHP" reference="lophocphan" label="Lớp học phần">
//         <AutocompleteInput optionText="TenLHP" label="Tên lớp học phần" />
//       </ReferenceInput>
//       <DateInput source="NgayTao" label="Ngày tạo" />
//       <DateInput source="HanNop" label="Hạn nộp" />
//       <SelectInput source="TrangThai" label="Trạng thái" choices={[
//         { id: 1, name: "Hiện" },
//         { id: 0, name: "Ẩn" }
//       ]} defaultValue={1} />
//     </SimpleForm>
//   </Create>
// );

// 3. Form chỉnh sửa bài viết
export const BaiVietEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="tieuDe" label="Tiêu đề" />
      <TextInput source="noiDung" label="Nội dung" multiline />
      <SelectInput source="loaiBV" label="Loại bài" choices={[
        { id: 1, name: "Thông báo" },
        { id: 2, name: "Bài tập" }
      ]} />
      {/* <ReferenceInput source="MaTK" reference="users" label="Người đăng">
        <AutocompleteInput optionText="hoTen" label="Tên người đăng" />
      </ReferenceInput> */}
      <ReferenceInput source="maLHP" reference="lophocphan" label="Lớp học phần">
        <AutocompleteInput optionText="TenLHP" label="Tên lớp học phần"  />
      </ReferenceInput>
      <DateInput source="ngayTao" label="Ngày tạo" />
      {/* <DateInput source="HanNop" label="Hạn nộp" /> */}
      <SelectInput source="trangThai" label="Trạng thái" choices={[
        { id: 1, name: "Hiện" },
        { id: 0, name: "Ẩn" }
      ]} />
    </SimpleForm>
  </Edit>
);
