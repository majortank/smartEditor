import { Theme } from '../types';

// In-memory cache for rendered diagram SVGs: key = `${theme}:${code}`
const svgCache = new Map<string, string>();

let mermaidPromise: Promise<any> | null = null;
let renderCounter = 0;

export function getCacheKey(code: string, theme: string): string {
  return `${theme}:${code.trim()}`;
}

export function getCachedSvg(code: string, theme: string = 'dark'): string | undefined {
  return svgCache.get(getCacheKey(code, theme));
}

export function setCachedSvg(code: string, theme: string, svg: string): void {
  svgCache.set(getCacheKey(code, theme), svg);
}

export function clearDiagramCache(): void {
  svgCache.clear();
}

/**
 * Singleton loader for Mermaid and external diagram plugins (e.g. ZenUML).
 * Dynamically loaded once to avoid repeated import latencies and bundle re-evaluation.
 */
export async function getMermaidInstance() {
  if (typeof window === 'undefined') return null;

  if (!mermaidPromise) {
    mermaidPromise = (async () => {
      const [{ default: mermaid }, zenumlModule] = await Promise.all([
        import('mermaid'),
        import('@mermaid-js/mermaid-zenuml').catch(() => null),
      ]);

      if (zenumlModule && (zenumlModule.default || zenumlModule)) {
        try {
          await mermaid.registerExternalDiagrams([zenumlModule.default || zenumlModule]);
        } catch {
          // ignore registration errors if already registered
        }
      }

      return mermaid;
    })();
  }

  return mermaidPromise;
}

/**
 * Removes orphan error elements that Mermaid might inject into document.body on parse errors.
 */
export function cleanOrphanErrorNodes(): void {
  if (typeof document === 'undefined') return;
  document.querySelectorAll('body > [id^="dmermaid-"], body > [id^="mermaid-"]').forEach((el) => {
    el.remove();
  });
}

/**
 * Renders a Mermaid diagram definition into an SVG string.
 * Uses cached SVG if already available for this definition and theme.
 */
export async function renderDiagramCode(
  code: string,
  theme: Theme = 'dark'
): Promise<{ svg?: string; error?: string }> {
  const trimmed = code.trim();
  if (!trimmed) {
    return { error: 'Empty diagram definition' };
  }

  // Check cache first for instantaneous return
  const cached = getCachedSvg(trimmed, theme);
  if (cached) {
    return { svg: cached };
  }

  const mermaid = await getMermaidInstance();
  if (!mermaid) {
    return { error: 'Mermaid engine is not available in current environment' };
  }

  mermaid.initialize({
    startOnLoad: false,
    theme: theme === 'dark' ? 'dark' : 'default',
    securityLevel: 'loose',
    fontFamily: 'Inter, system-ui, sans-serif',
  });

  const uniqueId = `mermaid-svg-${Date.now()}-${++renderCounter}`;

  try {
    // Validate syntax before invoking render to prevent dirtying the DOM
    await mermaid.parse(trimmed);
    const { svg } = await mermaid.render(uniqueId, trimmed);
    cleanOrphanErrorNodes();

    // Cache the rendered SVG for subsequent renders and theme switches
    setCachedSvg(trimmed, theme, svg);

    return { svg };
  } catch (err: any) {
    cleanOrphanErrorNodes();
    return { error: err?.message || 'Syntax error in Mermaid diagram' };
  }
}
