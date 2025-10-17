interface AddTileProps {
  onClick: () => void;
}

export function AddTile({ onClick }: AddTileProps) {
  return (
    <button
      onClick={onClick}
      className="w-20 h-20 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center hover:border-gray-500 hover:bg-gray-800/50 transition-colors duration-200 group"
    >
      <div className="w-8 h-8 rounded-full bg-gray-700 group-hover:bg-gray-600 flex items-center justify-center transition-colors duration-200">
        <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </div>
      <span className="text-xs text-gray-500 group-hover:text-gray-400 mt-1 transition-colors duration-200">
        추가
      </span>
    </button>
  );
}
