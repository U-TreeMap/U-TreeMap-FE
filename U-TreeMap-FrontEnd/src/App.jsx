// src/App.jsx

import MapPage from './pages/MainPage';
import Sidebar from './components/SideBar';
import Test from './components/UI/Test';
export default function App() {
  return (
    // <div w-screen h-screen>
    //   <Sidebar />
    //   {/* <Test></Test> */}
    // </div>
    <div className="w-screen h-screen">
      <Sidebar />
      <MapPage />
    </div>
  );
}
