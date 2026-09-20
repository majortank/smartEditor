'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Header } from './Header';
import { Toolbar } from './Toolbar';
import { EditorPane, EditorPaneRef } from './EditorPane';
import { PreviewPane } from './PreviewPane';
import { DocumentSidebar } from './DocumentSidebar';
import { StatsFooter } from './StatsFooter';
import { DocumentItem, EditorMode, ViewMode, Theme, TemplateItem } from '../types';
import { TEMPLATES } from '../templates';
import { computeStats } from '../utils/statistics';
import { exportAsMarkdown, exportAsStandaloneHtml, exportAsHtmlSnippet, printDocument } from '../utils/exporter';
import { renderMarkdown } from '../utils/markdown';
import { 
  markdownToHtmlComponent, 
  htmlToMarkdown, 
  isHtmlContent 
} from '../utils/converter';
import { Sparkles, ArrowRightLeft, X } from 'lucide-react';

const STORAGE_KEY = 'marka_documents_v1';
const LEGACY_STORAGE_KEY = 'smart_editor_documents_v1';
const ACTIVE_DOC_KEY = 'marka_active_id_v1';
const LEGACY_ACTIVE_DOC_KEY = 'smart_editor_active_id_v1';
const THEME_KEY = 'marka_theme_v1';
const LEGACY_THEME_KEY = 'smart_editor_theme_v1';

export function EditorApp() {
  const [isClient, setIsClient] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Error loading documents:', e);
      }
    }
    const initialTmpl = TEMPLATES[0];
    return [
      {
        id: 'doc-' + Date.now(),
        title: initialTmpl.name,
        content: initialTmpl.content,
        mode: initialTmpl.mode,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
    ];
  });

  const [activeDocId, setActiveDocId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem(ACTIVE_DOC_KEY) || localStorage.getItem(LEGACY_ACTIVE_DOC_KEY);
      if (savedId) return savedId;
    }
    return documents[0]?.id || '';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
    }
    return 'dark';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [lastSavedAt, setLastSavedAt] = useState<number>(Date.now());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [conversionPrompt, setConversionPrompt] = useState<{ targetMode: EditorMode } | null>(null);
  const editorPaneRef = useRef<EditorPaneRef>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Sync theme to root html element for global Tailwind dark mode
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(THEME_KEY, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (e) {
      console.error('Error syncing theme:', e);
    }
  }, [theme, isClient]);

  const activeDoc = useMemo(() => {
    return documents.find(d => d.id === activeDocId) || documents[0];
  }, [documents, activeDocId]);

  // Persist documents to localStorage
  useEffect(() => {
    if (!isClient) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
      localStorage.setItem(ACTIVE_DOC_KEY, activeDocId);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [documents, activeDocId, isClient]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  }, []);

  const updateActiveDoc = useCallback((updates: Partial<DocumentItem>) => {
    if (!activeDoc) return;
    const now = Date.now();
    setDocuments(prev =>
      prev.map(d => (d.id === activeDoc.id ? { ...d, ...updates, updatedAt: now } : d))
    );
    setLastSavedAt(now);
  }, [activeDoc]);

  const handleTitleChange = (newTitle: string) => {
    updateActiveDoc({ title: newTitle });
  };

  const handleContentChange = (newContent: string) => {
    updateActiveDoc({ content: newContent });
  };

  const handleModeChange = (mode: EditorMode) => {
    updateActiveDoc({ mode });
  };

  // Convert current markdown content into an HTML component
  const handleConvertToHtmlComponent = useCallback((variant: 'component' | 'semantic' = 'component') => {
    if (!activeDoc) return;
    const converted = markdownToHtmlComponent(activeDoc.content, variant);
    updateActiveDoc({ content: converted, mode: 'html' });
    showToast(`Converted to HTML ${variant === 'component' ? 'Component Card' : 'Semantic Markup'}`);
  }, [activeDoc, updateActiveDoc, showToast]);

  // Convert current HTML content into clean markdown
  const handleConvertToMarkdown = useCallback(() => {
    if (!activeDoc) return;
    const converted = htmlToMarkdown(activeDoc.content);
    updateActiveDoc({ content: converted, mode: 'markdown' });
    showToast('Converted HTML to Markdown');
  }, [activeDoc, updateActiveDoc, showToast]);

  // Handle mode switch click from header with intelligent conversion prompt
  const handleRequestModeChange = useCallback((targetMode: EditorMode) => {
    if (!activeDoc || targetMode === activeDoc.mode) return;

    const trimmed = activeDoc.content.trim();
    if (!trimmed) {
      updateActiveDoc({ mode: targetMode });
      return;
    }

    if (targetMode === 'html') {
      if (isHtmlContent(trimmed)) {
        updateActiveDoc({ mode: 'html' });
        return;
      }
      setConversionPrompt({ targetMode: 'html' });
    } else {
      if (!isHtmlContent(trimmed)) {
        updateActiveDoc({ mode: 'markdown' });
        return;
      }
      setConversionPrompt({ targetMode: 'markdown' });
    }
  }, [activeDoc, updateActiveDoc]);

  const handleCreateDoc = () => {
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      title: 'New Document',
      content: '# Untitled Document\n\nStart writing here...',
      mode: 'markdown',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
    setSidebarOpen(false);
    showToast('New document created');
  };

  const handleDeleteDoc = (id: string) => {
    if (documents.length <= 1) return;
    const remaining = documents.filter(d => d.id !== id);
    setDocuments(remaining);
    if (activeDocId === id) {
      setActiveDocId(remaining[0].id);
    }
    showToast('Document deleted');
  };

  const handleDuplicateDoc = (doc: DocumentItem) => {
    const dup: DocumentItem = {
      ...doc,
      id: 'doc-' + Date.now(),
      title: `${doc.title} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDocuments(prev => [dup, ...prev]);
    setActiveDocId(dup.id);
    showToast('Document duplicated');
  };

  const handleLoadTemplate = (template: TemplateItem) => {
    const newDoc: DocumentItem = {
      id: 'doc-' + Date.now(),
      title: template.name,
      content: template.content,
      mode: template.mode,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocId(newDoc.id);
    setSidebarOpen(false);
    showToast(`Loaded template: ${template.name}`);
  };

  const handleInsertText = useCallback((prefix: string, suffix: string = '', defaultText: string = '') => {
    if (editorPaneRef.current) {
      editorPaneRef.current.insertAtCursor(prefix, suffix, defaultText);
    } else {
      if (!activeDoc) return;
      const current = activeDoc.content;
      const addition = `${prefix}${defaultText}${suffix}`;
      updateActiveDoc({ content: current ? current + '\n' + addition : addition });
    }
  }, [activeDoc, updateActiveDoc]);

  const handleExportMarkdown = useCallback(() => {
    if (!activeDoc) return;
    exportAsMarkdown(activeDoc.title, activeDoc.content, activeDoc.mode);
    showToast('Exported as Markdown (.md)');
  }, [activeDoc, showToast]);

  const handleExportHtml = useCallback(() => {
    if (!activeDoc) return;
    exportAsStandaloneHtml(activeDoc.title, activeDoc.content, activeDoc.mode, theme);
    showToast('Exported Standalone HTML with styles (.html)');
  }, [activeDoc, theme, showToast]);

  const handleExportSnippet = useCallback(() => {
    if (!activeDoc) return;
    exportAsHtmlSnippet(activeDoc.title, activeDoc.content, activeDoc.mode);
    showToast('Exported HTML component snippet (.html)');
  }, [activeDoc, showToast]);

  const handlePrint = useCallback(() => {
    if (!activeDoc) return;
    printDocument(activeDoc.title, activeDoc.content, activeDoc.mode, theme);
    showToast('Opening print dialog (Content & Styling Only)...');
  }, [activeDoc, theme, showToast]);

  // Intercept Ctrl+P / Cmd+P to invoke clean document print
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handlePrint();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrint]);

  const handleCopyContent = () => {
    if (!activeDoc) return;
    const textToCopy = activeDoc.mode === 'html'
      ? activeDoc.content
      : renderMarkdown(activeDoc.content);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      showToast('Copied content to clipboard');
    }
  };

  const stats = useMemo(() => {
    return computeStats(activeDoc?.content || '');
  }, [activeDoc?.content]);

  // Handle Ctrl+S keyboard shortcut
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        setLastSavedAt(Date.now());
        showToast('Document saved to local storage');
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, [showToast]);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'} transition-colors duration-200`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-sky-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <Sparkles size={14} className="text-slate-950 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Mode Switch Conversion Modal */}
      {conversionPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 text-slate-900 dark:text-slate-100">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-600 dark:text-sky-400">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {conversionPrompt.targetMode === 'html'
                      ? 'Convert to HTML Component?'
                      : 'Convert to Markdown?'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {conversionPrompt.targetMode === 'html'
                      ? 'Transform your Markdown into an interactive HTML UI component'
                      : 'Parse HTML tags back into clean GitHub Flavored Markdown'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setConversionPrompt(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              {conversionPrompt.targetMode === 'html' ? (
                <>
                  <button
                    onClick={() => {
                      handleConvertToHtmlComponent('component');
                      setConversionPrompt(null);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition active:scale-98"
                  >
                    <Sparkles size={14} />
                    <span>Convert to Tailwind UI Component Card</span>
                  </button>
                  <button
                    onClick={() => {
                      handleConvertToHtmlComponent('semantic');
                      setConversionPrompt(null);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition"
                  >
                    Convert to Clean Semantic HTML
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    handleConvertToMarkdown();
                    setConversionPrompt(null);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 transition active:scale-98"
                >
                  <ArrowRightLeft size={14} />
                  <span>Convert HTML to Markdown</span>
                </button>
              )}

              <button
                onClick={() => {
                  updateActiveDoc({ mode: conversionPrompt.targetMode });
                  setConversionPrompt(null);
                  showToast(`Switched mode to ${conversionPrompt.targetMode === 'html' ? 'HTML Component' : 'Markdown'}`);
                }}
                className="w-full py-2 px-4 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 text-xs font-medium transition text-center"
              >
                Switch Mode Only (Keep Text As-Is)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Document Sidebar (Workspace) */}
      <DocumentSidebar
        isOpen={sidebarOpen}
        documents={documents}
        activeDocId={activeDocId}
        onClose={() => setSidebarOpen(false)}
        onSelectDoc={(id) => { setActiveDocId(id); setSidebarOpen(false); }}
        onCreateDoc={handleCreateDoc}
        onDeleteDoc={handleDeleteDoc}
        onDuplicateDoc={handleDuplicateDoc}
        onLoadTemplate={handleLoadTemplate}
      />

      {/* Main Header */}
      <Header
        title={activeDoc?.title || 'Untitled Document'}
        mode={activeDoc?.mode || 'markdown'}
        viewMode={viewMode}
        theme={theme}
        onTitleChange={handleTitleChange}
        onModeChange={handleModeChange}
        onRequestModeChange={handleRequestModeChange}
        onConvertToHtmlComponent={() => handleConvertToHtmlComponent('component')}
        onConvertToMarkdown={handleConvertToMarkdown}
        onViewModeChange={setViewMode}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        onToggleSidebar={() => setSidebarOpen(s => !s)}
        onExportMarkdown={handleExportMarkdown}
        onExportHtml={handleExportHtml}
        onExportSnippet={handleExportSnippet}
        onPrint={handlePrint}
        onCopyContent={handleCopyContent}
      />

      {/* Formatting Toolbar */}
      <Toolbar
        mode={activeDoc?.mode || 'markdown'}
        onInsertText={handleInsertText}
        onConvertToHtmlComponent={() => handleConvertToHtmlComponent('component')}
        onConvertToMarkdown={handleConvertToMarkdown}
      />

      {/* Workspace Area: Split Pane */}
      <main className="flex-1 w-full flex overflow-hidden">
        {/* Editor Column */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`editor-pane-column h-full overflow-hidden ${viewMode === 'split' ? 'w-1/2 border-r border-slate-200 dark:border-slate-800' : 'w-full'} transition-colors`}>
            <EditorPane
              ref={editorPaneRef}
              content={activeDoc?.content || ''}
              onChange={handleContentChange}
              onScrollSync={setScrollPercentage}
            />
          </div>
        )}

        {/* Preview Column */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`preview-pane-column h-full overflow-hidden ${viewMode === 'split' ? 'w-1/2' : 'w-full'} transition-colors`}>
            <PreviewPane
              content={activeDoc?.content || ''}
              mode={activeDoc?.mode || 'markdown'}
              theme={theme}
              scrollPercentage={scrollPercentage}
              onConvertInEditor={() => handleConvertToHtmlComponent('component')}
            />
          </div>
        )}
      </main>

      {/* Statistics Footer */}
      <StatsFooter
        stats={stats}
        lastSavedAt={lastSavedAt}
      />

    </div>
  );
}

export default EditorApp;
