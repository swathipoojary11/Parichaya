'use client';
import { useState, useEffect } from 'react';
import { inspectDB } from '@/lib/db';

/**
 * DBInspector — Dev-mode panel to browse IndexedDB contents
 * Only renders when visible, toggle with Ctrl+Shift+D
 */
export default function DBInspector() {
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState(null);
  const [activeStore, setActiveStore] = useState('users');

  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (isOpen) {
      inspectDB().then(setData).catch(console.error);
    }
  }, [isOpen]);

  const refresh = () => inspectDB().then(setData).catch(console.error);

  if (!isOpen) return null;

  const stores = data ? Object.keys(data) : [];
  const rows = data?.[activeStore] || [];

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-surface-dark border border-border-dark rounded-2xl w-[90vw] max-w-4xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border-dark">
          <div className="flex items-center gap-3">
            <span className="text-brand font-bold text-lg">🗄️ AuraDB Inspector</span>
            <span className="text-xs text-text-body-dark bg-zinc-800 px-2 py-0.5 rounded-full">DEV MODE</span>
          </div>
          <div className="flex gap-2">
            <button onClick={refresh} className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">
              ↻ Refresh
            </button>
            <button onClick={() => setIsOpen(false)} className="px-3 py-1 text-sm bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors">
              ✕ Close
            </button>
          </div>
        </div>

        {/* Store tabs */}
        <div className="flex gap-1 px-4 py-2 border-b border-border-dark overflow-x-auto">
          {stores.map(store => (
            <button
              key={store}
              onClick={() => setActiveStore(store)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                activeStore === store
                  ? 'bg-brand text-white'
                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {store} ({data[store]?.length || 0})
            </button>
          ))}
        </div>

        {/* Data */}
        <div className="flex-1 overflow-auto p-4">
          {rows.length === 0 ? (
            <div className="text-center text-zinc-500 py-12">No records in "{activeStore}"</div>
          ) : (
            <pre className="text-xs text-zinc-300 font-mono leading-relaxed whitespace-pre-wrap">
              {JSON.stringify(rows, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
