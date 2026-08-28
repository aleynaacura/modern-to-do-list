export type Priority = 'low' | 'medium' | 'high';
export type Category = 'health' | 'personal' | 'work' | 'shopping';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  category?: Category;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: number;
  updatedAt: number;
}

export type Filter = 'all' | 'active' | 'completed';

export const CATEGORY_META: Record<Category, { label: string; color: string }> = {
  health: { label: 'Sağlık', color: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  personal: { label: 'Kişisel', color: 'bg-sky-50 text-sky-700 ring-sky-200' },
  work: { label: 'İş', color: 'bg-violet-50 text-violet-700 ring-violet-200' },
  shopping: { label: 'Alışveriş', color: 'bg-orange-50 text-orange-700 ring-orange-200' },
};

export const PRIORITY_META: Record<Priority, { label: string; dot: string; chip: string }> = {
  low: { label: 'Düşük', dot: 'bg-emerald-400', chip: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  medium: { label: 'Orta', dot: 'bg-amber-400', chip: 'bg-amber-50 text-amber-700 ring-amber-200' },
  high: { label: 'Yüksek', dot: 'bg-rose-400', chip: 'bg-rose-50 text-rose-700 ring-rose-200' },
};
