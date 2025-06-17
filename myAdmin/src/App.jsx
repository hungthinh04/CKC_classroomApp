import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import { KhoaList, KhoaCreate, KhoaEdit } from './resources/Khoa';
import { BoMonList, BoMonCreate, BoMonEdit } from './resources/BoMon';

const dataProvider = simpleRestProvider('http://localhost:3000/admin');

function App() {
  return (
    <Admin dataProvider={dataProvider}>
      <Resource name="khoa" list={KhoaList} create={KhoaCreate} edit={KhoaEdit} />
      <Resource name="bomon" list={BoMonList} create={BoMonCreate} edit={BoMonEdit} />
    </Admin>
  );
}

export default App;
