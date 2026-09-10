import React from 'react';
import { DocumentStats } from '../types';

interface StatsFooterProps {
  stats: DocumentStats;
  lastSavedAt?: number;
}

export const StatsFooter: React.FC<StatsFooterProps> = ({ stats, lastSavedAt }) => {
  return (
    <footer className="h-8 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 flex items-center justify-between text-[11px] text-slate-400 font-mono select-none z-30">
      {/* Left: Text Metrics */}
      <div className="flex items-center space-x-4">
        <span>
          <strong className="text-slate-200">{stats.words.toLocaleString()}</strong> words
        </span>
        <span className="hidden sm:inline text-slate-700">|</span>
        <span className="hidden sm:inline">
          <strong className="text-slate-200">{stats.characters.toLocaleString()}</strong> chars
        </span>
        <span className="hidden sm:inline text-slate-700">|</span>
        <span className="hidden md:inline">
          <strong className="text-slate-200">{stats.lines.toLocaleString()}</strong> lines
        </span>
        <span className="text-slate-700">|</span>
        <span>
          ~<strong className="text-slate-200">{stats.readingTimeMinutes}</strong> min read
        </span>
        <span className="hidden lg:inline text-slate-700">|</span>
        <span className="hidden lg:inline">
          Readability: <strong className="text-sky-400">{stats.readingEase}</strong>
        </span>
      </div>

      {/* Right: Autosave Status */}
      <div className="flex items-center space-x-2">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-slate-400">
          {lastSavedAt ? `Autosaved` : 'Syncing'}
        </span>
      </div>
    </footer>
  );
};
