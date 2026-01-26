import { useState } from 'react';
import { Drawer } from 'vaul';
import TreeDetailContent from './UI/TreeDetailContent';
import TreeIcon from '../assets/icons/tree.svg';
import ArrowL from '../assets/icons/left_arrow.svg';
import TreeLikeButton from './UI/TreeLikeButton';
export default function MobileBottomSheet({ selectedTree }) {
  const [snap, setSnap] = useState('130px');

  const isExpanded = snap === 1;

  if (!selectedTree) return null;

  return (
    <Drawer.Root
      open={!!selectedTree}
      snapPoints={['130px', 1]}
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      modal={false}
      // (최소 높이 유지)
      dismissible={false}
    >
      <Drawer.Portal>
        <Drawer.Content
          className="
            fixed bottom-0 left-0 right-0 z-50 
            flex flex-col 
            bg-white 
            rounded-t-3xl 
            shadow-[0_-4px_20px_rgba(0,0,0,0.15)] 
            outline-none 
            h-full 
          "
        >
          <Drawer.Title className="sr-only">나무 상세 정보</Drawer.Title>

          {/* === 헤더 영역 === */}
          <div className="flex-none w-full bg-white rounded-t-3xl">
            {isExpanded ? (
              /* (헤더 모드) */
              <div className="flex items-center justify-between px-4 h-11 ">
                <button onClick={() => setSnap('130px')} className="">
                  <img src={ArrowL} alt="Back" />
                </button>
                <TreeLikeButton treeId={selectedTree.id} initialLiked={selectedTree.isLiked} />
              </div>
            ) : (
              /* (핸들바 모드) */
              <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
                <div className="w-10 h-1 bg-gray-300 rounded-full" />
              </div>
            )}
          </div>

          {/* === 컨텐츠 영역 === */}
          <div className="flex-1 w-full pb-10 pl-4 pr-2.5 overflow-y-auto bg-white">
            <TreeDetailContent selectedTree={selectedTree} hideLikeButton={true} />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
