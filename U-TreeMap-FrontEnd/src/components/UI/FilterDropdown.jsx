import { useState, useRef, useEffect } from 'react';
import ArrowDropDown from '../../assets/icons/arrow_dropdown.svg';
import NotCheckBox from '../../assets/icons/not_checked_box.svg';
import CheckedBox from '../../assets/icons/checked_box.svg';

/**
 * @param {string} label - 버튼에 표시될 이름 (예: 수종, 생육상태)
 * @param {Array} options - 드롭다운에 표시될 리스트 데이터 (API 연동 시 여기에 주입)
 * @param {Array} selectedItems - 현재 선택된 아이템들의 배열 (부모에서 관리)
 * @param {Function} onSelect - 아이템 선택/해제 시 실행될 함수 (부모 state 업데이트용)
 */
export default function FilterDropdown({ label, options = [], selectedItems = [], onSelect }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownRef]);

  // 아이템 토글 로직
  const handleToggle = (item) => {
    let newSelected;
    if (selectedItems.includes(item)) {
      newSelected = selectedItems.filter((i) => i !== item);
    } else {
      newSelected = [...selectedItems, item];
    }
    // 부모에게 변경된 배열 전달
    onSelect(newSelected);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🟢 [버튼] */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center justify-center gap-[5px]
          px-[15px] py-[7px]
          bg-white
          rounded-[30px]
          shadow-[2px_2px_4px_0_rgba(0,0,0,0.25)]
          transition-all duration-200 hover:bg-[#EFFFEA] active:scale-95
          whitespace-nowrap shrink-0
        "
      >
        <span className="text-[14px] font-medium text-[#218F00]">{label}</span>
        <img
          src={ArrowDropDown}
          alt="toggle"
          className={`transition-transform duration-300 ease-in-out ${isOpen ? 'rotate-180' : 'rotate-0'}`}
        />
      </button>

      {/* 🟢 [드롭다운 메뉴] */}
      <div
        className={`
          absolute left-0 mt-[17px] z-50
          w-[150px] max-h-[394px]  /* 높이를 유동적으로 변경 (최대 높이 제한) */
          bg-white rounded-[20px]
          shadow-[2px_2px_4px_0_rgba(0,0,0,0.25)]
          overflow-hidden origin-top-left
          transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1)
          ${
            isOpen
              ? 'opacity-100 scale-100 translate-y-0 visible'
              : 'opacity-0 scale-95 -translate-y-2 invisible pointer-events-none'
          }
        `}
      >
        <div className="flex flex-col items-start gap-2.5 p-[15px] w-full max-h-[394px] overflow-y-auto scrollbar-hide">
          {options.map((item) => {
            const isChecked = selectedItems.includes(item);
            return (
              <div
                key={item}
                onClick={() => handleToggle(item)}
                className="flex items-center w-full gap-2 p-1 transition-colors rounded-md cursor-pointer group hover:bg-gray-50 shrink-0"
              >
                <img
                  src={isChecked ? CheckedBox : NotCheckBox}
                  alt={isChecked ? 'checked' : 'unchecked'}
                  className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                />
                <span
                  className={`text-[14px] transition-colors ${
                    isChecked ? ' text-black' : 'font-medium text-[#4B4B4B]'
                  }`}
                >
                  {item}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
