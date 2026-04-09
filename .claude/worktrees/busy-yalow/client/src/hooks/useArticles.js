import { useState, useEffect, useCallback } from 'react';
import * as api from '../api/articles';

export function useArticles() {
  const [board, setBoard] = useState({ idea: [], draft: [], published: [] });
  const [archive, setArchive] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadBoard = useCallback(async () => {
    const data = await api.fetchBoard();
    setBoard(data);
  }, []);

  const loadArchive = useCallback(async () => {
    const data = await api.fetchArchive();
    setArchive(data);
  }, []);

  useEffect(() => {
    Promise.all([loadBoard(), loadArchive()]).finally(() => setLoading(false));
  }, [loadBoard, loadArchive]);

  const addArticle = useCallback(async (status = 'idea') => {
    const article = await api.createArticle({ title: '', body_html: '', status });
    setBoard(prev => ({ ...prev, [status]: [...prev[status], article] }));
    return article;
  }, []);

  const saveArticle = useCallback(async (id, data) => {
    const updated = await api.updateArticle(id, data);
    setBoard(prev => {
      const newBoard = { ...prev };
      for (const col of Object.keys(newBoard)) {
        newBoard[col] = newBoard[col].map(a => a.id === id ? updated : a);
      }
      return newBoard;
    });
    return updated;
  }, []);

  const archiveArticle = useCallback(async (id) => {
    await api.updateArticle(id, { status: 'archived' });
    setBoard(prev => {
      const newBoard = { ...prev };
      for (const col of Object.keys(newBoard)) {
        newBoard[col] = newBoard[col].filter(a => a.id !== id);
      }
      return newBoard;
    });
    const data = await api.fetchArchive();
    setArchive(data);
  }, []);

  const removeArticle = useCallback(async (id) => {
    await api.deleteArticle(id);
    setBoard(prev => {
      const newBoard = { ...prev };
      for (const col of Object.keys(newBoard)) {
        newBoard[col] = newBoard[col].filter(a => a.id !== id);
      }
      return newBoard;
    });
    setArchive(prev => prev.filter(a => a.id !== id));
  }, []);

  const restoreArticle = useCallback(async (id) => {
    const restored = await api.restoreArticle(id);
    setArchive(prev => prev.filter(a => a.id !== id));
    setBoard(prev => ({ ...prev, idea: [...prev.idea, restored] }));
  }, []);

  const moveArticle = useCallback(async (id, fromStatus, toStatus, newPosition) => {
    setBoard(prev => {
      const newBoard = { ...prev };
      const movedArticle = newBoard[fromStatus].find(a => a.id === id);
      newBoard[fromStatus] = newBoard[fromStatus].filter(a => a.id !== id);
      const updated = { ...movedArticle, status: toStatus, position: newPosition };
      const col = fromStatus === toStatus ? [...newBoard[toStatus]] : [...newBoard[toStatus]];
      const insertIdx = col.findIndex(a => a.position > newPosition);
      if (insertIdx === -1) col.push(updated);
      else col.splice(insertIdx, 0, updated);
      newBoard[toStatus] = col;
      return newBoard;
    });
    await api.updateArticle(id, { status: toStatus, position: newPosition });
  }, []);

  return {
    board,
    archive,
    loading,
    addArticle,
    saveArticle,
    archiveArticle,
    removeArticle,
    restoreArticle,
    moveArticle,
    setBoard
  };
}
