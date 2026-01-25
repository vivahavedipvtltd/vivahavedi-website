'use client';

import { SWRConfig } from 'swr';
import { globalSWRConfig } from '@/lib/swrConfig';

export function SWRProvider({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={globalSWRConfig}>{children}</SWRConfig>;
}
