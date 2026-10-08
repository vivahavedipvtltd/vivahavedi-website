'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Loader2, Search, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/config';
import { AGE_OPTIONS, HEIGHT_OPTIONS } from '@/lib/partnerPreferenceOptions';

interface Item { id: number; name: string; masterId?: number }
interface Masters { religion: Item[]; caste: Item[]; state: Item[]; district: Item[]; qualification_level: Item[] }

const ids = (v: unknown): number[] =>
  typeof v === 'string' ? v.split('|').map(x => parseInt(x.trim(), 10)).filter(n => Number.isFinite(n) && n > 0) : [];

const SHOW_LIMIT = 40;

/** Tap-to-select chips. Short lists show everything; long lists show matches as you type. */
function ChipPicker({ label, hint, options, selected, onToggle, searchable, empty }: {
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

function Range({ label, from, to, onFrom, onTo, options, unit }: {
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

export default function WhatsAppPreferencesPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading } = useAuth();
  const [masters, setMasters] = useState<Masters | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [ageFrom, setAgeFrom] = useState('');
  const [ageTo, setAgeTo] = useState('');
  const [heightFrom, setHeightFrom] = useState('');
  const [heightTo, setHeightTo] = useState('');
  const [religions, setReligions] = useState<number[]>([]);
  const [castes, setCastes] = useState<number[]>([]);
  const [states, setStates] = useState<number[]>([]);
  const [districts, setDistricts] = useState<number[]>([]);
  const [levels, setLevels] = useState<number[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login');
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      try {
        const [m, p] = await Promise.all([
          fetch(`${API_BASE_URL}/masters`, { headers: { Accept: 'application/json' } }).then(r => r.json()),
          fetch(`${API_BASE_URL}/partner-profile`, { headers: { Accept: 'application/json', Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]);
        if (cancelled) return;
        if (m.status !== 'success') throw new Error('masters');
        setMasters(m.data);
        const d = p.status === 'success' ? p.data : null;
        if (d) {
          // Older profiles may have castes/districts without their religion/state: work those out so nothing is hidden.
          const md: Masters = m.data;
          const savedCastes = ids(d.upp_caste);
          const savedDistricts = ids(d.upp_district);
          const relOfCaste = md.caste.filter(c => savedCastes.includes(c.id)).map(c => c.masterId as number);
          const stateOfDistrict = md.district.filter(x => savedDistricts.includes(x.id)).map(x => x.masterId as number);
          setReligions(Array.from(new Set([...ids(d.upp_relegion), ...relOfCaste])));
          setStates(Array.from(new Set([...ids(d.upp_state), ...stateOfDistrict])));
          setAgeFrom(String(d.upp_age_f || d.upp_age_from || ''));
          setAgeTo(String(d.upp_age_t || d.upp_age_to || ''));
          setHeightFrom(String(d.upp_height_f || d.upp_height_from || ''));
          setHeightTo(String(d.upp_height_t || d.upp_height_to || ''));
          setCastes(savedCastes);
          setDistricts(savedDistricts);
          setLevels(ids(d.upp_qualification_level));
        }
      } catch {
        if (!cancelled) setError('We could not load your preferences. Please refresh the page.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  const toggle = (set: React.Dispatch<React.SetStateAction<number[]>>) => (id: number) =>
    set(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const toggleReligion = (id: number) => {
    const next = religions.includes(id) ? religions.filter(x => x !== id) : [...religions, id];
    setReligions(next);
    // Drop castes that no longer belong to a selected religion.
    if (masters && next.length) {
      const okIds = new Set(masters.caste.filter(c => c.masterId !== undefined && next.includes(c.masterId)).map(c => c.id));
      setCastes(prev => prev.filter(c => okIds.has(c)));
    }
  };

  const casteOptions = useMemo(
    () => (masters && religions.length ? masters.caste.filter(c => c.masterId !== undefined && religions.includes(c.masterId)) : []),
    [masters, religions],
  );
  const districtOptions = useMemo(() => {
    if (!masters || !states.length) return [];
    return masters.district.filter(d => d.masterId !== undefined && states.includes(d.masterId));
  }, [masters, states]);

  const toggleState = (id: number) => {
    const next = states.includes(id) ? states.filter(x => x !== id) : [...states, id];
    setStates(next);
    // Drop districts of states that are no longer selected.
    if (masters) {
      const okIds = new Set(masters.district.filter(d => d.masterId !== undefined && next.includes(d.masterId)).map(d => d.id));
      setDistricts(prev => prev.filter(d => okIds.has(d)));
    }
  };

  const ageOptions = AGE_OPTIONS.map(a => ({ value: a, label: `${a} yrs` }));
  const heightOptions = HEIGHT_OPTIONS.map(h => ({ value: h.cm, label: h.label }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (ageFrom && ageTo && Number(ageFrom) > Number(ageTo)) return setError('"Age from" must not be more than "Age to".');
    if (heightFrom && heightTo && Number(heightFrom) > Number(heightTo)) return setError('"Height from" must not be more than "Height to".');

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/profile-updation/partner-quick`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          upp_age_from: ageFrom ? Number(ageFrom) : null,
          upp_age_to: ageTo ? Number(ageTo) : null,
          upp_height_from: heightFrom ? Number(heightFrom) : null,
          upp_height_to: heightTo ? Number(heightTo) : null,
          upp_relegion: religions,
          upp_caste: castes,
          upp_state: states,
          upp_district: districts,
          upp_qualification_level: levels,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.status === 'success') setSaved(true);
      else setError(body.message || 'Could not save. Please try again.');
    } catch {
      setError('Could not save. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (saved) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Preferences saved</h1>
          <p className="text-gray-600">Go back to WhatsApp — we have sent you a message to see your new matches.</p>
          <button onClick={() => setSaved(false)} className="mt-6 text-sm text-red-600 underline">Edit again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900">Your match preferences</h1>
        <p className="text-gray-600 mt-1 mb-5">Tell us who you are looking for. We use this to pick your matches.</p>

        {loading || !masters ? (
          <div className="py-16 text-center">
            {error ? <p className="text-red-700">{error}</p> : <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" />}
          </div>
        ) : (
          <form id="prefs" onSubmit={save} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-7">
            <Range label="Age" from={ageFrom} to={ageTo} onFrom={setAgeFrom} onTo={setAgeTo} options={ageOptions} unit="age" />
            <Range label="Height" from={heightFrom} to={heightTo} onFrom={setHeightFrom} onTo={setHeightTo} options={heightOptions} unit="height" />
            <ChipPicker label="Religion" options={masters.religion} selected={religions} onToggle={toggleReligion} />
            <ChipPicker label="Caste" searchable options={casteOptions} selected={castes} onToggle={toggle(setCastes)}
              empty="Pick a religion above to see its castes."
              hint={religions.length ? 'Showing castes of the religion(s) you picked. Leave empty for any caste.' : undefined} />
            <ChipPicker label="State" searchable options={masters.state} selected={states} onToggle={toggleState}
              hint="Pick the state(s) first, then choose districts below." />
            <ChipPicker label="District" searchable options={districtOptions} selected={districts} onToggle={toggle(setDistricts)}
              empty="Pick a state above to see its districts."
              hint={states.length ? 'Showing districts of the state(s) you picked. Leave empty for the whole state.' : undefined} />
            <ChipPicker label="Education level" options={masters.qualification_level} selected={levels} onToggle={toggle(setLevels)}
              hint="Leave empty for any education." />
            {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
          </form>
        )}
      </div>

      {masters && !loading && (
        <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-3">
          <div className="max-w-xl mx-auto">
            <button form="prefs" type="submit" disabled={saving}
              className="w-full py-3 rounded-xl bg-red-600 text-white text-base font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2">
              {saving && <Loader2 className="w-5 h-5 animate-spin" />} Save preferences
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
