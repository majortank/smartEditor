import React from 'react';
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  FileCode,
  Quote,
  List,
  ListOrdered,
  CheckSquare,
  Link2,
  Image,
  Table,
  Minus,
  Heading1,
  Heading2,
  Heading3,
  GitBranch
} from 'lucide-react';
import { EditorMode } from '../types';

interface ToolbarProps {
  mode: EditorMode;
  onInsertText: (prefix: string, suffix?: string, defaultText?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ mode, onInsertText }) => {
  if (mode === 'html') {
    return (
      <div className="h-10 border-b border-slate-800 bg-slate-900/50 px-4 flex items-center space-x-2 text-xs text-slate-400 select-none overflow-x-auto">
        <span className="font-semibold text-sky-400">HTML Visualizer Mode:</span>
        <span>Live DOM rendering with sandboxed execution. Type or paste HTML, CSS & JS.</span>
      </div>
    );
  }

  return (
    <div className="h-10 border-b border-slate-800 bg-slate-900/60 px-3 flex items-center space-x-1 text-slate-300 text-xs select-none overflow-x-auto">
      {/* Headings */}
      <button
        onClick={() => onInsertText('# ', '', 'Heading 1')}
        title="Heading 1"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Heading1 size={15} />
      </button>
      <button
        onClick={() => onInsertText('## ', '', 'Heading 2')}
        title="Heading 2"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Heading2 size={15} />
      </button>
      <button
        onClick={() => onInsertText('### ', '', 'Heading 3')}
        title="Heading 3"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Heading3 size={15} />
      </button>

      <div className="w-px h-4 bg-slate-800 mx-1" />

      {/* Formatting */}
      <button
        onClick={() => onInsertText('**', '**', 'bold text')}
        title="Bold (Ctrl+B)"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Bold size={15} />
      </button>
      <button
        onClick={() => onInsertText('*', '*', 'italic text')}
        title="Italic (Ctrl+I)"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Italic size={15} />
      </button>
      <button
        onClick={() => onInsertText('~~', '~~', 'strikethrough text')}
        title="Strikethrough"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Strikethrough size={15} />
      </button>

      <div className="w-px h-4 bg-slate-800 mx-1" />

      {/* Code */}
      <button
        onClick={() => onInsertText('`', '`', 'code')}
        title="Inline Code"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Code size={15} />
      </button>
      <button
        onClick={() => onInsertText('```typescript\n', '\n```', '// Your code here')}
        title="Code Block"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <FileCode size={15} />
      </button>

      <div className="w-px h-4 bg-slate-800 mx-1" />

      {/* Lists */}
      <button
        onClick={() => onInsertText('- ', '', 'List item')}
        title="Bullet List"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <List size={15} />
      </button>
      <button
        onClick={() => onInsertText('1. ', '', 'First item')}
        title="Numbered List"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <ListOrdered size={15} />
      </button>
      <button
        onClick={() => onInsertText('- [ ] ', '', 'Task item')}
        title="Task Checklist"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <CheckSquare size={15} />
      </button>

      <div className="w-px h-4 bg-slate-800 mx-1" />

      {/* Quotes & Links */}
      <button
        onClick={() => onInsertText('> ', '', 'Quote text')}
        title="Blockquote"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Quote size={15} />
      </button>
      <button
        onClick={() => onInsertText('[', '](https://example.com)', 'Link description')}
        title="Insert Link (Ctrl+K)"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Link2 size={15} />
      </button>
      <button
        onClick={() => onInsertText('![', '](https://images.unsplash.com/photo-1555066931-4365d14bab8c)', 'Image Alt Text')}
        title="Insert Image"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Image size={15} />
      </button>

      <div className="w-px h-4 bg-slate-800 mx-1" />

      {/* Advanced Elements */}
      <button
        onClick={() => onInsertText(
          '| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :--- |\n| Value A | Value B | Value C |\n',
          '',
          ''
        )}
        title="Insert Table"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Table size={15} />
      </button>
      <button
        onClick={() => onInsertText(
          '```mermaid\nflowchart TD\n    A[Start] --> B{Valid?}\n    B -->|Yes| C[Proceed]\n    B -->|No| D[Retry]\n```\n',
          '',
          ''
        )}
        title="Insert Mermaid Diagram"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <GitBranch size={15} />
      </button>
      <button
        onClick={() => onInsertText('\n---\n\n', '', '')}
        title="Horizontal Rule"
        className="p-1.5 hover:bg-slate-800 rounded transition hover:text-sky-400"
      >
        <Minus size={15} />
      </button>
    </div>
  );
};
