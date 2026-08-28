import { useMemo, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { Category, Filter, Priority, Todo } from '@/types';
import { AddForm } from '@/components/AddForm';
import { Filters } from '@/components/Filters';
import { Header } from '@/components/Header';
import { Progress } from '@/components/Progress';
import { TodoItem } from '@/components/TodoItem';

const STORAGE_KEY = 'tasky.todos.v1';

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2, 10);
}

export function TodoApp() {
  const [todos, setTodos] = useLocalStorage<Todo[]>(STORAGE_KEY, []);
  const [filter, setFilter] = useState<Filter>('all');
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all');
  const [query, setQuery] = useState('');

  function add(title: string, description: string, category: Category, priority: Priority, dueDate: string | null) {
    const now = Date.now();
    const todo: Todo = {
      id: uid(),
      title,
      description: description || undefined,
      category,
      completed: false,
      priority,
      dueDate,
      createdAt: now,
      updatedAt: now,
    };
    setTodos((prev) => [todo, ...prev]);
  }

  function toggle(id: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed, updatedAt: Date.now() } : t)),
    );
  }

  function remove(id: string) {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }

  function edit(id: string, title: string) {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, title, updatedAt: Date.now() } : t)),
    );
  }

  function clearCompleted() {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }

  const counts = useMemo(
    () => ({
      all: todos.length,
      active: todos.filter((t) => !t.completed).length,
      completed: todos.filter((t) => t.completed).length,
    }),
    [todos],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return todos
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) => (categoryFilter === 'all' ? true : t.category === categoryFilter))
      .filter((t) => {
        if (!q) return true;
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description?.toLowerCase().includes(q) ?? false)
        );
      })
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        const order: Record<Priority, number> = { high: 0, medium: 1, low: 2 };
        if (order[a.priority] !== order[b.priority]) return order[a.priority] - order[b.priority];
        return b.createdAt - a.createdAt;
      });
  }, [todos, filter, categoryFilter, query]);

  const done = counts.completed;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-sky-50/40">
      <div className="mx-auto w-full max-w-2xl px-4 py-8 sm:py-12">
        <Header />

        <div className="mt-6 space-y-4">
          <Progress total={counts.all} done={done} />
          <AddForm onAdd={add} />

          <Filters
            filter={filter}
            setFilter={setFilter}
            query={query}
            setQuery={setQuery}
            counts={counts}
          />
          {counts.all > 0 && (
            <CategoryFilter
              value={categoryFilter}
              onChange={setCategoryFilter}
              todos={todos}
            />
          )}

          {visible.length > 0 ? (
            <ul className="space-y-2">
              {visible.map((t) => (
                <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={remove} onEdit={edit} />
              ))}
            </ul>
          ) : (
            <EmptyState hasTodos={counts.all > 0} filter={filter} query={query} />
          )}

          {counts.completed > 0 && (
            <div className="flex justify-end pt-1">
              <button
                onClick={clearCompleted}
                className="text-xs font-medium text-slate-400 transition hover:text-rose-500"
              >
                Tamamlananları temizle ({counts.completed})
              </button>
            </div>
          )}
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Tarayıcında yerel olarak saklanır · Hesap gerekmez
        </footer>
      </div>
    </div>
  );
}

import { CATEGORY_META } from '@/types';
import type { Category as CatType } from '@/types';

function CategoryFilter({
  value,
  onChange,
  todos,
}: {
  value: Category | 'all';
  onChange: (c: Category | 'all') => void;
  todos: Todo[];
}) {
  const cats = Object.keys(CATEGORY_META) as CatType[];
  const countFor = (c: Category | 'all') =>
    c === 'all' ? todos.length : todos.filter((t) => t.category === c).length;

  return (
    <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
      <button
        onClick={() => onChange('all')}
        className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
          value === 'all'
            ? 'bg-slate-800 text-white ring-slate-800'
            : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'
        }`}
      >
        Tüm kategoriler · {countFor('all')}
      </button>
      {cats.map((c) => (
        <button
          key={c}
          onClick={() => onChange(c)}
          className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition ${
            value === c
              ? `${CATEGORY_META[c].color} ring-2 ring-sky-400`
              : 'bg-white text-slate-500 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {CATEGORY_META[c].label} · {countFor(c)}
        </button>
      ))}
    </div>
  );
}

function EmptyState({
  hasTodos,
  filter,
  query,
}: {
  hasTodos: boolean;
  filter: Filter;
  query: string;
}) {
  let title = 'Henüz görev yok';
  let subtitle = 'Başlamak için yukarıdan ilk görevini ekle.';

  if (hasTodos) {
    if (query) {
      title = 'Sonuç yok';
      subtitle = `"${query}" ile eşleşen görev bulunamadı.`;
    } else if (filter === 'active') {
      title = 'Hepsi tamam';
      subtitle = 'Bekleyen görevin yok.';
    } else if (filter === 'completed') {
      title = 'Henüz tamamlanan yok';
      subtitle = 'Tamamlanan bir görev burada görünecek.';
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white/60 px-6 py-12 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-slate-100 text-slate-400">
        <ClipboardList size={26} />
      </div>
      <p className="mt-4 text-base font-semibold text-slate-700">{title}</p>
      <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
    </div>
  );
}
