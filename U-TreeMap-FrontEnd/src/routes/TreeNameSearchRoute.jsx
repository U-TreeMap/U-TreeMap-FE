import { useNavigate } from 'react-router-dom';
import TreeNameSearchModal from '../components/TreeData/TreeNameSearchModal';

export default function TreeNameSearchRoute() {
  const navigate = useNavigate();

  return <TreeNameSearchModal onClose={() => navigate(-1)} />;
}
