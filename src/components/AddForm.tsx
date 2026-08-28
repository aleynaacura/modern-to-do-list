import { useEffect, useRef, useState } from 'react';
import { CalendarDays, Check, Flag, Plus, Tag, X } from 'lucide-react';
import type { Category, Priority } from '@/types';
import { CATEGORY_META, PRIORITY_META } from '@/types';

interface AddFormProps {
  onAdd: (title: string, description: string, category: Category, priority: Priority, dueDate: string | null) => void;
}

const CATEGORIES = Object.keys(CATEGORY_META) as Category[];
const PRIORITIES = Object.keys(PRIORITY_META) as Priority[];

export function AddForm({ onAdd }: AddFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Category>('personal');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) titleRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
    setTitle('');
    setDescription('');
    setCategory('personal');
    setPriority('medium');
    setDueDate('');
  }

  function submit() {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onAdd(trimmedTitle, description.trim(), category, priority, dueDate || null);
    close();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/15 transition hover:bg-sky-700"
      >
        <Plus size={17} strokeWidth={2.5} /> Yeni görev ekle
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/40 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => { if (e.target === e.currentTarget) close(); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="new-task-title" className="animate-pop-in max-h-[92vh] w-full overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:max-w-lg sm:rounded-3xl sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">Yeni görev</p>
                <h2 id="new-task-title" className="mt-1 text-xl font-bold tracking-tight text-slate-900">Ne yapmak istiyorsun?</h2>
              </div>
              <button onClick={close} className="grid h-9 w-9 place-items-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700" aria-label="Pencereyi kapat"><X size={19} /></button>
            </div>

            <div className="mt-6 space-y-5">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Görev adı <span className="text-rose-500">*</span></span>
                <input ref={titleRef} value={title} onChange={(e) => setTitle(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') submit(); }} placeholder="Örn. Sunumu hazırla" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-slate-700">Açıklama <span className="font-normal text-slate-400">(isteğe bağlı)</span></span>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Görevle ilgili kısa bir not ekle…" rows={3} className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100" />
              </label>

              <div>
                <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700"><Tag size={15} className="text-slate-400" /> Kategori</span>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {CATEGORIES.map((item) => (
                    <button key={item} onClick={() => setCategory(item)} className={`rounded-xl px-3 py-2.5 text-sm font-medium ring-1 transition ${category === item ? `${CATEGORY_META[item].color} ring-2 ring-sky-400` : 'bg-slate-50 text-slate-500 ring-slate-200 hover:bg-slate-100'}`}>
                      {CATEGORY_META[item].label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700"><Flag size={15} className="text-slate-400" /> Öncelik</span>
                  <div className="flex rounded-xl bg-slate-100 p-1">
                    {PRIORITIES.map((item) => <button key={item} onClick={() => setPriority(item)} className={`flex-1 rounded-lg py-2 text-xs font-semibold transition ${priority === item ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{PRIORITY_META[item].label}</button>)}
                  </div>
                </div>
                <label>
                  <span className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700"><CalendarDays size={15} className="text-slate-400" /> Bitiş tarihi</span>
                  <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-4 focus:ring-sky-100" />
                </label>
              </div>
            </div>

            <div className="mt-7 flex gap-3 border-t border-slate-100 pt-5">
              <button onClick={close} className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50">Vazgeç</button>
              <button onClick={submit} disabled={!title.trim()} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"><Check size={16} /> Görevi ekle</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
