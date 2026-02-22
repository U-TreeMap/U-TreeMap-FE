import React from "react";
import LeftArrow from "../../assets/icons/white_left_arrow.svg?react";
import RightArrowS from "../../assets/icons/right_arrow_s.svg?react";

// 아이콘 예시 (svg로 대체 가능)

import Pencil from "../../assets/icons/pencil.svg?react";
import FileText from "../../assets/icons/page.svg?react";
import Locate from "../../assets/icons/locate.svg?react";

export default function MobVolunteerPage() {
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

          <h1 className="flex-1 text-center text-[18px] font-sans font-semibold whitespace-nowrap">
            자원봉사자 페이지
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto min-h-0 w-full max-w-[480px] flex-1 overflow-y-auto px-[19px] pt-[24px] pb-[40px] [&::-webkit-scrollbar]:hidden">
        {/* Greeting */}
        <section className="space-y-2">
          <p className="text-[18px] font-sans font-semibold text-gray-900">
            안녕하세요.
            <br />
            자원봉사자 페이지 입니다.
          </p>

          {/* Location */}
          <div className="flex items-center gap-2">
            <Locate className="h-5 w-5 text-gray-500" />
            <span className="text-[16px] font-sans font-semibold text-[#218F00] underline underline-offset-4">
              울산광역시 남구 무거동 울산대학교
            </span>
          </div>
        </section>

        {/* Description + Date */}
        <section className="mt-6">
          <p className="text-[18px] font-sans font-semibold text-gray-900">
            무슨무슨방
            <br />
            나무 데이터를 측정해주시면 됩니다.
          </p>

          <div className="mt-3 flex justify-end">
            <span className="text-[14px] font-sans font-semibold text-gray-400">
              2026.01.19
            </span>
          </div>
        </section>

        {/* Actions */}
        <section className="mt-8 space-y-4">
          <ActionRow
            icon={<Pencil className="h-5 w-5 text-gray-600" />}
            label="나무 데이터 측정하기"
          />
          <ActionRow
            icon={<FileText className="h-5 w-5 text-gray-600" />}
            label="튜토리얼 페이지"
          />
        </section>
      </main>
    </div>
  );
}

function ActionRow({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[56px] w-full items-center justify-between rounded-2xl bg-gray-100 px-5 active:opacity-90"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white">
          {icon}
        </div>
        <span className="text-[16px] font-sans font-semibold text-gray-900">
          {label}
        </span>
      </div>

      <RightArrowS className="opacity-70" />
    </button>
  );
}
