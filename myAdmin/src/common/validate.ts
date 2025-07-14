import { regex, required } from "react-admin";

// validate.ts
export const onlyVietnamese = regex(/^[\p{L}\s]+$/u, 'Chỉ nhập chữ và khoảng trắng');
export const requiredField = required('Trường này là bắt buộc');
export const phoneVN = regex(/^0\d{9}$/, 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số');
export const cccdVN = regex(/^\d{12}$/, 'CCCD phải có đúng 12 số');

export const minAge = (min = 18) => (value) => {
  if (!value) return undefined;
  const birth = new Date(value);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age >= min ? undefined : `Giảng viên phải đủ ${min} tuổi`;
};

export const maxToday = (value) => {
  if (!value) return undefined;
  const today = new Date().toISOString().split("T")[0];
  return value > today ? 'Ngày sinh không hợp lệ (vượt quá hôm nay)' : undefined;
};
