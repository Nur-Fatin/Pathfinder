import React, { useState } from 'react';
import { DecisionAnalysis, DecisionOption, ProConItem } from '../types/decision';
import { Plus, Trash2, ArrowUpRight, ArrowDownRight, ShieldCheck, Scale } from 'lucide-react';

interface ProsConsViewProps {
  decision: DecisionAnalysis;
  onUpdateDecision: (updated: DecisionAnalysis) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({ decision, onUpdateDecision }) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(decision.options[0]?.id || '');
  const [newProText, setNewProText] = useState('');
  const [newProImpact, setNewProImpact] = useState<number>(3);
  const [newProCategory, setNewProCategory] = useState('Strategic');

  const [newConText, setNewConText] = useState('');
  const [newConImpact, setNewConImpact] = useState<number>(3);
  const [newConCategory, setNewConCategory] = useState('Risk');
  const [newConMitigation, setNewConMitigation] = useState('');

  const [addingType, setAddingType] = useState<'pro' | 'con' | null>(null);

  const activeOption = decision.options.find((o) => o.id === activeOptionId) || decision.options[0];

  // Calculate scores
  const calculateOptionScore = (opt: DecisionOption) => {
    const prosTotal = opt.pros.reduce((sum, p) => sum + p.impact, 0);
    const consTotal = opt.cons.reduce((sum, c) => sum + c.impact, 0);
    const net = prosTotal - consTotal;
    return { prosTotal, consTotal, net };
  };

  const handleAddPro = () => {
    if (!newProText.trim() || !activeOption) return;
    const newPro: ProConItem = {
      id: 'p_' + Date.now().toString(36),
      text: newProText.trim(),
      impact: newProImpact,
      category: newProCategory,
    };

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          pros: [...opt.pros, newPro],
        };
      }
      return opt;
    });

    onUpdateDecision({ ...decision, options: updatedOptions, updatedAt: new Date().toISOString() });
    setNewProText('');
    setAddingType(null);
  };

  const handleAddCon = () => {
    if (!newConText.trim() || !activeOption) return;
    const newCon: ProConItem = {
      id: 'c_' + Date.now().toString(36),
      text: newConText.trim(),
      impact: newConImpact,
      category: newConCategory,
      note: newConMitigation ? `Mitigation: ${newConMitigation}` : undefined,
    };

    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          cons: [...opt.cons, newCon],
        };
      }
      return opt;
    });

    onUpdateDecision({ ...decision, options: updatedOptions, updatedAt: new Date().toISOString() });
    setNewConText('');
    setNewConMitigation('');
    setAddingType(null);
  };

  const handleDeleteItem = (optionId: string, itemId: string, isPro: boolean) => {
    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          pros: isPro ? opt.pros.filter((p) => p.id !== itemId) : opt.pros,
          cons: !isPro ? opt.cons.filter((c) => c.id !== itemId) : opt.cons,
        };
      }
      return opt;
    });
    onUpdateDecision({ ...decision, options: updatedOptions, updatedAt: new Date().toISOString() });
  };

  const handleImpactChange = (optionId: string, itemId: string, isPro: boolean, newImpact: number) => {
    const updatedOptions = decision.options.map((opt) => {
      if (opt.id === optionId) {
        return {
          ...opt,
          pros: isPro
            ? opt.pros.map((p) => (p.id === itemId ? { ...p, impact: newImpact } : p))
            : opt.pros,
          cons: !isPro
            ? opt.cons.map((c) => (c.id === itemId ? { ...c, impact: newImpact } : c))
            : opt.cons,
        };
      }
      return opt;
    });
    onUpdateDecision({ ...decision, options: updatedOptions, updatedAt: new Date().toISOString() });
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards comparing net score across all options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {decision.options.map((opt) => {
          const { prosTotal, consTotal, net } = calculateOptionScore(opt);
          const isSelected = opt.id === activeOption?.id;

          return (
            <button
              key={opt.id}
              onClick={() => setActiveOptionId(opt.id)}
              className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold tracking-wider uppercase opacity-80">
                  {opt.title}
                </span>
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                    net > 0
                      ? isSelected
                        ? 'bg-emerald-500/20 text-emerald-300 dark:text-emerald-700'
                        : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                      : net < 0
                      ? isSelected
                        ? 'bg-rose-500/20 text-rose-300 dark:text-rose-700'
                        : 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300'
                      : isSelected
                      ? 'bg-white/10 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Net: {net > 0 ? `+${net}` : net}
                </span>
              </div>
              <p
                className={`text-xs line-clamp-2 ${
                  isSelected ? 'text-slate-300 dark:text-slate-600' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {opt.description}
              </p>
              <div
                className={`flex items-center gap-4 mt-3 pt-3 border-t text-xs font-mono tabular-nums ${
                  isSelected ? 'border-white/15 dark:border-slate-300' : 'border-slate-100 dark:border-slate-800'
                }`}
              >
                <span className="text-emerald-500 font-semibold">Pros: +{prosTotal}</span>
                <span className="text-rose-500 font-semibold">Cons: -{consTotal}</span>
                <span className="opacity-70">({opt.pros.length} pros · {opt.cons.length} cons)</span>
              </div>
            </button>
          );
        })}
      </div>

      {activeOption && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-6 border-b border-slate-100 dark:border-slate-800 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {activeOption.title}
                </h3>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {activeOption.description}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setAddingType(addingType === 'pro' ? null : 'pro')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Pro
              </button>
              <button
                onClick={() => setAddingType(addingType === 'con' ? null : 'con')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Con
              </button>
            </div>
          </div>

          {/* Quick Add Forms */}
          {addingType === 'pro' && (
            <div className="mb-6 p-4 bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-xl space-y-3">
              <div className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                Add New Supporting Argument (Pro)
              </div>
              <input
                type="text"
                placeholder="What is the concrete advantage or upside?"
                value={newProText}
                onChange={(e) => setNewProText(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-300">Impact Score (1-5):</span>
                  <select
                    value={newProImpact}
                    onChange={(e) => setNewProImpact(parseInt(e.target.value, 10))}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono"
                  >
                    <option value={1}>1 - Minor upside</option>
                    <option value={2}>2 - Modest upside</option>
                    <option value={3}>3 - Meaningful advantage</option>
                    <option value={4}>4 - High impact</option>
                    <option value={5}>5 - Game-changer / Essential</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-300">Category:</span>
                  <input
                    type="text"
                    value={newProCategory}
                    onChange={(e) => setNewProCategory(e.target.value)}
                    className="w-32 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                    placeholder="e.g. Financial"
                  />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setAddingType(null)}
                    className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddPro}
                    className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-medium"
                  >
                    Save Pro
                  </button>
                </div>
              </div>
            </div>
          )}

          {addingType === 'con' && (
            <div className="mb-6 p-4 bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/60 rounded-xl space-y-3">
              <div className="text-xs font-semibold text-rose-900 dark:text-rose-200">
                Add New Risk or Downside (Con)
              </div>
              <input
                type="text"
                placeholder="What is the concrete risk, cost, or drawback?"
                value={newConText}
                onChange={(e) => setNewConText(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <input
                type="text"
                placeholder="Mitigation idea (How could you reduce this downside?)"
                value={newConMitigation}
                onChange={(e) => setNewConMitigation(e.target.value)}
                className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-300">Severity / Impact (1-5):</span>
                  <select
                    value={newConImpact}
                    onChange={(e) => setNewConImpact(parseInt(e.target.value, 10))}
                    className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono"
                  >
                    <option value={1}>1 - Minor inconvenience</option>
                    <option value={2}>2 - Noticeable friction</option>
                    <option value={3}>3 - Serious concern</option>
                    <option value={4}>4 - Major downside</option>
                    <option value={5}>5 - Severe / Deal-breaker</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-600 dark:text-slate-300">Category:</span>
                  <input
                    type="text"
                    value={newConCategory}
                    onChange={(e) => setNewConCategory(e.target.value)}
                    className="w-32 px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded text-xs"
                    placeholder="e.g. Risk"
                  />
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={() => setAddingType(null)}
                    className="px-3 py-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddCon}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded font-medium"
                  >
                    Save Con
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Two-Column Side by Side: Pros vs Cons */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pros Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-emerald-100 dark:border-emerald-950">
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Pros & Advantages ({activeOption.pros.length})
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  Weighted: +{activeOption.pros.reduce((s, p) => s + p.impact, 0)} pts
                </span>
              </div>

              {activeOption.pros.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  No pros added yet. Click &quot;Add Pro&quot; above to include an upside.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeOption.pros.map((pro) => (
                    <div
                      key={pro.id}
                      className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-lg hover:border-emerald-300 dark:hover:border-emerald-700 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                            {pro.text}
                          </div>
                          {pro.note && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {pro.note}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <span>{pro.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums text-emerald-600 dark:text-emerald-400 font-semibold">
                              Impact: +{pro.impact}/5
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100">
                          <select
                            value={pro.impact}
                            onChange={(e) =>
                              handleImpactChange(activeOption.id, pro.id, true, parseInt(e.target.value, 10))
                            }
                            className="text-xs px-1.5 py-0.5 font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
                            title="Adjust impact weighting"
                          >
                            <option value={1}>+1</option>
                            <option value={2}>+2</option>
                            <option value={3}>+3</option>
                            <option value={4}>+4</option>
                            <option value={5}>+5</option>
                          </select>
                          <button
                            onClick={() => handleDeleteItem(activeOption.id, pro.id, true)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Cons Column */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-rose-100 dark:border-rose-950">
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    Cons & Trade-offs ({activeOption.cons.length})
                  </span>
                </div>
                <span className="text-xs text-slate-500 font-mono tabular-nums">
                  Weighted: -{activeOption.cons.reduce((s, c) => s + c.impact, 0)} pts
                </span>
              </div>

              {activeOption.cons.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                  No cons added yet. Click &quot;Add Con&quot; above to record downsides.
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeOption.cons.map((con) => (
                    <div
                      key={con.id}
                      className="p-3.5 bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-lg hover:border-rose-300 dark:hover:border-rose-700 transition-colors group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1 flex-1">
                          <div className="text-sm font-medium text-slate-900 dark:text-slate-100 leading-snug">
                            {con.text}
                          </div>
                          {con.note && (
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {con.note}
                            </p>
                          )}
                          {con.mitigation && (
                            <div className="flex items-start gap-1.5 mt-1.5 p-2 bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 rounded text-xs text-amber-900 dark:text-amber-200">
                              <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                              <div>
                                <span className="font-semibold">Mitigation: </span>
                                {con.mitigation}
                              </div>
                            </div>
                          )}
                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1">
                            <span>{con.category}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono tabular-nums text-rose-600 dark:text-rose-400 font-semibold">
                              Severity: -{con.impact}/5
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-90 group-hover:opacity-100">
                          <select
                            value={con.impact}
                            onChange={(e) =>
                              handleImpactChange(activeOption.id, con.id, false, parseInt(e.target.value, 10))
                            }
                            className="text-xs px-1.5 py-0.5 font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded"
                            title="Adjust severity rating"
                          >
                            <option value={1}>-1</option>
                            <option value={2}>-2</option>
                            <option value={3}>-3</option>
                            <option value={4}>-4</option>
                            <option value={5}>-5</option>
                          </select>
                          <button
                            onClick={() => handleDeleteItem(activeOption.id, con.id, false)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
                            title="Delete item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
