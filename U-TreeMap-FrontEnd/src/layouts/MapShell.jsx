import { useLocation } from 'react-router-dom';
import MainPage from '../pages/MainPage';
import MobilePage from '../pages/MobilePage';
import MapBox from '../components/MapBox';
import { useIsMobile } from '../hooks/hook';
import { mockTreeData } from '../data/mockTreeData';
import { ROUTES } from '../routes/routePaths';

function getViewFromPathname(pathname) {
  if (pathname === ROUTES.MY_TREES || pathname === ROUTES.MY_TREE_ALIAS) return 'my-trees';
  if (pathname === ROUTES.PROFILE || pathname === ROUTES.PROFILE_INFO || pathname === ROUTES.PROFILE_EDIT) {
    return 'profile';
  }
  if (pathname.startsWith(ROUTES.ADMIN)) return 'admin';
  return 'map';
}

export default function MapShell({ view = 'map' }) {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  const selectedTree = mockTreeData;
  const currentView = getViewFromPathname(pathname) || view;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapBox isMobile={isMobile} />

      {isMobile ? (
        <MobilePage selectedTree={selectedTree} view={currentView} />
      ) : (
        <MainPage selectedTree={selectedTree} view={currentView} />
      )}
    </div>
  );
}
