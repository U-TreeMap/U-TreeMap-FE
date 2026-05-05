import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from '../App';
import TreeAddRequestPage from '../components/TreeData/TreeAddRequestPage';
import MobTreeAddRequestPage from '../components/TreeData/MobTreeAddRequestPage';
import TreeEditRequestPage from '../components/TreeData/TreeEditRequestPage';
import MobTreeEditRequestPage from '../components/TreeData/MobTreeEditRequestPage';
import ResponsiveRoute from './ResponsiveRoute';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/map" replace />} />
        <Route path="/map" element={<App view="map" />} />
        <Route path="/my-trees" element={<App view="my-trees" />} />
        <Route path="/profile" element={<App view="profile" />} />
        <Route
          path="/trees/new"
          element={<ResponsiveRoute desktop={TreeAddRequestPage} mobile={MobTreeAddRequestPage} />}
        />
        <Route
          path="/trees/:treeId/edit"
          element={<ResponsiveRoute desktop={TreeEditRequestPage} mobile={MobTreeEditRequestPage} />}
        />
        <Route path="*" element={<Navigate to="/map" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
