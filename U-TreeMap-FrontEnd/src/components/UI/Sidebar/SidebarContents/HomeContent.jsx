// components/SidebarContents/HomeContent.jsx
import { useState } from 'react';
import UtreeLogo from '../../../../assets/icons/logo.svg';
import { SearchBar } from '../../Searchbar';
import TreeDetailContent from '../../TreeDetailContent';
import FilterDropdown from '../../FilterDropdown';
import SidebarLayout from './SidebarLayout';
import { INITIAL_TREE_DATA, INITIAL_CONDITION_DATA } from '../../../../data/mockTreeData';
export default function HomeContent({ selectedTree }) {
  const [searchText, setSearchText] = useState('');

  // 필터 관련 State
  const [treeOptions] = useState(INITIAL_TREE_DATA);
  const [selectedTrees, setSelectedTrees] = useState(['느티나무', '벚나무']);
  const [conditionOptions] = useState(INITIAL_CONDITION_DATA);
  const [selectedConditions, setSelectedConditions] = useState(['양호']);

  // SearchBar에서 디바운싱된 값을 받아 처리하는 함수
  const handleSearch = (keyword) => {
    console.log('검색:', keyword);
    setSearchText(keyword);
  };

  return (
    <>
      <SidebarLayout
        paddingStyles="px-[19px] pt-12.5 pb-1.5"
        headerContent={<SearchBar initialValue={searchText} onSearch={handleSearch} />}
      >
        {/* 하단: 상세 정보 (스크롤 영역) */}
        <div className="pl-[19px] pr-[13px] pb-10">
          <TreeDetailContent selectedTree={selectedTree} />
        </div>
      </SidebarLayout>

      {/* 필터 드롭다운 */}
      <div className="absolute left-full top-14 ml-5 whitespace-nowrap z-50 flex gap-2.5">
        <FilterDropdown label="수종" options={treeOptions} selectedItems={selectedTrees} onSelect={setSelectedTrees} />
        <FilterDropdown
          label="생육상태"
          options={conditionOptions}
          selectedItems={selectedConditions}
          onSelect={setSelectedConditions}
        />
      </div>
    </>
  );
}
