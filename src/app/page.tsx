'use client';

import dynamic from 'next/dynamic';

const EditorApp = dynamic(() => import('@/components/EditorApp'), {
  ssr: false,
  loading: () => (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-950 text-slate-400 gap-3 select-none">
      <div className="w-9 h-9 border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm font-medium tracking-wide">Loading SmartEditor Studio...</p>
    </div>
  ),
});

export default function HomePage() {
  return <EditorApp />;
}
