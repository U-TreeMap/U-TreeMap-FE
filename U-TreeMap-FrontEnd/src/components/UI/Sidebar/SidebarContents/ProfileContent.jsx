import React from 'react';
import SidebarLayout from './SidebarLayout';
export default function ProfileContent() {
  return (
    <SidebarLayout paddingStyles="px-[19px] pt-12.5 pb-1.5" headerContent={''}>
      {/* 하단: 상세 정보 (스크롤 영역) */}
      <div>Profile</div>
    </SidebarLayout>
  );
}
