// components/NavigationRail.jsx
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '../../../../assets/icons/home.svg';
import HomeFilled from '../../../../assets/icons/home_filled.svg';

import TreeIcon from '../../../../assets/icons/tree.svg';
import TreeFilled from '../../../../assets/icons/tree-filled-green.svg';

import UserIcon from '../../../../assets/icons/user.svg';
import UserFilled from '../../../../assets/icons/user_filled.svg';
import { ROUTES } from '../../../../routes/routePaths';

export default function NavigationRail({ onNavigate }) {
  const { pathname } = useLocation();

  // 탭별 아이콘 매핑
  const getIcon = (isActive, defaultIcon, filledIcon) => {
    return isActive ? filledIcon : defaultIcon;
  };

  const linkClassName = 'transition-transform hover:scale-110';
  const isMapActive = pathname === ROUTES.MAP || pathname === ROUTES.ROOT;
  const isMyTreesActive = pathname === ROUTES.MY_TREES || pathname === ROUTES.MY_TREE_ALIAS;
  const isProfileActive =
    pathname === ROUTES.PROFILE ||
    pathname === ROUTES.PROFILE_INFO ||
    pathname === ROUTES.PROFILE_EDIT ||
    pathname.startsWith(ROUTES.ADMIN);

  return (
    <nav className="w-14 h-full bg-[#F5F5F8] flex flex-col items-center py-7 border-none z-30 relative pointer-events-auto ">
      <div className="flex flex-col mt-8 mb-auto gap-7">
        {/* HOME TAB */}
        <Link to={ROUTES.MAP} onClick={onNavigate} className={linkClassName}>
          <img
            src={getIcon(isMapActive, HomeIcon, HomeFilled)}
            alt="Home"
            className={isMapActive ? 'opacity-100' : 'opacity-60'}
          />
        </Link>

        {/* MY TREE TAB */}
        <Link to={ROUTES.MY_TREES} onClick={onNavigate} className={linkClassName}>
          <img
            src={getIcon(isMyTreesActive, TreeIcon, TreeFilled)}
            alt="My Tree"
            className={isMyTreesActive ? 'opacity-100' : 'opacity-60'}
          />
        </Link>
      </div>

      {/* PROFILE TAB */}
      <Link to={ROUTES.PROFILE} onClick={onNavigate} className={linkClassName}>
        <img
          src={getIcon(isProfileActive, UserIcon, UserFilled)}
          alt="Profile"
          className={isProfileActive ? 'opacity-100' : 'opacity-60'}
        />
      </Link>
    </nav>
  );
}
