'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import type { Item } from '@/components/whatsapp/PrefWidgets';

interface Masters { religion: Item[]; caste: Item[]; country: Item[]; state: Item[]; district: Item[]; qualification_level: Item[]; marital_status: Item[] }

const input = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 bg-white text-base focus:outline-none focus:ring-2 focus:ring-red-500 disabled:bg-gray-100';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-900 mb-1.5">{label}</span>
      {children}
    </label>
  );
}

function Select({ value, onChange, items, placeholder, disabled }: {
  value: string; onChange: (v: string) => void; items: Item[]; placeholder: string; disabled?: boolean;
}) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} disabled={disabled} required className={input}>
      <option value="">{placeholder}</option>
      {items.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
    </select>
  );
}

function Notice({ title, text }: { title: string; text: string }) {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        <h1 className="text-lg font-semibold text-gray-900 mb-2">{title}</h1>
        <p className="text-gray-600">{text}</p>
      </div>
    </main>
  );
}

function WhatsAppRegister() {
  const code = useSearchParams().get('c') ?? '';
  const [state, setState] = useState<'loading' | 'ready' | 'invalid' | 'member'>('loading');
  const [message, setMessage] = useState('');
  const [masters, setMasters] = useState<Masters | null>(null);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [religion, setReligion] = useState('');
  const [caste, setCaste] = useState('');
  const [country, setCountry] = useState('');
  const [stateId, setStateId] = useState('');
  const [district, setDistrict] = useState('');
  const [education, setEducation] = useState('');
  const [marital, setMarital] = useState('');

  useEffect(() => {
    if (!code) { setMessage('This link is incomplete. Please tap the button in WhatsApp again.'); setState('invalid'); return; }
    let cancelled = false;
    (async () => {
      try {
        const [chk, m] = await Promise.all([
          fetch(`${API_BASE_URL}/whatsapp-forms/register?c=${encodeURIComponent(code)}`, { headers: { Accept: 'application/json' } })
            .then(async r => ({ ok: r.ok, body: await r.json().catch(() => ({})) })),
          fetch(`${API_BASE_URL}/masters`, { headers: { Accept: 'application/json' } }).then(r => r.json()),
        ]);
        if (cancelled) return;
        if (!chk.ok) { setMessage(chk.body.message || 'This link has expired.'); setState('invalid'); return; }
        if (chk.body.data?.already_member) { setState('member'); return; }
        if (m.status !== 'success') throw new Error('masters');
        setMasters(m.data);
        setCountry(String(m.data.country?.[0]?.id ?? '')); // most common country first, normally India
        const given = String(chk.body.data?.name ?? '').trim();
        if (given && !/^\+?\d+$/.test(given)) setName(given);
        setState('ready');
      } catch {
        if (!cancelled) { setMessage('We could not load the form. Please check your connection and try again.'); setState('invalid'); }
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  const castes = useMemo(() => masters?.caste.filter(c => String(c.masterId) === religion) ?? [], [masters, religion]);
  const states = useMemo(() => masters?.state.filter(s => String(s.masterId) === country) ?? [], [masters, country]);
  const districts = useMemo(() => masters?.district.filter(d => String(d.masterId) === stateId) ?? [], [masters, stateId]);

  const maxDob = useMemo(() => { const d = new Date(); d.setFullYear(d.getFullYear() - 18); return d.toISOString().slice(0, 10); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!gender) return setError('Please choose your gender.');
    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp-forms/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          c: code, name: name.trim(), gender, dob, email: email.trim(),
          religion: Number(religion), caste: Number(caste), country: Number(country), state: Number(stateId), district: Number(district),
          education_level: Number(education),
          marital_status: masters?.marital_status.find(x => String(x.id) === marital)?.name,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.status === 'success') setDone(true);
      else if (res.status === 410) { setMessage(body.message); setState('invalid'); }
      else setError(body.message || 'Could not register. Please try again.');
    } catch {
      setError('Could not register. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (state === 'loading') {
    return <main className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-red-600" /></main>;
  }
  if (state === 'invalid') return <Notice title="Link not available" text={message} />;
  if (state === 'member') return <Notice title="You're already registered" text="A profile already exists for this WhatsApp number. Go back to WhatsApp and message us again." />;

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">You're registered</h1>
          <p className="text-gray-600">Go back to WhatsApp — we have sent you your login details there.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900">Create your profile</h1>
        <p className="text-gray-600 mt-1 mb-5">Just a few details. We'll use your WhatsApp number as your mobile number and send your password on WhatsApp.</p>

        <form id="reg" onSubmit={submit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-5">
          <Field label="Name">
            <input value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} autoComplete="name" className={input} placeholder="Your full name" />
          </Field>

          <fieldset>
            <legend className="text-sm font-semibold text-gray-900 mb-1.5">Gender</legend>
            <div className="grid grid-cols-2 gap-2">
              {[['male', 'Male'], ['female', 'Female']].map(([v, l]) => (
                <button key={v} type="button" onClick={() => setGender(v)} aria-pressed={gender === v}
                  className={`py-2.5 rounded-lg border text-base ${gender === v ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}>
                  {l}
                </button>
              ))}
            </div>
          </fieldset>

          <Field label="Date of birth">
            <input type="date" value={dob} onChange={e => setDob(e.target.value)} required min="1950-01-01" max={maxDob} className={input} />
          </Field>

          <Field label="Email ID">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={255} autoComplete="email" className={input} placeholder="you@example.com" />
          </Field>

          <Field label="Religion">
            <Select value={religion} onChange={v => { setReligion(v); setCaste(''); }} items={masters!.religion} placeholder="Select religion" />
          </Field>
          <Field label="Caste">
            <Select value={caste} onChange={setCaste} items={castes} disabled={!religion} placeholder={religion ? 'Select caste' : 'Select religion first'} />
          </Field>

          <Field label="Country">
            <Select value={country} onChange={v => { setCountry(v); setStateId(''); setDistrict(''); }} items={masters!.country} placeholder="Select country" />
          </Field>
          <Field label="State">
            <Select value={stateId} onChange={v => { setStateId(v); setDistrict(''); }} items={states} disabled={!country} placeholder={country ? 'Select state' : 'Select country first'} />
          </Field>
          <Field label="District">
            <Select value={district} onChange={setDistrict} items={districts} disabled={!stateId} placeholder={stateId ? 'Select district' : 'Select state first'} />
          </Field>

          <Field label="Education level">
            <Select value={education} onChange={setEducation} items={masters!.qualification_level} placeholder="Select education level" />
          </Field>
          <Field label="Marital status">
            <Select value={marital} onChange={setMarital} items={masters!.marital_status} placeholder="Select marital status" />
          </Field>

          {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
        </form>
      </div>

      <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 p-3">
        <div className="max-w-xl mx-auto">
          <button form="reg" type="submit" disabled={saving}
            className="w-full py-3 rounded-xl bg-red-600 text-white text-base font-semibold disabled:opacity-60 inline-flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-5 h-5 animate-spin" />} Register
          </button>
        </div>
      </div>
    </main>
  );
}

export default function WhatsAppRegisterPage() {
  return (
    <Suspense fallback={null}>
      <WhatsAppRegister />
    </Suspense>
  );
}
