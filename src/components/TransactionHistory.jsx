import React, { useState } from 'react';
import { Search, Trash2, Inbox } from 'lucide-react';
import { getCategoryMeta } from '../constants/categories';
import { formatCurrency, formatDate } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function TransactionHistory({ transactions, currency, onDeleteTransaction }) {
  const [filter, setFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [search, setSearch] = useState('');

  const filtered = transactions.filter((t) => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = t.title?.toLowerCase().includes(q);
      const matchCategory = t.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchCategory) return false;
    }
    return true;
  });

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm mt-4 sm:mt-6">
      {/* Header with Title & Filter Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3.5 sm:mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Recent Transactions</span>
            <span className="text-[11px] sm:text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono">
              {transactions.length}
            </span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            History of your financial activities
          </p>
        </div>

        {/* Filter Tabs (Full width on mobile, auto width on desktop) */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800/70 rounded-xl text-xs w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg font-medium transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('income')}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg font-medium transition-all ${
              filter === 'income'
                ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 shadow-sm font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-emerald-600'
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setFilter('expense')}
            className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg font-medium transition-all ${
              filter === 'expense'
                ? 'bg-rose-50 dark:bg-rose-500/20 text-rose-700 dark:text-rose-300 shadow-sm font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-rose-600'
            }`}
          >
            Expenses
          </button>
        </div>
      </div>

      {/* Search Input */}
      {transactions.length > 2 && (
        <div className="relative mb-3.5 sm:mb-4">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2.5 sm:py-2 text-base sm:text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
          />
        </div>
      )}

      {/* Transaction List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="py-10 sm:py-12 text-center flex flex-col items-center justify-center">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400 mb-2">
              <Inbox className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
              {transactions.length === 0 ? 'No Transactions Yet' : 'No Matching Results'}
            </p>
            <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1 px-4">
              {transactions.length === 0
                ? 'Add an income or expense using the form above to start tracking your records.'
                : 'Try clearing your search query or switching the filter tab.'}
            </p>
          </div>
        ) : (
          filtered.map((t) => {
            const isIncome = t.type === 'income';
            const meta = getCategoryMeta(t.category, t.type);

            return (
              <div
                key={t.id}
                className="group p-2.5 sm:p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100/80 dark:bg-slate-800/40 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2.5 sm:gap-3 transition-colors"
              >
                {/* Left: Icon & Details */}
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <div
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${meta.color}15` }}
                  >
                    <CategoryIcon name={meta.icon} className="w-4 h-4" color={meta.color} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white truncate">
                      {t.title}
                    </p>
                    <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                      <span>{formatDate(t.date)}</span>
                      <span>•</span>
                      <span className="capitalize">{meta.label}</span>
                    </div>
                  </div>
                </div>

                {/* Right: Amount & Delete Button */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <span
                    className={`font-mono font-bold text-xs sm:text-sm whitespace-nowrap ${
                      isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {isIncome ? '+' : '-'}{formatCurrency(t.amount, currency)}
                  </span>

                  <button
                    onClick={() => onDeleteTransaction(t.id)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 active:scale-95 transition-all"
                    title="Delete transaction"
                    aria-label="Delete transaction"
                  >
                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
