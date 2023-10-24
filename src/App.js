import logo from './logo.svg';
import './App.css';
import {Route, Routes} from "react-router-dom";
import ListUser from "./component/admin/ListUser";

function App() {
  return (
    <Routes>
      <Route path={'account_users'} element={<ListUser/>}></Route>
    </Routes>
  );
}

export default App;
