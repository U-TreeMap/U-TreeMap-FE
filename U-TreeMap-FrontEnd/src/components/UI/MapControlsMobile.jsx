// src/components/map/MapControlsMobile.jsx
import plus from "../../assets/icons/map/plus.svg";
import minus from "../../assets/icons/map/minus.svg";
import target from "../../assets/icons/map/target.svg";

import { zoomIn, zoomOut } from "../../features/map/controlZoom";
import { showMyLocationOnce } from "../../features/map/locateMe";

export default function MapControlsMobile({ map }) {
  if (!map) return null;

  // ✅ 모바일 통일: 버튼 48x48
  const BTN_SIZE = "w-[48px] h-[48px]";
  const ROUND = "rounded-[24px]";

  // ✅ 버튼 공통: "버튼 느낌" + 터치 UX
  const btnBase =
    "flex items-center justify-center select-none cursor-pointer " +
    "transition active:scale-[0.97]";

  // ✅ 배경/그림자(피그마 값 기반)
  const surface =
    "bg-white shadow-[1.167px_1.167px_4.083px_0_rgba(0,0,0,0.25)]";

  // ✅ 눌림/호버(모바일에서도 active는 잘 먹음)
  const feedback =
    "active:bg-black/5 hover:bg-black/5"; // 데스크탑에서도 자연스러운 정도

  return (
    <div className="absolute bottom-[50px] right-4 z-10 flex flex-col gap-[10px]">
      {/* 🔍 줌 컨트롤: 한 덩어리로 붙이기 */}
      <div
        className={`flex flex-col overflow-hidden ${ROUND} ${surface}`}
        // overflow-hidden + rounded로 "한 덩어리" 느낌 만들기
      >
        {/* ➖ Zoom Out */}
        <button
          type="button"
          onClick={() => zoomOut(map)}
          className={`${BTN_SIZE} ${btnBase} ${feedback}`}
          aria-label="Zoom out"
        >
          <img
            src={minus}
            alt=""
            className="w-[48px] h-[48px] pointer-events-none"
          />
        </button>

        {/* 가운데 구분선(선택) */}
        <div className="h-[1px] w-full bg-black/10" />

        {/* ➕ Zoom In */}
        <button
          type="button"
          onClick={() => zoomIn(map)}
          className={`${BTN_SIZE} ${btnBase} ${feedback}`}
          aria-label="Zoom in"
        >
          <img
            src={plus}
            alt=""
            className="w-[48px] h-[48px] pointer-events-none"
          />
        </button>
      </div>

      {/* 📍 내 위치 버튼 */}
      <button
        type="button"
        onClick={() => showMyLocationOnce(map)}
        className={`${BTN_SIZE} ${ROUND} ${btnBase} ${surface} ${feedback}`}
        aria-label="Locate me"
      >
        <img
          src={target}
          alt=""
          className="w-[24px] h-[24px] pointer-events-none"
        />
      </button>
    </div>
  );
}
