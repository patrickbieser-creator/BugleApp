import { useState } from 'react';
import ArchiveCard from './ArchiveCard';

export default function ArchiveSection({ archive, onRestore, onDelete, onExport }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mt-8 border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-600"
      >
        <span>Archive ({archive.length})</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="p-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 bg-white">
          {archive.length === 0 ? (
            <p className="text-sm text-gray-400 col-span-full text-center py-4">No archived articles</p>
          ) : (
            archive.map(article => (
              <ArchiveCard
                key={article.id}
                article={article}
                onRestore={onRestore}
                onDelete={onDelete}
                onExport={onExport}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
