import {
  List,
  Datagrid,
  TextField,
  EditButton,
  DeleteButton,
  Edit,
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  DateInput,
  Show,
  SimpleShowLayout,
  DateField,
  NumberField,
  required,
  minValue,
  ReferenceInput,
  AutocompleteInput,
  ReferenceField,
  FunctionField,
  SelectInput,
} from "react-admin";

// Hàm tự động tạo mã giảng viên, mã lớp học phần, mã môn học (ví dụ: tự động tạo số tăng dần)
const generateAutoCode = (prefix, currentMaxId) => {
  return `${prefix}${currentMaxId + 1}`;
};

// Hàm tự động lấy ngày hiện tại
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Định dạng ngày dạng YYYY-MM-DD
};

export const LopHocPhanList = () => (
  <List>
    <Datagrid rowClick="edit">
      <FunctionField label="STT" render={(record, index) => index + 1} />
      <TextField source="TenLHP" label="Tên LHP" />
      <DateField source="NgayTao" label="Ngày Tạo" />
      <NumberField source="HocKy" label="Học Kỳ" />
      <NumberField source="ChinhSach" label="Chính Sách" />
      <NumberField source="NamHoc" label="Năm Học" />
      <ReferenceField
        source="MaGV"
        reference="giangvien"
        label="Tên giảng viên"
        link={false}
      >
        <TextField source="TenGV" label="Tên Giảng Viên" />
      </ReferenceField>
      <ReferenceField
        source="MaLH"
        reference="lophoc"
        label="Lớp Học"
        link={false}
      >
        <TextField source="tenLop" />
      </ReferenceField>
      <ReferenceField
        source="MaMH"
        reference="monhoc"
        label="Môn Học"
        link={false}
      >
        <TextField source="TenMH" />
      </ReferenceField>
      <NumberField source="LuuTru" label="Lưu Trữ" />
      <NumberField source="TrangThai" label="Trạng Thái" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

export const LopHocPhanEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput
        source="tenLHP"
        label="Tên LHP"
        validate={required("Tên LHP là bắt buộc")} // Đảm bảo rằng validate được truyền đúng
      />
      <DateInput
        source="ngayTao"
        label="Ngày Tạo"
        defaultValue={getCurrentDate()} // Tự động điền ngày hiện tại
        validate={[
          required("Ngày tạo là bắt buộc"),
          minValue("1925-01-01", "Ngày tạo phải lớn hơn 1925"),
        ]}
      />
      <NumberInput
        source="hocKy"
        label="Học Kỳ"
        validate={[
          required("Học kỳ là bắt buộc"),
          minValue(1, "Học kỳ phải lớn hơn 0"),
        ]}
      />
      <NumberInput
        source="chinhSach"
        label="Chính Sách"
        validate={required("Chính sách là bắt buộc")}
      />
      <NumberInput
        source="namHoc"
        label="Năm Học"
        validate={[
          required("Năm học là bắt buộc"),
          minValue(1900, "Năm học không hợp lệ"),
        ]}
      />
      {/* ReferenceInput để lấy Mã Giảng Viên từ bảng GIANGVIEN */}
      <ReferenceInput source="maGV" reference="giangvien" label="Giảng viên">
        <AutocompleteInput optionText="TenGV" label="Tên Giảng Viên" />
      </ReferenceInput>

      {/* ReferenceInput để lấy Mã Lớp Học từ bảng LOPHOC */}
      <ReferenceInput source="maLH" reference="lophoc" label="Lớp Học">
        <AutocompleteInput optionText="tenLop" label="Tên Lớp Học" />
      </ReferenceInput>

      {/* ReferenceInput để lấy Mã Môn Học từ bảng MONHOC */}
      <ReferenceInput source="maMH" reference="monhoc" label="Môn Học">
        <AutocompleteInput optionText="TenMH" label="Tên Môn Học" />
      </ReferenceInput>

      <NumberInput
        source="luuTru"
        label="Lưu Trữ"
        validate={required("Lưu trữ là bắt buộc")}
      />
      <NumberInput
        source="trangThai"
        label="Trạng Thái"
        defaultValue={1} // Tự động gán giá trị 'Hoạt động' (1)
      />
    </SimpleForm>
  </Edit>
);

export const LopHocPhanCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="tenLHP" label="Tên LHP" validate={required()} />
      <DateInput
        source="ngayTao"
        label="Ngày Tạo"
        defaultValue={getCurrentDate()} // Tự động điền ngày hiện tại
        validate={[
          required(),
          minValue("1925-01-01", "Ngày tạo phải lớn hơn 1925"),
        ]}
      />
      <NumberInput
        source="hocKy"
        label="Học Kỳ"
        validate={[required(), minValue(1, "Học kỳ phải lớn hơn 0")]}
      />
      <NumberInput
        source="chinhSach"
        label="Chính Sách"
        validate={required()}
      />
      <NumberInput
        source="namHoc"
        label="Năm Học"
        validate={[required(), minValue(1900, "Năm học không hợp lệ")]}
      />

      {/* ReferenceInput để lấy Mã Giảng Viên từ bảng GIANGVIEN */}
      <ReferenceInput source="maGV" reference="giangvien" label="Giảng viên">
        <AutocompleteInput optionText="TenGV" label="Tên Giảng Viên" />
      </ReferenceInput>

      {/* ReferenceInput để lấy Mã Lớp Học từ bảng LOPHOC */}
      <ReferenceInput source="maLH" reference="lophoc" label="Lớp Học">
        <AutocompleteInput optionText="tenLop" label="Tên Lớp Học" />
      </ReferenceInput>

      {/* ReferenceInput để lấy Mã Môn Học từ bảng MONHOC */}
      <ReferenceInput source="maMH" reference="monhoc" label="Môn Học">
        <AutocompleteInput optionText="TenMH" label="Tên Môn Học" />
      </ReferenceInput>

      <SelectInput
        source="luuTru"
        label="Lưu Trữ"
        choices={[
          { id: 0, name: "0" },
          { id: 1, name: "1" },
        ]}
        validate={required()}
      />
      <NumberInput
        source="trangThai"
        label="Trạng Thái"
        defaultValue={1} // Tự động gán giá trị 'Hoạt động' (1)
      />
    </SimpleForm>
  </Create>
);
