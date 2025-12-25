import Sidebar from '../components/SideBar';

export default function MainPage({ selectedTree }) {
  return (
    <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
      <Sidebar selectedTree={selectedTree} />
    </div>
  );
}
