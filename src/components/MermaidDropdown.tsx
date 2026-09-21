'use client';

import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
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
  Sparkles,
  X
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
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [coords, setCoords] = useState<{ top: number; left: number; width: number }>({
    top: 0,
    left: 0,
    width: 420
  });

  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update fixed popover position relative to button
  const updatePosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const popoverWidth = Math.min(440, Math.max(320, window.innerWidth - 32));

    let left = rect.left;
    if (left + popoverWidth > window.innerWidth - 16) {
      left = Math.max(16, window.innerWidth - popoverWidth - 16);
    }

    setCoords({
      top: rect.bottom + 6,
      left: left,
      width: popoverWidth
    });
  }, []);

  // Handle open / toggle
  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  // Close when clicking outside of button and popover
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        buttonRef.current &&
        !buttonRef.current.contains(target) &&
        popoverRef.current &&
        !popoverRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      updatePosition();
    }

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    // Auto-focus search input
    const timer = setTimeout(() => searchInputRef.current?.focus(), 60);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
      clearTimeout(timer);
    };
  }, [isOpen, updatePosition]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Filter snippets: searches across all 20 diagrams if search query is provided
  const filteredSnippets = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return MERMAID_SNIPPETS.filter((snippet) => {
      const matchesCategory =
        Boolean(q) || // When actively searching, search across all categories!
        selectedCategory === 'All' ||
        snippet.category === selectedCategory;

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
        return <Layers size={12} className="text-sky-500 shrink-0" />;
      case 'Behavior':
        return <Activity size={12} className="text-emerald-500 shrink-0" />;
      case 'Planning':
        return <Calendar size={12} className="text-indigo-500 shrink-0" />;
      case 'Data & Analytics':
        return <BarChart2 size={12} className="text-amber-500 shrink-0" />;
      case 'Specification':
        return <FileCode2 size={12} className="text-rose-500 shrink-0" />;
      default:
        return <GitBranch size={12} className="text-slate-400 shrink-0" />;
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
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

      {/* Portal-mounted Popover Menu (escapes toolbar overflow clipping) */}
      {isOpen &&
        mounted &&
        createPortal(
          <div
            ref={popoverRef}
            style={{
              position: 'fixed',
              top: `${coords.top}px`,
              left: `${coords.left}px`,
              width: `${coords.width}px`,
              zIndex: 9999
            }}
            className="max-h-[520px] flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-800 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-xl"
          >
            {/* Header & Search */}
            <div className="p-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 space-y-2.5">
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

              {/* Search Bar */}
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
                  className="w-full pl-8 pr-7 py-1.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 transition"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-1 overflow-x-auto pb-0.5 text-[11px] no-scrollbar">
                {CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat && !searchQuery;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSearchQuery('');
                      }}
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
            <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-[350px]">
              {filteredSnippets.length === 0 ? (
                <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                  <p>No diagrams match &ldquo;{searchQuery}&rdquo;</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('All');
                    }}
                    className="px-3 py-1 text-xs bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400 rounded-lg hover:underline"
                  >
                    Reset filter & show all 20 diagrams
                  </button>
                </div>
              ) : (
                filteredSnippets.map((snippet) => {
                  const isCopied = copiedId === snippet.id;
                  return (
                    <button
                      key={snippet.id}
                      type="button"
                      onClick={() => handleSelect(snippet)}
                      className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 border border-transparent hover:border-slate-200 dark:hover:border-slate-700/60 transition group flex items-start gap-2.5 cursor-pointer"
                    >
                      <div className="mt-0.5 p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-sky-50 dark:group-hover:bg-sky-950/60 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition shrink-0">
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

            {/* Footer */}
            <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/80 dark:bg-slate-900/80 flex items-center justify-between text-[11px] text-slate-400 select-none">
              <span>
                Inserts at cursor ({mode === 'html' ? 'HTML container' : 'Markdown block'})
              </span>
              <span className="font-mono text-[10px] text-slate-500">Esc to close</span>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};
