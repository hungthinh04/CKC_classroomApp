// import {
//   List,
//   Datagrid,
//   TextField,
//   EditButton,
//   Edit,
//   SimpleForm,
//   TextInput,
//   Create,
//   SelectInput,
//   NumberInput,
//   FunctionField,
//   ReferenceInput,
//   AutocompleteInput,
//   SaveButton,
//   DateInput,
//   maxValue
// } from "react-admin";
// import { required, regex, minValue } from 'react-admin';  // Chú ý: Thay `pattern` bằng `regex`

// const maxDate = () => {
//   const currentDate = new Date();
//   currentDate.setDate(currentDate.getDate() + 1); // Thêm một ngày
//   return currentDate.toISOString().split('T')[0];
// }

// const GiangVienFilter = [
//   <TextInput label="Tìm theo tên" source="TenGV" alwaysOn />,
// ];

// export const GiangVienList = () => (
//   <List filters={GiangVienFilter} perPage={10}>
//     <Datagrid rowClick="edit">
//       <FunctionField label="STT" render={(record, index) => index + 1} />
//       <TextField source="id" label="ID" />
//       <TextField source="MSGV" label="MSGV" />
//       <TextField source="HoGV" label="Họ" />
//       <TextField source="TenGV" label="Tên" />
//       <TextField source="NgaySinh" label="Ngày sinh" />
//       <TextField source="GioiTinh" label="Giới tính" />
//       <TextField source="SDT" label="SĐT" />
//       <TextField source="CCCD" label="CCCD" />
//       <TextField source="DiaChi" label="Địa chỉ" />
//       <TextField source="MaTK" label="Mã TK" />
//       <TextField source="MaBM" label="Mã Bộ môn" />
//       <TextField source="TrangThai" label="Trạng thái" />
//       <TextField source="MaGiangVien" label="Mã Giảng Viên" />
//       <EditButton />
//     </Datagrid>
//   </List>
// );

// export const GiangVienEdit = () => (
//   <Edit>
//     <SimpleForm>
//       <TextInput source="id" disabled />
//       <TextInput source="msgv" label="MSGV" />
//       <TextInput
//         source="hoGV"
//         label="Họ"
//         validate={[required(), regex(/^[A-Za-z\s]+$/, 'Họ không được chứa số')]}
//       />
//       <TextInput
//         source="tenGV"
//         label="Tên"
//         validate={[required(), regex(/^[A-Za-z\s]+$/, 'Tên không được chứa số')]}
//       />
//       <DateInput
//         source="ngaySinh"
//         label="Ngày sinh"
//         validate={[required(), minValue('1925-01-01', 'Ngày sinh phải lớn hơn 1925'),  maxValue(maxDate(), 'Ngày sinh không hợp lệ'),]}
//       />
//       <SelectInput
//         source="gioiTinh"
//         label="Giới tính"
//         choices={[
//           { id: 0, name: "Nam" },
//           { id: 1, name: "Nữ" },
//         ]}
//       />
//       <TextInput
//         source="sdt"
//         label="Số điện thoại"
//         validate={[
//           required(),
//           regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
//         ]}
//       />
//       <TextInput
//         source="cccd"
//         label="CCCD"
//         validate={[
//           required(),
//           regex(/^\d{12}$/, 'CCCD phải có 12 chữ số'),
//         ]}
//       />
//       <TextInput source="diaChi" label="Địa chỉ" />
//       <NumberInput source="maTK" label="Mã Tài Khoản" />
//       <NumberInput source="maBM" label="Mã Bộ môn" />
//       <SelectInput
//         source="trangThai"
//         label="Trạng thái"
//         choices={[
//           { id: 0, name: "Đang học" },
//           { id: 1, name: "Bị đình chỉ" },
//           { id: 2, name: "Đã tốt nghiệp" },
//         ]}
//       />
//       <TextInput source="maGiangVien" label="Mã Giảng Viên" />
//     </SimpleForm>
//   </Edit>
// );

// export const GiangVienCreate = (props) => (
//   <Create {...props}>
//     <SimpleForm>
//       <TextInput source="msgv" label="MSGV" />
//       <TextInput
//         source="hoGV"
//         label="Họ"
//         validate={[required(), regex(/^[A-Za-z\s]+$/, 'Họ không được chứa số')]}
//       />
//       <TextInput
//         source="tenGV"
//         label="Tên"
//         validate={[required(), regex(/^[A-Za-z\s]+$/, 'Tên không được chứa số')]}
//       />
//       <DateInput
//         source="ngaySinh"
//         label="Ngày sinh"
//         validate={[required(), minValue('1925-01-01', 'Ngày sinh không hợp lệ')]}
//       />
//       <SelectInput
//         source="gioiTinh"
//         label="Giới tính"
//         choices={[
//           { id: 0, name: "Nam" },
//           { id: 1, name: "Nữ" },
//         ]}
//       />
//       <TextInput
//         source="sdt"
//         label="Số điện thoại"
//         validate={[
//           required(),
//           regex(/^\d{10}$/, 'Số điện thoại phải có 10 chữ số'),
//         ]}
//       />
//       <TextInput
//         source="cccd"
//         label="CCCD"
//         validate={[
//           required(),
//           regex(/^\d{12}$/, 'CCCD phải có 12 chữ số'),
//         ]}
//       />
//       <TextInput source="diaChi" label="Địa chỉ" />
//       <NumberInput source="maTK" label="Mã Tài Khoản" />
//       <ReferenceInput source="maBM" reference="bomon" label="Bộ môn">
//         <AutocompleteInput optionText="TenBM" label="Tên Bộ Môn" />
//       </ReferenceInput>

//       <SelectInput
//         source="trangThai"
//         label="Trạng thái"
//         choices={[
//           { id: 0, name: "Đang học" },
//           { id: 1, name: "Bị đình chỉ" },
//           { id: 2, name: "Đã tốt nghiệp" },
//         ]}
//       />
//       <TextInput source="maGiangVien" label="Mã Giảng Viên" />
//       <SaveButton />
//     </SimpleForm>
//   </Create>
// );

import {
  List,
  Datagrid,
  TextField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  Create,
  SelectInput,
  NumberInput,
  FunctionField,
  ReferenceInput,
  AutocompleteInput,
  SaveButton,
  DateInput,
  maxValue,
  ReferenceField,
} from "react-admin";
import { required, regex, minValue } from "react-admin"; // Chú ý: Thay `pattern` bằng `regex`
import { cccdVN, onlyVietnamese, phoneVN, requiredField } from "../common/validate";

const maxDate = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1); // Thêm một ngày
  return currentDate.toISOString().split("T")[0];
};

const normalizeSpaces = (value) => {
  if (!value) return value;
  return value.replace(/\s+/g, ' ').trim();
};

const GiangVienFilter = [
  <TextInput label="Tìm theo tên" source="TenGV" alwaysOn />,
];
const getCurrentDate = () => {
  const date = new Date();
  return date.toISOString().split("T")[0]; // Định dạng ngày dạng YYYY-MM-DD
};

export const GiangVienList = () => (
  <List filters={GiangVienFilter} perPage={10}>
    <Datagrid rowClick="edit">
      <FunctionField label="STT" render={(record, index) => index + 1} />
      {/* <TextField source="id" label="ID" />    */}
      <TextField source="MaGV" label="Mã Giảng Viên" />
      <TextField source="HoGV" label="Họ" parse={normalizeSpaces}/>
      <TextField source="TenGV" label="Tên" parse={normalizeSpaces}/>
      <TextField source="NgaySinh" label="Ngày sinh" />
      <FunctionField
        label="Giới tính"
        render={(record) => (record.GioiTinh === 0 ? "Nam" : "Nữ")}
      />
      <TextField source="SDT" label="SĐT" parse={normalizeSpaces}/>
      <TextField source="CCCD" label="CCCD" parse={normalizeSpaces}/>
      <TextField source="DiaChi" label="Địa chỉ" parse={normalizeSpaces}/>
      {/* <TextField source="MaTK" label="Mã TK" /> */}
      <ReferenceField
        source="MaBM"
        reference="bomon"
        label="Tên Bộ Môn"
        link={false}
      >
        <TextField source="TenBM" />
      </ReferenceField>
      <FunctionField
        label="Trạng thái"
        render={(record) => {
          if (record.TrangThai === 1) return "Hoạt động";
          if (record.TrangThai === 2) return "Tạm nghỉ";
          if (record.TrangThai === 3) return "Đã nghỉ việc";
          return record.TrangThai;
        }}
      />
      {/* <TextField source="MaGiangVien" label="Mã Giảng Viên" /> */}
      <EditButton />
    </Datagrid>
  </List>
);

export const GiangVienEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" />
      <TextInput source="maGV" label="Mã Giảng Viên" readOnly />
      <TextInput source="hoGV" label="Họ" validate={[requiredField, onlyVietnamese]} placeholder="VD: Nguyễn Văn" parse={normalizeSpaces}/>
      <TextInput source="tenGV" label="Tên" validate={[requiredField, onlyVietnamese]} placeholder="VD: Nam" parse={normalizeSpaces}/>

        <DateInput
          source="ngaySinh"
          label="Ngày sinh"
          validate={[
            requiredField,
            minValue("1925-01-01", "Năm sinh phải sau 1925"),
            ]}
          max={maxDate()}
          placeholder="YYYY-MM-DD"
        />
      <SelectInput
        source="gioiTinh"
        label="Giới tính"
        choices={[
          { id: 0, name: "Nam" },
          { id: 1, name: "Nữ" },
        ]}
      />
        <TextInput source="sdt" label="Số điện thoại" validate={[requiredField, phoneVN]} placeholder="0987654321" parse={normalizeSpaces}/>
        <TextInput source="cccd" label="CCCD" validate={[requiredField, cccdVN]} placeholder="012345678901" parse={normalizeSpaces}/>
        <TextInput source="diaChi" label="Địa chỉ" validate={requiredField} placeholder="123 Nguyễn Trãi, Q.1" parse={normalizeSpaces}/>
      <NumberInput source="maTK" label="Mã Tài Khoản" readOnly />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn">
        <AutocompleteInput optionText="TenBM" label="Tên Bộ Môn" validate={requiredField} />
      </ReferenceInput>
      <SelectInput
        source="trangThai"
        label="Trạng thái"
        choices={[
          { id: 1, name: "Hoạt động" },
          { id: 2, name: "Tạm nghỉ" },
          { id: 3, name: "Đã nghỉ việc" },
        ]}
      />
      <TextInput source="maGiangVien" label="Mã Giảng Viên" readOnly />
    </SimpleForm>
  </Edit>
);

export const GiangVienCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      <TextInput source="maGV" label="Mã Giảng Viên" readOnly />
      <TextInput source="hoGV" label="Họ" validate={[requiredField, onlyVietnamese]} placeholder="VD: Nguyễn Văn" parse={normalizeSpaces}/>
        <TextInput source="tenGV" label="Tên" validate={[requiredField, onlyVietnamese]} placeholder="VD: Nam" parse={normalizeSpaces}/>

     <DateInput
          source="ngaySinh"
          label="Ngày sinh"
          defaultValue={getCurrentDate()}
          validate={[
            requiredField,
            minValue("1925-01-01", "Năm sinh phải sau 1925"),
             ]}
          max={maxDate()}
          placeholder="YYYY-MM-DD"
        />
      <SelectInput
        source="gioiTinh"
        label="Giới tính"
        choices={[
          { id: 0, name: "Nam" },
          { id: 1, name: "Nữ" },
        ]}
      />
        <TextInput source="sdt" label="Số điện thoại" validate={[requiredField, phoneVN]} placeholder="0987654321" parse={normalizeSpaces}/>
        <TextInput source="cccd" label="CCCD" validate={[requiredField, cccdVN]} placeholder="012345678901" parse={normalizeSpaces}/>
        <TextInput source="diaChi" label="Địa chỉ" validate={requiredField} placeholder="123 Nguyễn Trãi, Q.1" parse={normalizeSpaces}/>
      <NumberInput source="maTK" label="Mã Tài Khoản" readOnly />
      <ReferenceInput source="maBM" reference="bomon" label="Bộ môn">
        <AutocompleteInput optionText="TenBM" label="Tên Bộ Môn" />
      </ReferenceInput>

      <SelectInput
        source="trangThai"
        label="Trạng thái"
        choices={[
          { id: 1, name: "Hoạt động" },
          { id: 2, name: "Tạm nghỉ" },
          { id: 3, name: "Đã nghỉ việc" },
        ]}
      />
      <TextInput source="maGiangVien" label="Mã Giảng Viên" readOnly />
      <SaveButton />
    </SimpleForm>
  </Create>
);
