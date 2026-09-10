import { marked } from 'marked';
import DOMPurify from 'dompurify';

marked.setOptions({
  gfm: true,
  breaks: true,
});

export function renderMarkdown(content: string): string {
  if (!content) return '';
  try {
    const rawHtml = marked.parse(content) as string;
    return DOMPurify.sanitize(rawHtml, {
      ADD_TAGS: ['iframe', 'svg', 'path', 'code', 'pre'],
      ADD_ATTR: ['target', 'class', 'id', 'xmlns', 'viewBox', 'd', 'fill', 'stroke', 'stroke-width', 'stroke-linecap', 'stroke-linejoin'],
    });
  } catch (err) {
    console.error('Markdown rendering error:', err);
    return `<div class="p-4 bg-red-900/30 text-red-300 rounded border border-red-800">Rendering Error: ${(err as Error).message}</div>`;
  }
}
