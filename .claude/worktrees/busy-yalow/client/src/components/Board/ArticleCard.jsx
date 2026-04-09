import { Draggable } from '@hello-pangea/dnd';

export default function ArticleCard({ article, index, onOpen, onArchive, onDelete, onExport, showArchive }) {
  const preview = article.body_html
    ? article.body_html.replace(/<[^>]+>/g, '').slice(0, 80)
    : '';

  return (
    <Draggable draggableId={article.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white rounded-lg border border-gray-200 p-3 shadow-sm cursor-grab select-none
            ${snapshot.isDragging ? 'shadow-lg ring-2 ring-blue-400' : 'hover:border-gray-300'}`}
        >
          <p
            className="font-medium text-gray-800 text-sm leading-snug cursor-pointer hover:text-blue-600"
            onClick={() => onOpen(article)}
          >
            {article.title || <span className="italic text-gray-400">Untitled</span>}
          </p>
          {preview && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{preview}</p>
          )}
          <div className="flex gap-1 mt-2 flex-wrap">
            <button
              onClick={() => onOpen(article)}
              className="text-xs text-blue-500 hover:text-blue-700 px-1.5 py-0.5 rounded hover:bg-blue-50"
            >
              Edit
            </button>
            <button
              onClick={() => onExport(article)}
              className="text-xs text-gray-500 hover:text-gray-700 px-1.5 py-0.5 rounded hover:bg-gray-100"
            >
              Export
            </button>
            {showArchive && (
              <button
                onClick={() => onArchive(article.id)}
                className="text-xs text-amber-500 hover:text-amber-700 px-1.5 py-0.5 rounded hover:bg-amber-50"
              >
                Archive
              </button>
            )}
            <button
              onClick={() => onDelete(article.id)}
              className="text-xs text-red-400 hover:text-red-600 px-1.5 py-0.5 rounded hover:bg-red-50 ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
