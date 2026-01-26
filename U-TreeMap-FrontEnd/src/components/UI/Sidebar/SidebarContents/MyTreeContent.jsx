import { useState } from 'react';
import TreeFilledGreen from '../../../../assets/icons/tree-filled-green.svg';
import GpsIcon from '../../../../assets/icons/gps.svg';
import SidebarLayout from './SidebarLayout';

const treeUrl = 'https://picsum.photos/200';

const MOCK_MY_TREES = [
  {
    id: 1,
    no: 'No.002',
    name: '느티나무',
    scientificName: 'Zelkova serrata',
    address: '울산광역시 남구 무거동 울산대학교',
    coords: '(35.5383603, 129.2555418)',
    tag: '도시 정원',
    category: '교목',
    image: treeUrl,
  },
  {
    id: 2,
    no: 'No.005',
    name: '벚나무',
    scientificName: 'Prunus serrulata',
    address: '울산광역시 남구 무거동 123-45',
    coords: '(35.5383603, 129.2555418)',
    tag: '가로수',
    category: '교목',
    image: treeUrl,
  },
  {
    id: 3,
    no: 'No.012',
    name: '철쭉',
    scientificName: 'Rhododendron',
    address: '울산광역시 남구 대학로 93',
    coords: '(35.5381111, 129.2552222)',
    tag: '관목',
    category: '관목',
    image: treeUrl,
  },
  {
    id: 4,
    no: 'No.015',
    name: '민들레',
    scientificName: 'Taraxacum',
    address: '울산광역시 남구 무거동 공원',
    coords: '(35.5383333, 129.2553333)',
    tag: '초목',
    category: '초목',
    image: treeUrl,
  },
];

const CATEGORIES = ['전체', '교목', '관목', '초목'];

export default function MyTreeContent() {
  const [selectedCategory, setSelectedCategory] = useState('전체');

  // 카테고리에 따른 필터링 로직
  const filteredTrees = MOCK_MY_TREES.filter((tree) => {
    if (selectedCategory === '전체') return true;
    return tree.category === selectedCategory;
  });

  return (
    <SidebarLayout
      paddingStyles="px-[19px] pt-12.5 pb-4"
      showLogo={true}
      headerContent={
        <div className="flex gap-1.75 overflow-x-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`
                   text-[14px] py-1.25 px-2.5 font-normal rounded-[30px] border
                ${
                  selectedCategory === cat
                    ? 'bg-[#218F00] border-[#218F00] text-white' // 선택됨
                    : 'bg-white border-[#939393] text-[#4B4B4B] hover:bg-gray-50' // 선택 안됨
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>
      }
    >
      {/* 메인 컨텐츠 SidebarLayout의 children */}
      <div className="flex flex-col gap-4 px-5 pb-20">
        {filteredTrees.map((tree) => (
          <div
            key={tree.id}
            className="bg-[#F8F9FA] rounded-[20px] p-4 flex gap-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] relative"
          >
            {/* 왼쪽: 나무 이미지 */}
            <div className="w-[80px] h-[80px] shrink-0 rounded-xl overflow-hidden bg-gray-200">
              <img src={tree.image} alt={tree.name} className="object-cover w-full h-full" />
            </div>

            {/* 중앙: 텍스트 정보 */}
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex items-baseline gap-1 mb-0.5">
                <span className="text-[12px] text-[#939393] font-medium">{tree.no}</span>
              </div>

              <h3 className="text-[16px] font-semibold text-[#333333] mb-1 truncate">
                {tree.name}
                <span className="text-[11px] font-normal text-black ml-1">({tree.scientificName})</span>
              </h3>

              <div className="flex items-center gap-1 mb-0.5">
                <img className="w-3 h-3" src={GpsIcon} alt="GPS" />
                <p className="text-[12px] text-black truncate">{tree.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-[#797979]">{tree.coords}</span>
                <span className="text-[10px] font-bold text-[#FFB700]">{tree.tag}</span>
              </div>
            </div>

            {/* 오른쪽: 아이콘 */}
            <div className="absolute cursor-pointer top-4 right-4">
              <img src={TreeFilledGreen} alt="tree-icon" className="w-6 h-6" />
            </div>
          </div>
        ))}

        {/* 데이터가 없을 경우 */}
        {filteredTrees.length === 0 && (
          <div className="py-10 text-sm text-center text-gray-400">해당하는 나무가 없습니다.</div>
        )}
      </div>
    </SidebarLayout>
  );
}
