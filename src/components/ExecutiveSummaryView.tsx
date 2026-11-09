import React from 'react';
import { DecisionAnalysis } from '../types/decision';
import { CheckCircle2, AlertTriangle, HelpCircle, Compass, ShieldCheck } from 'lucide-react';

interface ExecutiveSummaryViewProps {
  decision: DecisionAnalysis;
  onOpenAdvisor: () => void;
}

export const ExecutiveSummaryView: React.FC<ExecutiveSummaryViewProps> = ({
  decision,
  onOpenAdvisor,
}) => {
  const { recommendation, blindspots, devilsAdvocate, decisionType, summary } = decision;

  const isType1 = decisionType?.includes('Type 1') || false;

  return (
    <div className="space-y-6">
      {/* Primary Recommendation Banner */}
      <div className="p-6 bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-950 text-white rounded-2xl border border-indigo-500/20 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                Pathfinder Strategic Verdict
              </span>
            </div>
            <div className="text-xs font-mono px-2.5 py-1 rounded bg-white/10 text-slate-200 border border-white/10">
              {decisionType}
            </div>
          </div>

          <div>
            <div className="text-xs text-indigo-300 font-medium">Recommended Primary Direction:</div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-0.5">
              {recommendation.primaryChoice}
            </h2>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed max-w-4xl">
            {recommendation.verdictRationale}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
            {recommendation.lowRiskNextStep && (
              <div className="space-y-1">
                <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Immediate Low-Risk Action (Next 24-72 Hours):
                </span>
                <p className="text-slate-300">{recommendation.lowRiskNextStep}</p>
              </div>
            )}

            {recommendation.contingencyPlan && (
              <div className="space-y-1">
                <span className="font-semibold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  90-Day Contingency & Circuit Breaker:
                </span>
                <p className="text-slate-300">{recommendation.contingencyPlan}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decision Taxonomy & Executive Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Summary & Devil's Advocate */}
        <div className="lg:col-span-2 space-y-6">
          {/* Executive Overview */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Core Strategic Trade-off
            </h3>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed">
              {summary}
            </p>
          </div>

          {/* Devil's Advocate Testing */}
          {devilsAdvocate && Object.keys(devilsAdvocate).length > 0 && (
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-500" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Devil&apos;s Advocate Stress Tests
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                The most uncomfortable, critical questions testing your conviction before you commit:
              </p>

              <div className="space-y-3">
                {Object.entries(devilsAdvocate).map(([optId, counterArg]) => {
                  const opt = decision.options.find((o) => o.id === optId);
                  return (
                    <div
                      key={optId}
                      className="p-3.5 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/50 space-y-1.5"
                    >
                      <div className="text-xs font-bold text-rose-900 dark:text-rose-300">
                        Challenging {opt ? opt.title : optId}:
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                        &quot;{counterArg}&quot;
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Mental Model & Blindspots */}
        <div className="space-y-6">
          {/* Type 1 vs Type 2 Decision Mental Model */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Decision Architecture Rule
              </h4>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {isType1 ? (
                <>
                  <strong className="text-slate-900 dark:text-white">One-Way Door:</strong> This decision has high switching costs and cannot be easily reversed. Invest time in deliberate second-order risk mitigation and pre-mortems before executing.
                </>
              ) : (
                <>
                  <strong className="text-slate-900 dark:text-white">Two-Way Door:</strong> This decision is lightweight and reversible. Bias toward rapid action with 70% information rather than over-analyzing.
                </>
              )}
            </div>
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={onOpenAdvisor}
                className="w-full text-center px-3 py-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors"
              >
                Stress-Test with Pathfinder AI →
              </button>
            </div>
          </div>

          {/* Identified Blindspots */}
          <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Identified Blindspots & Biases
            </h4>
            {blindspots && blindspots.length > 0 ? (
              <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                {blindspots.map((blindspot, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="font-mono text-indigo-500 font-bold shrink-0">{idx + 1}.</span>
                    <span>{blindspot}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-400">No critical blindspots flagged.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
