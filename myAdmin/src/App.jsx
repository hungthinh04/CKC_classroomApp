import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { KhoaList, KhoaCreate, KhoaEdit } from './resources/Khoa';
import { BoMonList, BoMonCreate, BoMonEdit } from './resources/BoMon';
import { MonHocCreate, MonHocEdit, MonHocList } from './resources/MonHoc';

const dataProvider = simpleRestProvider('http://localhost:3000/admin');

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="khoa" options={{label:"Khoa"}} list={KhoaList} create={KhoaCreate} edit={KhoaEdit} />
      <Resource name="bomon" options={{label:"Bộ Môn"}} list={BoMonList} create={BoMonCreate} edit={BoMonEdit} />
      <Resource name="monhoc" options={{label:"Môn Học"}} list={MonHocList} create={MonHocCreate} edit={MonHocEdit} />
    </Admin>
  );
}

export default App;
