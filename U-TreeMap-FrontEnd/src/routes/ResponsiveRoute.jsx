import { useIsMobile } from '../hooks/hook';

export default function ResponsiveRoute({ desktop: Desktop, mobile: Mobile }) {
  const isMobile = useIsMobile();
  const Component = isMobile ? Mobile : Desktop;

  return <Component />;
}
