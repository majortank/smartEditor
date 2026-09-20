'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Monitor, Tablet, Smartphone, RotateCcw, Sparkles } from 'lucide-react';
import { EditorMode, DeviceViewport, Theme } from '../types';
import { renderMarkdown } from '../utils/markdown';
import { isHtmlContent, markdownToHtmlComponent, wrapHtmlComponentForPreview } from '../utils/converter';

interface PreviewPaneProps {
  content: string;
  mode: EditorMode;
  theme?: Theme;
  scrollPercentage?: number;
  onConvertInEditor?: () => void;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({
  content,
  mode,
  theme = 'dark',
  scrollPercentage,
  onConvertInEditor,
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

  // Compute HTML content for preview sandbox
  const isContentHtml = useMemo(() => isHtmlContent(content), [content]);

  const htmlToPreview = useMemo(() => {
    if (mode !== 'html') return '';
    if (isContentHtml) {
      return wrapHtmlComponentForPreview(content, theme);
    }
    // Auto-convert Markdown content to an interactive HTML Component for live preview
    const compiled = markdownToHtmlComponent(content, 'component');
    return wrapHtmlComponentForPreview(compiled, theme);
  }, [content, mode, theme, isContentHtml]);

  // Memoize rendered HTML for Markdown mode
  const renderedHtml = useMemo(() => {
    return mode === 'markdown' ? renderMarkdown(content) : '';
  }, [content, mode]);

  // Dynamically render Mermaid diagrams in Markdown preview with debounce & syntax safety
  useEffect(() => {
    if (mode !== 'markdown' || !containerRef.current) return;

    const mermaidNodes = containerRef.current.querySelectorAll<HTMLElement>('.mermaid');
    if (mermaidNodes.length === 0) return;

    let isCancelled = false;

    const timer = setTimeout(() => {
      import('mermaid')
        .then(async ({ default: mermaid }) => {
          if (isCancelled) return;

          mermaid.initialize({
            startOnLoad: false,
            theme: theme === 'dark' ? 'dark' : 'default',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, sans-serif',
          });

          // Helper to remove any orphan error elements Mermaid may append to document.body
          const cleanOrphanErrorNodes = () => {
            if (typeof document === 'undefined') return;
            document.querySelectorAll('body > [id^="dmermaid-"], body > [id^="mermaid-"]').forEach(el => el.remove());
          };

          for (let index = 0; index < mermaidNodes.length; index++) {
            if (isCancelled) break;
            const node = mermaidNodes[index];

            // Cache original raw code in dataset so subsequent theme changes or renders have clean code
            if (!node.dataset.mermaidCode) {
              node.dataset.mermaidCode = node.textContent || '';
            }
            const code = (node.dataset.mermaidCode || '').trim();
            if (!code) continue;

            const uniqueId = `mermaid-svg-${index}-${Date.now()}`;

            try {
              // Validate syntax with mermaid.parse before render to avoid DOM error nodes
              await mermaid.parse(code);
              const { svg } = await mermaid.render(uniqueId, code);
              cleanOrphanErrorNodes();
              if (!isCancelled && node) {
                node.innerHTML = svg;
              }
            } catch {
              cleanOrphanErrorNodes();
              if (!isCancelled && node) {
                node.innerHTML = `
                  <div class="w-full text-left font-mono text-xs text-amber-600 dark:text-amber-400 p-4 bg-amber-50/80 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 shadow-sm">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-1.5 font-bold text-amber-800 dark:text-amber-300">
                        <span class="inline-block w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                        <span>Mermaid Diagram (Editing...)</span>
                      </div>
                      <span class="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300">Syntax Incomplete</span>
                    </div>
                    <pre class="bg-transparent p-0 text-xs overflow-x-auto whitespace-pre font-mono text-slate-700 dark:text-slate-300">${code}</pre>
                  </div>
                `;
              }
            }
          }
        })
        .catch(err => {
          console.error('Failed to load mermaid in preview:', err);
        });
    }, 120);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [renderedHtml, mode, theme]);

  if (mode === 'html') {
    return (
      <div className="w-full h-full flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden transition-colors">
        {/* Viewport Control Bar */}
        <div className="viewport-bar h-10 border-b border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-slate-900/60 px-4 flex items-center justify-between text-xs select-none transition-colors">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded flex items-center gap-1 transition ${
                  viewport === 'desktop'
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Desktop Viewport (100%)"
              >
                <Monitor size={14} />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded flex items-center gap-1 transition ${
                  viewport === 'tablet'
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Tablet Viewport (768px)"
              >
                <Tablet size={14} />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded flex items-center gap-1 transition ${
                  viewport === 'mobile'
                    ? 'bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-400 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
                title="Mobile Viewport (375px)"
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            {/* Auto-compiled indicator if editor contains Markdown in HTML mode */}
            {!isContentHtml && content.trim().length > 0 && (
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] bg-sky-50 text-sky-700 border border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800/80 transition-colors">
                <Sparkles size={12} className="text-sky-600 dark:text-sky-400 animate-pulse" />
                <span className="hidden md:inline">Live converted to HTML Component</span>
                {onConvertInEditor && (
                  <button
                    onClick={onConvertInEditor}
                    title="Write this converted HTML into the editor"
                    className="ml-1 px-1.5 py-0.2 bg-sky-500 hover:bg-sky-400 text-slate-950 rounded font-semibold text-[10px] transition"
                  >
                    Sync to Editor
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setIframeKey(k => k + 1)}
            title="Reload Preview Frame"
            className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition flex items-center gap-1"
          >
            <RotateCcw size={13} />
            <span className="hidden sm:inline">Reload</span>
          </button>
        </div>

        {/* Viewport Frame Container */}
        <div className="flex-1 w-full h-full p-4 flex items-center justify-center overflow-auto bg-slate-200/50 dark:bg-slate-950/90 transition-colors">
          <div
            className={`h-full ${theme === 'dark' ? 'bg-slate-950' : 'bg-white'} rounded-xl shadow-2xl transition-all duration-300 overflow-hidden border border-slate-300 dark:border-slate-800 ${
              viewport === 'mobile'
                ? 'w-[375px] max-h-[667px]'
                : viewport === 'tablet'
                ? 'w-[768px] max-h-[900px]'
                : 'w-full'
            }`}
          >
            <iframe
              key={iframeKey}
              srcDoc={htmlToPreview}
              title="HTML Component Live Preview"
              sandbox="allow-scripts allow-modals allow-same-origin"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    );
  }

  // Markdown Preview Mode
  return (
    <div
      ref={containerRef}
      className="w-full h-full overflow-y-auto p-6 sm:p-10 bg-white dark:bg-slate-900/30 text-slate-900 dark:text-slate-100 selection:bg-sky-500/20 dark:selection:bg-sky-500/30 transition-colors"
    >
      <div
        className="max-w-3xl mx-auto markdown-body space-y-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderedHtml }}
      />
    </div>
  );
};
