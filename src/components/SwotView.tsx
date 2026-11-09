import React, { useState } from 'react';
import { DecisionAnalysis, SwotData } from '../types/decision';
import { Plus, Trash2, Lightbulb, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

interface SwotViewProps {
  decision: DecisionAnalysis;
  onUpdateDecision: (updated: DecisionAnalysis) => void;
}

type SwotQuadrant = 'strengths' | 'weaknesses' | 'opportunities' | 'threats';

export const SwotView: React.FC<SwotViewProps> = ({ decision, onUpdateDecision }) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(decision.options[0]?.id || '');
  const [addingToQuadrant, setAddingToQuadrant] = useState<SwotQuadrant | null>(null);
  const [newItemText, setNewItemText] = useState('');

  const activeOption = decision.options.find((o) => o.id === activeOptionId) || decision.options[0];
  const swot: SwotData = activeOption?.swot || {
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: [],
    strategicTakeaways: [],
  };

  const handleAddItem = (quadrant: SwotQuadrant) => {
    if (!newItemText.trim() || !activeOption) return;

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === activeOption.id) {
        const currentList = opt.swot[quadrant] || [];
        return {
          ...opt,
          swot: {
            ...opt.swot,
            [quadrant]: [...currentList, newItemText.trim()],
          },
        };
      }
      return opt;
    });

    onUpdateDecision({ ...decision, options: updatedOptions, updatedAt: new Date().toISOString() });
    setNewItemText('');
    setAddingToQuadrant(null);
  };

  const handleDeleteItem = (quadrant: SwotQuadrant, index: number) => {
    if (!activeOption) return;

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === activeOption.id) {
        const currentList = opt.swot[quadrant] || [];
        return {
          ...opt,
          swot: {
            ...opt.swot,
            [quadrant]: currentList.filter((_, i) => i !== index),
          },
        };
      }
      return opt;
    });

    onUpdateDecision({ ...decision, options: updatedOptions, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      {/* Option Selector Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mr-2 shrink-0">
          Option Analyzed:
        </span>
        {decision.options.map((opt) => {
          const isSelected = opt.id === activeOptionId;
          return (
            <button
              key={opt.id}
              onClick={() => setActiveOptionId(opt.id)}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer shrink-0 ${
                isSelected
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.title}
            </button>
          );
        })}
      </div>

      {activeOption && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                SWOT Matrix: {activeOption.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Evaluates internal capability vs. external forces shaping this path.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Internal: Strengths & Weaknesses
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> External: Opportunities & Threats
              </span>
            </div>
          </div>

          {/* 2x2 SWOT Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Strengths */}
            <div className="p-5 rounded-xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Strengths (Internal Advantages)
                  </h4>
                </div>
                <button
                  onClick={() => setAddingToQuadrant(addingToQuadrant === 'strengths' ? null : 'strengths')}
                  className="p-1 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded transition-colors"
                  title="Add Strength"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {addingToQuadrant === 'strengths' && (
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter internal strength or unique capability..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5 text-xs">
                    <button
                      onClick={() => setAddingToQuadrant(null)}
                      className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddItem('strengths')}
                      className="px-2.5 py-0.5 bg-emerald-600 text-white rounded font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <ul className="space-y-2 text-xs">
                {swot.strengths.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 group"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleDeleteItem('strengths', idx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="p-5 rounded-xl border border-amber-200/80 dark:border-amber-900/50 bg-amber-50/30 dark:bg-amber-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Weaknesses (Internal Limitations)
                  </h4>
                </div>
                <button
                  onClick={() => setAddingToQuadrant(addingToQuadrant === 'weaknesses' ? null : 'weaknesses')}
                  className="p-1 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 rounded transition-colors"
                  title="Add Weakness"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {addingToQuadrant === 'weaknesses' && (
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-amber-200 dark:border-amber-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter internal liability or resource gap..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5 text-xs">
                    <button
                      onClick={() => setAddingToQuadrant(null)}
                      className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddItem('weaknesses')}
                      className="px-2.5 py-0.5 bg-amber-600 text-white rounded font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <ul className="space-y-2 text-xs">
                {swot.weaknesses.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 group"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleDeleteItem('weaknesses', idx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Opportunities */}
            <div className="p-5 rounded-xl border border-indigo-200/80 dark:border-indigo-900/50 bg-indigo-50/30 dark:bg-indigo-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Opportunities (External Tailwinds)
                  </h4>
                </div>
                <button
                  onClick={() =>
                    setAddingToQuadrant(addingToQuadrant === 'opportunities' ? null : 'opportunities')
                  }
                  className="p-1 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 rounded transition-colors"
                  title="Add Opportunity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {addingToQuadrant === 'opportunities' && (
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-indigo-200 dark:border-indigo-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter external market tailwind or timing opening..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5 text-xs">
                    <button
                      onClick={() => setAddingToQuadrant(null)}
                      className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddItem('opportunities')}
                      className="px-2.5 py-0.5 bg-indigo-600 text-white rounded font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <ul className="space-y-2 text-xs">
                {swot.opportunities.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 group"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleDeleteItem('opportunities', idx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Threats */}
            <div className="p-5 rounded-xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/30 dark:bg-rose-950/20 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Threats (External Headwinds & Risks)
                  </h4>
                </div>
                <button
                  onClick={() => setAddingToQuadrant(addingToQuadrant === 'threats' ? null : 'threats')}
                  className="p-1 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded transition-colors"
                  title="Add Threat"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {addingToQuadrant === 'threats' && (
                <div className="p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-rose-200 dark:border-rose-800 space-y-2">
                  <input
                    type="text"
                    placeholder="Enter external disruption or competitor threat..."
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-slate-200 dark:border-slate-800 rounded focus:outline-none"
                    autoFocus
                  />
                  <div className="flex justify-end gap-1.5 text-xs">
                    <button
                      onClick={() => setAddingToQuadrant(null)}
                      className="px-2 py-0.5 text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleAddItem('threats')}
                      className="px-2.5 py-0.5 bg-rose-600 text-white rounded font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}

              <ul className="space-y-2 text-xs">
                {swot.threats.map((item, idx) => (
                  <li
                    key={idx}
                    className="flex items-start justify-between gap-2 p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-lg border border-slate-200/60 dark:border-slate-800 text-slate-800 dark:text-slate-200 group"
                  >
                    <span>{item}</span>
                    <button
                      onClick={() => handleDeleteItem('threats', idx)}
                      className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition-opacity p-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Strategic Synthesis Takeaway */}
          {swot.strategicTakeaways && swot.strategicTakeaways.length > 0 && (
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                Cross-SWOT Strategic Synthesis
              </div>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 pl-6 list-disc">
                {swot.strategicTakeaways.map((takeaway, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {takeaway}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
