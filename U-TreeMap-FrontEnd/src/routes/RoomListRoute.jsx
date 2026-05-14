import { useIsMobile } from '../hooks/hook';
import MobRoomList from '../components/TreeData/MobRoomList';
import RoomList from '../components/TreeData/RoomList';

export default function RoomListRoute() {
  const isMobile = useIsMobile();

  return isMobile ? <MobRoomList /> : <RoomList />;
}
