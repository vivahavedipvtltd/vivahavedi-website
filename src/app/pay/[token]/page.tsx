'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/config';

const MESSAGES: Record<string, string> = {
  paid: 'This payment has already been completed. Thank you!',
  expired: 'This payment link has expired. Please contact us for a new one.',
  invalid: 'This payment link is not valid. Please contact us for a new one.',
};

export default function PayLinkPage() {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState('');
  const started = useRef(false); // count one visit per page load (React dev double-run)

  useEffect(() => {
    if (started.current || !token) return;
    started.current = true;

    fetch(`${API_BASE_URL}/payment-links/${encodeURIComponent(token)}/open`, {
      method: 'POST',
      headers: { Accept: 'application/json' },
    })
      .then(async res => ({ body: await res.json().catch(() => ({})) }))
      .then(({ body }) => {
        if (body.state === 'ok' && typeof body.redirect_url === 'string') {
          window.location.replace(body.redirect_url);
        } else {
          setMessage(MESSAGES[body.state] ?? MESSAGES.invalid);
        }
      })
      .catch(() => setMessage('Could not open the payment page. Please check your connection and try again.'));
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-sm w-full text-center bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        {message ? (
          <>
            <p className="text-gray-800 mb-4">{message}</p>
            <Link href="/" className="inline-block px-5 py-2 rounded-lg bg-red-600 text-white text-sm">Go to home</Link>
          </>
        ) : (
          <>
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-red-600 mb-3" />
            <p className="text-gray-700">Opening secure payment…</p>
          </>
        )}
      </div>
    </div>
  );
}
