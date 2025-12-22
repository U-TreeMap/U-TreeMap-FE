// sidebar.jsx 에서 사용한 TabButton
import LeftArrowS from '../../assets/icons/left_arrow_s.svg';
import RightArrow from '../../assets/icons/right_arrow.svg';

export const TabButton = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`py-2 px-3.5 text-[16px] font-medium transition-all relative ${
      isActive ? 'text-black font-semibold' : 'text-[#939393]'
    }`}
  >
    {label}
    {isActive && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#218F00]"></span>}
  </button>
);

// 메인 사이드 바 토글
export const ToggleButton = ({ isOpen, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="
        absolute
        z-50
        top-1/2
        left-full
        -translate-y-1/2
        flex
        items-center
        justify-center
        w-[30px]
        h-[70px]
        bg-white
        rounded-r-lg
        shadow-[4px_4px_15px_0_rgba(0,0,0,0.15)]
        border border-gray-200 border-l-0
        cursor-pointer
        hover:bg-[#EFFFEA]
        text-gray-500
      "
      aria-label="Toggle Sidebar"
    >
      <img src={isOpen ? LeftArrowS : RightArrow} alt={isOpen ? '닫기' : '열기'} />
    </button>
  );
};
