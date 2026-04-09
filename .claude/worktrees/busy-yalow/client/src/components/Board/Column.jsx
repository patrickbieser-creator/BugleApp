import { Droppable } from '@hello-pangea/dnd';
import ArticleCard from './ArticleCard';

const COLUMN_CONFIG = {
  idea:      { label: 'Ideas',     color: 'bg-purple-100 text-purple-800', dot: 'bg-purple-400' },
  draft:     { label: 'Draft',     color: 'bg-yellow-100 text-yellow-800', dot: 'bg-yellow-400' },
  published: { label: 'Published', color: 'bg-green-100 text-green-800',  dot: 'bg-green-400'  }
};

export default function Column({ status, articles, onAdd, onOpen, onArchive, onDelete, onExport }) {
  const { label, color, dot } = COLUMN_CONFIG[status];

  return (
    <div className="flex flex-col flex-1 min-w-[280px] max-w-sm bg-gray-50 rounded-xl border border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${dot}`} />
          <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
          <span className="text-xs text-gray-400 font-mono">{articles.length}</span>
        </div>
        <button
          onClick={() => onAdd(status)}
          className="text-gray-400 hover:text-gray-600 text-xl leading-none font-light"
          title="Add article"
        >
          +
        </button>
      </div>
      <Droppable droppableId={status}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 p-3 flex flex-col gap-2 min-h-[120px] transition-colors rounded-b-xl
              ${snapshot.isDraggingOver ? 'bg-blue-50' : ''}`}
          >
            {articles.map((article, index) => (
              <ArticleCard
                key={article.id}
                article={article}
                index={index}
                onOpen={onOpen}
                onArchive={onArchive}
                onDelete={onDelete}
                onExport={onExport}
                showArchive={status === 'published'}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
