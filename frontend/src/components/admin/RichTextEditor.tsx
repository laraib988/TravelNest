'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { StarterKit } from '@tiptap/starter-kit';
import { Image } from '@tiptap/extension-image';
import { Link } from '@tiptap/extension-link';
import { TextAlign } from '@tiptap/extension-text-align';
import { Placeholder } from '@tiptap/extension-placeholder';
import { Highlight } from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { marked } from 'marked';
import TurndownService from 'turndown';
// @ts-ignore
import { gfm } from 'turndown-plugin-gfm';

import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Minus,
  Highlighter,
  Table as TableIcon,
} from 'lucide-react';

// HTML ⇄ Markdown converters (blog content is stored as markdown).
const Turndown = (TurndownService as any).default || TurndownService;
const turndown = new Turndown({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '*',
  strongDelimiter: '**',
});
turndown.use(gfm);

function markdownToHtml(md: string): string {
  if (!md) return '';
  const parse = (marked as any).parse || marked;
  const html = parse(md, { async: false, gfm: true, breaks: true });
  return typeof html === 'string' ? html : '';
}

interface RichTextEditorProps {
  value: string; // markdown
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your blog post…', minHeight = '480px' }: RichTextEditorProps) {
  const [initialHtml] = useState<string>(() => markdownToHtml(value));

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({ allowBase64: false, HTMLAttributes: { class: 'rte-image' } }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: placeholder || 'Start writing…' }),
      Highlight,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'rte-table',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialHtml,
    immediatelyRender: false,
    
    editorProps: {
      attributes: {
        class: 'rte-prose',
      },
      handleDrop: (view, event, slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            const formData = new FormData();
            formData.append('file', file);
            fetch('/api/admin/upload', { method: 'POST', body: formData })
              .then(res => res.json())
              .then(data => {
                if (data.url) {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: data.url });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }
              }).catch(console.error);
            return true;
          }
        }
        return false;
      },
      handlePaste: (view, event, slice) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            const formData = new FormData();
            formData.append('file', file);
            fetch('/api/admin/upload', { method: 'POST', body: formData })
              .then(res => res.json())
              .then(data => {
                if (data.url) {
                  const { schema } = view.state;
                  const node = schema.nodes.image.create({ src: data.url });
                  const transaction = view.state.tr.replaceSelectionWith(node);
                  view.dispatch(transaction);
                }
              }).catch(console.error);
            return true;
          }
        }
        return false;
      }
    },
    onUpdate: ({ editor: e }) => {
      const md = turndown.turndown(e.getHTML());
      onChange(md);
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // If the parent value changes externally (e.g. form reset), sync the editor.
  useEffect(() => {
    if (!editor) return;
    const currentMd = turndown.turndown(editor.getHTML());
    if (value !== currentMd && !editor.isFocused) {
      editor.commands.setContent(markdownToHtml(value || ''));
    }
  }, [value, editor]);

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Enter the URL:', previousUrl || 'https://');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const addImage = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        editor.chain().focus().setImage({ src: data.url }).run();
      }
    } catch (err) {
      console.error('Image upload failed', err);
    }
    e.target.value = '';
  };

  return (
    <div className="rte-wrap" style={{ border: '1px solid #cbd5e1', borderRadius: 12, overflow: 'hidden', background: '#fff' }}>
      {/* Toolbar */}
      <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '10px 12px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', alignItems: 'center' }}>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} style={{ ...toolBtn, background: editor.isActive('bold') ? '#7c3aed' : '#fff', color: editor.isActive('bold') ? '#fff' : '#475569' }}>
          <Bold size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} style={{ ...toolBtn, background: editor.isActive('italic') ? '#7c3aed' : '#fff', color: editor.isActive('italic') ? '#fff' : '#475569' }}>
          <Italic size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} style={{ ...toolBtn, background: editor.isActive('strike') ? '#7c3aed' : '#fff', color: editor.isActive('strike') ? '#fff' : '#475569' }}>
          <Strikethrough size={16} />
        </button>

        <span style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={{ ...toolBtn, background: editor.isActive('heading', { level: 2 }) ? '#7c3aed' : '#fff', color: editor.isActive('heading', { level: 2 }) ? '#fff' : '#475569' }}>
          <Heading2 size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={{ ...toolBtn, background: editor.isActive('heading', { level: 3 }) ? '#7c3aed' : '#fff', color: editor.isActive('heading', { level: 3 }) ? '#fff' : '#475569' }}>
          <Heading3 size={16} />
        </button>

        <span style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} style={{ ...toolBtn, background: editor.isActive('bulletList') ? '#7c3aed' : '#fff', color: editor.isActive('bulletList') ? '#fff' : '#475569' }}>
          <List size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} style={{ ...toolBtn, background: editor.isActive('orderedList') ? '#7c3aed' : '#fff', color: editor.isActive('orderedList') ? '#fff' : '#475569' }}>
          <ListOrdered size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} style={{ ...toolBtn, background: editor.isActive('blockquote') ? '#7c3aed' : '#fff', color: editor.isActive('blockquote') ? '#fff' : '#475569' }}>
          <Quote size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={{ ...toolBtn, background: editor.isActive('codeBlock') ? '#7c3aed' : '#fff', color: editor.isActive('codeBlock') ? '#fff' : '#475569' }}>
          <Code size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} style={{ ...toolBtn, background: editor.isActive('highlight') ? '#7c3aed' : '#fff', color: editor.isActive('highlight') ? '#fff' : '#475569' }}>
          <Highlighter size={16} />
        </button>

        <span style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

        <button type="button" onClick={setLink} style={{ ...toolBtn, background: editor.isActive('link') ? '#7c3aed' : '#fff', color: editor.isActive('link') ? '#fff' : '#475569' }}>
          <LinkIcon size={16} />
        </button>
        <button type="button" onClick={addImage} style={{ ...toolBtn, background: '#fff', color: '#475569' }}>
          <ImageIcon size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} style={{ ...toolBtn, background: '#fff', color: '#475569' }}>
          <Minus size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} style={{ ...toolBtn, background: '#fff', color: '#475569' }} title="Insert Table">
          <TableIcon size={16} />
        </button>

        <span style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} style={{ ...toolBtn, background: editor.isActive({ textAlign: 'left' }) ? '#7c3aed' : '#fff', color: editor.isActive({ textAlign: 'left' }) ? '#fff' : '#475569' }}>
          <AlignLeft size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} style={{ ...toolBtn, background: editor.isActive({ textAlign: 'center' }) ? '#7c3aed' : '#fff', color: editor.isActive({ textAlign: 'center' }) ? '#fff' : '#475569' }}>
          <AlignCenter size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} style={{ ...toolBtn, background: editor.isActive({ textAlign: 'right' }) ? '#7c3aed' : '#fff', color: editor.isActive({ textAlign: 'right' }) ? '#fff' : '#475569' }}>
          <AlignRight size={16} />
        </button>

        <span style={{ width: 1, height: 22, background: '#e2e8f0', margin: '0 4px' }} />

        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} style={{ ...toolBtn, background: '#fff', color: editor.can().chain().focus().undo().run() ? '#475569' : '#cbd5e1', cursor: editor.can().chain().focus().undo().run() ? 'pointer' : 'not-allowed' }}>
          <Undo2 size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} style={{ ...toolBtn, background: '#fff', color: editor.can().chain().focus().redo().run() ? '#475569' : '#cbd5e1', cursor: editor.can().chain().focus().redo().run() ? 'pointer' : 'not-allowed' }}>
          <Redo2 size={16} />
        </button>
      </div>

      {/* Editor body */}
      <div style={{ padding: '16px 20px', minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}

const toolBtn: React.CSSProperties = {
  width: 34, height: 34, borderRadius: 8, border: '1px solid #e2e8f0',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  transition: 'all 0.15s',
};