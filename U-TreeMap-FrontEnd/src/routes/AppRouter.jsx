import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MapShell from '../layouts/MapShell';
import RoomListRoute from './RoomListRoute';
import TeamListRoute from './TeamListRoute';
import TreeListRoute from './TreeListRoute';
import TreeNameSearchRoute from './TreeNameSearchRoute';
import TreeRequestRoute from './TreeRequestRoute';
import VolunteerRoute from './VolunteerRoute';
import { ROUTES } from './routePaths';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={ROUTES.ROOT} element={<Navigate to={ROUTES.MAP} replace />} />
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.MAP} replace />} />
        <Route path={ROUTES.MAP} element={<MapShell view="map" />} />
        <Route path={ROUTES.MY_TREES} element={<MapShell view="my-trees" />} />
        <Route path={ROUTES.MY_TREE_ALIAS} element={<Navigate to={ROUTES.MY_TREES} replace />} />
        <Route path={ROUTES.PROFILE} element={<MapShell view="profile" />} />
        <Route path={ROUTES.PROFILE_INFO} element={<MapShell view="profile" />} />
        <Route path={ROUTES.PROFILE_EDIT} element={<MapShell view="profile" />} />
        <Route path={ROUTES.ADMIN} element={<MapShell view="admin" />} />
        <Route path={ROUTES.ADMIN_VOLUNTEER_INVITE} element={<MapShell view="admin" />} />
        <Route path={ROUTES.ADMIN_TREE_EDIT_REQUESTS} element={<MapShell view="admin" />} />
        <Route path={ROUTES.ADMIN_TREE_EDIT_REQUEST_TEAM} element={<MapShell view="admin" />} />
        <Route path={ROUTES.ADMIN_TREE_EDIT_REQUEST_DETAIL} element={<MapShell view="admin" />} />
        <Route path={ROUTES.TREE_NEW} element={<TreeRequestRoute mode="add" />} />
        <Route path={ROUTES.TREE_EDIT} element={<TreeRequestRoute mode="edit" />} />
        <Route path={ROUTES.TREE_ADD_REQUEST} element={<Navigate to={ROUTES.TREE_NEW} replace />} />
        <Route path={ROUTES.TREE_EDIT_REQUEST} element={<TreeRequestRoute mode="edit" />} />
        <Route path={ROUTES.ROOMS} element={<RoomListRoute />} />
        <Route path={ROUTES.ROOM_LIST} element={<Navigate to={ROUTES.ROOMS} replace />} />
        <Route path={ROUTES.TEAMS} element={<TeamListRoute />} />
        <Route path={ROUTES.TEEM_LIST} element={<Navigate to={ROUTES.TEAMS} replace />} />
        <Route path={ROUTES.ROOM_TREES} element={<TreeListRoute />} />
        <Route path={ROUTES.TREE_LIST} element={<TreeListRoute />} />
        <Route path={ROUTES.TREE_NAME_SEARCH} element={<TreeNameSearchRoute />} />
        <Route path={ROUTES.VOLUNTEER} element={<VolunteerRoute />} />
        <Route path="*" element={<Navigate to={ROUTES.MAP} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
