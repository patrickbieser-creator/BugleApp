export default function ArchiveCard({ article, onRestore, onDelete, onExport }) {
  const preview = article.body_html
    ? article.body_html.replace(/<[^>]+>/g, '').slice(0, 100)
    : '';

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-700 truncate">
          {article.title || <span className="italic text-gray-400">Untitled</span>}
        </p>
        {preview && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{preview}</p>
        )}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button
          onClick={() => onRestore(article.id)}
          className="text-xs text-green-600 hover:text-green-800 px-2 py-1 rounded hover:bg-green-50"
        >
          Restore
        </button>
        <button
          onClick={() => onExport(article)}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded hover:bg-gray-100"
        >
          Export
        </button>
        <button
          onClick={() => onDelete(article.id)}
          className="text-xs text-red-400 hover:text-red-600 px-2 py-1 rounded hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
