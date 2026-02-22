import { useState } from 'react';
import MainPage from './pages/MainPage';
import MobilePage from './pages/MobilePage';
import MapBox from './components/MapBox';
import { useIsMobile } from './hooks/hook';
import { mockTreeData } from './data/mockTreeData';
import { getSelectedTree } from './features/ui/getSelectedTree';
import { useMapStore } from './stores/UseMapStore';
import { useSelectedTree } from './hooks/useSelectedTree';


import GpsSettingModal from './components/UI/gps/GpsSettingModal';
import TreeEditRequestPage from './components/TreeData/TreeEditRequestPage';
import MobTreeEditRequestPageMobile from './components/TreeData/MobTreeEditRequestPage';
import TreeList from './components/TreeData/TreeList';
import MobTreeList from './components/TreeData/MobTreeList';
import MobRoomList from './components/TreeData/MobRoomList';
import MobVolunteerPage from './components/TreeData/MobVolunteer';
import TreeNameSearchModal from './components/TreeData/TreeNameSearchModal';

export default function App() {
  const isMobile = useIsMobile();
  

  //const [selectedTree, setSelectedTree] = useState(mockTreeData);
  const { tree, loading} = useSelectedTree(); 

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <TreeNameSearchModal></TreeNameSearchModal>
      {/* <MapBox isMobile={isMobile} />
      {isMobile ? <MobilePage selectedTree={tree} /> : <MainPage selectedTree={tree} />} */}
    </div>
  );
}
