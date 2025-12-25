import { useState } from 'react';
import MainPage from './pages/MainPage';
import MobilePage from './pages/MobilePage';
import MapBox from './components/MapBox';
import { useIsMobile } from './hooks/hook';
import { mockTreeData } from './data/mockTreeData';

export default function App() {
  const isMobile = useIsMobile();

  const [selectedTree, setSelectedTree] = useState(mockTreeData);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapBox onSelectTree={setSelectedTree} isMobile={isMobile} />

      {isMobile ? <MobilePage selectedTree={selectedTree} /> : <MainPage selectedTree={selectedTree} />}
    </div>
  );
}
