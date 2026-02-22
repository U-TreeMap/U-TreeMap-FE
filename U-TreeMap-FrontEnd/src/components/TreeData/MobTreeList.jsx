import React,{useState} from "react";
import LeftArrow from "../../assets/icons/white_left_arrow.svg?react";
import RightArrowS from "../../assets/icons/right_arrow_s.svg?react";

export default function MobTreeList() {

    const [dummy,setDummy] = useState([
        {id: 1, name:"은행나무 132643"},
        {id: 2, name:"은행나무 195739"},
        {id: 3, name:"은행나무 847593"},
        {id: 4, name:"은행나무 470293"},
        {id: 5, name:"은행나무 908673"},
        {id: 6, name:"은행나무 364785"},
        {id: 7, name:"은행나무 298364"},
        {id: 8, name:"은행나무 987234"},
        {id: 9, name:"은행나무 485823"},
        {id: 10, name:"은행나무 872643"},
    ])

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
            나무 데이터 측정
          </h1>

          <div className="h-10 w-10" />
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto min-h-0 w-full max-w-[480px] flex-1 overflow-y-auto px-[19px] pt-[40px] pb-[120px] [&::-webkit-scrollbar]:hidden">

        {/* Locate : 방제목 표시 , 팀이름 표시*/}
        <div className="locate">방제목, 팀이름 같은거, 혹은 위치</div>
        {/* Section: 나무 정보 */}
        <section className="mt-8 space-y-4">
          {dummy.map(({id,name}, index)=>(<LabeledNumberInput index={index} id={id} name={name}/>))}
        </section>
      </main>

    </div>
  );
}


function LabeledNumberInput({ index, id, name }) {
  return (
    <div className="space-y-2">
      <div className="relative ">
        <div className="flex h-14 w-full items-center justify-between rounded-2xl bg-gray-100 px-5 pl-[15px] pr-[15px] text-base font-sans text-gray-900 outline-none">
            <span>{name}</span>
            <RightArrowS/>
        </div>
        
      </div>
    </div>
  );
}