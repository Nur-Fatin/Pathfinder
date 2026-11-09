import React from 'react';
import { FrameworkType } from '../types/decision';
import { Sun, Moon, Plus } from 'lucide-react';

interface HeaderProps {
  currentView: 'summary' | FrameworkType;
  onSelectView: (view: 'summary' | FrameworkType) => void;
  onOpenNewDecision: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  onOpenNewDecision,
  isDarkMode,
  onToggleTheme,
}) => {
  return (
    <header className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xs sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single Text Element Brand Wordmark */}
        <div
          onClick={() => onSelectView('summary')}
          className="text-lg font-bold tracking-tight text-slate-900 dark:text-white whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
        >
          <span className="w-2.5 h-2.5 bg-indigo-600 dark:bg-indigo-400 rounded-sm inline-block" />
          <span>Pathfinder</span>
        </div>

        {/* Zone 2: 4-5 Concise Single-Line Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectView('summary')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
              currentView === 'summary' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectView('pros-cons')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
              currentView === 'pros-cons' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
            }`}
          >
            Pros & Cons
          </button>
          <button
            onClick={() => onSelectView('comparison')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
              currentView === 'comparison' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
            }`}
          >
            Comparison Matrix
          </button>
          <button
            onClick={() => onSelectView('swot')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
              currentView === 'swot' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
            }`}
          >
            SWOT Analysis
          </button>
          <button
            onClick={() => onSelectView('cost-benefit')}
            className={`whitespace-nowrap shrink-0 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${
              currentView === 'cost-benefit' ? 'text-indigo-600 dark:text-indigo-400 font-bold' : ''
            }`}
          >
            Cost-Benefit
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white rounded-lg transition-colors cursor-pointer"
            title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button
            onClick={onOpenNewDecision}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Decision</span>
          </button>
        </div>
      </div>
    </header>
  );
};
