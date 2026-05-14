import { useIsMobile } from '../hooks/hook';
import MobTreeList from '../components/TreeData/MobTreeList';
import TreeList from '../components/TreeData/TreeList';

export default function TreeListRoute() {
  const isMobile = useIsMobile();

  return isMobile ? <MobTreeList /> : <TreeList />;
}
