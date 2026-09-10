import React, { useRef } from 'react';

interface EditorPaneProps {
  content: string;
  onChange: (val: string) => void;
  onScrollSync?: (scrollTopPercentage: number) => void;
}

export const EditorPane: React.FC<EditorPaneProps> = ({
  content,
  onChange,
  onScrollSync,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lines = content.split('\n');
  const lineCount = lines.length;

  const handleScroll = () => {
    if (!textareaRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = textareaRef.current;
    
    // Sync line numbers
    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }

    // Report scroll percentage for sync preview
    if (onScrollSync && scrollHeight > clientHeight) {
      const percentage = scrollTop / (scrollHeight - clientHeight);
      onScrollSync(percentage);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Handle Tab key
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }, 0);
      return;
    }

    // Keyboard Shortcuts: Ctrl/Cmd + B (Bold), I (Italic), K (Link)
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        wrapSelection('**', '**', 'bold text');
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        wrapSelection('*', '*', 'italic text');
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        wrapSelection('[', '](https://example.com)', 'link text');
      }
    }

    // Auto-closing brackets & quotes
    const autoPairs: Record<string, string> = {
      '(': ')',
      '[': ']',
      '{': '}',
      '`': '`',
      '"': '"',
    };

    if (autoPairs[e.key]) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      if (start === end) {
        e.preventDefault();
        const close = autoPairs[e.key];
        const newContent = content.substring(0, start) + e.key + close + content.substring(end);
        onChange(newContent);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
        }, 0);
      }
    }
  };

  const wrapSelection = (prefix: string, suffix: string, defaultText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || defaultText;

    const newContent = content.substring(0, start) + prefix + selected + suffix + content.substring(end);
    onChange(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + prefix.length;
      textarea.selectionEnd = start + prefix.length + selected.length;
    }, 0);
  };

  return (
    <div className="relative w-full h-full flex bg-slate-950 overflow-hidden font-mono text-xs sm:text-sm">
      {/* Line Numbers Gutter */}
      <div
        ref={lineNumbersRef}
        aria-hidden="true"
        className="w-10 sm:w-12 py-4 pl-2 pr-3 bg-slate-900/60 text-slate-600 text-right select-none overflow-hidden border-r border-slate-800/80 leading-6"
      >
        {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => onChange(e.target.value)}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        placeholder="Start writing markdown or HTML here..."
        spellCheck={false}
        className="flex-1 w-full h-full p-4 bg-transparent text-slate-200 resize-none focus:outline-none leading-6 font-mono selection:bg-sky-500/30 overflow-y-auto"
      />
    </div>
  );
};
