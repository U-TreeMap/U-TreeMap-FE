import { useIsMobile } from '../hooks/hook';
import MobTreeAddRequestPage from '../components/TreeData/MobTreeAddRequestPage';
import MobTreeEditRequestPage from '../components/TreeData/MobTreeEditRequestPage';
import TreeAddRequestPage from '../components/TreeData/TreeAddRequestPage';
import TreeEditRequestPage from '../components/TreeData/TreeEditRequestPage';

export default function TreeRequestRoute({ mode }) {
  const isMobile = useIsMobile();

  if (mode === 'edit') {
    return isMobile ? <MobTreeEditRequestPage /> : <TreeEditRequestPage />;
  }

  return isMobile ? <MobTreeAddRequestPage /> : <TreeAddRequestPage />;
}
