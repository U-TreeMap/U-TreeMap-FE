import { useState } from 'react';
import { ToggleButton } from './UI/button';
import NavigationRail from './UI/Sidebar/SidebarContents/NavigationRail';
import HomeContent from './UI/Sidebar/SidebarContents/HomeContent';
import MyTreeContent from './UI/Sidebar/SidebarContents/MyTreeContent';
import ProfileContent from './UI/Sidebar/SidebarContents/ProfileContent';

export default function Sidebar({ selectedTree, view = 'map' }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleNavigate = () => {
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className="absolute top-0 left-0 z-20 flex h-full font-sans border-none pointer-events-none">
      {/* 1. 네비게이션 레일 (탭 제어) */}
      <NavigationRail onNavigate={handleNavigate} />

      {/* 2. 정보 패널 (슬라이드 애니메이션) */}
      <aside className="relative z-20 flex h-full pointer-events-auto">
        <div
          className={`
            h-full bg-white border-r border-gray-200 shadow-[4px_4px_15px_0_rgba(0,0,0,0.15)]
            overflow-visible 
            transition-all duration-350 ease-in-out 
            ${isOpen ? 'w-91.5' : 'w-0'}
          `}
        >
          {/* Inner Content Wrapper */}
          <div
            className={`
              w-91.5 h-full flex flex-col relative
              transition-transform duration-350 ease-in-out
              ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            {/* 탭 조건부 렌더링 */}
            {view === 'map' && <HomeContent selectedTree={selectedTree} />}
            {view === 'my-trees' && <MyTreeContent />}
            {view === 'profile' && <ProfileContent />}
          </div>
        </div>

        {/* 3. 토글 버튼 */}
        <ToggleButton isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />
      </aside>
    </div>
  );
}
