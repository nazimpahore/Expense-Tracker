import React, { useState } from 'react';
import { Plus, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';

export default function TransactionForm({ onAddTransaction, currencySymbol = '$' }) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory(INCOME_CATEGORIES[0].id);
    } else {
      setCategory(EXPENSE_CATEGORIES[0].id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0) return;

    onAddTransaction({
      id: `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date
    });

    setTitle('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3.5 sm:mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Add Transaction
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Log an expense or income entry
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* Type Toggle: Expense vs Income */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-2 rounded-lg text-xs font-semibold min-h-[40px] transition-all active:scale-[0.98] ${
              type === 'expense'
                ? 'bg-white dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 shadow-sm border border-slate-200 dark:border-rose-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            <span>Expense</span>
          </button>

          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-2 rounded-lg text-xs font-semibold min-h-[40px] transition-all active:scale-[0.98] ${
              type === 'income'
                ? 'bg-white dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-sm border border-slate-200 dark:border-emerald-500/30'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Income</span>
          </button>
        </div>

        {/* Title / Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Description
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={type === 'expense' ? 'e.g. Groceries, Dinner, Electric' : 'e.g. Salary, Client Retainer'}
            className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/80 rounded-xl px-3.5 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
              {currencySymbol}
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700/80 rounded-xl pl-8 pr-3.5 py-2.5 text-base sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all"
            />
          </div>
        </div>

        {/* Category & Date Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all cursor-pointer"
            >
              {currentCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 rounded-xl px-3 py-2.5 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-all cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 py-3 sm:py-2.5 px-4 rounded-xl font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-sm active:scale-[0.98] transition-all min-h-[44px]"
        >
          <Plus className="w-4 h-4" />
          <span>Add {type === 'income' ? 'Income' : 'Expense'}</span>
        </button>
      </form>
    </div>
  );
}
