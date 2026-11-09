import React, { useState } from 'react';
import { DecisionAnalysis, CostBenefitItem } from '../types/decision';
import { DollarSign, Clock, Plus, Trash2, ArrowRight } from 'lucide-react';

interface CostBenefitViewProps {
  decision: DecisionAnalysis;
  onUpdateDecision: (updated: DecisionAnalysis) => void;
}

export const CostBenefitView: React.FC<CostBenefitViewProps> = ({ decision, onUpdateDecision }) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(decision.options[0]?.id || '');
  const [addingSection, setAddingSection] = useState<
    'directCosts' | 'indirectCosts' | 'tangibleBenefits' | 'intangibleBenefits' | null
  >(null);
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemEstimate, setNewItemEstimate] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');

  const activeOption = decision.options.find((o) => o.id === activeOptionId) || decision.options[0];
  const cb = activeOption?.costBenefit || {
    directCosts: [],
    indirectCosts: [],
    tangibleBenefits: [],
    intangibleBenefits: [],
    netSummary: '',
    roiTimeline: '',
  };

  const handleAddItem = (
    section: 'directCosts' | 'indirectCosts' | 'tangibleBenefits' | 'intangibleBenefits'
  ) => {
    if (!newItemTitle.trim() || !activeOption) return;

    const newItem: CostBenefitItem = {
      item: newItemTitle.trim(),
      estimate: newItemEstimate.trim() || 'N/A',
      description: newItemDesc.trim() || undefined,
    };

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          costBenefit: {
            ...opt.costBenefit,
            [section]: [...(opt.costBenefit[section] || []), newItem],
          },
        };
      }
      return opt;
    });

    onUpdateDecision({ ...decision, options: updatedOptions, updatedAt: new Date().toISOString() });
    setNewItemTitle('');
    setNewItemEstimate('');
    setNewItemDesc('');
    setAddingSection(null);
  };

  const handleDeleteItem = (
    section: 'directCosts' | 'indirectCosts' | 'tangibleBenefits' | 'intangibleBenefits',
    index: number
  ) => {
    if (!activeOption) return;

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          costBenefit: {
            ...opt.costBenefit,
            [section]: opt.costBenefit[section].filter((_, i) => i !== index),
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
          {/* Executive Net Evaluation Card */}
          <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl space-y-3 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-mono tracking-wider text-slate-300 font-semibold">
                Cost-Benefit Ledger Synthesis
              </span>
              {cb.roiTimeline && (
                <div className="flex items-center gap-1.5 text-xs font-mono text-indigo-300">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Horizon: {cb.roiTimeline}</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium leading-relaxed text-slate-100">
              {cb.netSummary || 'Balanced synthesis of projected financial and non-financial yields against resource costs.'}
            </p>
          </div>

          {/* Quick Add Form if Active */}
          {addingSection && (
            <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl space-y-3 text-xs">
              <div className="font-semibold text-slate-900 dark:text-slate-100">
                Add Item to {addingSection.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Item Name (e.g. Salary decrease, Tooling budget, Peace of mind)"
                  value={newItemTitle}
                  onChange={(e) => setNewItemTitle(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
                />
                <input
                  type="text"
                  placeholder="Estimate or Value (e.g. $15,000/yr, 10 hrs/wk, or High)"
                  value={newItemEstimate}
                  onChange={(e) => setNewItemEstimate(e.target.value)}
                  className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono"
                />
              </div>
              <input
                type="text"
                placeholder="Description or context (optional)"
                value={newItemDesc}
                onChange={(e) => setNewItemDesc(e.target.value)}
                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAddingSection(null)}
                  className="px-3 py-1 text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddItem(addingSection)}
                  className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded font-medium"
                >
                  Save Entry
                </button>
              </div>
            </div>
          )}

          {/* Two-Sided Balance Sheet Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Costs Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-rose-200 dark:border-rose-900/60">
                <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm">
                  <DollarSign className="w-4 h-4" />
                  <span>Total Costs & Capital Outlay</span>
                </div>
                <button
                  onClick={() => setAddingSection('directCosts')}
                  className="inline-flex items-center gap-1 text-xs text-rose-700 dark:text-rose-400 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Cost
                </button>
              </div>

              {/* Direct Costs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  1. Direct Financial & Resource Costs
                </div>
                {cb.directCosts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No direct costs recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {cb.directCosts.map((cost, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-950 text-xs group"
                      >
                        <div className="space-y-0.5">
                          <div className="font-semibold text-slate-900 dark:text-slate-100">
                            {cost.item}
                          </div>
                          {cost.frequency && (
                            <div className="text-[11px] text-slate-500 dark:text-slate-400">
                              Frequency: {cost.frequency}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                            {cost.estimate}
                          </span>
                          <button
                            onClick={() => handleDeleteItem('directCosts', idx)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Indirect / Opportunity Costs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    2. Opportunity & Indirect Costs
                  </span>
                  <button
                    onClick={() => setAddingSection('indirectCosts')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    + Add
                  </button>
                </div>
                {cb.indirectCosts.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No opportunity costs recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {cb.indirectCosts.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.item}
                          </span>
                          <button
                            onClick={() => handleDeleteItem('indirectCosts', idx)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Benefits Side */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200 dark:border-emerald-900/60">
                <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                  <ArrowRight className="w-4 h-4" />
                  <span>Total Benefits & Gains</span>
                </div>
                <button
                  onClick={() => setAddingSection('tangibleBenefits')}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Benefit
                </button>
              </div>

              {/* Tangible Benefits */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  1. Tangible & Measurable Gains
                </div>
                {cb.tangibleBenefits.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No tangible benefits recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {cb.tangibleBenefits.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-950 text-xs group"
                      >
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.item}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {item.estimate}
                          </span>
                          <button
                            onClick={() => handleDeleteItem('tangibleBenefits', idx)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Intangible Benefits */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    2. Intangible & Quality-of-Life Returns
                  </span>
                  <button
                    onClick={() => setAddingSection('intangibleBenefits')}
                    className="text-xs text-slate-500 hover:text-slate-800"
                  >
                    + Add
                  </button>
                </div>
                {cb.intangibleBenefits.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No intangible benefits recorded.</p>
                ) : (
                  <div className="space-y-2">
                    {cb.intangibleBenefits.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-800 text-xs group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-semibold text-slate-900 dark:text-slate-100">
                            {item.item}
                          </span>
                          <button
                            onClick={() => handleDeleteItem('intangibleBenefits', idx)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        {item.description && (
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
