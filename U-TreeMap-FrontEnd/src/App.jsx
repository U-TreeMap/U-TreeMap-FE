import { useState } from 'react';
import MainPage from './pages/MainPage';
import MobilePage from './pages/MobilePage';
import MapBox from './components/MapBox';
import { useIsMobile } from './hooks/hook';
import { mockTreeData } from './data/mockTreeData';
import { getSelectedTree } from './features/ui/getSelectedTree';
import { useMapStore } from './stores/UseMapStore';
import { useSelectedTree } from './hooks/useSelectedTree';

export default function App() {
  const isMobile = useIsMobile();
  

  //const [selectedTree, setSelectedTree] = useState(mockTreeData);
  const { tree, loading} = useSelectedTree(); 

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <MapBox isMobile={isMobile} />

      {isMobile ? <MobilePage selectedTree={tree} /> : <MainPage selectedTree={tree} />}
    </div>
  );
}
