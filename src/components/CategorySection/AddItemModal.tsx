import { useState } from 'react';
import type { CategoryId, AddItemFormData } from '@/types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (categoryId: CategoryId, item: AddItemFormData) => Promise<void>;
  categoryId: CategoryId;
  categoryTitle: string;
}

export function AddItemModal({ isOpen, onClose, onAdd, categoryId, categoryTitle }: AddItemModalProps) {
  const [formData, setFormData] = useState<AddItemFormData>({
    name: '',
    url: '',
    iconUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.url.trim()) {
      alert('이름과 URL을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(categoryId, {
        name: formData.name.trim(),
        url: formData.url.trim(),
        iconUrl: formData.iconUrl.trim() || undefined,
      });
      
      // 폼 리셋
      setFormData({
        name: '',
        url: '',
        iconUrl: '',
      });
    } catch (error) {
      // 에러는 상위 컴포넌트에서 처리
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: '',
        url: '',
        iconUrl: '',
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {categoryTitle}에 앱 추가
          </h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              앱 이름 *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="예: ChatGPT"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
              URL *
            </label>
            <input
              type="url"
              id="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://chat.openai.com"
              disabled={isSubmitting}
              required
            />
          </div>

          <div>
            <label htmlFor="iconUrl" className="block text-sm font-medium text-gray-300 mb-2">
              아이콘 URL (선택사항)
            </label>
            <input
              type="url"
              id="iconUrl"
              value={formData.iconUrl}
              onChange={(e) => setFormData(prev => ({ ...prev, iconUrl: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com/icon.png"
              disabled={isSubmitting}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '추가 중...' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
