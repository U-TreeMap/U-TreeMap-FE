import { useState, useEffect } from 'react';
import SearchIcon from '../../assets/icons/search.svg';

export const SearchBar = ({ initialValue = '', onSearch }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  // 디바운싱
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [inputValue, onSearch]);

  return (
    <div className="mt-2.5 w-full ">
      <div className="flex items-center w-full px-3.5 py-2 rounded-full bg-[#F5F5F8]">
        <img src={SearchIcon} alt="검색" className="text-gray-400 mr-2.5 shrink-0" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="장소, 주소 검색"
          className="flex-1 text-gray-700 bg-transparent focus:outline-none"
        />
      </div>
    </div>
  );
};
