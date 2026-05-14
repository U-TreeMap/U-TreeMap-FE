import Sidebar from '../components/SideBar';

export default function MainPage({ selectedTree, view }) {
  return (
    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
      <Sidebar selectedTree={selectedTree} view={view} />
    </div>
  );
}
