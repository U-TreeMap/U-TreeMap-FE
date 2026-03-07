import { useMemo, useState } from "react";
import XIcon from "../../assets/icons/x.svg?react";        // 없으면 너 아이콘으로 교체
import SearchIcon from "../../assets/icons/search.svg?react"; // 없으면 너 아이콘으로 교체

export const TreeNameSearchModal = ({ isOpen = true, onClose, onSelect }) => {
  const [q, setQ] = useState("베");
  const [selectedId, setSelectedId] = useState(1);

  // 더미 추천 데이터
  const items = useMemo(
    () => [
      { id: 1, name: "배롱나무" },
      { id: 2, name: "배나무" },
      { id: 3, name: "베롱나무(오타 예시)" },
      { id: 4, name: "벚나무" },
      { id: 5, name: "느티나무" },
    ],
    []
  );

  const filtered = useMemo(() => {
    const keyword = q.trim();
    if (!keyword) return items;
    return items.filter((it) => it.name.includes(keyword));
  }, [q, items]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-6">
      {/* 모달 박스 */}
      <div className="w-full max-w-[360px] rounded-[28px] bg-white shadow-xl">
        {/* Title */}
        <div className="px-6 pt-6">
          <h2 className="text-[18px] font-sans font-semibold text-gray-900">
            나무 이름을 입력해주세요
          </h2>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 rounded-[14px] bg-gray-100 px-4 py-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="나무 이름 검색"
              className="w-full bg-transparent text-[16px] font-sans font-semibold text-gray-900 outline-none placeholder:text-gray-400"
            />

            {/* clear */}
            {q.length > 0 && (
              <button
                type="button"
                onClick={() => setQ("")}
                className="flex h-8 w-8 items-center justify-center rounded-full active:bg-black/5"
                aria-label="지우기"
              >
                {/* 아이콘 없으면 텍스트 X로 대체 가능 */}
                <XIcon className="h-5 w-5 text-gray-500" />
              </button>
            )}

            {/* search */}
            <button
              type="button"
              onClick={() => {
                // 검색 눌렀을 때 동작 (지금은 noop)
                // 필요하면 API 호출 트리거 넣기
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full active:bg-black/5"
              aria-label="검색"
            >
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Recommend List (scroll) */}
        <div className="px-6 pt-4 pb-2">
          <div className="h-[180px] overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden">
            <div className="space-y-3">
              {filtered.map((it) => {
                const active = it.id === selectedId;
                return (
                  <button
                    key={it.id}
                    type="button"
                    onClick={() => setSelectedId(it.id)}
                    className={[
                      "w-full rounded-[18px] px-5 py-4 text-left text-[18px] font-sans font-semibold",
                      active
                        ? "bg-[#218F00] text-white"
                        : "bg-gray-100 text-gray-900",
                    ].join(" ")}
                  >
                    {it.name}
                  </button>
                );
              })}

              {filtered.length === 0 && (
                <div className="py-8 text-center text-sm text-gray-500">
                  검색 결과가 없습니다.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom actions */}
        <div className="flex items-center justify-end gap-4 px-6 pb-5 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="text-[16px] font-sans font-semibold text-gray-500 active:opacity-70"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default TreeNameSearchModal;
