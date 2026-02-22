import React, { useState } from "react";
import LeftArrow from "../../assets/icons/white_left_arrow.svg?react";
import RightArrowS from "../../assets/icons/right_arrow_s.svg?react";

export default function MobRoomList() {
  const [dummy] = useState([
    { id: 1, name: "팀 1" },
    { id: 2, name: "팀 2" },
    { id: 3, name: "팀 3" },
    { id: 4, name: "팀 4" },
    { id: 5, name: "팀 5" },
    { id: 6, name: "팀 6" },
    { id: 7, name: "팀 7" },
    { id: 8, name: "팀 8" },
    { id: 9, name: "팀 9" },
    { id: 10, name: "팀 10" },
  ]);

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 h-[100px] w-full bg-[#218F00] text-white">
        <div className="mt-[45px] flex h-[44px] w-full items-center px-4">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
            aria-label="뒤로가기"
          >
            <LeftArrow />
          </button>

          <h1 className="flex-1 text-center text-[18px] font-sans whitespace-nowrap">
            나무 수정 요청
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto min-h-0 w-full max-w-[480px] flex-1 overflow-y-auto px-[19px] pt-[28px] pb-[40px] [&::-webkit-scrollbar]:hidden">
        {/* Location */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-[18px]">📍</span>
          <p className="text-[18px] font-sans font-semibold text-gray-900">
            울산광역시 남구 무거동 울산대학교
          </p>
        </div>

        {/* Grid */}
        <section className="grid grid-cols-2 gap-x-5 gap-y-6">
          {dummy.map(({ id, name }) => (
            <RoomCard key={id} name={name} />
          ))}
        </section>
      </main>
    </div>
  );
}

function RoomCard({ name }) {
  return (
    <button
      type="button"
      className="w-full h-[100px] rounded-[28px] bg-gray-100 p-5 active:scale-[0.99]"
    >
      {/* 핵심: flex-row + items-center */}
      <div className="flex h-full w-full items-center justify-between">

        {/* 텍스트 */}
        <span className="text-[18px] font-sans font-semibold text-gray-900">
          {name}
        </span>

        {/* 화살표 */}
        <RightArrowS className="opacity-80" />

      </div>
    </button>
  );
}
