import { useEffect, useEffectEvent, useState } from 'react';

import { useMyGpsStore } from '../../../stores/useGpsStore'

import Phone from '../../../assets/icons/gps/phone.svg?react';
import Stop from '../../../assets/icons/gps/stop.svg?react';


export const GpsSettingModal = ()=>{

  const [isOpen,setIsOpen] = useState(true);
  const [isStart,setIsStart] = useState(false);

  const WAIT_SEC = 10_000;
  const INTERVAL = 1_000;
  const [timeLeft, setTimeLeft] = useState(WAIT_SEC);

  const startWatch = useMyGpsStore((s) => s.startWatch);
  const stopWatch = useMyGpsStore((s) => s.stopWatch);
  const acc = useMyGpsStore((s) => s.location?.accuracy ?? null);
  const status = useMyGpsStore((s) => s.status);
  const error = useMyGpsStore((s) => s.error);

  //gps추척 useEffect
  useEffect(()=>{
    if(!isOpen) return;
    startWatch();
    return ()=> stopWatch();
  }, [isOpen, startWatch, stopWatch])

  
  //타이머 useEffect
  useEffect(()=>{
    //타이머
    const timer = setInterval(()=>{
      setTimeLeft((prevTime) => {
        if(prevTime <= INTERVAL){
          //종료 이벤트 gps 값 넘겨줘야함.
          clearInterval(timer);
          setIsOpen(false);
          setIsStart(false);
          return 0;
        }
        return prevTime - INTERVAL});
    }, INTERVAL)
    //타이머 종료
    return ()=>{ clearInterval(timer)}
  },[isStart])


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      {/* 모달 박스 */}
      <div className="w-[300px] h-[320px] rounded-[35px] bg-white shadow-xl">
        
        {/* 이미지 영역 */}
        {isStart ?<Stop className="mt-[35px] ml-[77px] h-[147px] w-[147px]"></Stop>
        :  <Phone className="mt-[35px] ml-[77px] h-[147px] w-[147px]"></Phone>}
        
        {/* 설명 텍스트 */}
        <div className="mt-[10px] ml-[45px] text-center">
          <div className="w-[210px] h-[19px] font-sans font-medium text-[16px] leading-[1] tracking-[0.001em] text-center">
            기기를 기울이면서 움직여 보세요.
          </div>
        </div>

        {/* 정확도 표시 */}
        <div className="mt-[6px] ml-[119px] w-[63px] h-[16px] rounded-lg bg-gray-100 font-medium text-[13px] leading-[1] tracking-[0.001em] text-center whitespace-nowrap tabular-nums">
          <span className="text-gray-600">정확도: </span>
          {acc != null && acc > 5 ?
          <span className="text-red-600">낮음</span> 
          :<span className="text-green-600">높음</span>}
          
        </div>
          
        {isStart ?(
          <div className="relative mt-[15px] mb-[23px] ml-[15px] h-[49px] w-[270px] h-[49px] overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-green-700 animate-gps-progress" />
          <span className="absolute inset-0 flex items-center justify-center text-[18px] font-sans font-semibold text-white">
            {timeLeft/1000}초 후 완료
          </span>
        </div>
      ):(
      //시작버튼
        <div onClick={()=>{setIsStart(true);setTimeLeft(WAIT_SEC);}} 
          className="relative mt-[15px] mb-[23px] ml-[15px] h-[49px] w-[270px] h-[49px] overflow-hidden rounded-full bg-gray-200">
          <div className="h-full rounded-full bg-green-700" />
          <span className="absolute inset-0 flex items-center justify-center text-[18px] font-sans font-semibold text-white">
            측정시작
          </span>
        </div>) } 
        

        

      </div>
    </div>
  );
}

export default GpsSettingModal;

