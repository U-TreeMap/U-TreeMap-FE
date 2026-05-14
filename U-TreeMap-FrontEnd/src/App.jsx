import MapShell from './layouts/MapShell';

export default function App({ view = 'map' }) {
  return <MapShell view={view} />;
}
