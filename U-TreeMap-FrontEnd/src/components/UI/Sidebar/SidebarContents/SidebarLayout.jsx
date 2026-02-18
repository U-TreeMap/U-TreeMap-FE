import UtreeLogo from '../../../../assets/icons/logo.svg';

export default function SidebarLayout({
  headerContent, // 검색창 또는 필터 버튼 등 헤더 하단 요소
  children, // 메인 리스트 컨텐츠
  paddingStyles, // 탭마다 조금씩 다른 상단 패딩을 맞추기 위한 prop
  showLogo = true, // 로고 표시 여부 (기본값 true)
}) {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* 1. 공통 헤더 영역 (Outlet 1) */}
      <div className={`shrink-0 ${paddingStyles}`}>
        {showLogo ? (
          <img src={UtreeLogo} alt="U-TREE MAP" className="mb-2.5" />
        ) : (
          <h2 className="text-[22px] font-extrabold text-[#2FAF12] mb-5">U-TREE MAP</h2>
        )}

        {/* 각 탭별 헤더 확장 영역 (검색창, 필터 등) */}
        {headerContent}
      </div>

      {/* 2. 메인 컨텐츠 영역 (스크롤 구역) */}
      <div className="flex-1 overflow-y-auto border-none scrollbar-hide">{children}</div>
    </div>
  );
}
