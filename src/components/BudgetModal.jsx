import React, { useState, useEffect } from 'react';
import { X, SlidersHorizontal, Check, RotateCcw } from 'lucide-react';
import { EXPENSE_CATEGORIES } from '../constants/categories';
import { DEFAULT_BUDGETS } from '../utils/sampleData';
import { formatCurrency } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function BudgetModal({
  isOpen,
  onClose,
  budgets,
  onSaveBudgets,
  currency
}) {
  const [localBudgets, setLocalBudgets] = useState({});

  useEffect(() => {
    setLocalBudgets(budgets || DEFAULT_BUDGETS);
  }, [budgets, isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleChange = (catId, val) => {
    const num = parseFloat(val) || 0;
    setLocalBudgets(prev => ({ ...prev, [catId]: num }));
  };

  const handleResetDefaults = () => {
    setLocalBudgets(DEFAULT_BUDGETS);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveBudgets(localBudgets);
    onClose();
  };

  const totalMonthlyBudget = Object.values(localBudgets).reduce((sum, v) => sum + (Number(v) || 0), 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Monthly Category Budgets
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Set maximum spending thresholds per category to prevent overspending and track progress.
          </p>
        </div>

        {/* Total Monthly Cap Banner */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 mb-5 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Combined Monthly Spending Cap
          </span>
          <span className="text-lg font-bold font-mono text-teal-400">
            {formatCurrency(totalMonthlyBudget, currency)}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {EXPENSE_CATEGORIES.map((cat) => {
              const value = localBudgets[cat.id] ?? cat.defaultBudget;
              return (
                <div 
                  key={cat.id} 
                  className="p-3 rounded-xl bg-slate-900/50 border border-slate-800/80 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div 
                      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <CategoryIcon name={cat.icon} className="w-4 h-4" color={cat.color} />
                    </div>
                    <span className="text-xs font-medium text-slate-200 truncate">
                      {cat.label}
                    </span>
                  </div>

                  <div className="w-28 relative flex-shrink-0">
                    <input
                      type="number"
                      min="0"
                      step="10"
                      value={value}
                      onChange={(e) => handleChange(cat.id, e.target.value)}
                      className="w-full bg-slate-900 text-white font-mono text-xs border border-slate-700/80 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-teal-500/50"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Defaults
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-900/40 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Save Budgets</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
