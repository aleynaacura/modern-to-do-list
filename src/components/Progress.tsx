import { CheckCircle2, ListTodo } from 'lucide-react';

interface ProgressProps {
  total: number;
  done: number;
}

export function Progress({ total, done }: ProgressProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  const allDone = total > 0 && done === total;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`grid h-9 w-9 place-items-center rounded-xl ${
              allDone ? 'bg-emerald-50 text-emerald-600' : 'bg-sky-50 text-sky-600'
            }`}
          >
            {allDone ? <CheckCircle2 size={18} /> : <ListTodo size={18} />}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">
              {total === 0
                ? 'Henüz görev yok'
                : allDone
                  ? 'Hepsi tamam. Harika!'
                  : `${done} / ${total} tamamlandı`}
            </p>
            <p className="text-xs text-slate-400">
              {total === 0 ? 'Aşağıdan ilk görevini ekle' : `%${pct} ilerleme`}
            </p>
          </div>
        </div>
        <span className="text-2xl font-semibold tabular-nums text-slate-700">
          %{pct}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ease-out ${
            allDone ? 'bg-emerald-500' : 'bg-sky-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
