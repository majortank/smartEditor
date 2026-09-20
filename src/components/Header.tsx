'use client';

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
  Moon,
  ArrowRightLeft
} from 'lucide-react';
import { Logo } from './Logo';
import { EditorMode, ViewMode, Theme } from '../types';

interface HeaderProps {
  title: string;
  mode: EditorMode;
  viewMode: ViewMode;
  theme: Theme;
  onTitleChange: (newTitle: string) => void;
  onModeChange: (mode: EditorMode) => void;
  onRequestModeChange?: (targetMode: EditorMode) => void;
  onConvertToHtmlComponent?: (variant: 'component' | 'semantic') => void;
  onConvertToMarkdown?: () => void;
  onViewModeChange: (mode: ViewMode) => void;
  onToggleTheme: () => void;
  onToggleSidebar: () => void;
  onExportMarkdown: () => void;
  onExportHtml: () => void;
  onExportSnippet?: () => void;
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
  onRequestModeChange,
  onConvertToHtmlComponent,
  onConvertToMarkdown,
  onViewModeChange,
  onToggleTheme,
  onToggleSidebar,
  onExportMarkdown,
  onExportHtml,
  onExportSnippet,
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

  const handleModeClick = (target: EditorMode) => {
    if (onRequestModeChange) {
      onRequestModeChange(target);
    } else {
      onModeChange(target);
    }
  };

  return (
    <header className="h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/90 backdrop-blur-md flex items-center justify-between px-4 z-40 select-none transition-colors duration-200 shadow-sm dark:shadow-none">
      {/* Left: Brand & Sidebar & Document Title */}
      <div className="flex items-center space-x-3">
        <button
          onClick={onToggleSidebar}
          title="Toggle Document Workspace (Sidebar)"
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
        >
          <FolderOpen size={16} />
        </button>

        <div className="flex items-center space-x-2.5">
          <Logo size={28} />
          <span className="font-extrabold text-sm tracking-tight hidden sm:inline bg-gradient-to-r from-sky-500 via-cyan-400 to-indigo-500 bg-clip-text text-transparent">
            Marka
          </span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 hidden md:inline">
            v2
          </span>
        </div>

        <span className="text-slate-300 dark:text-slate-700">/</span>

        <input
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Untitled Document"
          className="bg-transparent text-sm font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:bg-slate-100 dark:focus:bg-slate-800/80 px-2 py-1 rounded-md max-w-[160px] sm:max-w-[280px] md:max-w-[320px] transition border border-transparent focus:border-slate-300 dark:focus:border-slate-700"
        />
      </div>

      {/* Center: Mode Switcher & Quick Conversion */}
      <div className="flex items-center space-x-2">
        <div className="flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs transition-colors">
          <button
            onClick={() => handleModeClick('markdown')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              mode === 'markdown'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            Markdown
          </button>
          <button
            onClick={() => handleModeClick('html')}
            className={`px-3 py-1 rounded-md font-semibold transition ${
              mode === 'html'
                ? 'bg-sky-500 text-slate-950 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
            }`}
          >
            HTML Component
          </button>
        </div>

        {/* Quick 1-click Conversion Button */}
        {mode === 'markdown' && onConvertToHtmlComponent && (
          <button
            onClick={() => onConvertToHtmlComponent('component')}
            title="Convert Markdown to HTML UI Component in Editor"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 text-xs font-medium transition"
          >
            <Sparkles size={12} />
            <span>Convert to HTML</span>
          </button>
        )}
        {mode === 'html' && onConvertToMarkdown && (
          <button
            onClick={onConvertToMarkdown}
            title="Convert HTML to Markdown in Editor"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 dark:bg-sky-500/10 dark:hover:bg-sky-500/20 dark:text-sky-400 dark:border-sky-500/30 text-xs font-medium transition"
          >
            <ArrowRightLeft size={12} />
            <span>Convert to MD</span>
          </button>
        )}
      </div>

      {/* Right: View Modes & Export Suite */}
      <div className="flex items-center space-x-2">
        {/* View Mode Buttons */}
        <div className="hidden md:flex items-center bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs transition-colors">
          <button
            onClick={() => onViewModeChange('editor')}
            title="Editor Only"
            className={`p-1.5 rounded-md transition ${viewMode === 'editor' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <FileEdit size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('split')}
            title="Split View"
            className={`p-1.5 rounded-md transition ${viewMode === 'split' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Columns size={14} />
          </button>
          <button
            onClick={() => onViewModeChange('preview')}
            title="Preview Only"
            className={`p-1.5 rounded-md transition ${viewMode === 'preview' ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm' : 'hover:text-slate-900 dark:hover:text-slate-200'}`}
          >
            <Eye size={14} />
          </button>
        </div>

        {/* Copy to Clipboard */}
        <button
          onClick={handleCopy}
          title="Copy formatted content to clipboard"
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition flex items-center gap-1 text-xs"
        >
          {copied ? <Check size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Copy size={14} />}
          <span className="hidden xl:inline">{copied ? 'Copied' : 'Copy'}</span>
        </button>

        {/* Print / PDF Button */}
        <button
          onClick={onPrint}
          title="Print or Save as PDF"
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition hidden sm:flex items-center"
        >
          <Printer size={14} />
        </button>

        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="px-3 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center space-x-1.5 transition shadow-sm shadow-sky-500/20 active:scale-95"
          >
            <Download size={13} />
            <span>Export</span>
          </button>

          {showExportMenu && (
            <>
              <div 
                className="fixed inset-0 z-40"
                onClick={() => setShowExportMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl py-1 z-50 text-xs">
                <button
                  onClick={() => { onExportMarkdown(); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span>Markdown (.md)</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">MD</span>
                </button>
                <button
                  onClick={() => { onExportHtml(); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span>Standalone HTML</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">COMPLETE</span>
                </button>
                {onExportSnippet && (
                  <button
                    onClick={() => { onExportSnippet(); setShowExportMenu(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
                  >
                    <span>HTML Component</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">SNIPPET</span>
                  </button>
                )}
                <div className="border-t border-slate-200 dark:border-slate-800 my-1" />
                <button
                  onClick={() => { onPrint(); setShowExportMenu(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between transition-colors"
                >
                  <span>Print / Save as PDF</span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">PRINT</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition"
        >
          {theme === 'dark' ? <Sun size={14} className="text-amber-400" /> : <Moon size={14} className="text-slate-600" />}
        </button>
      </div>
    </header>
  );
};
