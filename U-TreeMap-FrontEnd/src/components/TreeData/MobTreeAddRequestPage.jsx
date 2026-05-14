import { useNavigate } from "react-router-dom";
import LeftArrow from "../../assets/icons/white_left_arrow.svg?react";
import RightArrowS from "../../assets/icons/right_arrow_s.svg?react";

export default function MobTreeAddRequestPageMobile() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full flex-col bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 h-[100px] w-full bg-[#218F00] text-white">
        <div className="mt-[45px] flex h-[44px] w-full items-center px-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full active:bg-white/10"
            aria-label="뒤로가기"
          >
            <LeftArrow />
          </button>

          <h1 className="flex-1 text-center text-[18px] font-sans whitespace-nowrap">
            나무 데이터 측정
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto min-h-0 w-full max-w-[480px] flex-1 overflow-y-auto px-[19px] pt-[40px] pb-[120px] [&::-webkit-scrollbar]:hidden">        {/* Section: 좌표 */}
        <section className="space-y-3">
          <h2 className="text-xl font-sans font-semibold tracking-tight text-gray-900">
            좌표 등록을 해주세요
          </h2>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-gray-100 px-5 py-4 text-left"
          >
            <span className="text-base font-sans text-gray-900">
              (35.5383603, 129.2555418)
            </span>
            <RightArrowS />
          </button>

          <div className="overflow-hidden rounded-2xl bg-gray-100">
            <div className="relative aspect-[16/9] w-full">
              <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                Map 영역
              </div>
              <div className="absolute right-[18%] top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-green-700 shadow-md" />
            </div>
          </div>
        </section>

        {/* Section: 나무 이름 */}
        <section className="mt-8 space-y-3">
          <h2 className="text-xl font-sans font-semibold tracking-tight text-gray-900">
            나무 이름을 입력해주세요
          </h2>

          <button
            type="button"
            className="flex w-full items-center justify-between rounded-2xl bg-gray-100 px-5 py-4 text-left"
          >
            <span className="text-base font-sans text-gray-900">느티나무</span>
            <RightArrowS />
          </button>
        </section>

        {/* Section: 나무 정보 */}
        <section className="mt-8 space-y-4">
          <h2 className="text-xl font-sans font-semibold tracking-tight text-gray-900">
            나무 정보를 입력해주세요
          </h2>

          <LabeledNumberInput label="흉고직경" value="10" unit="cm" />
          <LabeledNumberInput label="수고" value="420" unit="cm" />
          <LabeledNumberInput label="수관폭" value="200" unit="cm" />
          <LabeledNumberInput label="지하고" value="80" unit="cm" />
        </section>
      </main>

      {/* Bottom CTA */}
      <div className="fixed inset-x-0 bottom-0 z-50 w-full bg-white">
        <div className="mx-auto w-full max-w-[480px] px-4 pb-5 pt-4">
          <button
            type="button"
            className="h-14 w-full rounded-full bg-green-700 text-lg font-sans text-white active:opacity-90"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
}

function LabeledNumberInput({ label, value, unit }) {
  return (
    <div className="space-y-2">
      <div className="text-sm font-sans font-semibold text-gray-500">{label}</div>

      <div className="relative">
        <input
          type="number"
          defaultValue={value}
          className="h-14 w-full rounded-2xl bg-gray-100 px-5 pr-14 text-base font-sans text-gray-900 outline-none"
        />
        <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-400">
          {unit}
        </span>
      </div>
    </div>
  );
}
