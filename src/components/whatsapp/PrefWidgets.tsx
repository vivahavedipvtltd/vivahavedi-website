'use client';

import { useMemo, useState } from 'react';
import { Search, X } from 'lucide-react';

export interface Item { id: number; name: string; masterId?: number }
export interface Masters { religion: Item[]; caste: Item[]; state: Item[]; district: Item[]; qualification_level: Item[]; marital_status: Item[] }

export const ids = (v: unknown): number[] =>
  typeof v === 'string' ? v.split('|').map(x => parseInt(x.trim(), 10)).filter(n => Number.isFinite(n) && n > 0) : [];

const SHOW_LIMIT = 40;

/** Tap-to-select chips. Short lists show everything; long lists show matches as you type. */
export function ChipPicker({ label, hint, options, selected, onToggle, searchable, empty }: {
  label: string; hint?: string; options: Item[]; selected: number[]; onToggle: (id: number) => void; searchable?: boolean; empty?: string;
}) {
  const [q, setQ] = useState('');
  const byId = useMemo(() => new Map(options.map(o => [o.id, o])), [options]);
  const chosen = selected.map(id => byId.get(id)).filter(Boolean) as Item[];

  const matches = useMemo(() => {
    const term = q.trim().toLowerCase();
    const pool = options.filter(o => !selected.includes(o.id));
    return term ? pool.filter(o => o.name.toLowerCase().includes(term)) : pool;
  }, [options, selected, q]);
  const shown = searchable ? matches.slice(0, SHOW_LIMIT) : matches;

  return (
    <section>
      <div className="flex items-baseline justify-between mb-1.5">
        <h2 className="text-sm font-semibold text-gray-900">{label}</h2>
        {selected.length > 0 && <span className="text-xs text-gray-500">{selected.length} selected</span>}
      </div>
      {hint && <p className="text-xs text-gray-500 mb-2">{hint}</p>}

      {chosen.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {chosen.map(o => (
            <button key={o.id} type="button" onClick={() => onToggle(o.id)}
              className="inline-flex items-center gap-1 rounded-full bg-red-600 text-white text-sm pl-3 pr-2 py-1.5">
              {o.name}<X className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      )}

      {searchable && (
        <div className="relative mb-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={`Search ${label.toLowerCase()}…`}
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-300 text-base focus:outline-none focus:ring-2 focus:ring-red-500" />
        </div>
      )}

      {options.length === 0 ? (
        <p className="text-sm text-gray-500">{empty ?? 'Nothing to choose from.'}</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {shown.map(o => (
            <button key={o.id} type="button" onClick={() => onToggle(o.id)}
              className="rounded-full border border-gray-300 bg-white text-gray-800 text-sm px-3 py-1.5 hover:border-red-400">
              {o.name}
            </button>
          ))}
          {searchable && matches.length > shown.length && (
            <span className="text-xs text-gray-500 self-center px-1">+{matches.length - shown.length} more — type to search</span>
          )}
          {shown.length === 0 && <span className="text-sm text-gray-500">{q ? 'No match.' : 'All selected.'}</span>}
        </div>
      )}
    </section>
  );
}

export function Range({ label, from, to, onFrom, onTo, options, unit }: {
  label: string; from: string; to: string; onFrom: (v: string) => void; onTo: (v: string) => void;
  options: Array<{ value: number; label: string }>; unit: string;
}) {
  const sel = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-red-500';
  return (
    <section>
      <h2 className="text-sm font-semibold text-gray-900 mb-1.5">{label}</h2>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <select value={from} onChange={e => onFrom(e.target.value)} className={sel} aria-label={`${label} from`}>
          <option value="">From</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        <span className="text-gray-500 text-sm">to</span>
        <select value={to} onChange={e => onTo(e.target.value)} className={sel} aria-label={`${label} to`}>
          <option value="">To</option>
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </div>
      <p className="text-xs text-gray-500 mt-1">Leave empty for any {unit}.</p>
    </section>
  );
}

