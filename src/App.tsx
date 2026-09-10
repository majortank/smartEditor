import { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { Toolbar } from './components/Toolbar';
import { EditorPane } from './components/EditorPane';
import { PreviewPane } from './components/PreviewPane';
import { DocumentSidebar } from './components/DocumentSidebar';
import { StatsFooter } from './components/StatsFooter';
import { DocumentItem, EditorMode, ViewMode, Theme, TemplateItem } from './types';
import { TEMPLATES } from './templates';
import { computeStats } from './utils/statistics';
import { exportAsMarkdown, exportAsStandaloneHtml } from './utils/exporter';
import { renderMarkdown } from './utils/markdown';

const STORAGE_KEY = 'smart_editor_documents_v1';
const ACTIVE_DOC_KEY = 'smart_editor_active_id_v1';

export function App() {
  // Load documents from localStorage or initialize with RFC template
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error loading documents:', e);
    }
    // Default initial document
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
    const savedId = localStorage.getItem(ACTIVE_DOC_KEY);
    return savedId || (documents[0]?.id || '');
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [theme, setTheme] = useState<Theme>('dark');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [scrollPercentage, setScrollPercentage] = useState<number>(0);
  const [lastSavedAt, setLastSavedAt] = useState<number>(Date.now());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeDoc = useMemo(() => {
    return documents.find(d => d.id === activeDocId) || documents[0];
  }, [documents, activeDocId]);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(documents));
      localStorage.setItem(ACTIVE_DOC_KEY, activeDocId);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [documents, activeDocId]);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2200);
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

  const handleInsertText = (prefix: string, suffix: string = '', defaultText: string = '') => {
    if (!activeDoc) return;
    const current = activeDoc.content;
    const addition = `${prefix}${defaultText}${suffix}`;
    updateActiveDoc({ content: current + '\n' + addition });
  };

  const handleExportMarkdown = () => {
    if (!activeDoc) return;
    exportAsMarkdown(activeDoc.title, activeDoc.content);
    showToast('Exported as Markdown (.md)');
  };

  const handleExportHtml = () => {
    if (!activeDoc) return;
    const htmlToExport = activeDoc.mode === 'html'
      ? activeDoc.content
      : renderMarkdown(activeDoc.content);
    exportAsStandaloneHtml(activeDoc.title, htmlToExport);
    showToast('Exported as Standalone HTML (.html)');
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyContent = () => {
    if (!activeDoc) return;
    const textToCopy = activeDoc.mode === 'html'
      ? activeDoc.content
      : renderMarkdown(activeDoc.content);
    navigator.clipboard.writeText(textToCopy);
    showToast('Copied content to clipboard');
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
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-12 right-6 z-50 bg-sky-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <span>✨</span>
          <span>{toastMessage}</span>
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
        onViewModeChange={setViewMode}
        onToggleTheme={() => setTheme(t => (t === 'dark' ? 'light' : 'dark'))}
        onToggleSidebar={() => setSidebarOpen(s => !s)}
        onExportMarkdown={handleExportMarkdown}
        onExportHtml={handleExportHtml}
        onPrint={handlePrint}
        onCopyContent={handleCopyContent}
      />

      {/* Formatting Toolbar */}
      <Toolbar
        mode={activeDoc?.mode || 'markdown'}
        onInsertText={handleInsertText}
      />

      {/* Workspace Area: Split Pane */}
      <main className="flex-1 w-full flex overflow-hidden">
        {/* Editor Column */}
        {(viewMode === 'split' || viewMode === 'editor') && (
          <div className={`h-full overflow-hidden ${viewMode === 'split' ? 'w-1/2 border-r border-slate-800' : 'w-full'}`}>
            <EditorPane
              content={activeDoc?.content || ''}
              onChange={handleContentChange}
              onScrollSync={setScrollPercentage}
            />
          </div>
        )}

        {/* Preview Column */}
        {(viewMode === 'split' || viewMode === 'preview') && (
          <div className={`h-full overflow-hidden ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
            <PreviewPane
              content={activeDoc?.content || ''}
              mode={activeDoc?.mode || 'markdown'}
              scrollPercentage={scrollPercentage}
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
