export type CategoryId = string;

export interface AppItem {
  id: string;
  name: string;
  url: string;
  iconUrl?: string;
  order: number;
  createdAt: string;
}

export interface Category {
  id: CategoryId;
  title: string;
  order: number;
  items: AppItem[];
  createdAt: string;
}

export interface AddItemFormData {
  name: string;
  url: string;
  iconUrl?: string;
}
