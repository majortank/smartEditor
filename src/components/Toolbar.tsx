'use client';

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
  GitBranch,
  ArrowRightLeft,
  Layout,
  MousePointerClick,
  Columns,
  BadgeAlert,
  Sparkles,
  BarChart3,
  FormInput,
  AlertCircle
} from 'lucide-react';
import { EditorMode } from '../types';

interface ToolbarProps {
  mode: EditorMode;
  onInsertText: (prefix: string, suffix?: string, defaultText?: string) => void;
  onConvertToHtmlComponent?: () => void;
  onConvertToMarkdown?: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  mode,
  onInsertText,
  onConvertToHtmlComponent,
  onConvertToMarkdown,
}) => {
  if (mode === 'html') {
    return (
      <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/60 px-3 flex items-center space-x-1.5 text-slate-700 dark:text-slate-300 text-xs select-none overflow-x-auto transition-colors">
        {/* HTML to Markdown Converter Button */}
        {onConvertToMarkdown && (
          <button
            onClick={onConvertToMarkdown}
            title="Convert HTML back into Markdown syntax"
            className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 flex items-center gap-1.5 font-medium transition"
          >
            <ArrowRightLeft size={13} />
            <span>Convert to Markdown</span>
          </button>
        )}

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

        {/* UI Component Snippets */}
        <button
          onClick={() =>
            onInsertText(
              '<div class="p-6 max-w-sm mx-auto bg-white dark:bg-slate-900/90 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl">\n  <h3 class="text-base font-bold text-slate-900 dark:text-white mb-2">Card Title</h3>\n  <p class="text-sm text-slate-600 dark:text-slate-400">Card description content goes here.</p>\n</div>\n',
              '',
              ''
            )
          }
          title="Insert Tailwind Component Card"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
        >
          <Layout size={14} />
          <span className="hidden sm:inline text-[11px]">Card</span>
        </button>

        <button
          onClick={() =>
            onInsertText(
              '<button class="px-4 py-2 bg-sky-500 hover:bg-sky-400 active:scale-95 text-slate-950 font-bold rounded-xl transition shadow-lg shadow-sky-500/25 text-sm">\n  Click Action\n</button>\n',
              '',
              ''
            )
          }
          title="Insert Tailwind Button"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
        >
          <MousePointerClick size={14} />
          <span className="hidden sm:inline text-[11px]">Button</span>
        </button>

        <button
          onClick={() =>
            onInsertText(
              '<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950 dark:text-sky-400 dark:border-sky-800">\n  <span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span>\n  Active Status\n</span>\n',
              '',
              ''
            )
          }
          title="Insert Status Badge"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
        >
          <BadgeAlert size={14} />
          <span className="hidden sm:inline text-[11px]">Badge</span>
        </button>

        <button
          onClick={() =>
            onInsertText(
              '<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">\n  <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">Column 1</div>\n  <div class="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100">Column 2</div>\n</div>\n',
              '',
              ''
            )
          }
          title="Insert Responsive Grid"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
        >
          <Columns size={14} />
          <span className="hidden sm:inline text-[11px]">Grid</span>
        </button>

        <button
          onClick={() =>
            onInsertText(
              '<div class="mermaid my-6 flex justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto">\nflowchart TD\n  A[Client Request] --> B[API Gateway]\n  B --> C[Microservice]\n  C --> D[(Database)]\n</div>\n',
              '',
              ''
            )
          }
          title="Insert Mermaid Diagram Container"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1 font-medium"
        >
          <GitBranch size={14} />
          <span className="hidden sm:inline text-[11px]">Mermaid</span>
        </button>

        <button
          onClick={() =>
            onInsertText(
              '<div class="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md">\n  <div class="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Users</div>\n  <div class="text-2xl font-bold text-slate-900 dark:text-white mt-1">24,591</div>\n  <div class="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium flex items-center gap-1">↑ +18.4% vs last week</div>\n</div>\n',
              '',
              ''
            )
          }
          title="Insert Stat / Metric Card"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
        >
          <BarChart3 size={14} />
          <span className="hidden sm:inline text-[11px]">Metric</span>
        </button>

        <button
          onClick={() =>
            onInsertText(
              '<div class="w-full max-w-sm mb-4">\n  <label class="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>\n  <input type="email" placeholder="you@company.com" class="w-full px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />\n</div>\n',
              '',
              ''
            )
          }
          title="Insert Form Input Group"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
        >
          <FormInput size={14} />
          <span className="hidden sm:inline text-[11px]">Input</span>
        </button>

        <button
          onClick={() =>
            onInsertText(
              '<div class="p-4 rounded-xl border border-sky-200 dark:border-sky-800/70 bg-sky-50 dark:bg-sky-950/40 text-sky-900 dark:text-sky-200 text-xs flex items-center gap-3 mb-4">\n  <span class="text-base">💡</span>\n  <div><strong class="font-bold">Info:</strong> Workspace changes are automatically saved locally.</div>\n</div>\n',
              '',
              ''
            )
          }
          title="Insert Alert Banner"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 flex items-center gap-1"
        >
          <AlertCircle size={14} />
          <span className="hidden sm:inline text-[11px]">Alert</span>
        </button>

        <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

        {/* Standard Tags */}
        <button
          onClick={() => onInsertText('<div class="text-slate-900 dark:text-slate-100">\n  ', '\n</div>', 'Content')}
          title="Insert <div>"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[11px]"
        >
          &lt;div&gt;
        </button>
        <button
          onClick={() => onInsertText('<h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">', '</h2>', 'Heading')}
          title="Insert <h2>"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[11px]"
        >
          &lt;h2&gt;
        </button>
        <button
          onClick={() => onInsertText('<p class="text-slate-700 dark:text-slate-300 leading-relaxed">', '</p>', 'Paragraph text')}
          title="Insert <p>"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[11px]"
        >
          &lt;p&gt;
        </button>
        <button
          onClick={() => onInsertText('<pre class="p-4 bg-slate-950 text-slate-100 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto"><code>', '</code></pre>', '// Code here')}
          title="Insert <pre><code>"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[11px]"
        >
          &lt;code&gt;
        </button>
        <button
          onClick={() => onInsertText('<br>\n', '', '')}
          title="Insert <br> (Line Break)"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[11px]"
        >
          &lt;br&gt;
        </button>
        <button
          onClick={() => onInsertText('<hr class="my-4 border-slate-200 dark:border-slate-800">\n', '', '')}
          title="Insert <hr> (Horizontal Divider)"
          className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400 font-mono text-[11px]"
        >
          &lt;hr&gt;
        </button>
      </div>
    );
  }

  return (
    <div className="h-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/60 px-3 flex items-center space-x-1 text-slate-700 dark:text-slate-300 text-xs select-none overflow-x-auto transition-colors">
      {/* Markdown to HTML Converter Button */}
      {onConvertToHtmlComponent && (
        <>
          <button
            onClick={onConvertToHtmlComponent}
            title="Convert this Markdown document into an interactive HTML UI Component"
            className="px-2.5 py-1 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 flex items-center gap-1.5 font-medium transition mr-1"
          >
            <Sparkles size={13} className="text-sky-600 dark:text-sky-400" />
            <span>Convert to HTML Component</span>
          </button>
          <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />
        </>
      )}

      {/* Headings */}
      <button
        onClick={() => onInsertText('# ', '', 'Heading 1')}
        title="Heading 1"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Heading1 size={15} />
      </button>
      <button
        onClick={() => onInsertText('## ', '', 'Heading 2')}
        title="Heading 2"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Heading2 size={15} />
      </button>
      <button
        onClick={() => onInsertText('### ', '', 'Heading 3')}
        title="Heading 3"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Heading3 size={15} />
      </button>

      <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

      {/* Formatting */}
      <button
        onClick={() => onInsertText('**', '**', 'bold text')}
        title="Bold (Ctrl+B)"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Bold size={15} />
      </button>
      <button
        onClick={() => onInsertText('*', '*', 'italic text')}
        title="Italic (Ctrl+I)"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Italic size={15} />
      </button>
      <button
        onClick={() => onInsertText('~~', '~~', 'strikethrough text')}
        title="Strikethrough"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Strikethrough size={15} />
      </button>

      <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

      {/* Code */}
      <button
        onClick={() => onInsertText('`', '`', 'code')}
        title="Inline Code"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Code size={15} />
      </button>
      <button
        onClick={() => onInsertText('```typescript\n', '\n```', '// Your code here')}
        title="Code Block"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <FileCode size={15} />
      </button>

      <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

      {/* Lists */}
      <button
        onClick={() => onInsertText('- ', '', 'List item')}
        title="Bullet List"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <List size={15} />
      </button>
      <button
        onClick={() => onInsertText('1. ', '', 'First item')}
        title="Numbered List"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <ListOrdered size={15} />
      </button>
      <button
        onClick={() => onInsertText('- [ ] ', '', 'Task item')}
        title="Task Checklist"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <CheckSquare size={15} />
      </button>

      <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

      {/* Quotes & Links */}
      <button
        onClick={() => onInsertText('> ', '', 'Quote text')}
        title="Blockquote"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Quote size={15} />
      </button>
      <button
        onClick={() => onInsertText('[', '](https://example.com)', 'Link description')}
        title="Insert Link (Ctrl+K)"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Link2 size={15} />
      </button>
      <button
        onClick={() => onInsertText('![', '](https://images.unsplash.com/photo-1555066931-4365d14bab8c)', 'Image Alt Text')}
        title="Insert Image"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Image size={15} />
      </button>

      <div className="w-px h-4 bg-slate-300 dark:bg-slate-800 mx-1" />

      {/* Advanced Elements */}
      <button
        onClick={() => onInsertText(
          '| Column 1 | Column 2 | Column 3 |\n| :--- | :--- | :--- |\n| Value A | Value B | Value C |\n',
          '',
          ''
        )}
        title="Insert Table"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
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
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <GitBranch size={15} />
      </button>
      <button
        onClick={() => onInsertText('\n---\n\n', '', '')}
        title="Horizontal Rule"
        className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded transition hover:text-sky-600 dark:hover:text-sky-400"
      >
        <Minus size={15} />
      </button>
    </div>
  );
};
