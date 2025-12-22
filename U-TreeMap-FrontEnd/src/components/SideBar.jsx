// 데이터 패칭 방식 ?
import { useState } from 'react';
// 데이터 & 아이콘
import { mockTreeData, INITIAL_TREE_DATA, INITIAL_CONDITION_DATA } from '../data/mockTreeData';
import TreeFilled from '../assets/icons/tree-filled.svg';
import HomeIcon from '../assets/icons/home.svg';
import UserIcon from '../assets/icons/user.svg';
import UtreeLogo from '../assets/icons/logo.svg';

// 컴포넌트
import FilterDropdown from './UI/FilterDropdown';
import { SearchBar } from './UI/Searchbar';
import { ToggleButton } from './UI/button';
import TreeDetailContent from './UI/TreeDetailContent';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchText, setSearchText] = useState(''); // 검색어 상태 (디바운싱된 값 아님, 실제 필터링용)

  // 드롭다운 state
  const [treeOptions] = useState(INITIAL_TREE_DATA);
  const [selectedTrees, setSelectedTrees] = useState(['느티나무', '벚나무']);
  const [conditionOptions] = useState(INITIAL_CONDITION_DATA);
  const [selectedConditions, setSelectedConditions] = useState(['양호']);

  // 데이터 (실제로는 여기서 필터링 로직이 들어갈 수 있음)
  const selectedTree = mockTreeData;

  // SearchBar에서 디바운싱된 값을 받아 처리하는 함수
  const handleSearch = (keyword) => {
    console.log('검색:', keyword);
    setSearchText(keyword);
  };

  return (
    <div className="absolute top-0 left-0 z-20 flex h-full font-sans border-none pointer-events-none">
      {/* 네비게이션 레일 */}
      <nav className="w-14 h-full bg-[#F5F5F8] flex flex-col items-center py-7 border-none z-30 relative pointer-events-auto">
        <div className="flex flex-col mt-8 mb-auto gap-7">
          <img src={HomeIcon} alt="Home" />
          <img src={TreeFilled} alt="Trees" />
        </div>
        <img src={UserIcon} alt="User" />
      </nav>

      {/* 정보 패널 */}
      <aside className="relative z-20 flex h-full pointer-events-auto">
        {/* Outer Wrapper (너비 조절) */}
        <div
          className={`
            h-full bg-white border-r border-gray-200 shadow-[4px_4px_15px_0_rgba(0,0,0,0.15)]
            overflow-hidden 
            transition-all duration-350 ease-in-out 
            ${isOpen ? 'w-91.5' : 'w-0'}
          `}
        >
          {/* Inner Content (슬라이드 이동) */}
          <div
            className={`
              w-91.5 h-full flex flex-col
              transition-transform duration-350 ease-in-out
              ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}
          >
            {/* 상단: 로고 및 검색창 */}
            <div className="px-[19px] pt-12.5 pb-6.25 shrink-0">
              <img src={UtreeLogo} alt="Logo" />
              {/* 🌟 SearchBar 컴포넌트 사용 (디바운싱 적용됨) */}
              <SearchBar initialValue={searchText} onSearch={handleSearch} />
            </div>

            {/* 하단: 상세 정보 (스크롤 영역) */}
            <div className="flex-1 overflow-y-auto border-none scrollbar-hide">
              <div className="pl-[19px] pr-[13px] font-['Pretendard'] pb-10">
                {/* 🌟 상세 내용 컴포넌트 사용 */}
                <TreeDetailContent selectedTree={selectedTree} />
              </div>
            </div>
          </div>
        </div>

        {/* 토글 버튼 */}
        <ToggleButton isOpen={isOpen} onToggle={() => setIsOpen((prev) => !prev)} />

        {/* 필터 드롭다운 (패널 우측 상단 고정) */}
        <div className="absolute left-full top-14 ml-5 whitespace-nowrap z-50 flex gap-2.5">
          <FilterDropdown
            label="수종"
            options={treeOptions}
            selectedItems={selectedTrees}
            onSelect={setSelectedTrees}
          />
          <FilterDropdown
            label="생육상태"
            options={conditionOptions}
            selectedItems={selectedConditions}
            onSelect={setSelectedConditions}
          />
        </div>
      </aside>
    </div>
  );
}
