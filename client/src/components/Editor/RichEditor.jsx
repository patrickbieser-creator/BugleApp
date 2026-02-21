import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function MenuBar({ editor }) {
  if (!editor) return null;

  const btn = (action, label, active) => (
    <button
      key={label}
      type="button"
      onClick={action}
      className={`px-2 py-1 text-sm rounded hover:bg-gray-200 ${active ? 'bg-gray-300 font-semibold' : ''}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
      {btn(() => editor.chain().focus().toggleBold().run(), 'B', editor.isActive('bold'))}
      {btn(() => editor.chain().focus().toggleItalic().run(), 'I', editor.isActive('italic'))}
      {btn(() => editor.chain().focus().toggleStrike().run(), 'S̶', editor.isActive('strike'))}
      {btn(() => editor.chain().focus().toggleCode().run(), '`', editor.isActive('code'))}
      <span className="w-px bg-gray-300 mx-1" />
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), 'H2', editor.isActive('heading', { level: 2 }))}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), 'H3', editor.isActive('heading', { level: 3 }))}
      {btn(() => editor.chain().focus().toggleBulletList().run(), '• List', editor.isActive('bulletList'))}
      {btn(() => editor.chain().focus().toggleOrderedList().run(), '1. List', editor.isActive('orderedList'))}
      {btn(() => editor.chain().focus().toggleBlockquote().run(), '❝', editor.isActive('blockquote'))}
      {btn(() => editor.chain().focus().toggleCodeBlock().run(), '</>', editor.isActive('codeBlock'))}
    </div>
  );
}

export default function RichEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none p-3 min-h-[200px]'
      }
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML())
  });

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
