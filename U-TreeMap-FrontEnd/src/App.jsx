import MainPage from './pages/MainPage';
import MobilePage from './pages/MobilePage';
import MapBox from './components/MapBox';
import { useIsMobile } from './hooks/hook';
import { mockTreeData } from './data/mockTreeData';

export default function App({ view = 'map' }) {
  const isMobile = useIsMobile();
  const selectedTree = mockTreeData;

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapBox isMobile={isMobile} />

      {isMobile ? (
        <MobilePage selectedTree={selectedTree} view={view} />
      ) : (
        <MainPage selectedTree={selectedTree} view={view} />
      )}
    </div>
  );
}
