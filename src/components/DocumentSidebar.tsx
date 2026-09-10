import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  FileText, 
  Sparkles, 
  X, 
  Calendar,
  Layers
} from 'lucide-react';
import { DocumentItem, TemplateItem } from '../types';
import { TEMPLATES } from '../templates';

interface DocumentSidebarProps {
  isOpen: boolean;
  documents: DocumentItem[];
  activeDocId: string;
  onClose: () => void;
  onSelectDoc: (id: string) => void;
  onCreateDoc: () => void;
  onDeleteDoc: (id: string) => void;
  onDuplicateDoc: (doc: DocumentItem) => void;
  onLoadTemplate: (template: TemplateItem) => void;
}

export const DocumentSidebar: React.FC<DocumentSidebarProps> = ({
  isOpen,
  documents,
  activeDocId,
  onClose,
  onSelectDoc,
  onCreateDoc,
  onDeleteDoc,
  onDuplicateDoc,
  onLoadTemplate,
}) => {
  const [activeTab, setActiveTab] = useState<'documents' | 'templates'>('documents');

  if (!isOpen) return null;

  return (
    <aside className="fixed inset-y-0 left-0 z-50 w-80 bg-slate-900 border-r border-slate-800 shadow-2xl flex flex-col transition-all duration-300">
      {/* Sidebar Header */}
      <div className="h-14 px-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Layers size={18} className="text-sky-400" />
          <span className="font-bold text-sm text-slate-200">Workspace Library</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="p-3 grid grid-cols-2 gap-1 bg-slate-950/60 border-b border-slate-800 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('documents')}
          className={`py-1.5 rounded-lg transition ${
            activeTab === 'documents'
              ? 'bg-slate-800 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Documents ({documents.length})
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`py-1.5 rounded-lg transition flex items-center justify-center gap-1.5 ${
            activeTab === 'templates'
              ? 'bg-slate-800 text-sky-400 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles size={13} />
          <span>Templates</span>
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {activeTab === 'documents' ? (
          <>
            <button
              onClick={onCreateDoc}
              className="w-full py-2 px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-sky-500/20 transition mb-3"
            >
              <Plus size={15} />
              <span>New Document</span>
            </button>

            {documents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No documents saved yet.
              </div>
            ) : (
              documents.map((doc) => {
                const isActive = doc.id === activeDocId;
                return (
                  <div
                    key={doc.id}
                    onClick={() => onSelectDoc(doc.id)}
                    className={`group p-3 rounded-xl border transition cursor-pointer flex flex-col space-y-1.5 ${
                      isActive
                        ? 'bg-slate-800/90 border-sky-500/50 shadow-md'
                        : 'bg-slate-900/50 border-slate-800/80 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 truncate">
                        <FileText size={14} className={isActive ? 'text-sky-400' : 'text-slate-500'} />
                        <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                          {doc.title || 'Untitled Document'}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 uppercase">
                        {doc.mode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={11} />
                        {new Date(doc.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      
                      <div className="opacity-0 group-hover:opacity-100 transition flex items-center space-x-1" onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => onDuplicateDoc(doc)}
                          title="Duplicate"
                          className="p-1 hover:text-sky-400 transition"
                        >
                          <Copy size={12} />
                        </button>
                        {documents.length > 1 && (
                          <button
                            onClick={() => onDeleteDoc(doc.id)}
                            title="Delete"
                            className="p-1 hover:text-rose-400 transition"
                          >
                            <Trash2 size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </>
        ) : (
          <div className="space-y-3">
            <p className="text-[11px] text-slate-400 leading-relaxed px-1">
              Select a production template to jumpstart your technical documentation or interactive web component:
            </p>
            {TEMPLATES.map((tmpl) => (
              <div
                key={tmpl.id}
                onClick={() => onLoadTemplate(tmpl)}
                className="p-3.5 bg-slate-950/60 hover:bg-slate-800/60 border border-slate-800 rounded-xl transition cursor-pointer group space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 group-hover:text-sky-400 transition">
                    {tmpl.name}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-950/60 text-sky-400 font-mono border border-sky-800/50">
                    {tmpl.mode}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {tmpl.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};
