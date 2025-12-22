// 흉고직경, 수고, 수관폭, 지하고 스펙박스

export const SpecBox = ({ label, value }) => (
  <div className="w-full h-[75px] flex flex-col px-[33px] py-[11px] justify-center items-center gap-2.5 bg-[#F5F5F5] rounded-lg">
    <p className="text-[16px] font-medium">{label}</p>
    <p className="text-[14px] font-medium text-[#218F00]">{value}</p>
  </div>
);
