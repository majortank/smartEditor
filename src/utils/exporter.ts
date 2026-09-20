import { EditorMode, Theme } from '../types';
import { renderMarkdown } from './markdown';
import { htmlToMarkdown } from './converter';

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function sanitizeFilename(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'document';
}

/**
 * Export as Markdown (.md). If document is in HTML mode, converts HTML to Markdown.
 */
export function exportAsMarkdown(title: string, content: string, mode: EditorMode = 'markdown'): void {
  const filename = `${sanitizeFilename(title)}.md`;
  const textToExport = mode === 'html' ? htmlToMarkdown(content) : content;
  downloadFile(filename, textToExport, 'text/markdown;charset=utf-8');
}

/**
 * Export purely the HTML content/component snippet without full page boilerplate.
 */
export function exportAsHtmlSnippet(title: string, content: string, mode: EditorMode = 'markdown'): void {
  const filename = `${sanitizeFilename(title)}.snippet.html`;
  const snippet = mode === 'html' ? content.trim() : renderMarkdown(content);
  downloadFile(filename, snippet, 'text/html;charset=utf-8');
}

/**
 * Export as a standalone, self-contained HTML page with responsive styles & current theme.
 * Does not force a full-screen viewport or lock down container size.
 */
export function exportAsStandaloneHtml(
  title: string,
  content: string,
  mode: EditorMode = 'markdown',
  theme: Theme = 'light'
): void {
  const filename = `${sanitizeFilename(title)}.html`;
  const trimmed = content.trim();

  // If already a full HTML document in HTML mode, ensure theme and typography plugins are present without nesting
  if (mode === 'html' && (/^<!DOCTYPE/i.test(trimmed) || /^<html/i.test(trimmed))) {
    let modified = content;
    if (!/<html[^>]*class=/i.test(modified)) {
      modified = modified.replace(/<html([^>]*)>/i, `<html$1 class="${theme}">`);
    } else {
      modified = modified.replace(/(<html[^>]*class=["'])([^"']*)(["'])/i, (_, prefix, classes, suffix) => {
        const cleaned = classes.split(/\s+/).filter((c: string) => c !== 'dark' && c !== 'light').join(' ');
        const finalClasses = cleaned ? `${cleaned} ${theme}` : theme;
        return `${prefix}${finalClasses}${suffix}`;
      });
    }
    if (modified.includes('cdn.tailwindcss.com') && !modified.includes('darkMode')) {
      modified = modified.replace(
        /(<script[^>]*src=["'][^"']*cdn\.tailwindcss\.com[^"']*["'][^>]*><\/script>)/i,
        `$1\n  <script>tailwind.config = { darkMode: 'class' };</script>`
      );
    }
    downloadFile(filename, modified, 'text/html;charset=utf-8');
    return;
  }

  const renderedContent = mode === 'html'
    ? content
    : renderMarkdown(content);

  const bgColor = theme === 'dark' ? '#090d16' : '#ffffff';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
  const borderColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const subtleBg = theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)';

  const fullHtml = `<!DOCTYPE html>
<html lang="en" class="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title || 'Document'}</title>
  <script src="https://cdn.tailwindcss.com?plugins=typography,forms,aspect-ratio"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
    };
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({
        startOnLoad: true,
        theme: '${theme === 'dark' ? 'dark' : 'default'}',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
      });
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      margin: 0;
      padding: 0;
      line-height: 1.65;
      -webkit-font-smoothing: antialiased;
    }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    br { display: inline; }
    .content-container {
      width: 100%;
      max-width: 56rem;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
    }
    /* Typography fallbacks for unclassed elements under Tailwind Preflight */
    h1:not([class*="text-"]):not([class*="font-"]) { font-size: 2rem; font-weight: 800; margin-top: 1.75rem; margin-bottom: 0.75rem; line-height: 1.25; letter-spacing: -0.025em; }
    h2:not([class*="text-"]):not([class*="font-"]) { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.5rem; line-height: 1.3; letter-spacing: -0.015em; }
    h3:not([class*="text-"]):not([class*="font-"]) { font-size: 1.25rem; font-weight: 600; margin-top: 1.25rem; margin-bottom: 0.5rem; line-height: 1.4; }
    h4:not([class*="text-"]):not([class*="font-"]) { font-size: 1.1rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.25rem; }
    p:not([class*="my-"]):not([class*="mb-"]):not([class*="mt-"]):not([class*="py-"]) { margin-top: 0.75rem; margin-bottom: 0.75rem; line-height: 1.7; }
    ul:not([class*="list-"]) { list-style-type: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
    ol:not([class*="list-"]) { list-style-type: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
    li { margin: 0.25rem 0; }
    blockquote:not([class*="border-"]) { border-left: 3px solid #0ea5e9; padding: 0.5rem 1rem; margin: 1.25rem 0; font-style: italic; background: rgba(14, 165, 233, 0.05); border-radius: 0 0.5rem 0.5rem 0; }
    table:not([class*="table-"]) { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem; }
    th:not([class*="border-"]), td:not([class*="border-"]) { border: 1px solid ${borderColor}; padding: 0.65rem 0.85rem; text-align: left; }
    th:not([class*="bg-"]) { background-color: ${subtleBg}; font-weight: 600; }
    hr { border: none; border-top: 1px solid ${borderColor}; margin: 2rem 0; }
    a:not([class*="text-"]) { color: #0284c7; text-decoration: underline; text-underline-offset: 3px; }
    pre { background: #0f172a; color: #f8fafc; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; border: 1px solid #1e293b; margin: 1.25rem 0; }
    code { font-size: 0.875em; }
    pre code { background: transparent; padding: 0; border: none; }
    @media print {
      body { background: white !important; color: #0f172a !important; }
      .content-container { max-width: 100% !important; padding: 0 !important; margin: 0 !important; }
      h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; }
      table, pre, blockquote, tr, img, figure { break-inside: avoid; page-break-inside: avoid; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}">
  <main class="content-container">
    ${renderedContent}
  </main>
  <script>
    if (typeof mermaid !== 'undefined') {
      try {
        mermaid.run({ querySelector: '.mermaid', suppressErrors: true });
      } catch (e) {}
    }
  </script>
</body>
</html>`;
  downloadFile(filename, fullHtml, 'text/html;charset=utf-8');
}

/**
 * Triggers a pristine print of the document content and styling ONLY.
 * Uses a dedicated hidden print iframe so zero application UI (editor, header, toolbar, sidebar, footer) is printed.
 */
export function printDocument(
  title: string,
  content: string,
  mode: EditorMode = 'markdown',
  theme: Theme = 'light'
): void {
  if (typeof window === 'undefined') return;

  const renderedContent = mode === 'html'
    ? content
    : renderMarkdown(content);

  const trimmed = renderedContent.trim();
  let printHtml = '';

  if (mode === 'html' && (/^<!DOCTYPE/i.test(trimmed) || /^<html/i.test(trimmed))) {
    printHtml = trimmed;
    const printStyles = `
      <style>
        @page { size: auto; margin: 15mm; }
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          body { background: white !important; color: #0f172a !important; margin: 0 !important; padding: 0 !important; min-height: 0 !important; }
          .no-print { display: none !important; }
          h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; }
          table, pre, blockquote, tr, img, figure { break-inside: avoid; page-break-inside: avoid; }
        }
      </style>
    `;
    if (printHtml.includes('</head>')) {
      printHtml = printHtml.replace('</head>', `${printStyles}</head>`);
    } else {
      printHtml = `${printStyles}${printHtml}`;
    }
  } else {
    printHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title || 'Document'}</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com?plugins=typography,forms,aspect-ratio"></script>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    if (typeof mermaid !== 'undefined') {
      mermaid.initialize({
        startOnLoad: true,
        theme: 'default',
        securityLevel: 'loose',
        fontFamily: 'Inter, system-ui, sans-serif',
      });
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    @page {
      size: auto;
      margin: 15mm;
    }
    * {
      box-sizing: border-box;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background: white !important;
      color: #0f172a !important;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    .print-body {
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      padding: 0;
    }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    br { display: inline; }
    h1:not([class*="text-"]):not([class*="font-"]) { font-size: 2rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; line-height: 1.25; color: #0f172a; }
    h2:not([class*="text-"]):not([class*="font-"]) { font-size: 1.5rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; line-height: 1.3; color: #1e293b; }
    h3:not([class*="text-"]):not([class*="font-"]) { font-size: 1.25rem; font-weight: 600; margin-top: 1rem; margin-bottom: 0.5rem; line-height: 1.4; color: #1e293b; }
    h4:not([class*="text-"]):not([class*="font-"]) { font-size: 1.1rem; font-weight: 600; margin-top: 0.75rem; margin-bottom: 0.25rem; color: #334155; }
    p:not([class*="my-"]):not([class*="mb-"]):not([class*="mt-"]):not([class*="py-"]) { margin-top: 0.75rem; margin-bottom: 0.75rem; line-height: 1.65; color: #334155; }
    ul:not([class*="list-"]) { list-style-type: disc; padding-left: 1.5rem; margin: 0.75rem 0; }
    ol:not([class*="list-"]) { list-style-type: decimal; padding-left: 1.5rem; margin: 0.75rem 0; }
    li { margin: 0.25rem 0; }
    blockquote:not([class*="border-"]) { border-left: 3px solid #0ea5e9; padding: 0.5rem 1rem; margin: 1rem 0; font-style: italic; background: #f8fafc; border-radius: 0 0.5rem 0.5rem 0; }
    table:not([class*="table-"]) { width: 100%; border-collapse: collapse; margin: 1.25rem 0; font-size: 0.875rem; }
    th:not([class*="border-"]), td:not([class*="border-"]) { border: 1px solid #cbd5e1; padding: 0.6rem 0.85rem; text-align: left; }
    th:not([class*="bg-"]) { background-color: #f1f5f9; font-weight: 600; color: #0f172a; }
    hr { border: none; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; }
    pre { background: #0f172a !important; color: #f8fafc !important; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
    pre code { background: transparent !important; color: inherit !important; }
    h1, h2, h3, h4, h5, h6 { break-after: avoid; page-break-after: avoid; }
    table, pre, blockquote, tr, img, figure { break-inside: avoid; page-break-inside: avoid; }
  </style>
</head>
<body>
  <div class="print-body">
    ${renderedContent}
  </div>
  <script>
    if (typeof mermaid !== 'undefined') {
      try {
        mermaid.run({ querySelector: '.mermaid', suppressErrors: true });
      } catch (e) {}
    }
  </script>
</body>
</html>`;
  }

  let printIframe = document.getElementById('smart-editor-print-frame') as HTMLIFrameElement;
  if (!printIframe) {
    printIframe = document.createElement('iframe');
    printIframe.id = 'smart-editor-print-frame';
    printIframe.style.position = 'fixed';
    printIframe.style.right = '0';
    printIframe.style.bottom = '0';
    printIframe.style.width = '0';
    printIframe.style.height = '0';
    printIframe.style.border = '0';
    printIframe.style.visibility = 'hidden';
    document.body.appendChild(printIframe);
  }

  const iframeDoc = printIframe.contentDocument || printIframe.contentWindow?.document;
  if (!iframeDoc) return;

  iframeDoc.open();
  iframeDoc.write(printHtml);
  iframeDoc.close();

  setTimeout(() => {
    printIframe.contentWindow?.focus();
    printIframe.contentWindow?.print();
  }, 500);
}
