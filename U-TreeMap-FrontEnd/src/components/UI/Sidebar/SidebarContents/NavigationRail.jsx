// components/NavigationRail.jsx
import HomeIcon from '../../../../assets/icons/home.svg';
import HomeFilled from '../../../../assets/icons/home_filled.svg';

import TreeIcon from '../../../../assets/icons/tree.svg';
import TreeFilled from '../../../../assets/icons/tree-filled-green.svg';

import UserIcon from '../../../../assets/icons/user.svg';
import UserFilled from '../../../../assets/icons/user_filled.svg';
import { TABS } from '../../../SideBar';

export default function NavigationRail({ activeTab, onTabChange }) {
  // 탭별 아이콘 매핑
  const getIcon = (tabName, defaultIcon, filledIcon) => {
    return activeTab === tabName ? filledIcon : defaultIcon;
  };

  return (
    <nav className="w-14 h-full bg-[#F5F5F8] flex flex-col items-center py-7 border-none z-30 relative pointer-events-auto ">
      <div className="flex flex-col mt-8 mb-auto gap-7">
        {/* HOME TAB */}
        <button onClick={() => onTabChange(TABS.HOME)} className="transition-transform hover:scale-110">
          <img
            src={getIcon(TABS.HOME, HomeIcon, HomeFilled)}
            alt="Home"
            className={activeTab === TABS.HOME ? 'opacity-100' : 'opacity-60'}
          />
        </button>

        {/* MY TREE TAB */}
        <button onClick={() => onTabChange(TABS.MY_TREE)} className="transition-transform hover:scale-110">
          <img
            src={getIcon(TABS.MY_TREE, TreeIcon, TreeFilled)}
            alt="My Tree"
            className={activeTab === TABS.MY_TREE ? 'opacity-100' : 'opacity-60'}
          />
        </button>
      </div>

      {/* PROFILE TAB */}
      <button onClick={() => onTabChange(TABS.PROFILE)} className="transition-transform hover:scale-110">
        <img
          src={getIcon(TABS.PROFILE, UserIcon, UserFilled)}
          alt="Profile"
          className={activeTab === TABS.PROFILE ? 'opacity-100' : 'opacity-60'}
        />
      </button>
    </nav>
  );
}
