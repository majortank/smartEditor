import React, { useRef, useEffect, useState } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw } from 'lucide-react';
import { EditorMode, DeviceViewport } from '../types';
import { renderMarkdown } from '../utils/markdown';

interface PreviewPaneProps {
  content: string;
  mode: EditorMode;
  scrollPercentage?: number;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  content,
  mode,
  scrollPercentage,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewport, setViewport] = useState<DeviceViewport>('desktop');
  const [iframeKey, setIframeKey] = useState(0);

  // Sync scroll from editor
  useEffect(() => {
    if (scrollPercentage === undefined || !containerRef.current) return;
    const { scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight > clientHeight) {
      containerRef.current.scrollTop = scrollPercentage * (scrollHeight - clientHeight);
    }
  }, [scrollPercentage]);

  if (mode === 'html') {
    return (
      <div className="w-full h-full flex flex-col bg-slate-950 overflow-hidden">
        {/* Viewport Control Bar */}
        <div className="h-10 border-b border-slate-800 bg-slate-900/60 px-4 flex items-center justify-between text-xs select-none">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded flex items-center gap-1 transition ${
                viewport === 'desktop' ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor size={14} />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded flex items-center gap-1 transition ${
                viewport === 'tablet' ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Tablet size={14} />
              <span className="hidden sm:inline">Tablet (768px)</span>
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded flex items-center gap-1 transition ${
                viewport === 'mobile' ? 'bg-sky-500/20 text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone size={14} />
              <span className="hidden sm:inline">Mobile (375px)</span>
            </button>
          </div>

          <button
            onClick={() => setIframeKey(k => k + 1)}
            title="Reload Preview Frame"
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition flex items-center gap-1"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reload</span>
          </button>
        </div>

        {/* Viewport Frame Container */}
        <div className="flex-1 w-full h-full p-4 flex items-center justify-center overflow-auto bg-slate-950/80">
          <div
            className={`h-full bg-white rounded-xl shadow-2xl transition-all duration-300 overflow-hidden border border-slate-800 ${
              viewport === 'mobile'
                ? 'w-[375px] max-h-[667px]'
                : viewport === 'tablet'
                ? 'w-[768px] max-h-[900px]'
                : 'w-full'
            }`}
          >
            <iframe
              key={iframeKey}
              srcDoc={content}
              title="HTML Component Live Preview"
              sandbox="allow-scripts allow-modals"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Markdown Preview Mode
  const renderedHtml = renderMarkdown(content);

  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto p-6 sm:p-10 bg-slate-900/30 text-slate-100 selection:bg-sky-500/30"
    >
      <div
        className="max-w-3xl mx-auto markdown-body space-y-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  );
};
