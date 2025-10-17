import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { Category, AppItem, CategoryId, AddItemFormData } from '@/types';
import { AppTile } from './AppTile';
import { AddTile } from './AddTile';
import { AddItemModal } from './AddItemModal';
import { EditItemModal } from './EditItemModal';
import { DeleteConfirmModal } from './DeleteConfirmModal';
import { EditCategoryModal } from './EditCategoryModal';

interface CategorySectionProps {
  category: Category;
  onAddItem: (categoryId: CategoryId, item: AddItemFormData) => void;
  onUpdateItem: (categoryId: CategoryId, itemId: string, updates: Partial<AppItem>) => void;
  onDeleteItem: (categoryId: CategoryId, itemId: string) => void;
  onReorderItems: (categoryId: CategoryId, fromIndex: number, toIndex: number) => void;
  onUpdateCategory?: (categoryId: CategoryId, title: string) => void;
  onDeleteCategory?: (categoryId: CategoryId) => void;
}

export default function CategorySection({
  category,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onReorderItems,
  onUpdateCategory,
  onDeleteCategory
}: CategorySectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditItemModalOpen, setIsEditItemModalOpen] = useState(false);
  const [isDeleteItemModalOpen, setIsDeleteItemModalOpen] = useState(false);
  const [isEditCategoryModalOpen, setIsEditCategoryModalOpen] = useState(false);
  const [isDeleteCategoryModalOpen, setIsDeleteCategoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AppItem | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddItem = async (categoryId: CategoryId, item: AddItemFormData) => {
    await onAddItem(categoryId, item);
    setIsModalOpen(false);
  };

  const handleEditItem = (item: AppItem) => {
    setSelectedItem(item);
    setIsEditItemModalOpen(true);
  };


  const handleDeleteItem = (item: AppItem) => {
    setSelectedItem(item);
    setIsDeleteItemModalOpen(true);
  };

  const handleSaveItem = async (updates: Partial<AppItem>) => {
    if (selectedItem) {
      await onUpdateItem(category.id, selectedItem.id, updates);
    }
  };

  const handleConfirmDeleteItem = async () => {
    if (selectedItem) {
      await onDeleteItem(category.id, selectedItem.id);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = category.items.findIndex(item => item.id === active.id);
      const newIndex = category.items.findIndex(item => item.id === over.id);
      
      onReorderItems(category.id, oldIndex, newIndex);
    }
  };

  const handleEditCategory = () => {
    setIsEditCategoryModalOpen(true);
  };

  const handleDeleteCategory = () => {
    setIsDeleteCategoryModalOpen(true);
  };

  const handleSaveCategory = async (title: string) => {
    if (onUpdateCategory) {
      await onUpdateCategory(category.id, title);
    }
  };

  const handleConfirmDeleteCategory = async () => {
    if (onDeleteCategory) {
      await onDeleteCategory(category.id);
    }
  };

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-100">{category.title}</h2>
        {(onUpdateCategory || onDeleteCategory) && (
          <div className="flex items-center gap-2">
            {onUpdateCategory && (
              <button
                onClick={handleEditCategory}
                className="p-1 text-gray-400 hover:text-gray-200 transition-colors"
                aria-label="카테고리 이름 변경"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDeleteCategory && (
              <button
                onClick={handleDeleteCategory}
                className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                aria-label="카테고리 삭제"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        )}
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={category.items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex flex-wrap gap-4 md:gap-6">
            {category.items.map((item) => (
              <AppTile
                key={item.id}
                item={item}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
              />
            ))}
            
            <AddTile onClick={() => setIsModalOpen(true)} />
          </div>
        </SortableContext>
      </DndContext>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
        categoryId={category.id}
        categoryTitle={category.title}
      />

      <EditItemModal
        isOpen={isEditItemModalOpen}
        onClose={() => {
          setIsEditItemModalOpen(false);
          setSelectedItem(null);
        }}
        onSave={handleSaveItem}
        item={selectedItem!}
      />

      <DeleteConfirmModal
        isOpen={isDeleteItemModalOpen}
        onClose={() => {
          setIsDeleteItemModalOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmDeleteItem}
        title="앱 삭제"
        message="이 앱을 삭제하시겠습니까?"
        itemName={selectedItem?.name || ''}
      />

      <EditCategoryModal
        isOpen={isEditCategoryModalOpen}
        onClose={() => setIsEditCategoryModalOpen(false)}
        onSave={handleSaveCategory}
        currentTitle={category.title}
      />

      <DeleteConfirmModal
        isOpen={isDeleteCategoryModalOpen}
        onClose={() => setIsDeleteCategoryModalOpen(false)}
        onConfirm={handleConfirmDeleteCategory}
        title="카테고리 삭제"
        message="이 카테고리와 모든 항목을 삭제하시겠습니까?"
        itemName={category.title}
      />
    </section>
  );
}