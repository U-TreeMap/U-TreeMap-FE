import { useIsMobile } from '../hooks/hook';
import MobVolunteer from '../components/TreeData/MobVolunteer';
import Volunteer from '../components/TreeData/Volunteer';

export default function VolunteerRoute() {
  const isMobile = useIsMobile();

  return isMobile ? <MobVolunteer /> : <Volunteer />;
}
