'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';
import { AGE_OPTIONS, HEIGHT_OPTIONS } from '@/lib/partnerPreferenceOptions';
import { ChipPicker, Range, ids, type Masters } from '@/components/whatsapp/PrefWidgets';

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

/** Match preferences for someone who has not registered yet. Opened from WhatsApp with a single-use code. */
function WhatsAppFindMatches() {
  const code = useSearchParams().get('c') ?? '';
  const [masters, setMasters] = useState<Masters | null>(null);
  const [invalid, setInvalid] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const [lookingFor, setLookingFor] = useState('');
  const [ageFrom, setAgeFrom] = useState('');
  const [ageTo, setAgeTo] = useState('');
  const [heightFrom, setHeightFrom] = useState('');
  const [heightTo, setHeightTo] = useState('');
  const [marital, setMarital] = useState<number[]>([]);
  const [religions, setReligions] = useState<number[]>([]);
  const [castes, setCastes] = useState<number[]>([]);
  const [states, setStates] = useState<number[]>([]);
  const [districts, setDistricts] = useState<number[]>([]);
  const [levels, setLevels] = useState<number[]>([]);

  useEffect(() => {
    if (!code) { setInvalid('This link is incomplete. Please tap the button in WhatsApp again.'); return; }
    let cancelled = false;
    (async () => {
      try {
        const [chk, m] = await Promise.all([
          fetch(`${API_BASE_URL}/whatsapp-forms/preferences?c=${encodeURIComponent(code)}`, { headers: { Accept: 'application/json' } })
            .then(async r => ({ ok: r.ok, body: await r.json().catch(() => ({})) })),
          fetch(`${API_BASE_URL}/masters`, { headers: { Accept: 'application/json' } }).then(r => r.json()),
        ]);
        if (cancelled) return;
        if (!chk.ok) { setInvalid(chk.body.message || 'This link has expired.'); return; }
        if (m.status !== 'success') throw new Error('masters');
        const md: Masters = m.data;
        setMasters(md);

        // Updating: start from what they saved before.
        const p = chk.body.data?.preferences;
        if (p) {
          const savedCastes = ids(p.upp_caste);
          const savedDistricts = ids(p.upp_district);
          const relOfCaste = md.caste.filter(c => savedCastes.includes(c.id)).map(c => c.masterId as number);
          const stateOfDistrict = md.district.filter(x => savedDistricts.includes(x.id)).map(x => x.masterId as number);
          const savedMarital = String(p.upp_m_status ?? '').split(',').map(x => x.trim().toLowerCase()).filter(Boolean);
          setLookingFor(p.looking_for ?? '');
          setAgeFrom(p.upp_age_f ?? ''); setAgeTo(p.upp_age_t ?? '');
          setHeightFrom(p.upp_height_f ?? ''); setHeightTo(p.upp_height_t ?? '');
          setMarital(md.marital_status.filter(x => savedMarital.includes(x.name.toLowerCase())).map(x => x.id));
          setReligions(Array.from(new Set([...ids(p.upp_relegion), ...relOfCaste])));
          setCastes(savedCastes);
          setStates(Array.from(new Set([...ids(p.upp_state), ...stateOfDistrict])));
          setDistricts(savedDistricts);
          setLevels(ids(p.upp_qualification_level));
        }
      } catch {
        if (!cancelled) setInvalid('We could not load the form. Please check your connection and try again.');
      }
    })();
    return () => { cancelled = true; };
  }, [code]);

  const toggle = (set: React.Dispatch<React.SetStateAction<number[]>>) => (id: number) =>
    set(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  const toggleReligion = (id: number) => {
    const next = religions.includes(id) ? religions.filter(x => x !== id) : [...religions, id];
    setReligions(next);
    if (masters && next.length) {
      const ok = new Set(masters.caste.filter(c => c.masterId !== undefined && next.includes(c.masterId)).map(c => c.id));
      setCastes(prev => prev.filter(c => ok.has(c)));
    }
  };
  const toggleState = (id: number) => {
    const next = states.includes(id) ? states.filter(x => x !== id) : [...states, id];
    setStates(next);
    if (masters) {
      const ok = new Set(masters.district.filter(d => d.masterId !== undefined && next.includes(d.masterId)).map(d => d.id));
      setDistricts(prev => prev.filter(d => ok.has(d)));
    }
  };

  const casteOptions = useMemo(
    () => (masters && religions.length ? masters.caste.filter(c => c.masterId !== undefined && religions.includes(c.masterId)) : []),
    [masters, religions],
  );
  const districtOptions = useMemo(
    () => (masters && states.length ? masters.district.filter(d => d.masterId !== undefined && states.includes(d.masterId)) : []),
    [masters, states],
  );

  const ageOptions = AGE_OPTIONS.map(a => ({ value: a, label: `${a} yrs` }));
  const heightOptions = HEIGHT_OPTIONS.map(h => ({ value: h.cm, label: h.label }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!lookingFor) return setError('Please choose whether you are looking for a bride or a groom.');
    if (ageFrom && ageTo && Number(ageFrom) > Number(ageTo)) return setError('"Age from" must not be more than "Age to".');
    if (heightFrom && heightTo && Number(heightFrom) > Number(heightTo)) return setError('"Height from" must not be more than "Height to".');

    setSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/whatsapp-forms/preferences`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          c: code,
          looking_for: lookingFor,
          upp_age_from: ageFrom ? Number(ageFrom) : null,
          upp_age_to: ageTo ? Number(ageTo) : null,
          upp_height_from: heightFrom ? Number(heightFrom) : null,
          upp_height_to: heightTo ? Number(heightTo) : null,
          upp_m_status: (masters?.marital_status ?? []).filter(x => marital.includes(x.id)).map(x => x.name),
          upp_relegion: religions,
          upp_caste: castes,
          upp_state: states,
          upp_district: districts,
          upp_qualification_level: levels,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok && body.status === 'success') setSaved(true);
      else if (res.status === 410) setInvalid(body.message);
      else setError(body.message || 'Could not save. Please try again.');
    } catch {
      setError('Could not save. Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  if (invalid) return <Notice title="Link not available" text={invalid} />;

  if (saved) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-sm w-full text-center bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <CheckCircle2 className="w-14 h-14 text-green-600 mx-auto mb-3" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Preferences saved</h1>
          <p className="text-gray-600">Go back to WhatsApp — we have sent you a message to see your matches.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-28">
      <div className="max-w-xl mx-auto px-4 pt-6">
        <h1 className="text-2xl font-bold text-gray-900">Find your matches</h1>
        <p className="text-gray-600 mt-1 mb-5">Tell us who you are looking for. We'll remember this next time you message us on WhatsApp.</p>

        {!masters ? (
          <div className="py-16 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600" /></div>
        ) : (
          <form id="prefs" onSubmit={save} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-7">
            <fieldset>
              <legend className="text-sm font-semibold text-gray-900 mb-1.5">I am looking for</legend>
              <div className="grid grid-cols-2 gap-2">
                {[['bride', 'A bride'], ['groom', 'A groom']].map(([v, l]) => (
                  <button key={v} type="button" onClick={() => setLookingFor(v)} aria-pressed={lookingFor === v}
                    className={`py-2.5 rounded-lg border text-base ${lookingFor === v ? 'bg-red-600 border-red-600 text-white' : 'bg-white border-gray-300 text-gray-800'}`}>
                    {l}
                  </button>
                ))}
              </div>
            </fieldset>
            <Range label="Age" from={ageFrom} to={ageTo} onFrom={setAgeFrom} onTo={setAgeTo} options={ageOptions} unit="age" />
            <Range label="Height" from={heightFrom} to={heightTo} onFrom={setHeightFrom} onTo={setHeightTo} options={heightOptions} unit="height" />
            <ChipPicker label="Marital status" options={masters.marital_status} selected={marital} onToggle={toggle(setMarital)}
              hint="Leave empty for any marital status." />
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

      {masters && (
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

export default function WhatsAppFindMatchesPage() {
  return (
    <Suspense fallback={null}>
      <WhatsAppFindMatches />
    </Suspense>
  );
}
