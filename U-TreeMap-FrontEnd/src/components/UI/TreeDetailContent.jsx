import { useState } from 'react';
import GpsIcon from '../../assets/icons/gps.svg';
import ArrowCycleL from '../../assets/icons/arrow_cycle_l.svg'; // 오타 수정: Cycle
import ArrowCycleR from '../../assets/icons/arrow_cycle_r.svg';
import CloudIcon from '../../assets/icons/cloud.svg';
import { SpecBox } from './Sidebar/Box';
import { TabButton } from './button';

export default function TreeDetailContent({ selectedTree }) {
  const [activeTab, setActiveTab] = useState('morphology');

  if (!selectedTree) {
    return <div className="mt-20 text-center text-gray-400">나무를 선택해주세요.</div>;
  }

  return (
    <>
      {/* 1. 기본 정보 */}
      <div className="mt-2">
        <p className="text-[14px] font-medium text-[#939393] mb-[5px]">{selectedTree.id}</p>
        <div className="flex gap-2 items-left">
          <span className="text-lg">🌳</span>
          <h2 className="text-[18px] flex items-end font-semibold">{selectedTree.name}</h2>
          <span className="flex items-end text-[14px] font-semibold text-[#4B4B4B]">
            ({selectedTree.scientificName})
          </span>
        </div>
      </div>

      {/* 2. 요약 */}
      <ul className="mt-2.5 list-disc ml-4">
        {selectedTree.summary.map((item, idx) => (
          <li key={idx} className="text-[14px] font-medium text-[#4B4B4B] leading-normal">
            {item}
          </li>
        ))}
      </ul>

      {/* 3. 이미지 */}
      <div className="w-full h-40 mt-[8.27px] overflow-hidden rounded-xl">
        <img src={selectedTree.imageUrl} alt={selectedTree.name} className="object-cover w-full h-full" />
      </div>

      {/* 4. 위치 정보 */}
      <div className="mt-[35px]">
        <h3 className="flex items-center gap-1 text-[18px] font-semibold leading-normal">
          <img src={GpsIcon} alt="" />
          {selectedTree.address}
        </h3>
        <p className="mt-2 text-[12px] font-normal text-[#939393]">
          ({selectedTree.coordinates.lat}, {selectedTree.coordinates.lng})
        </p>
      </div>

      {/* 5. 탄소 흡수량 카드 */}
      <div className="relative mt-[19px] text-center bg-white border-none rounded-2xl py-6">
        {/* 위 화살표 */}
        <img src={ArrowCycleR} alt="" className="absolute right-0 resize-noneight-0 -top-1" />

        {/* 가운데 콘텐츠 */}
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="relative w-[60px] h-10 flex items-center justify-center">
            <img src={CloudIcon} alt="" />
            <span className="absolute text-[12px] font-bold text-[#1B5E20] pt-1">{selectedTree.carbon.amount}</span>
          </div>

          <div className="text-left">
            <p className="text-[14px] font-semibold mb-1">탄소흡수량</p>
            <p className="text-[12px] font-medium text-[#4B4B4B] leading-[18px]">{selectedTree.carbon.description}</p>
            <p className="text-[12px] font-semibold text-[#FFB700] leading-[18px]">→ {selectedTree.carbon.effect}</p>
          </div>
        </div>

        {/* 아래 화살표 */}
        <img src={ArrowCycleL} alt="" className="absolute left-0 -bottom-1" />
      </div>

      {/* 6. 스펙 그리드 */}
      <div className="mt-[19px] grid grid-cols-2 gap-3">
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
