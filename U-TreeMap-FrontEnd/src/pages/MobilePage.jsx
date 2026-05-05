import { useState } from 'react';
import { SearchBar } from '../components/UI/Searchbar';
import MobileBottomSheet from '../components/MobileBottomSheet';
import UTreeLogo from '../assets/icons/logo.svg';
import FilterBtn from '../assets/icons/filter_btn.svg';

export default function MobilePage({ selectedTree, view = 'map' }) {
  const [searchText, setSearchText] = useState('');

  const handleFilterClick = () => {
    alert('필터 메뉴 열기');
  };

  if (view === 'my-trees') {
    return (
      <div className="absolute inset-0 z-30 flex flex-col bg-white pointer-events-auto">
        <div className="flex flex-col w-full px-4 pb-2.5 bg-white">
          <div className="flex items-center justify-between w-full pt-2">
            <img src={UTreeLogo} alt="U-TREE MAP" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center text-[16px] font-semibold text-[#4B4B4B]">
          내 나무
        </div>
      </div>
    );
  }

  if (view === 'profile') {
    return (
      <div className="absolute inset-0 z-30 flex flex-col bg-white pointer-events-auto">
        <div className="flex flex-col w-full px-4 pb-2.5 bg-white">
          <div className="flex items-center justify-between w-full pt-2">
            <img src={UTreeLogo} alt="U-TREE MAP" />
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center text-[16px] font-semibold text-[#4B4B4B]">
          Profile
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="absolute inset-0 z-20 flex flex-col pointer-events-none">
        <div className="flex flex-col w-full px-4 pb-2.5 bg-white pointer-events-auto ">
          <div className="flex items-center justify-between w-full pt-2">
            <img src={UTreeLogo} alt="U-TREE MAP" />
            <button onClick={handleFilterClick} className="">
              <div>
                <img src={FilterBtn} alt="" />
              </div>
            </button>
          </div>

          {/* 검색창 */}
          <div className="mt-2.5">
            <SearchBar initialValue={searchText} onSearch={setSearchText} />
          </div>
        </div>
      </div>

      {/* 바텀 시트 */}
      <MobileBottomSheet selectedTree={selectedTree} />
    </>
  );
}
