import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { getCachedSvg } from './mermaidRenderer';
import { Theme } from '../types';

let currentRenderTheme: Theme = 'dark';

interface DiagramSlot {
  code: string;
  cachedSvg?: string;
}

let activeSlots: DiagramSlot[] = [];

marked.setOptions({
  gfm: true,
  breaks: true,
});

marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      if (lang === 'mermaid') {
        const trimmed = text.trim();
        const cachedSvg = getCachedSvg(trimmed, currentRenderTheme);
        const slotIndex = activeSlots.length;
        activeSlots.push({ code: trimmed, cachedSvg });
        return `<div data-mermaid-slot="${slotIndex}"></div>`;
      }
      return false;
    },
  },
});

export function renderMarkdown(content: string, theme: Theme = 'dark'): string {
  if (!content) return '';
  try {
    currentRenderTheme = theme;
    activeSlots = [];
    const rawHtml = marked.parse(content) as string;

    let sanitized = rawHtml;
    if (typeof window !== 'undefined') {
      sanitized = DOMPurify.sanitize(rawHtml, {
        USE_PROFILES: { html: true, svg: true },
        ADD_TAGS: [
          'iframe',
          'style',
          'code',
          'pre',
          'button',
          'input',
          'span',
          'div',
        ],
        ADD_ATTR: [
          'target',
          'class',
          'id',
          'type',
          'checked',
          'style',
          'data-mermaid-slot',
        ],
        ALLOW_DATA_ATTR: true,
      });
    }

    // Restore mermaid diagram slots with intact, pristine SVGs (unmolested by DOMPurify)
    for (let i = 0; i < activeSlots.length; i++) {
      const slot = activeSlots[i];
      const encoded = encodeURIComponent(slot.code);
      const slotMarker = `<div data-mermaid-slot="${i}"></div>`;

      const blockHtml = slot.cachedSvg
        ? `<div class="mermaid my-6 flex justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto select-none" data-mermaid-code="${encoded}" data-mermaid-status="rendered">${slot.cachedSvg}</div>`
        : `<div class="mermaid my-6 flex justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto select-none" data-mermaid-code="${encoded}" data-mermaid-status="pending"><div class="mermaid-placeholder flex flex-col items-center justify-center py-6 text-slate-400 dark:text-slate-500 gap-2 select-none"><div class="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div><span class="text-xs font-mono text-slate-400 dark:text-slate-500">Rendering Diagram...</span></div></div>`;

      sanitized = sanitized.replace(slotMarker, blockHtml);
    }

    return sanitized;
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<div class="p-4 bg-red-900/30 text-red-300 rounded border border-red-800">Rendering Error: ${(err as Error).message}</div>`;
  }
}
