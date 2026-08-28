import { AlertTriangle, Check, Pencil, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { Todo } from '@/types';
import { CATEGORY_META, PRIORITY_META } from '@/types';
import { ConfirmDialog } from '@/components/ConfirmDialog';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, title: string) => void;
}

function isOverdue(due: string | null, completed: boolean) {
  if (!due || completed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(due) < today;
}

function formatDue(due: string) {
  const d = new Date(due);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86_400_000);
  if (diff === 0) return 'Bugün';
  if (diff === 1) return 'Yarın';
  if (diff === -1) return 'Dün';
  if (diff > 1 && diff < 7) return d.toLocaleDateString('tr-TR', { weekday: 'short' });
  return d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const [expanded, setExpanded] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const meta = PRIORITY_META[todo.priority];
  const catMeta = todo.category ? CATEGORY_META[todo.category] : null;
  const overdue = isOverdue(todo.dueDate, todo.completed);
  const hasDescription = !!todo.description;

  function save() {
    const t = draft.trim();
    if (t && t !== todo.title) onEdit(todo.id, t);
    else setDraft(todo.title);
    setEditing(false);
  }

  return (
    <li
      className={`group animate-pop-in rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm transition hover:shadow-soft ${
        todo.completed ? 'opacity-60' : ''
      } ${overdue ? 'border-rose-200 bg-rose-50/40' : ''}`}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => onToggle(todo.id)}
          className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition ${
            todo.completed
              ? 'border-sky-600 bg-sky-600 text-white'
              : 'border-slate-300 hover:border-sky-500'
          }`}
          aria-label={todo.completed ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
        >
          {todo.completed && <Check size={14} strokeWidth={3} className="animate-check" />}
        </button>

        {editing ? (
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') save();
              if (e.key === 'Escape') {
                setDraft(todo.title);
                setEditing(false);
              }
            }}
            onBlur={save}
            className="flex-1 rounded-md border border-sky-300 px-2 py-1 text-[15px] focus:outline-none focus:ring-2 focus:ring-sky-200"
          />
        ) : (
          <button
            onClick={() => hasDescription && setExpanded((e) => !e)}
            className="flex-1 text-left"
          >
            <span
              className={`text-[15px] text-slate-800 ${todo.completed ? 'line-through decoration-slate-400' : ''}`}
            >
              {todo.title}
            </span>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${meta.chip}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              {catMeta && (
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${catMeta.color}`}
                >
                  {catMeta.label}
                </span>
              )}
              {todo.dueDate && (
                <span
                  className={`text-[11px] font-medium ${
                    overdue ? 'text-rose-600' : 'text-slate-400'
                  }`}
                >
                  {overdue ? 'Süresi geçti · ' : ''}
                  {formatDue(todo.dueDate)}
                </span>
              )}
            </div>
          </button>
        )}

        <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
          <button
            onClick={() => setEditing(true)}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Görevi düzenle"
          >
            <Pencil size={15} />
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
            aria-label="Görevi sil"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Görevi sil"
        message={`"${todo.title}" görevini silmek istediğine emin misin? Bu işlem geri alınamaz.`}
        confirmLabel="Evet, sil"
        cancelLabel="Vazgeç"
        onConfirm={() => {
          setConfirmOpen(false);
          onDelete(todo.id);
        }}
        onCancel={() => setConfirmOpen(false)}
      />

      {hasDescription && expanded && (
        <div className="animate-slide-in mt-3 border-t border-slate-100 pt-3 pl-9">
          <p className="whitespace-pre-wrap text-[13px] leading-relaxed text-slate-500">
            {todo.description}
          </p>
        </div>
      )}
    </li>
  );
}

export { X };
