import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: true,
});

marked.use({
  renderer: {
    code({ text, lang }: { text: string; lang?: string }) {
      if (lang === 'mermaid') {
        const escaped = text.replace(/"/g, '&quot;');
        return `<div class="mermaid my-6 flex justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto select-none" data-mermaid-code="${escaped}">${text}</div>`;
      }
      return false;
    },
  },
});

export function renderMarkdown(content: string): string {
  if (!content) return '';
  try {
    const rawHtml = marked.parse(content) as string;
    if (typeof window !== 'undefined') {
      return DOMPurify.sanitize(rawHtml, {
        ADD_TAGS: ['iframe', 'svg', 'path', 'code', 'pre', 'button', 'input', 'style', 'span', 'g', 'rect', 'circle', 'line', 'polygon', 'marker', 'defs'],
        ADD_ATTR: ['target', 'class', 'id', 'xmlns', 'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'type', 'checked', 'style', 'data-mermaid-code', 'data-processed'],
      });
    }
    return rawHtml;
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<div class="p-4 bg-red-900/30 text-red-300 rounded border border-red-800">Rendering Error: ${(err as Error).message}</div>`;
  }
}
