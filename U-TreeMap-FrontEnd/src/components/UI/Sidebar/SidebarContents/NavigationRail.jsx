// components/NavigationRail.jsx
import { NavLink } from 'react-router-dom';
import HomeIcon from '../../../../assets/icons/home.svg';
import HomeFilled from '../../../../assets/icons/home_filled.svg';

import TreeIcon from '../../../../assets/icons/tree.svg';
import TreeFilled from '../../../../assets/icons/tree-filled-green.svg';

import UserIcon from '../../../../assets/icons/user.svg';
import UserFilled from '../../../../assets/icons/user_filled.svg';

export default function NavigationRail({ onNavigate }) {
  // 탭별 아이콘 매핑
  const getIcon = (isActive, defaultIcon, filledIcon) => {
    return isActive ? filledIcon : defaultIcon;
  };

  const linkClassName = 'transition-transform hover:scale-110';

  return (
    <nav className="w-14 h-full bg-[#F5F5F8] flex flex-col items-center py-7 border-none z-30 relative pointer-events-auto ">
      <div className="flex flex-col mt-8 mb-auto gap-7">
        {/* HOME TAB */}
        <NavLink to="/map" onClick={onNavigate} className={linkClassName}>
          {({ isActive }) => (
            <img
              src={getIcon(isActive, HomeIcon, HomeFilled)}
              alt="Home"
              className={isActive ? 'opacity-100' : 'opacity-60'}
            />
          )}
        </NavLink>

        {/* MY TREE TAB */}
        <NavLink to="/my-trees" onClick={onNavigate} className={linkClassName}>
          {({ isActive }) => (
            <img
              src={getIcon(isActive, TreeIcon, TreeFilled)}
              alt="My Tree"
              className={isActive ? 'opacity-100' : 'opacity-60'}
            />
          )}
        </NavLink>
      </div>

      {/* PROFILE TAB */}
      <NavLink to="/profile" onClick={onNavigate} className={linkClassName}>
        {({ isActive }) => (
          <img
            src={getIcon(isActive, UserIcon, UserFilled)}
            alt="Profile"
            className={isActive ? 'opacity-100' : 'opacity-60'}
          />
        )}
      </NavLink>
    </nav>
  );
}
