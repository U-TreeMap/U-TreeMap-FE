import plus from "../../assets/icons/map/plus.svg";
import minus from "../../assets/icons/map/minus.svg";
import target from "../../assets/icons/map/target.svg";

import { zoomIn, zoomOut } from "../../features/map/controlZoom";
import { showMyLocationOnce } from "../../features/map/locateMe";

export default function MapControls({ map }) {
  if (!map) return null;


  // 🔘 공통 버튼 스타일
  const buttonBase =
    "relative flex items-center justify-center cursor-pointer select-none " +
    "transition-all duration-150 ease-out " +
    "hover:scale-[1.05] active:scale-[0.95] active:translate-y-[1px]";

  const shadowNormal =
    "shadow-[1.167px_1.167px_4.083px_0_rgba(0,0,0,0.25)]";
  const shadowHover =
    "hover:shadow-[2px_2px_6px_rgba(0,0,0,0.3)] active:shadow-[1px_1px_3px_rgba(0,0,0,0.25)]";

  const isMobile = true;
  
  const mobileZoomBox = "w-[48px] h-[96px] flex flex-col";
  const desktopZoomBox = "w-[28px] h-[56px] flex flex-col";
  const mobile_mod =  "w-[48px] h-[48px]";
  const desktop_mod = "w-[28px] h-[28px]";
  const mobile_rocate = "w-[48px] h-[48px] p-[12px] rounded-[24px]"
  const desktop_rocate = "w-[28px] h-[28px] p-[7px] rounded-[14px]"

  return (
    <div className="absolute bottom-7 right-4 z-10 flex flex-col gap-[10px]">

      {/* 📍 내 위치 버튼 */}
      <div
        onClick={() => showMyLocationOnce(map)}
        className={`${buttonBase} ${isMobile ? mobile_rocate : desktop_rocate } bg-white ${shadowNormal} ${shadowHover}`}
      >
        <img
          src={target}
          className={`${isMobile ? mobile_mod : desktop_mod} pointer-events-none`}
        />
      </div>

      {/* 🔍 줌 버튼 박스 */}
      <div className={isMobile ? mobileZoomBox : desktopZoomBox}>

        {/* ➖ Zoom Out */}
        <div
          onClick={() => zoomOut(map)}
          className={`${buttonBase} ${isMobile ? mobile_mod : desktop_mod}`}
        >
          <img
            src={minus}
            className={`${isMobile ? mobile_mod : desktop_mod} pointer-events-none [filter:drop-shadow(2px_2px_6px_rgba(0,0,0,0.25))]`}
          />
        </div>

        {/* ➕ Zoom In */}
        <div
          onClick={() => zoomIn(map)}
          className={`${buttonBase} ${isMobile ? mobile_mod : desktop_mod}`}
        >
          <img
            src={plus}
            className={`${isMobile ? mobile_mod : desktop_mod} pointer-events-none [filter:drop-shadow(2px_2px_6px_rgba(0,0,0,0.25))]`}
          />
        </div>
      </div>

    </div>
  );
}
