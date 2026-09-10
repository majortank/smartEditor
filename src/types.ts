export type EditorMode = 'markdown' | 'html';
export type ViewMode = 'split' | 'editor' | 'preview';
export type DeviceViewport = 'desktop' | 'tablet' | 'mobile';
export type Theme = 'dark' | 'light';

export interface DocumentItem {
  id: string;
  title: string;
  content: string;
  mode: EditorMode;
  createdAt: number;
  updatedAt: number;
}

export interface DocumentStats {
  words: number;
  characters: number;
  lines: number;
  readingTimeMinutes: number;
  readingEase: string;
}

export interface TemplateItem {
  id: string;
  name: string;
  description: string;
  category: string;
  mode: EditorMode;
  content: string;
}
