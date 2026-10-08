'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/config';

/** Only ever send the member to their own dashboard pages or the WhatsApp preference form. */
function safeNext(next: unknown): string {
  return typeof next === 'string' && (next === '/whatsapp-preferences' || /^\/dashboard(\/[A-Za-z0-9_-]+)*$/.test(next)) ? next : '/dashboard';
}

function WhatsAppLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const started = useRef(false); // the code works once, so never exchange it twice (React dev double-run)

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = params.get('c') ?? '';
    if (!code) {
      setError('This link is incomplete. Please log in normally.');
      return;
    }

    fetch(`${API_BASE_URL}/auth/whatsapp-link`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ code }),
    })
      .then(async res => ({ ok: res.ok, body: await res.json().catch(() => ({})) }))
      .then(({ ok, body }) => {
        if (ok && body.status === 'success') {
          login(body.data.token, body.data.user_id, body.data.expire_date);
          router.replace(safeNext(body.data.next));
        } else {
          setError(body.message || 'This link has expired or was already used. Please log in normally.');
        }
      })
      .catch(() => setError('Could not sign you in. Please check your connection or log in normally.'));
  }, [params, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {error ? (
          <>
            <p className="text-gray-800 mb-4">{error}</p>
            <Link href="/login" className="inline-block px-5 py-2 rounded-lg bg-red-600 text-white text-sm">Go to login</Link>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-3" />
            <p className="text-gray-700">Signing you in…</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function WhatsAppLoginPage() {
  return (
    <Suspense fallback={null}>
      <WhatsAppLogin />
    </Suspense>
  );
}
