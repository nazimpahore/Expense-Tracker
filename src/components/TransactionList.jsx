import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  Edit3, 
  Copy, 
  Calendar, 
  Tag, 
  Repeat, 
  CreditCard,
  Building2,
  Banknote,
  Smartphone,
  Coins,
  ChevronDown,
  X
} from 'lucide-react';
import { getCategoryMeta, ALL_CATEGORIES } from '../constants/categories';
import { formatCurrency, formatDate } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function TransactionList({
  transactions,
  currency,
  onEditTransaction,
  onDuplicateTransaction,
  onDeleteTransaction,
  onOpenAddModal
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all' | 'income' | 'expense'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc'); // 'date-desc', 'date-asc', 'amount-desc', 'amount-asc', 'title-asc'

  // Payment method icon mapper
  const getMethodIcon = (method) => {
    switch (method) {
      case 'card': return CreditCard;
      case 'bank': return Building2;
      case 'cash': return Banknote;
      case 'digital': return Smartphone;
      case 'crypto': return Coins;
      default: return CreditCard;
    }
  };

  // Filter and Sort logic
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter((t) => {
        // Type filter
        if (typeFilter !== 'all' && t.type !== typeFilter) return false;
        // Category filter
        if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
        // Search query filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = t.title?.toLowerCase().includes(q);
          const matchCategory = t.category?.toLowerCase().includes(q);
          const matchNotes = t.notes?.toLowerCase().includes(q);
          const matchTags = t.tags?.some(tag => tag.toLowerCase().includes(q));
          if (!matchTitle && !matchCategory && !matchNotes && !matchTags) return false;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'date-desc') {
          return new Date(b.date) - new Date(a.date);
        } else if (sortBy === 'date-asc') {
          return new Date(a.date) - new Date(b.date);
        } else if (sortBy === 'amount-desc') {
          return Number(b.amount) - Number(a.amount);
        } else if (sortBy === 'amount-asc') {
          return Number(a.amount) - Number(b.amount);
        } else if (sortBy === 'title-asc') {
          return (a.title || '').localeCompare(b.title || '');
        }
        return 0;
      });
  }, [transactions, typeFilter, categoryFilter, searchQuery, sortBy]);

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCategoryFilter('all');
    setSortBy('date-desc');
  };

  const hasActiveFilters = searchQuery !== '' || typeFilter !== 'all' || categoryFilter !== 'all' || sortBy !== 'date-desc';

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 border border-slate-800/80 shadow-2xl relative">
      {/* Title & Stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Transaction Ledger</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700/60 font-mono">
              {filteredTransactions.length}
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Comprehensive history of all financial entries with instant multi-facet filtering
          </p>
        </div>

        {/* Filter Controls Row */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Type Filter Tabs */}
          <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                typeFilter === 'all'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                typeFilter === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              Inflow
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                typeFilter === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              Outflow
            </button>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-400 px-2 py-1.5 rounded-lg hover:bg-slate-800/80 transition-colors"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 mb-5">
        {/* Search Input */}
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, notes, or tags (e.g. rent, work, #tax)..."
            className="w-full bg-slate-900/80 text-slate-100 placeholder-slate-500 border border-slate-800 hover:border-slate-700 focus:border-teal-500/60 rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-slate-900/80 text-slate-200 border border-slate-800 hover:border-slate-700 focus:border-teal-500/60 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value="all">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Dropdown */}
        <div className="sm:col-span-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-slate-900/80 text-slate-200 border border-slate-800 hover:border-slate-700 focus:border-teal-500/60 rounded-xl px-3 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 transition-all cursor-pointer"
          >
            <option value="date-desc">Date (Newest First)</option>
            <option value="date-asc">Date (Oldest First)</option>
            <option value="amount-desc">Amount (Highest First)</option>
            <option value="amount-asc">Amount (Lowest First)</option>
            <option value="title-asc">Title (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Transactions List Content */}
      <div className="space-y-2.5">
        {filteredTransactions.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-slate-500 mb-3">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-200 mb-1">
              No Transactions Found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-4">
              {hasActiveFilters
                ? 'Try broadening your search term or adjusting filter criteria.'
                : 'Your ledger is currently empty. Record your first transaction to start tracking.'}
            </p>
            {hasActiveFilters ? (
              <button
                onClick={clearFilters}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <button
                onClick={onOpenAddModal}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-teal-600 hover:bg-teal-500 text-white shadow-lg shadow-teal-900/30 transition-all"
              >
                Create Transaction
              </button>
            )}
          </div>
        ) : (
          filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';
            const meta = getCategoryMeta(tx.category, tx.type);
            const MethodIcon = getMethodIcon(tx.paymentMethod);

            return (
              <div
                key={tx.id}
                className="group p-3.5 sm:p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5"
              >
                {/* Left: Category Icon & Details */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                    style={{ backgroundColor: `${meta.color}15`, border: `1px solid ${meta.color}30` }}
                  >
                    <CategoryIcon name={meta.icon} className="w-5 h-5" color={meta.color} />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm sm:text-base text-white tracking-tight truncate">
                        {tx.title}
                      </span>
                      {tx.recurring && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                          <Repeat className="w-2.5 h-2.5" />
                          Recurring
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 flex-wrap text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {formatDate(tx.date)}
                      </span>
                      <span>•</span>
                      <span 
                        className="font-medium px-2 py-0.5 rounded text-[11px]"
                        style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                      >
                        {meta.label}
                      </span>
                      {tx.paymentMethod && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-[11px] text-slate-400 capitalize">
                            <MethodIcon className="w-3 h-3 text-slate-500" />
                            {tx.paymentMethod}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Notes & Tags if any */}
                    {(tx.notes || (tx.tags && tx.tags.length > 0)) && (
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        {tx.notes && (
                          <span className="text-[11px] text-slate-400 italic line-clamp-1">
                            "{tx.notes}"
                          </span>
                        )}
                        {tx.tags && tx.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-800/80 px-1.5 py-0.2 rounded border border-slate-700/50">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Amount & Actions */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/60">
                  <div className="text-left sm:text-right">
                    <div
                      className={`text-base sm:text-lg font-bold font-mono tabular-nums tracking-tight ${
                        isIncome ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount, currency)}
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onDuplicateTransaction(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 transition-colors"
                      title="Duplicate entry"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                      title="Edit transaction"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteTransaction(tx.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      title="Delete transaction"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
