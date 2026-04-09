import { useState, useCallback } from 'react';
import { useArticles } from './hooks/useArticles';
import { useExport } from './hooks/useExport';
import Board from './components/Board/Board';
import ArticleModal from './components/Editor/ArticleModal';
import ArchiveSection from './components/Archive/ArchiveSection';

export default function App() {
  const {
    board, archive, loading,
    addArticle, saveArticle, archiveArticle,
    removeArticle, restoreArticle, moveArticle
  } = useArticles();
  const { exportArticle } = useExport();
  const [editingArticle, setEditingArticle] = useState(null);

  const handleAdd = useCallback(async (status) => {
    const article = await addArticle(status);
    setEditingArticle(article);
  }, [addArticle]);

  const handleOpen = useCallback((article) => {
    setEditingArticle(article);
  }, []);

  const handleSave = useCallback(async (id, data) => {
    const updated = await saveArticle(id, data);
    setEditingArticle(prev => prev?.id === id ? updated : prev);
  }, [saveArticle]);

  const handleDragEnd = useCallback(async (result) => {
    const { draggableId, source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const fromStatus = source.droppableId;
    const toStatus = destination.droppableId;

    // Build destination column without the dragged item to find neighbors
    let destArticles = [...board[toStatus]];
    if (fromStatus === toStatus) {
      destArticles.splice(source.index, 1);
    }

    const above = destArticles[destination.index - 1];
    const below = destArticles[destination.index];

    let newPosition;
    if (!above && !below) newPosition = 65536;
    else if (!above) newPosition = below.position / 2;
    else if (!below) newPosition = above.position + 65536;
    else newPosition = (above.position + below.position) / 2;

    await moveArticle(draggableId, fromStatus, toStatus, newPosition);
  }, [board, moveArticle]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">Loading…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">
          The Bugle{' '}
          <span className="text-sm font-normal text-gray-400 ml-1">Newsletter Tracker</span>
        </h1>
      </header>

      <main className="px-6 py-6 max-w-7xl mx-auto">
        <Board
          board={board}
          onAdd={handleAdd}
          onOpen={handleOpen}
          onArchive={archiveArticle}
          onDelete={removeArticle}
          onExport={exportArticle}
          onDragEnd={handleDragEnd}
        />
        <ArchiveSection
          archive={archive}
          onRestore={restoreArticle}
          onDelete={removeArticle}
          onExport={exportArticle}
        />
      </main>

      {editingArticle && (
        <ArticleModal
          article={editingArticle}
          onSave={handleSave}
          onClose={() => setEditingArticle(null)}
        />
      )}
    </div>
  );
}
