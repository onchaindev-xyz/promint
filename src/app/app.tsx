// 📄 /src/app/page.tsx
'use client';

import dynamic from 'next/dynamic';
import { APP_NAME } from '~/lib/constants';

// ✅ Appel corrigé : import dynamique de Landing (remplace Demo)
const Landing = dynamic(() => import('~/components/Landing'), {
  ssr: false,
});

interface PageProps {
  title?: string;
}

export default function App({ title = APP_NAME }: PageProps) {
  return <Landing title={title} />;
}
