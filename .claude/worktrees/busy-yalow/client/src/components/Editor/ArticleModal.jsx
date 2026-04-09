import { useState, useEffect } from 'react';
import RichEditor from './RichEditor';

export default function ArticleModal({ article, onSave, onClose }) {
  const [title, setTitle] = useState(article.title || '');
  const [bodyHtml, setBodyHtml] = useState(article.body_html || '');
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setTitle(article.title || '');
    setBodyHtml(article.body_html || '');
    setDirty(false);
  }, [article.id]);

  const handleSave = () => {
    onSave(article.id, { title, body_html: bodyHtml });
    setDirty(false);
  };

  const handleClose = () => {
    if (dirty) onSave(article.id, { title, body_html: bodyHtml });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <input
            className="text-xl font-semibold flex-1 outline-none placeholder:text-gray-400"
            placeholder="Article title…"
            value={title}
            onChange={e => { setTitle(e.target.value); setDirty(true); }}
            autoFocus
          />
          <div className="flex gap-2 ml-4">
            <button
              onClick={handleSave}
              className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </div>
        </div>
        <div className="p-4 overflow-y-auto flex-1">
          <RichEditor
            content={bodyHtml}
            onChange={html => { setBodyHtml(html); setDirty(true); }}
          />
        </div>
      </div>
    </div>
  );
}
