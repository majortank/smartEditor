'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  GitBranch,
  ChevronDown,
  Search,
  Layers,
  Activity,
  Calendar,
  BarChart2,
  FileCode2,
  Check,
  Sparkles
} from 'lucide-react';
import { MERMAID_SNIPPETS, MermaidSnippet } from '../data/mermaidSnippets';
import { EditorMode } from '../types';

interface MermaidDropdownProps {
  mode: EditorMode;
  onInsertText: (prefix: string, suffix?: string, defaultText?: string) => void;
}

const CATEGORIES = [
  'All',
  'Structure',
  'Behavior',
  'Planning',
  'Data & Analytics',
  'Specification'
] as const;

type CategoryFilter = typeof CATEGORIES[number];

export const MermaidDropdown: React.FC<MermaidDropdownProps> = ({ mode, onInsertText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focus search input on open
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const filteredSnippets = useMemo(() => {
    return MERMAID_SNIPPETS.filter((snippet) => {
      const matchesCategory =
        selectedCategory === 'All' || snippet.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        snippet.name.toLowerCase().includes(q) ||
        snippet.syntaxKey.toLowerCase().includes(q) ||
        snippet.description.toLowerCase().includes(q) ||
        snippet.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleSelect = (snippet: MermaidSnippet) => {
    setCopiedId(snippet.id);
    setTimeout(() => setCopiedId(null), 1200);

    if (mode === 'html') {
      const htmlSnippet = `<div class="mermaid my-6 flex justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto select-none" data-mermaid-code="${encodeURIComponent(snippet.code)}">\n${snippet.code}\n</div>\n`;
      onInsertText(htmlSnippet, '', '');
    } else {
      const markdownSnippet = `\`\`\`mermaid\n${snippet.code}\n\`\`\`\n\n`;
      onInsertText(markdownSnippet, '', '');
    }

    setIsOpen(false);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Structure':
        return <Layers size={11} className="text-sky-500 shrink-0" />;
      case 'Behavior':
        return <Activity size={11} className="text-emerald-500 shrink-0" />;
      case 'Planning':
        return <Calendar size={11} className="text-indigo-500 shrink-0" />;
      case 'Data & Analytics':
        return <BarChart2 size={11} className="text-amber-500 shrink-0" />;
      case 'Specification':
        return <FileCode2 size={11} className="text-rose-500 shrink-0" />;
      default:
        return <GitBranch size={11} className="text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Insert Mermaid Diagrams (20 presets available)"
        className={`px-2 py-1 rounded flex items-center gap-1.5 font-medium transition text-xs ${
          isOpen
            ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300'
            : 'hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400'
        }`}
      >
        <GitBranch size={14} className="text-sky-600 dark:text-sky-400 shrink-0" />
        <span className="font-medium">Diagrams</span>
        <span className="hidden xl:inline text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
          20
        </span>
        <ChevronDown
          size={12}
          className={`transition-transform duration-200 opacity-60 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute left-0 mt-1.5 w-[380px] sm:w-[440px] max-h-[500px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 z-50 overflow-hidden text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150">
          {/* Header & Search */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-sky-500" />
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Insert Mermaid Diagram
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {filteredSnippets.length} of {MERMAID_SNIPPETS.length}
              </span>
            </div>

            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sequence, ER, class, kanban, gantt..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none text-[11px]">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-2 py-0.5 rounded-md whitespace-nowrap transition font-medium ${
                      isSelected
                        ? 'bg-sky-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Snippets List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[340px]">
            {filteredSnippets.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No diagrams match &ldquo;{searchQuery}&rdquo;
              </div>
            ) : (
              filteredSnippets.map((snippet) => {
                const isCopied = copiedId === snippet.id;
                return (
                  <button
                    key={snippet.id}
                    onClick={() => handleSelect(snippet)}
                    className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition group flex items-start gap-2.5"
                  >
                    <div className="mt-0.5 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/60 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition shrink-0">
                      {getCategoryIcon(snippet.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-semibold text-slate-900 dark:text-white truncate group-hover:text-sky-600 dark:group-hover:text-sky-400 transition">
                          {snippet.name}
                        </span>
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0">
                          {snippet.syntaxKey}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 leading-snug">
                        {snippet.description}
                      </p>
                    </div>
                    {isCopied && (
                      <Check size={14} className="text-emerald-500 shrink-0 mt-1" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
            <span>
              Inserts at cursor ({mode === 'html' ? 'HTML container' : 'Markdown block'})
            </span>
            <span className="font-mono text-[10px] text-slate-500">Esc to close</span>
          </div>
        </div>
      )}
    </div>
  );
};
