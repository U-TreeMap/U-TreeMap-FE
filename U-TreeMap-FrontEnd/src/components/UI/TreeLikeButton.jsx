import { useState, useEffect } from 'react';
import TreeIcon from '../../assets/icons/tree.svg';
import TreeIconFilled from '../../assets/icons/tree-filled.svg';

export default function TreeLikeButton({ treeId, initialLiked, onToggle }) {
  const [isLiked, setIsLiked] = useState(initialLiked || false);

  useEffect(() => {
    setIsLiked(initialLiked || false);
  }, [initialLiked, treeId]);

  const handleClick = async (e) => {
    e.stopPropagation();

    const newState = !isLiked;
    setIsLiked(newState);

    // 부모에게 변경 알림
    if (onToggle) onToggle(newState);

    try {
      console.log(` ${treeId} Like: ${newState}`);
    } catch (error) {
      console.error('Like failed', error);
      setIsLiked(!newState); // 실패 시 롤백
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center transition-transform cursor-pointer hover:scale-110 active:scale-95"
      aria-label={isLiked ? '좋아요 취소' : '좋아요'}
    >
      <img src={isLiked ? TreeIconFilled : TreeIcon} alt="tree like icon" />
    </button>
  );
}
