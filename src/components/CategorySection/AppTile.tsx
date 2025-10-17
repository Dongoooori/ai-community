import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Image from 'next/image';
import type { AppItem } from '@/types';

interface AppTileProps {
  item: AppItem;
  onEdit: (item: AppItem) => void;
  onDelete: (item: AppItem) => void;
}

export function AppTile({ item, onEdit, onDelete }: AppTileProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="relative group cursor-grab active:cursor-grabbing"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-20 h-20 bg-gray-800 rounded-xl flex flex-col items-center justify-center hover:bg-gray-700 transition-colors duration-200 border border-gray-700 hover:border-gray-600">
        {item.iconUrl ? (
          <Image
            src={item.iconUrl}
            alt={item.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-lg object-cover"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 아이콘 표시
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg ${item.iconUrl ? 'hidden' : ''}`}>
          {item.name.charAt(0).toUpperCase()}
        </div>
        <span className="text-xs text-gray-300 mt-1 text-center px-1 truncate w-full">
          {item.name}
        </span>
      </div>

      {/* 호버 시 메뉴 표시 */}
      {isHovered && (
        <div className="absolute -top-2 -right-2 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-1 flex gap-1 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="p-1 text-gray-400 hover:text-blue-400 transition-colors"
            title="편집"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item);
            }}
            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
            title="삭제"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
