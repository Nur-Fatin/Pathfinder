import { useState, useEffect } from 'react';
import { DecisionAnalysis, FrameworkType, FollowUpMessage } from './types/decision';
import { SAMPLE_DECISIONS } from './data/sampleDecisions';
import { Header } from './components/Header';
import { ExecutiveSummaryView } from './components/ExecutiveSummaryView';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonMatrixView } from './components/ComparisonMatrixView';
import { SwotView } from './components/SwotView';
import { CostBenefitView } from './components/CostBenefitView';
import { DecisionFormModal } from './components/DecisionFormModal';
import { DeepenAdvisorDrawer } from './components/DeepenAdvisorDrawer';
import { ExportModal } from './components/ExportModal';
import {
  Compass,
  FileText,
  Sliders,
  History,
  Sparkles,
  Share2,
  Trash2,
  FolderOpen,
  Scale,
  DollarSign,
  TrendingUp,
} from 'lucide-react';

export default function App() {
  // Theme state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pathfinder_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode class to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('pathfinder_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('pathfinder_theme', 'light');
    }
  }, [isDarkMode]);

  // Decisions state
  const [decisions, setDecisions] = useState<DecisionAnalysis[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pathfinder_decisions');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        } catch (e) {
          console.error('Failed to parse saved decisions:', e);
        }
      }
    }
    return SAMPLE_DECISIONS;
  });

  const [activeDecisionId, setActiveDecisionId] = useState<string>(
    () => decisions[0]?.id || SAMPLE_DECISIONS[0].id
  );

  const [currentView, setCurrentView] = useState<'summary' | FrameworkType>('summary');

  // Modals & Drawers state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAdvisorOpen, setIsAdvisorOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Loading states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAdvisorLoading, setIsAdvisorLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Chat message history per decision
  const [advisorThreads, setAdvisorThreads] = useState<Record<string, FollowUpMessage[]>>({});

  // Save decisions to localStorage
  useEffect(() => {
    localStorage.setItem('pathfinder_decisions', JSON.stringify(decisions));
  }, [decisions]);

  const activeDecision = decisions.find((d) => d.id === activeDecisionId) || decisions[0];

  const handleUpdateDecision = (updated: DecisionAnalysis) => {
    setDecisions((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleDeleteDecision = (id: string) => {
    const remaining = decisions.filter((d) => d.id !== id);
    if (remaining.length === 0) {
      setDecisions(SAMPLE_DECISIONS);
      setActiveDecisionId(SAMPLE_DECISIONS[0].id);
    } else {
      setDecisions(remaining);
      if (activeDecisionId === id) {
        setActiveDecisionId(remaining[0].id);
      }
    }
  };

  const handleLoadSample = (sampleId: string) => {
    const found = decisions.find((d) => d.id === sampleId);
    if (found) {
      setActiveDecisionId(found.id);
    } else {
      const sample = SAMPLE_DECISIONS.find((s) => s.id === sampleId);
      if (sample) {
        setDecisions((prev) => [sample, ...prev]);
        setActiveDecisionId(sample.id);
      }
    }
  };

  // Submit new decision to backend Gemini API
  const handleAnalyzeDecision = async (params: {
    question: string;
    context: string;
    options: string[];
    frameworkPreference: FrameworkType;
  }) => {
    setIsAnalyzing(true);
    setApiError(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with status ${res.status}`);
      }

      const data: DecisionAnalysis = await res.json();
      setDecisions((prev) => [data, ...prev]);
      setActiveDecisionId(data.id);
      setIsFormOpen(false);

      if (params.frameworkPreference !== 'all') {
        setCurrentView(params.frameworkPreference);
      } else {
        setCurrentView('summary');
      }
    } catch (err: any) {
      console.error('Analysis error:', err);
      setApiError(err.message || 'Unable to analyze decision. Please check server settings.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Chat with advisor
  const handleSendAdvisorMessage = async (text: string) => {
    if (!activeDecision) return;

    const userMsg: FollowUpMessage = {
      id: 'msg_' + Date.now().toString(36),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    const currentThread = advisorThreads[activeDecision.id] || [];
    const updatedThread = [...currentThread, userMsg];

    setAdvisorThreads((prev) => ({
      ...prev,
      [activeDecision.id]: updatedThread,
    }));

    setIsAdvisorLoading(true);

    try {
      const res = await fetch('/api/chat-deepen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionContext: activeDecision,
          userQuery: text,
          chatHistory: currentThread,
        }),
      });

      if (!res.ok) {
        throw new Error('Advisor failed to respond');
      }

      const data = await res.json();
      const botMsg: FollowUpMessage = {
        id: 'msg_' + (Date.now() + 1).toString(36),
        role: 'assistant',
        content: data.reply || 'Analysis completed.',
        timestamp: new Date().toISOString(),
      };

      setAdvisorThreads((prev) => ({
        ...prev,
        [activeDecision.id]: [...updatedThread, botMsg],
      }));
    } catch (e: any) {
      const errorMsg: FollowUpMessage = {
        id: 'msg_err_' + Date.now(),
        role: 'assistant',
        content: `Error: ${e.message || 'Could not connect to Pathfinder Advisor.'}`,
        timestamp: new Date().toISOString(),
      };
      setAdvisorThreads((prev) => ({
        ...prev,
        [activeDecision.id]: [...updatedThread, errorMsg],
      }));
    } finally {
      setIsAdvisorLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* 3-Zone Header */}
      <Header
        currentView={currentView}
        onSelectView={(v) => setCurrentView(v)}
        onOpenNewDecision={() => setIsFormOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* Main Workspace Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Error notification if any */}
        {apiError && (
          <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
            <span>{apiError}</span>
            <button
              onClick={() => setApiError(null)}
              className="text-xs font-semibold underline hover:no-underline ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Decision Context Bar */}
        {activeDecision && (
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 space-y-3 shadow-xs">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 flex-wrap">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Decision Dilemma
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{new Date(activeDecision.createdAt).toLocaleDateString()}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">
                    {activeDecision.options.length} options evaluated
                  </span>
                  {activeDecision.modelUsed && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                        {activeDecision.modelUsed}
                      </span>
                    </>
                  )}
                  {activeDecision.isFallback && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded px-1.5 py-0.5">
                      Resilient Fall-back Engaged
                    </span>
                  )}
                </div>
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                  {activeDecision.title}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-4xl">
                  {activeDecision.coreQuestion}
                </p>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center gap-2 shrink-0 flex-wrap">
                <button
                  onClick={() => setIsAdvisorOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Interrogate AI</span>
                </button>
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
                <button
                  onClick={() => setIsHistoryOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Decisions ({decisions.length})</span>
                </button>
              </div>
            </div>

            {/* Framework View Mode Switcher Pills */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg overflow-x-auto max-w-full">
                <button
                  onClick={() => setCurrentView('summary')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentView === 'summary'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Overview & Verdict</span>
                </button>

                <button
                  onClick={() => setCurrentView('pros-cons')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentView === 'pros-cons'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pros & Cons List</span>
                </button>

                <button
                  onClick={() => setCurrentView('comparison')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentView === 'comparison'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Comparison Matrix</span>
                </button>

                <button
                  onClick={() => setCurrentView('swot')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentView === 'swot'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
                  <span>SWOT Analysis</span>
                </button>

                <button
                  onClick={() => setCurrentView('cost-benefit')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentView === 'cost-benefit'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <DollarSign className="w-3.5 h-3.5 text-rose-500" />
                  <span>Cost-Benefit Analysis</span>
                </button>

                <button
                  onClick={() => setCurrentView('all')}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                    currentView === 'all'
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>Full Comprehensive Dossier</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Framework View Renderings */}
        {activeDecision && (
          <div className="space-y-8">
            {/* View: Summary or All */}
            {(currentView === 'summary' || currentView === 'all') && (
              <section className="space-y-4">
                {currentView === 'all' && (
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      1. Executive Verdict & Blindspots
                    </h2>
                  </div>
                )}
                <ExecutiveSummaryView
                  decision={activeDecision}
                  onOpenAdvisor={() => setIsAdvisorOpen(true)}
                />
              </section>
            )}

            {/* View: Pros and Cons or All */}
            {(currentView === 'pros-cons' || currentView === 'all') && (
              <section className="space-y-4">
                {currentView === 'all' && (
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Scale className="w-4 h-4 text-emerald-500" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      2. Weighted Pros & Cons List
                    </h2>
                  </div>
                )}
                <ProsConsView
                  decision={activeDecision}
                  onUpdateDecision={handleUpdateDecision}
                />
              </section>
            )}

            {/* View: Comparison Matrix or All */}
            {(currentView === 'comparison' || currentView === 'all') && (
              <section className="space-y-4">
                {currentView === 'all' && (
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      3. Multi-Option Comparison Matrix
                    </h2>
                  </div>
                )}
                <ComparisonMatrixView
                  decision={activeDecision}
                  onUpdateDecision={handleUpdateDecision}
                />
              </section>
            )}

            {/* View: SWOT Analysis or All */}
            {(currentView === 'swot' || currentView === 'all') && (
              <section className="space-y-4">
                {currentView === 'all' && (
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      4. SWOT Matrix & Strategic Synthesis
                    </h2>
                  </div>
                )}
                <SwotView
                  decision={activeDecision}
                  onUpdateDecision={handleUpdateDecision}
                />
              </section>
            )}

            {/* View: Cost Benefit Analysis or All */}
            {(currentView === 'cost-benefit' || currentView === 'all') && (
              <section className="space-y-4">
                {currentView === 'all' && (
                  <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                    <DollarSign className="w-4 h-4 text-rose-500" />
                    <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      5. Cost-Benefit Balance Sheet
                    </h2>
                  </div>
                )}
                <CostBenefitView
                  decision={activeDecision}
                  onUpdateDecision={handleUpdateDecision}
                />
              </section>
            )}
          </div>
        )}
      </main>

      {/* Decision History Sidebar Drawer */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Decision Library ({decisions.length})
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {decisions.map((d) => (
                <div
                  key={d.id}
                  className={`p-3 rounded-lg border text-left transition-colors flex items-start justify-between gap-2 group ${
                    d.id === activeDecisionId
                      ? 'bg-indigo-50/70 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <button
                    onClick={() => {
                      setActiveDecisionId(d.id);
                      setIsHistoryOpen(false);
                    }}
                    className="flex-1 text-left"
                  >
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                      {d.title}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {d.coreQuestion}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">
                      {new Date(d.createdAt).toLocaleDateString()} · {d.options.length} options
                    </div>
                  </button>

                  <button
                    onClick={() => handleDeleteDecision(d.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                    title="Delete decision"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setIsHistoryOpen(false);
                  setIsFormOpen(true);
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-center text-white bg-slate-900 dark:bg-indigo-600 rounded-lg hover:bg-slate-800 dark:hover:bg-indigo-500 transition-colors"
              >
                + Analyze New Decision
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decision Form Modal */}
      <DecisionFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleAnalyzeDecision}
        isLoading={isAnalyzing}
        onLoadSample={handleLoadSample}
      />

      {/* Deepen Advisor Drawer */}
      {activeDecision && (
        <DeepenAdvisorDrawer
          isOpen={isAdvisorOpen}
          onClose={() => setIsAdvisorOpen(false)}
          decision={activeDecision}
          messages={advisorThreads[activeDecision.id] || []}
          onSendMessage={handleSendAdvisorMessage}
          isLoading={isAdvisorLoading}
        />
      )}

      {/* Export Modal */}
      {activeDecision && (
        <ExportModal
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          decision={activeDecision}
        />
      )}
    </div>
  );
}
