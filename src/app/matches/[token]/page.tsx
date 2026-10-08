'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Check, Loader2, Minus } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

interface Profile {
  id: number; name: string; age: number | null; height_cm: number | null; height_ft: string | null; percent: number | null;
  photo: string; photo_status: 'yes' | 'locked' | 'no';
  marital_status: string | null; religion: string | null; caste: string | null; district: string | null; state: string | null; native_place: string | null;
  education: string | null; education_level: string | null; specialization: string | null; profession: string | null; work_sector: string | null;
  body_type: string | null; complexion: string | null; physical_status: string | null; diet: string | null;
  family_values: string | null; father_occupation: string | null; mother_occupation: string | null; brothers: string | null; sisters: string | null;
  nakshatra: string | null; manglik: string | null; about: string | null;
  matches: Array<{ label: string; ok: boolean }>;
}
interface Payload { for: string | null; expires_at: string; profiles: Profile[] }

const cap = (v: string) => v.charAt(0).toUpperCase() + v.slice(1);

function Facts({ title, rows }: { title: string; rows: Array<[string, string | null | undefined]> }) {
  const shown = rows.filter(([, v]) => v);
  if (!shown.length) return null;
  return (
    <div>
      <h3 className="text-[11px] font-semibold uppercase tracking-wider text-rose-700/80 mb-2">{title}</h3>
      <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5">
        {shown.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs text-stone-500">{k}</dt>
            <dd className="text-sm text-stone-900 font-medium break-words">{cap(String(v))}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Card({ p }: { p: Profile }) {
  const place = [p.district, p.state].filter(Boolean).join(', ');
  const siblings = [p.brothers && `${p.brothers} brother(s)`, p.sisters && `${p.sisters} sister(s)`].filter(Boolean).join(' · ');
  const chips = [p.age && `${p.age} yrs`, p.height_cm && `${p.height_ft} · ${p.height_cm} cm`, p.marital_status && cap(p.marital_status)].filter(Boolean) as string[];

  return (
    <article id={`p${p.id}`} className="scroll-mt-4 bg-white rounded-3xl shadow-[0_8px_30px_rgba(120,53,15,0.08)] border border-stone-200/70 overflow-hidden">
      <div className="p-5 flex gap-4 items-center bg-gradient-to-br from-rose-50 to-amber-50">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.photo} alt={p.photo_status === 'yes' ? p.name : 'Photo not shown'} className="w-24 h-24 rounded-2xl object-cover bg-stone-100 shrink-0 ring-4 ring-white shadow" />
        <div className="min-w-0">
          <h2 className="text-xl font-semibold text-stone-900 truncate">{p.name}</h2>
          <p className="text-xs text-stone-500 mb-2">Profile ID {p.id}</p>
          {p.percent !== null && (
            <span className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-100 rounded-full px-2.5 py-1">{p.percent}% match</span>
          )}
        </div>
      </div>
      {p.photo_status === 'locked' && <p className="px-5 pt-3 text-xs text-stone-500">This member keeps their photo private. Connect to request it.</p>}

      <div className="p-5 space-y-6">
        {chips.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {chips.map(c => <span key={c} className="text-sm bg-stone-100 text-stone-800 rounded-full px-3 py-1">{c}</span>)}
          </div>
        )}

        {p.about && <p className="text-sm leading-relaxed text-stone-700 italic border-l-2 border-rose-200 pl-3">“{p.about}”</p>}

        <Facts title="Community & location" rows={[['Religion', p.religion], ['Caste', p.caste], ['Lives in', place], ['Native place', p.native_place]]} />
        <Facts title="Education & career" rows={[['Education', p.education], ['Level', p.education_level], ['Specialisation', p.specialization], ['Profession', p.profession], ['Works in', p.work_sector]]} />
        <Facts title="Family" rows={[['Family values', p.family_values], ['Father', p.father_occupation], ['Mother', p.mother_occupation], ['Siblings', siblings]]} />
        <Facts title="Lifestyle & looks" rows={[['Diet', p.diet], ['Body type', p.body_type], ['Complexion', p.complexion], ['Physical status', p.physical_status]]} />
        <Facts title="Horoscope" rows={[['Nakshatra', p.nakshatra], ['Manglik', p.manglik]]} />

        {p.matches.length > 0 && (
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-rose-700/80 mb-2">Fits your preferences</h3>
            <ul className="flex flex-wrap gap-2">
              {p.matches.map(m => (
                <li key={m.label} className={`inline-flex items-center gap-1 text-xs rounded-full px-2.5 py-1 ${m.ok ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                  {m.ok ? <Check className="w-3.5 h-3.5" /> : <Minus className="w-3.5 h-3.5" />}{m.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        <a href={`/profile/${p.id}`} className="block text-center rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 transition-colors">
          View full profile &amp; connect
        </a>
      </div>
    </article>
  );
}

export default function MatchesPage() {
  const { token } = useParams<{ token: string }>();
  const [data, setData] = useState<Payload | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_BASE_URL}/match-share/${encodeURIComponent(token)}`, { headers: { Accept: 'application/json' } })
      .then(async r => ({ ok: r.ok, body: await r.json().catch(() => ({})) }))
      .then(({ ok, body }) => {
        if (cancelled) return;
        if (ok && body.status === 'success') setData(body.data);
        else setError(body.message || 'This link has expired. Ask us on WhatsApp for fresh matches.');
      })
      .catch(() => !cancelled && setError('Could not load the matches. Please check your connection and try again.'));
    return () => { cancelled = true; };
  }, [token]);

  // Jump to the profile whose button was tapped (#p123) once the cards exist.
  useEffect(() => {
    if (!data || !window.location.hash) return;
    document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' });
  }, [data]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
        <p className="max-w-sm text-center text-stone-700 bg-white rounded-2xl border border-stone-200 p-8">{error}</p>
      </main>
    );
  }
  if (!data) {
    return <main className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="w-8 h-8 animate-spin text-rose-600" /></main>;
  }

  return (
    <main className="min-h-screen bg-stone-50 pb-12">
      <header className="text-center px-4 pt-10 pb-6">
        <p className="text-xs tracking-[0.25em] uppercase text-rose-700">Vivahavedi Matrimony</p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-stone-900">{data.for ? `Matches picked for ${data.for}` : 'Your matches'}</h1>
        <p className="mt-1 text-sm text-stone-500">{data.profiles.length} profile{data.profiles.length === 1 ? '' : 's'} · link valid until {new Date(data.expires_at).toLocaleDateString()}</p>
      </header>
      <div className="max-w-xl mx-auto px-4 space-y-5">
        {data.profiles.length === 0 && <p className="text-center text-stone-600">These profiles are no longer available.</p>}
        {data.profiles.map(p => <Card key={p.id} p={p} />)}
      </div>
      <p className="max-w-xl mx-auto px-6 mt-8 text-center text-xs text-stone-400">Contact details are shared only after you connect. Please don&apos;t forward this link.</p>
    </main>
  );
}
