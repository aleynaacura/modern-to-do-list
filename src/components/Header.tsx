import { ClipboardList, Sparkles } from 'lucide-react';

export function Header() {
  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-sky-600 text-white shadow-lg shadow-sky-600/20">
          <ClipboardList size={20} strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Yapılacaklar Listesi</h1>
          <p className="text-xs text-slate-400">{today}</p>
        </div>
      </div>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
        <Sparkles size={14} className="text-sky-500" />
        Düzenli kal, her seferinde bir görev.
      </p>
    </header>
  );
}
