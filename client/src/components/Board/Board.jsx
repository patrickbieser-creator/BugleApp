import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';

const COLUMNS = ['idea', 'draft', 'published'];

export default function Board({ board, onAdd, onOpen, onArchive, onDelete, onExport, onDragEnd }) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map(status => (
          <Column
            key={status}
            status={status}
            articles={board[status] || []}
            onAdd={onAdd}
            onOpen={onOpen}
            onArchive={onArchive}
            onDelete={onDelete}
            onExport={onExport}
          />
        ))}
      </div>
    </DragDropContext>
  );
}
