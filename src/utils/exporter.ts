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

export function exportAsMarkdown(title: string, content: string): void {
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'document'}.md`;
  downloadFile(filename, content, 'text/markdown;charset=utf-8');
}

export function exportAsStandaloneHtml(title: string, renderedHtml: string): void {
  const filename = `${title.toLowerCase().replace(/[^a-z0-9]/g, '-') || 'document'}.html`;
  const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', system-ui, sans-serif; }
    code, pre { font-family: 'JetBrains Mono', monospace; }
    .prose pre { background: #0f172a; color: #f8fafc; padding: 1.25rem; border-radius: 0.75rem; overflow-x: auto; border: 1px solid #1e293b; }
    .prose code { background: #1e293b; color: #38bdf8; padding: 0.15rem 0.35rem; border-radius: 0.25rem; font-size: 0.875em; }
    .prose pre code { background: transparent; color: inherit; padding: 0; }
    .prose table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
    .prose th, .prose td { border: 1px solid #334155; padding: 0.75rem 1rem; text-align: left; }
    .prose th { background: #0f172a; font-weight: 700; }
    .prose blockquote { border-left: 4px solid #0ea5e9; padding-left: 1rem; color: #94a3b8; font-style: italic; }
    @media print {
      body { background: white !important; color: black !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen p-8 sm:p-12">
  <div class="max-w-4xl mx-auto prose dark:prose-invert">
    ${renderedHtml}
  </div>
</body>
</html>`;
  downloadFile(filename, fullHtml, 'text/html;charset=utf-8');
}
