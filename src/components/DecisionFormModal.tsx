import React, { useState } from 'react';
import { FrameworkType } from '../types/decision';
import { X, Sparkles, Plus, Trash2, Loader2, ArrowRight } from 'lucide-react';

interface DecisionFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    question: string;
    context: string;
    options: string[];
    frameworkPreference: FrameworkType;
  }) => Promise<void>;
  isLoading: boolean;
  onLoadSample: (sampleId: string) => void;
}

const PRESETS = [
  {
    label: 'Career: Startup vs Enterprise',
    sampleId: 'sample-career-startup-vs-corp',
  },
  {
    label: 'Finance: Buy vs Rent Home',
    sampleId: 'sample-housing-buy-vs-rent',
  },
];

export const DecisionFormModal: React.FC<DecisionFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
  onLoadSample,
}) => {
  const [question, setQuestion] = useState('');
  const [context, setContext] = useState('');
  const [customOptions, setCustomOptions] = useState<string[]>(['', '']);
  const [framework, setFramework] = useState<FrameworkType>('all');

  if (!isOpen) return null;

  const handleAddOptionField = () => {
    if (customOptions.length < 5) {
      setCustomOptions([...customOptions, '']);
    }
  };

  const handleOptionChange = (idx: number, val: string) => {
    const updated = [...customOptions];
    updated[idx] = val;
    setCustomOptions(updated);
  };

  const handleRemoveOptionField = (idx: number) => {
    if (customOptions.length > 2) {
      setCustomOptions(customOptions.filter((_, i) => i !== idx));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const filteredOptions = customOptions.map((o) => o.trim()).filter(Boolean);

    await onSubmit({
      question: question.trim(),
      context: context.trim(),
      options: filteredOptions,
      frameworkPreference: framework,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              New Strategic Decision
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              State your dilemma and Pathfinder will dissect pros, cons, matrices, and trade-offs.
            </p>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Quick Preset Selector */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="text-slate-500 font-medium">Quick Template:</span>
            {PRESETS.map((p) => (
              <button
                key={p.sampleId}
                type="button"
                onClick={() => {
                  onLoadSample(p.sampleId);
                  onClose();
                }}
                className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Dilemma Question */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              What decision do you need to make? <span className="text-rose-500">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="e.g. Should I accept the Senior Staff offer at the startup or stay at my current enterprise company?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full text-sm p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Context & Constraints */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Context, Constraints & Non-Negotiables (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Salary requirements, timeline to decide (2 weeks), family relocation constraints, risk tolerance..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="w-full text-xs p-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-slate-100"
            />
          </div>

          {/* Options Considered */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Options Under Consideration (Optional)
              </label>
              {customOptions.length < 5 && (
                <button
                  type="button"
                  onClick={handleAddOptionField}
                  className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Plus className="w-3 h-3" /> Add Option
                </button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Leave blank to have Pathfinder automatically propose the most viable, realistic alternatives.
            </p>
            <div className="space-y-2">
              {customOptions.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 w-16 shrink-0">
                    Option {String.fromCharCode(65 + idx)}:
                  </span>
                  <input
                    type="text"
                    placeholder={`e.g. ${idx === 0 ? 'Accept the new offer' : 'Remain in current position'}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  {customOptions.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOptionField(idx)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove option"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Primary Framework */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Primary Framework Focus
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
              {[
                { id: 'all', title: 'Comprehensive (All 4)' },
                { id: 'pros-cons', title: 'Pros & Cons List' },
                { id: 'comparison', title: 'Comparison Matrix' },
                { id: 'swot', title: 'SWOT Analysis' },
                { id: 'cost-benefit', title: 'Cost-Benefit Analysis' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFramework(f.id as FrameworkType)}
                  className={`p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                    framework === f.id
                      ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200 font-semibold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {f.title}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Powered by server-side Gemini 3.8 Flash
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading || !question.trim()}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-medium text-white bg-slate-900 hover:bg-slate-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 rounded-lg transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Analyzing Decision...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate Decision Blueprint</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
