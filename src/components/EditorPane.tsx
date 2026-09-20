'use client';

import React, { useRef, useImperativeHandle, forwardRef, useCallback } from 'react';

export interface EditorPaneRef {
  insertAtCursor: (prefix: string, suffix?: string, defaultText?: string) => void;
  focus: () => void;
}

interface EditorPaneProps {
  content: string;
  onChange: (val: string) => void;
  onScrollSync?: (scrollTopPercentage: number) => void;
}

export const EditorPane = forwardRef<EditorPaneRef, EditorPaneProps>(({
  content,
  onChange,
  onScrollSync,
}, ref) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<{ start: number; end: number }>({ start: 0, end: 0 });

  const lines = content.split('\n');
  const lineCount = lines.length;

  // Track selection whenever cursor moves
  const updateSelection = useCallback(() => {
    if (textareaRef.current) {
      selectionRef.current = {
        start: textareaRef.current.selectionStart,
        end: textareaRef.current.selectionEnd,
      };
    }
  }, []);

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

  // Insert component, snippet, or formatting right at the current cursor / line
  const insertAtCursor = useCallback((prefix: string, suffix: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end } = selectionRef.current;
    const selected = content.substring(start, end);
    const textToInsert = selected || defaultText;

    // Detect if inserting a block-level component/structure
    const isBlock = prefix.startsWith('<') || prefix.startsWith('```') || prefix.startsWith('|') || prefix.startsWith('#') || prefix.startsWith('---');

    let before = content.substring(0, start);
    let after = content.substring(end);

    let insertString = '';

    if (isBlock) {
      // Ensure block starts on a clean line if not already at line beginning
      const needsLeadingNewline = before.length > 0 && !before.endsWith('\n');
      // Ensure subsequent content starts on a clean line if not already
      const needsTrailingNewline = after.length > 0 && !after.startsWith('\n');

      const lead = needsLeadingNewline ? '\n' : '';
      const trail = needsTrailingNewline ? '\n' : '';

      insertString = `${lead}${prefix}${textToInsert}${suffix}${trail}`;
    } else {
      insertString = `${prefix}${textToInsert}${suffix}`;
    }

    const newContent = before + insertString + after;
    onChange(newContent);

    // Compute new cursor position inside or right after the inserted text
    let nextCursor = before.length + insertString.length;
    if (!selected && defaultText && suffix) {
      // Position cursor over the default text so user can immediately type over it
      const startOfDefault = before.length + (isBlock && before.length > 0 && !before.endsWith('\n') ? 1 : 0) + prefix.length;
      nextCursor = startOfDefault + defaultText.length;
      selectionRef.current = { start: startOfDefault, end: nextCursor };
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(startOfDefault, nextCursor);
      }, 0);
      return;
    }

    selectionRef.current = { start: nextCursor, end: nextCursor };
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(nextCursor, nextCursor);
    }, 0);
  }, [content, onChange]);

  // Expose methods to parent components via ref
  useImperativeHandle(ref, () => ({
    insertAtCursor,
    focus: () => textareaRef.current?.focus(),
  }), [insertAtCursor]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    // Handle Tab & Shift+Tab (Indentation & Outdentation)
    if (e.key === 'Tab') {
      e.preventDefault();

      const selectedText = content.substring(start, end);
      const isMultiLine = selectedText.includes('\n');

      if (isMultiLine) {
        // Multi-line indent/outdent
        const lineStartIndex = content.lastIndexOf('\n', start - 1) + 1;
        let lineEndIndex = content.indexOf('\n', end);
        if (lineEndIndex === -1) lineEndIndex = content.length;

        const targetBlock = content.substring(lineStartIndex, lineEndIndex);
        const linesArray = targetBlock.split('\n');

        if (e.shiftKey) {
          // Shift+Tab: Outdent all lines by up to 2 spaces
          const outdented = linesArray.map(line => {
            if (line.startsWith('  ')) return line.substring(2);
            if (line.startsWith(' ') || line.startsWith('\t')) return line.substring(1);
            return line;
          });
          const replacement = outdented.join('\n');
          const newContent = content.substring(0, lineStartIndex) + replacement + content.substring(lineEndIndex);
          onChange(newContent);
          setTimeout(() => {
            textarea.selectionStart = lineStartIndex;
            textarea.selectionEnd = lineStartIndex + replacement.length;
            updateSelection();
          }, 0);
        } else {
          // Tab: Indent all selected lines by 2 spaces
          const indented = linesArray.map(line => '  ' + line);
          const replacement = indented.join('\n');
          const newContent = content.substring(0, lineStartIndex) + replacement + content.substring(lineEndIndex);
          onChange(newContent);
          setTimeout(() => {
            textarea.selectionStart = lineStartIndex;
            textarea.selectionEnd = lineStartIndex + replacement.length;
            updateSelection();
          }, 0);
        }
        return;
      }

      // Single line / cursor Tab
      if (e.shiftKey) {
        // Single line outdent: remove up to 2 leading spaces before cursor
        const lineStart = content.lastIndexOf('\n', start - 1) + 1;
        const beforeCursor = content.substring(lineStart, start);
        if (beforeCursor.endsWith('  ')) {
          const newContent = content.substring(0, start - 2) + content.substring(start);
          onChange(newContent);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - 2;
            updateSelection();
          }, 0);
        } else if (beforeCursor.endsWith(' ') || beforeCursor.endsWith('\t')) {
          const newContent = content.substring(0, start - 1) + content.substring(start);
          onChange(newContent);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = start - 1;
            updateSelection();
          }, 0);
        }
        return;
      }

      // Standard 2-space tab insertion
      const newContent = content.substring(0, start) + '  ' + content.substring(end);
      onChange(newContent);
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
        updateSelection();
      }, 0);
      return;
    }

    // Auto-indent on Enter & List Continuation
    if (e.key === 'Enter') {
      const lineStart = content.lastIndexOf('\n', start - 1) + 1;
      const currentLine = content.substring(lineStart, start);

      const listMatch = currentLine.match(/^(\s*)([-*+]|\d+\.)\s+(\[[ x]\]\s+)?/);
      const indentMatch = currentLine.match(/^(\s+)/);

      if (listMatch) {
        const fullPrefix = listMatch[0];
        const indent = listMatch[1];
        const bullet = listMatch[2];

        // If line contains only the bullet, pressing Enter removes it
        if (currentLine.trim() === fullPrefix.trim()) {
          e.preventDefault();
          const newContent = content.substring(0, lineStart) + content.substring(start);
          onChange(newContent);
          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = lineStart;
            updateSelection();
          }, 0);
          return;
        }

        e.preventDefault();
        let nextPrefix = `${indent}${bullet} `;
        if (/^\d+\.$/.test(bullet)) {
          const num = parseInt(bullet, 10);
          nextPrefix = `${indent}${num + 1}. `;
        }
        if (listMatch[3]) {
          nextPrefix += '[ ] ';
        }

        const newContent = content.substring(0, start) + '\n' + nextPrefix + content.substring(end);
        onChange(newContent);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + nextPrefix.length;
          updateSelection();
        }, 0);
        return;
      } else if (indentMatch) {
        // Preserve code/markup indentation
        e.preventDefault();
        const indent = indentMatch[1];
        const newContent = content.substring(0, start) + '\n' + indent + content.substring(end);
        onChange(newContent);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1 + indent.length;
          updateSelection();
        }, 0);
        return;
      }
    }

    // Keyboard Shortcuts: Ctrl/Cmd + B (Bold), I (Italic), K (Link)
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'b' || e.key === 'B') {
        e.preventDefault();
        insertAtCursor('**', '**', 'bold text');
        return;
      } else if (e.key === 'i' || e.key === 'I') {
        e.preventDefault();
        insertAtCursor('*', '*', 'italic text');
        return;
      } else if (e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        insertAtCursor('[', '](https://example.com)', 'link text');
        return;
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
      if (start === end) {
        e.preventDefault();
        const close = autoPairs[e.key];
        const newContent = content.substring(0, start) + e.key + close + content.substring(end);
        onChange(newContent);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 1;
          updateSelection();
        }, 0);
        return;
      }
    }
  };

  return (
    <div className="editor-pane-container relative w-full h-full flex bg-white dark:bg-slate-950 overflow-hidden font-mono text-xs sm:text-sm transition-colors">
      {/* Line Numbers Gutter */}
      <div
        ref={lineNumbersRef}
        aria-hidden="true"
        className="w-10 sm:w-12 py-4 pl-2 pr-3 bg-slate-50 dark:bg-slate-900/60 text-slate-400 dark:text-slate-600 text-right select-none overflow-hidden border-r border-slate-200 dark:border-slate-800/80 leading-6"
      >
        {Array.from({ length: Math.max(1, lineCount) }).map((_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>

      {/* Editor Textarea */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={(e) => {
          onChange(e.target.value);
          updateSelection();
        }}
        onSelect={updateSelection}
        onKeyUp={updateSelection}
        onMouseUp={updateSelection}
        onBlur={updateSelection}
        onScroll={handleScroll}
        onKeyDown={handleKeyDown}
        placeholder="Start writing markdown or HTML here..."
        spellCheck={false}
        style={{ tabSize: 2 }}
        className="flex-1 w-full h-full p-4 bg-transparent text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-600 caret-slate-900 dark:caret-sky-400 resize-none focus:outline-none leading-6 font-mono selection:bg-sky-500/20 dark:selection:bg-sky-500/30 overflow-y-auto"
      />
    </div>
  );
});

EditorPane.displayName = 'EditorPane';
