import React, { useState } from 'react';
import { 
  FileEdit, 
  Columns, 
  Eye, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  FolderOpen, 
  Sparkles,
  Sun,
  Moon
} from 'lucide-react';
import { EditorMode, ViewMode, Theme } from '../types';

interface HeaderProps {
  title: string;
  mode: EditorMode;
  viewMode: ViewMode;
  theme: Theme;
  onTitleChange: (newTitle: string) => void;
  onModeChange: (mode: EditorMode) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onPrint: () => void;
  onCopyContent: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  mode,
  viewMode,
  theme,
  onTitleChange,
  onModeChange,
  onViewModeChange,
  onToggleTheme,
  onToggleSidebar,
  onExportMarkdown,
  onExportHtml,
  onPrint,
  onCopyContent,
}) => {
  const [copied, setCopied] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleCopy = () => {
    onCopyContent();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-4 z-40 select-none">
      {/* Left: Brand & Sidebar & Document Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          title="Toggle Document Workspace (Sidebar)"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          <FolderOpen size={16} />
        </button>

        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-sky-500/20">
            <Sparkles size={14} />
          </div>
          <span className="font-extrabold text-sm tracking-tight hidden sm:inline bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
            SmartEditor
          </span>
        </div>

        <span className="text-slate-600">/</span>

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Document"
          className="bg-transparent text-sm font-semibold text-slate-200 focus:outline-none focus:bg-slate-800/80 px-2 py-1 rounded-md max-w-[200px] sm:max-w-[320px] transition border border-transparent focus:border-slate-700"
        />
      </div>

      {/* Center: Mode Switcher */}
      <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
        <button
          onClick={() => onModeChange('markdown')}
          className={`px-3 py-1 rounded-md font-semibold transition ${
            mode === 'markdown'
              ? 'bg-sky-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Markdown
        </button>
        <button
          onClick={() => onModeChange('html')}
          className={`px-3 py-1 rounded-md font-semibold transition ${
            mode === 'html'
              ? 'bg-sky-500 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          HTML Component
        </button>
      </div>

      {/* Right: View Modes & Export Suite */}
      <div className="flex items-center space-x-2">
        {/* View Mode Buttons */}
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-slate-400 text-xs">
          <button
            onClick={() => onViewModeChange('editor')}
            title="Editor Only"
            className={`p-1.5 rounded-md transition ${viewMode === 'editor' ? 'bg-slate-800 text-sky-400' : 'hover:text-slate-200'}`}
          >
            <FileEdit size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            title="Split View"
            className={`p-1.5 rounded-md transition ${viewMode === 'split' ? 'bg-slate-800 text-sky-400' : 'hover:text-slate-200'}`}
          >
            <Columns size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            title="Preview Only"
            className={`p-1.5 rounded-md transition ${viewMode === 'preview' ? 'bg-slate-800 text-sky-400' : 'hover:text-slate-200'}`}
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          title="Copy Content"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span className="hidden lg:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="p-1.5 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition flex items-center gap-1 text-xs font-semibold"
          >
            <Download size={14} />
            <span className="hidden sm:inline">Export</span>
          </button>

          {showExportMenu && (
            <div 
              className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-1"
              onMouseLeave={() => setShowExportMenu(false)}
            >
              <button
                onClick={() => { onExportMarkdown(); setShowExportMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
              >
                <span>📄</span>
                <span>Download as .md</span>
              </button>
              <button
                onClick={() => { onExportHtml(); setShowExportMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
              >
                <span>🌐</span>
                <span>Download as .html</span>
              </button>
              <button
                onClick={() => { onPrint(); setShowExportMenu(false); }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-200 flex items-center gap-2"
              >
                <Printer size={14} />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title="Toggle Theme"
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
        >
          {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
        </button>
      </div>
    </header>
  );
};
