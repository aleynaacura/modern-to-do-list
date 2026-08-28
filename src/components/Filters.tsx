import { Search, X } from 'lucide-react';
import type { Filter } from '@/types';

interface FiltersProps {
  filter: Filter;
  setFilter: (f: Filter) => void;
  query: string;
  setQuery: (q: string) => void;
  counts: Record<Filter, number>;
}

const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tümü' },
  { key: 'active', label: 'Aktif' },
  { key: 'completed', label: 'Tamamlamalar' },
];

export function Filters({ filter, setFilter, query, setQuery, counts }: FiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex rounded-xl bg-slate-100 p-1">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              filter === f.key
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {f.label}
            <span
              className={`rounded-full px-1.5 text-[11px] tabular-nums ${
                filter === f.key ? 'bg-sky-100 text-sky-700' : 'bg-slate-200 text-slate-500'
              }`}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      <div className="relative flex-1 sm:max-w-xs">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Görev ara…"
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm text-slate-700 placeholder:text-slate-400 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-100"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            aria-label="Aramayı temizle"
          >
            <X size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
