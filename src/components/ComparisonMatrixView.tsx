import React, { useState } from 'react';
import { DecisionAnalysis, ComparisonCriterion } from '../types/decision';
import { Plus, Sliders, Trash2, Award } from 'lucide-react';

interface ComparisonMatrixViewProps {
  decision: DecisionAnalysis;
  onUpdateDecision: (updated: DecisionAnalysis) => void;
}

export const ComparisonMatrixView: React.FC<ComparisonMatrixViewProps> = ({
  decision,
  onUpdateDecision,
}) => {
  const [isAddingCriterion, setIsAddingCriterion] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritWeight, setNewCritWeight] = useState(4);
  const [newCritDesc, setNewCritDesc] = useState('');

  const { criteria, ratings } = decision.comparisonMatrix;

  // Calculate weighted total for each option
  const optionTotals = decision.options.map((opt) => {
    let totalScore = 0;
    let maxPossible = 0;

    criteria.forEach((crit) => {
      const optRating = ratings[opt.id]?.[crit.id]?.score ?? 5;
      totalScore += optRating * crit.weight;
      maxPossible += 10 * crit.weight;
    });

    const percentage = maxPossible > 0 ? Math.round((totalScore / maxPossible) * 100) : 0;
    return {
      optionId: opt.id,
      title: opt.title,
      totalScore,
      maxPossible,
      percentage,
    };
  });

  // Sort to find winner
  const sortedByScore = [...optionTotals].sort((a, b) => b.totalScore - a.totalScore);
  const winningOptionId = sortedByScore[0]?.optionId;

  const handleWeightChange = (critId: string, newWeight: number) => {
    const updatedCriteria = criteria.map((c) => (c.id === critId ? { ...c, weight: newWeight } : c));
    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        ...decision.comparisonMatrix,
        criteria: updatedCriteria,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleScoreChange = (optId: string, critId: string, newScore: number) => {
    const currentOptRatings = ratings[optId] || {};
    const existingEntry = currentOptRatings[critId] || { score: 5, rationale: '' };

    const updatedRatings = {
      ...ratings,
      [optId]: {
        ...currentOptRatings,
        [critId]: {
          ...existingEntry,
          score: newScore,
        },
      },
    };

    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        ...decision.comparisonMatrix,
        ratings: updatedRatings,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleAddCriterion = () => {
    if (!newCritName.trim()) return;
    const newCritId = 'crit_' + Date.now().toString(36);
    const newCriterion: ComparisonCriterion = {
      id: newCritId,
      name: newCritName.trim(),
      weight: newCritWeight,
      description: newCritDesc.trim() || 'Custom evaluation criterion',
    };

    // Initialize scores of 5 for all options
    const updatedRatings = { ...ratings };
    decision.options.forEach((opt) => {
      if (!updatedRatings[opt.id]) updatedRatings[opt.id] = {};
      updatedRatings[opt.id][newCritId] = { score: 6, rationale: 'Initial evaluation' };
    });

    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        criteria: [...criteria, newCriterion],
        ratings: updatedRatings,
      },
      updatedAt: new Date().toISOString(),
    });

    setNewCritName('');
    setNewCritDesc('');
    setIsAddingCriterion(false);
  };

  const handleDeleteCriterion = (critId: string) => {
    const updatedCriteria = criteria.filter((c) => c.id !== critId);
    onUpdateDecision({
      ...decision,
      comparisonMatrix: {
        ...decision.comparisonMatrix,
        criteria: updatedCriteria,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="space-y-6">
      {/* Weighted Matrix Ranking Podium */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {optionTotals.map((item, idx) => {
          const isWinner = item.optionId === winningOptionId;
          return (
            <div
              key={item.optionId}
              className={`p-4 rounded-xl border transition-all ${
                isWinner
                  ? 'bg-indigo-50/70 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-800'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Rank #{idx + 1}
                </span>
                {isWinner && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                    <Award className="w-3.5 h-3.5" />
                    Top Weighted Fit
                  </span>
                )}
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1 line-clamp-1">
                {item.title}
              </h4>
              <div className="flex items-baseline gap-2 mt-3">
                <span className="text-2xl font-bold font-mono text-slate-900 dark:text-slate-100 tabular-nums">
                  {item.totalScore}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  / {item.maxPossible} pts ({item.percentage}%)
                </span>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isWinner ? 'bg-indigo-600 dark:bg-indigo-400' : 'bg-slate-400 dark:bg-slate-600'
                  }`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Comparison Matrix Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Weighted Decision Matrix
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Adjust importance weights (1–5) and option performance scores (1–10). Live scores update instantaneously.
            </p>
          </div>

          <button
            onClick={() => setIsAddingCriterion(!isAddingCriterion)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Criterion
          </button>
        </div>

        {/* Add Criterion Form */}
        {isAddingCriterion && (
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
              Add New Evaluation Criterion
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  placeholder="Criterion Name (e.g. Learning Curve, Capital Risk, Culture)"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <select
                  value={newCritWeight}
                  onChange={(e) => setNewCritWeight(parseInt(e.target.value, 10))}
                  className="w-full text-sm px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg font-mono"
                >
                  <option value={1}>Weight: 1 (Lowest)</option>
                  <option value={2}>Weight: 2 (Low)</option>
                  <option value={3}>Weight: 3 (Moderate)</option>
                  <option value={4}>Weight: 4 (High)</option>
                  <option value={5}>Weight: 5 (Crucial)</option>
                </select>
              </div>
            </div>
            <input
              type="text"
              placeholder="Brief description or evaluation standard (optional)"
              value={newCritDesc}
              onChange={(e) => setNewCritDesc(e.target.value)}
              className="w-full text-xs px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg"
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={() => setIsAddingCriterion(false)}
                className="px-3 py-1 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCriterion}
                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-medium"
              >
                Save Criterion
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
                <th className="py-3 px-4 text-xs font-semibold text-slate-500 dark:text-slate-400 w-1/3 min-w-[220px]">
                  Evaluation Criteria
                </th>
                <th className="py-3 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400 text-center w-28">
                  Weight (1–5)
                </th>
                {decision.options.map((opt) => (
                  <th
                    key={opt.id}
                    className="py-3 px-4 text-xs font-bold text-slate-900 dark:text-slate-100 min-w-[200px]"
                  >
                    <div className="truncate">{opt.title}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {criteria.map((crit) => (
                <tr key={crit.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 align-top">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-slate-100">
                          {crit.name}
                        </div>
                        {crit.description && (
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {crit.description}
                          </div>
                        )}
                      </div>
                      {criteria.length > 1 && (
                        <button
                          onClick={() => handleDeleteCriterion(crit.id)}
                          className="opacity-0 hover:opacity-100 focus:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition-opacity"
                          title="Delete criterion"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-3 align-top text-center">
                    <select
                      value={crit.weight}
                      onChange={(e) => handleWeightChange(crit.id, parseInt(e.target.value, 10))}
                      className="px-2 py-1 text-xs font-mono font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-xs text-center"
                    >
                      <option value={1}>1x</option>
                      <option value={2}>2x</option>
                      <option value={3}>3x</option>
                      <option value={4}>4x</option>
                      <option value={5}>5x</option>
                    </select>
                  </td>
                  {decision.options.map((opt) => {
                    const ratingEntry = ratings[opt.id]?.[crit.id] || { score: 5, rationale: '' };
                    const weightedPoints = ratingEntry.score * crit.weight;

                    return (
                      <td key={opt.id} className="py-3 px-4 align-top">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <select
                              value={ratingEntry.score}
                              onChange={(e) =>
                                handleScoreChange(opt.id, crit.id, parseInt(e.target.value, 10))
                              }
                              className={`px-2 py-1 text-xs font-mono font-bold rounded border ${
                                ratingEntry.score >= 8
                                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                  : ratingEntry.score <= 4
                                  ? 'bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800'
                                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                <option key={num} value={num}>
                                  {num}/10
                                </option>
                              ))}
                            </select>
                            <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                              ={weightedPoints} pts
                            </span>
                          </div>
                          {ratingEntry.rationale && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                              {ratingEntry.rationale}
                            </p>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/60 font-semibold">
                <td className="py-4 px-4 text-xs font-bold text-slate-900 dark:text-slate-100">
                  Total Weighted Score
                </td>
                <td className="py-4 px-3 text-center text-xs font-mono text-slate-500">
                  Σ(W × S)
                </td>
                {decision.options.map((opt) => {
                  const summary = optionTotals.find((t) => t.optionId === opt.id);
                  const isWinner = opt.id === winningOptionId;

                  return (
                    <td key={opt.id} className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-base font-mono font-bold tabular-nums ${
                            isWinner
                              ? 'text-indigo-600 dark:text-indigo-400'
                              : 'text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {summary?.totalScore ?? 0}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          ({summary?.percentage ?? 0}%)
                        </span>
                        {isWinner && (
                          <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-300">
                            ★ Leader
                          </span>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
