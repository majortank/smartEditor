import { renderMarkdown } from './markdown';

/**
 * Checks whether content looks predominantly like HTML or Markdown
 */
export function isHtmlContent(content: string): boolean {
  const trimmed = content.trim();
  if (!trimmed) return false;
  return /^<!DOCTYPE/i.test(trimmed) || /^<html/i.test(trimmed) || /^<div/i.test(trimmed) || /<[a-z][\s\S]*>/i.test(trimmed);
}

/**
 * Converts Markdown text to an HTML Component string.
 * Supports:
 * - 'component': Wraps the rendered elements in a modern Tailwind CSS UI component card.
 * - 'semantic': Clean, semantic HTML elements.
 */
export function markdownToHtmlComponent(
  markdown: string,
  variant: 'component' | 'semantic' = 'component'
): string {
  if (!markdown || !markdown.trim()) return '';

  const sanitized = renderMarkdown(markdown);

  if (variant === 'semantic') {
    return sanitized.trim();
  }

  // Component variant: wrap in modern interactive UI component structure with dual light/dark styling
  return `<div class="w-full max-w-3xl mx-auto bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-slate-900 dark:text-slate-100">
  <div class="prose dark:prose-invert max-w-none space-y-4 text-slate-900 dark:text-slate-100">
    ${sanitized.split('\n').join('\n    ')}
  </div>
</div>`;
}

/**
 * Converts HTML to Markdown using a recursive DOM parser walker.
 * Works without external libraries via the browser's native DOMParser.
 */
export function htmlToMarkdown(html: string): string {
  if (!html || !html.trim()) return '';
  if (typeof window === 'undefined') return html;

  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const body = doc.body;

    function walk(node: Node): string {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || '';
      }

      if (node.nodeType !== Node.ELEMENT_NODE) {
        return '';
      }

      const el = node as HTMLElement;
      const tag = el.tagName.toLowerCase();

      // Skip script and style tags
      if (tag === 'script' || tag === 'style' || tag === 'noscript') {
        return '';
      }

      // Handle Mermaid diagram containers
      if (el.classList && el.classList.contains('mermaid')) {
        const rawCode = el.getAttribute('data-mermaid-code') || el.textContent || '';
        return `\n\`\`\`mermaid\n${rawCode.trim()}\n\`\`\`\n\n`;
      }

      const children = Array.from(el.childNodes).map(walk).join('');

      switch (tag) {
        case 'h1':
          return `\n# ${children.trim()}\n\n`;
        case 'h2':
          return `\n## ${children.trim()}\n\n`;
        case 'h3':
          return `\n### ${children.trim()}\n\n`;
        case 'h4':
          return `\n#### ${children.trim()}\n\n`;
        case 'h5':
          return `\n##### ${children.trim()}\n\n`;
        case 'h6':
          return `\n###### ${children.trim()}\n\n`;
        case 'p':
          return `\n${children.trim()}\n\n`;
        case 'strong':
        case 'b':
          return `**${children}**`;
        case 'em':
        case 'i':
          return `*${children}*`;
        case 'del':
        case 's':
        case 'strike':
          return `~~${children}~~`;
        case 'code':
          // If code is inside pre, let pre handle it
          if (el.parentElement && el.parentElement.tagName.toLowerCase() === 'pre') {
            return children;
          }
          return `\`${children}\``;
        case 'pre': {
          const codeEl = el.querySelector('code');
          const lang = codeEl?.className.match(/language-(\w+)/)?.[1] || '';
          const codeText = codeEl ? codeEl.textContent || '' : el.textContent || '';
          return `\n\`\`\`${lang}\n${codeText.trim()}\n\`\`\`\n\n`;
        }
        case 'a': {
          const href = el.getAttribute('href') || '#';
          const title = el.getAttribute('title');
          const titlePart = title ? ` "${title}"` : '';
          return `[${children.trim() || href}](${href}${titlePart})`;
        }
        case 'img': {
          const src = el.getAttribute('src') || '';
          const alt = el.getAttribute('alt') || '';
          return `![${alt}](${src})`;
        }
        case 'blockquote': {
          const lines = children.trim().split('\n');
          return '\n' + lines.map(l => `> ${l}`).join('\n') + '\n\n';
        }
        case 'ul':
          return `\n${children}\n`;
        case 'ol':
          return `\n${children}\n`;
        case 'li': {
          const parent = el.parentElement;
          if (parent && parent.tagName.toLowerCase() === 'ol') {
            const index = Array.from(parent.children).indexOf(el) + 1;
            return `${index}. ${children.trim()}\n`;
          }
          return `- ${children.trim()}\n`;
        }
        case 'hr':
          return `\n---\n\n`;
        case 'br':
          return `\n`;
        case 'table': {
          return `\n${renderTableToMarkdown(el)}\n\n`;
        }
        default:
          return children;
      }
    }

    function renderTableToMarkdown(tableEl: HTMLElement): string {
      const rows = Array.from(tableEl.querySelectorAll('tr'));
      if (rows.length === 0) return '';

      const tableData = rows.map(row => {
        return Array.from(row.querySelectorAll('th, td')).map(cell => {
          return cell.textContent?.trim().replace(/\|/g, '\\|') || '';
        });
      });

      const columnCount = Math.max(...tableData.map(r => r.length), 1);
      const normalized = tableData.map(row => {
        while (row.length < columnCount) row.push('');
        return row;
      });

      const header = normalized[0];
      const headerLine = `| ${header.join(' | ')} |`;
      const separatorLine = `| ${header.map(() => '---').join(' | ')} |`;
      const bodyLines = normalized.slice(1).map(row => `| ${row.join(' | ')} |`);

      return [headerLine, separatorLine, ...bodyLines].join('\n');
    }

    const md = walk(body);
    // Normalize excess consecutive newlines
    return md.replace(/\n{3,}/g, '\n\n').trim();
  } catch (err) {
    console.error('Error converting HTML to Markdown:', err);
    return html;
  }
}

/**
 * Prepares HTML content for the interactive iframe sandbox.
 * Injects Tailwind CDN with explicit class-based dark mode, responsive fonts, and theme support.
 */
export function wrapHtmlComponentForPreview(
  content: string,
  theme: 'dark' | 'light' = 'dark'
): string {
  const trimmed = content.trim();

  // If already a full HTML document, ensure Tailwind class dark mode and theme class are present
  if (/^<!DOCTYPE/i.test(trimmed) || /^<html/i.test(trimmed)) {
    // Inject or update class="${theme}" on <html>
    let modified = content;
    if (!/<html[^>]*class=/i.test(modified)) {
      modified = modified.replace(/<html([^>]*)>/i, `<html$1 class="${theme}">`);
    } else {
      // Clean up previous dark/light class on <html> and apply current theme
      modified = modified.replace(/(<html[^>]*class=["'])([^"']*)(["'])/i, (_, prefix, classes, suffix) => {
        const cleaned = classes.split(/\s+/).filter((c: string) => c !== 'dark' && c !== 'light').join(' ');
        const finalClasses = cleaned ? `${cleaned} ${theme}` : theme;
        return `${prefix}${finalClasses}${suffix}`;
      });
    }
    // Inject tailwind.config darkMode class if tailwind is loaded
    if (modified.includes('cdn.tailwindcss.com') && !modified.includes('darkMode')) {
      modified = modified.replace(
        /(<script[^>]*src=["'][^"']*cdn\.tailwindcss\.com[^"']*["'][^>]*><\/script>)/i,
        `$1\n  <script>tailwind.config = { darkMode: 'class' };</script>`
      );
    }
    return modified;
  }

  const bgColor = theme === 'dark' ? '#030712' : '#f8fafc';
  const textColor = theme === 'dark' ? '#f8fafc' : '#0f172a';
  const borderColor = theme === 'dark' ? '#1e293b' : '#e2e8f0';
  const subtleBg = theme === 'dark' ? 'rgba(15, 23, 42, 0.6)' : 'rgba(241, 245, 249, 0.8)';

  return `<!DOCTYPE html>
<html lang="en" class="${theme}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
    * {
      box-sizing: border-box;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      margin: 0;
      padding: 1.5rem;
      min-height: 100vh;
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    code, pre {
      font-family: 'JetBrains Mono', monospace;
    }
    /* Ensure <br> generates proper vertical line breaks across all contexts */
    br {
      display: inline;
    }
    /* Default typography rules for unclassed HTML elements under Tailwind Preflight */
    h1:not([class*="text-"]):not([class*="font-"]) {
      font-size: 1.875rem;
      font-weight: 800;
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      line-height: 1.25;
      letter-spacing: -0.025em;
    }
    h2:not([class*="text-"]):not([class*="font-"]) {
      font-size: 1.5rem;
      font-weight: 700;
      margin-top: 1.25rem;
      margin-bottom: 0.5rem;
      line-height: 1.3;
      letter-spacing: -0.015em;
    }
    h3:not([class*="text-"]):not([class*="font-"]) {
      font-size: 1.25rem;
      font-weight: 600;
      margin-top: 1rem;
      margin-bottom: 0.5rem;
      line-height: 1.4;
    }
    h4:not([class*="text-"]):not([class*="font-"]) {
      font-size: 1.1rem;
      font-weight: 600;
      margin-top: 0.75rem;
      margin-bottom: 0.25rem;
    }
    p:not([class*="my-"]):not([class*="mb-"]):not([class*="mt-"]):not([class*="py-"]) {
      margin-top: 0.75rem;
      margin-bottom: 0.75rem;
      line-height: 1.65;
    }
    ul:not([class*="list-"]) {
      list-style-type: disc;
      padding-left: 1.5rem;
      margin: 0.75rem 0;
    }
    ol:not([class*="list-"]) {
      list-style-type: decimal;
      padding-left: 1.5rem;
      margin: 0.75rem 0;
    }
    li {
      margin: 0.25rem 0;
    }
    blockquote:not([class*="border-"]) {
      border-left: 3px solid #0ea5e9;
      padding: 0.5rem 1rem;
      margin: 1rem 0;
      font-style: italic;
      background: ${theme === 'dark' ? 'rgba(14, 165, 233, 0.05)' : 'rgba(14, 165, 233, 0.05)'};
      border-radius: 0 0.5rem 0.5rem 0;
    }
    table:not([class*="table-"]) {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
    }
    th:not([class*="border-"]), td:not([class*="border-"]) {
      border: 1px solid ${borderColor};
      padding: 0.6rem 0.85rem;
      text-align: left;
    }
    th:not([class*="bg-"]) {
      background-color: ${subtleBg};
      font-weight: 600;
    }
    hr {
      border: none;
      border-top: 1px solid ${borderColor};
      margin: 1.5rem 0;
    }
    a:not([class*="text-"]) {
      color: #0284c7;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    /* Smooth animations */
    @keyframes pulse-slow {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    .glow { animation: pulse-slow 3s infinite ease-in-out; }
  </style>
</head>
<body class="${theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}">
  <div id="component-root" class="w-full max-w-4xl mx-auto">
    ${content}
  </div>
  <script id="mermaid-script" src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
  <script>
    function runMermaid() {
      if (typeof mermaid === 'undefined') return;
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: '${theme === 'dark' ? 'dark' : 'default'}',
          securityLevel: 'loose',
          fontFamily: 'Inter, system-ui, sans-serif',
        });
        document.querySelectorAll('pre code.language-mermaid, pre.mermaid').forEach(function(el) {
          var div = document.createElement('div');
          div.className = 'mermaid my-6 flex justify-center p-4 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800/80 overflow-x-auto select-none';
          var code = el.textContent || '';
          div.textContent = code;
          div.setAttribute('data-mermaid-code', code);
          (el.closest('pre') || el).replaceWith(div);
        });
        document.querySelectorAll('.mermaid').forEach(function(el) {
          if (!el.getAttribute('data-mermaid-code')) {
            el.setAttribute('data-mermaid-code', el.textContent || '');
          }
        });
        mermaid.run({ querySelector: '.mermaid', suppressErrors: true });
      } catch (e) {
        console.warn('Mermaid rendering error:', e);
      }
    }
    var mScript = document.getElementById('mermaid-script');
    if (mScript) {
      mScript.addEventListener('load', runMermaid);
    }
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', runMermaid);
    } else {
      runMermaid();
    }
    setTimeout(runMermaid, 50);
    setTimeout(runMermaid, 250);
  </script>
</body>
</html>`;
}
