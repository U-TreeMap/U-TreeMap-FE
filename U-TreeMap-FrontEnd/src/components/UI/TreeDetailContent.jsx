import { useState } from 'react';
import GpsIcon from '../../assets/icons/gps.svg';
import { SpecBox } from './Sidebar/Box';
import { TabButton } from './button';
import TreeIcon from '../../assets/icons/tree.svg';
import TreeIconFilled from '../../assets/icons/tree-filled.svg';
import { useEffect } from 'react';
export default function TreeDetailContent({ selectedTree }) {
  const [activeTab, setActiveTab] = useState('morphology');
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (selectedTree) {
      setIsLiked(selectedTree.isLiked || false);
    }
  }, [selectedTree]);
  const handleToggleLike = async () => {
    const previousState = isLiked;
    setIsLiked(!previousState);

    try {
      console.log(`Tree ID ${selectedTree.id} 좋아요 변경: ${!previousState}`);
    } catch (error) {
      console.error('좋아요 요청 실패:', error);
      setIsLiked(previousState);
    }
  };
  const environmentalData = [
    {
      id: 1,
      label: '탄소흡수량',
      value: '23.4',
      unit: 'tCO₂/year',
      description: '승용차 10대, 1년 동안 배출',
      icon: '🌿',
    },
    {
      id: 2,
      label: '대기오염 정화 효과',
      value: '12.3',
      unit: 'kg/year',
      description: '공기청정기 30대, 1년 동안 정화',
      icon: '☁️',
    },

    {
      id: 3,
      label: '빗물차단량',
      value: '185.0',
      unit: 'm³/year',
      description: '생수 2L, 약 92,500병에 해당',
      icon: '💧',
    },
  ];
  if (!selectedTree) {
    return <div className="mt-20 text-center text-gray-400">나무를 선택해주세요.</div>;
  }

  return (
    <>
      {/* 1. 상단 정보 영역 (ID + 아이콘 + 제목 + 요약) */}
      <div className="flex flex-col mt-2">
        <div className="flex items-start justify-between">
          <p className="text-[14px] font-medium text-[#939393] mb-[5px]">{selectedTree.id}</p>
          {/* 나무 좋아요 아이콘 */}
          <button
            onClick={handleToggleLike}
            className="transition-transform cursor-pointer hover:scale-110 active:scale-95"
            aria-label={isLiked ? '좋아요 취소' : '좋아요'}
          >
            <img src={isLiked ? TreeIconFilled : TreeIcon} alt="tree like icon" />
          </button>
        </div>
        {/* 나무 이름 및 학명 */}
        <div className="flex items-center ">
          <span className="">🌳</span>
          <h2 className="text-[18px] font-semibold text-[#222]">{selectedTree.name}</h2>
          <span className="ml-0.5 text-[14px] font-semibold text-[#4B4B4B] pt-1">({selectedTree.scientificName})</span>
        </div>

        {/*  요약 설명 */}
        <ul className="mt-2.5 list-disc ml-6.5">
          {selectedTree.summary.map((item, idx) => (
            <li key={idx} className="text-[14px] font-medium text-[#4B4B4B] leading-normal">
              {item}
            </li>
          ))}
        </ul>
      </div>
      {/* 3. 이미지 */}
      <div className="w-full h-40 mt-[8.27px] overflow-hidden rounded-xl">
        <img src={selectedTree.imageUrl} alt={selectedTree.name} className="object-cover w-full h-full" />
      </div>
      {/* 4. 위치 정보 */}
      <div className="mt-[35px] flex flex-col items-center">
        <h3 className="flex items-center text-[18px] font-semibold">
          <img src={GpsIcon} alt="" />
          {selectedTree.address}
        </h3>
        <div className="flex flex-row items-center mt-[5px] gap-[5px]">
          <p className=" text-[12px] font-medium text-[#797979]">
            ({selectedTree.coordinates.lat}, {selectedTree.coordinates.lng})
          </p>
          <p className="font-bold text-[12px] text-[#FFB700]">도시정원</p>
        </div>
      </div>

      {/* 점선 */}
      <div className="border-t border-dashed border-[#797979] my-6"></div>

      {/* 5. 환경 지표 리스트 (수정된 부분) */}
      <div className="flex flex-col gap-6 mb-6">
        {environmentalData.map((item) => (
          <div key={item.id} className="flex items-center">
            {/* 왼쪽: 수치와 단위 */}
            <div className="flex flex-col items-center p-2.5 min-w-[124px] text-right">
              <span className="text-[28px] font-bold text-[#388E3C] leading-none tracking-tight">{item.value}</span>
              <span className="text-[12px] text-[#9E9E9E] font-medium">{item.unit}</span>
            </div>

            {/* 오른쪽: 라벨과 설명 */}
            <div className="flex flex-col">
              <h4 className="flex items-center gap-1.5 text-[16px] font-bold">
                <span className="leading-none">{item.icon}</span>
                <span>{item.label}</span>
              </h4>

              <p className="mt-[3px] flex items-center font-medium text-[14px] text-[#797979] leading-[18px]">
                <span>→ {item.description}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* 6. 스펙 그리드 */}
      <div className="mt-[19px] grid grid-cols-2 gap-1.5">
        <SpecBox label="흉고직경" value={selectedTree.specs.dbh} />
        <SpecBox label="수고" value={selectedTree.specs.height} />
        <SpecBox label="수관폭" value={selectedTree.specs.width} />
        <SpecBox label="지하고" value={selectedTree.specs.rootHeight} />
      </div>
      {/* 7. 업데이트 날짜 */}
      <p className="mt-3 text-right text-[12px] font-normal text-[#4B4B4B]">업데이트 날짜: {selectedTree.updateDate}</p>
      {/* 8. 탭 메뉴 */}
      <div className="mt-[35px]">
        <div className="flex justify-between mb-3.5 border-b border-[#E0E0E0]">
          {['morphology', 'environment', 'usage'].map((tab) => (
            <TabButton
              key={tab}
              label={tab === 'morphology' ? '형태적 특징' : tab === 'environment' ? '생육 환경' : '활용 용도'}
              isActive={activeTab === tab}
              onClick={() => setActiveTab(tab)}
            />
          ))}
        </div>
        {/* key={activeTab}으로 탭 변경 시 애니메이션 리셋 효과 */}
        <div key={activeTab} className="text-[14px] text-[#4B4B4B] leading-6 min-h-[60px] animate-fade-in">
          • {selectedTree.details[activeTab]}
        </div>
      </div>
    </>
  );
}
