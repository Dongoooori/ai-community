import { useState, useEffect, useCallback } from 'react';
import type { Category, AppItem, CategoryId, AddItemFormData } from '@/types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // 카테고리 목록 가져오기
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const data = await response.json();
      setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const addItem = useCallback(async (categoryId: CategoryId, item: AddItemFormData) => {
    const response = await fetch(`/api/categories/${categoryId}/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add item');
    }

    const data = await response.json();
    await fetchCategories(); // 카테고리 목록 새로고침
    return data.item;
  }, [fetchCategories]);

  const updateItem = useCallback(async (categoryId: CategoryId, itemId: string, updates: Partial<AppItem>) => {
    const response = await fetch(`/api/categories/${categoryId}/items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update item');
    }

    const data = await response.json();
    await fetchCategories(); // 카테고리 목록 새로고침
    return data.item;
  }, [fetchCategories]);

  const deleteItem = useCallback(async (categoryId: CategoryId, itemId: string) => {
    const response = await fetch(`/api/categories/${categoryId}/items/${itemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete item');
    }

    await fetchCategories(); // 카테고리 목록 새로고침
  }, [fetchCategories]);

  const reorderItems = useCallback(async (categoryId: CategoryId, fromIndex: number, toIndex: number) => {
    const response = await fetch(`/api/categories/${categoryId}/items/reorder`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fromIndex, toIndex }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to reorder items');
    }

    await fetchCategories(); // 카테고리 목록 새로고침
  }, [fetchCategories]);

  const addCategory = useCallback(async (title: string) => {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to add category');
    }

    const data = await response.json();
    await fetchCategories(); // 카테고리 목록 새로고침
    return data.category;
  }, [fetchCategories]);

  const updateCategory = useCallback(async (categoryId: CategoryId, title: string) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to update category');
    }

    const data = await response.json();
    await fetchCategories(); // 카테고리 목록 새로고침
    return data.category;
  }, [fetchCategories]);

  const deleteCategory = useCallback(async (categoryId: CategoryId) => {
    const response = await fetch(`/api/categories/${categoryId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to delete category');
    }

    await fetchCategories(); // 카테고리 목록 새로고침
  }, [fetchCategories]);

  return {
    categories,
    loading,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
