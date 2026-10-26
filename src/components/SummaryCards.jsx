import React from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function SummaryCards({ transactions, currency }) {
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = incomeTotal - expenseTotal;
  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
      {/* 1. Total Balance */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Balance
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 flex-shrink-0">
            <Wallet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <div className={`text-xl sm:text-2xl lg:text-3xl font-bold font-mono tracking-tight truncate ${
            netBalance >= 0 ? 'text-slate-900 dark:text-white' : 'text-rose-600 dark:text-rose-400'
          }`}>
            {formatCurrency(netBalance, currency)}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-1">
            {netBalance >= 0 ? 'Net Available' : 'Net Deficit'}
          </p>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Inflow
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono tracking-tight text-emerald-600 dark:text-emerald-400 truncate">
            +{formatCurrency(incomeTotal, currency)}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-1">
            {incomeCount} {incomeCount === 1 ? 'record' : 'records'}
          </p>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-all flex flex-col justify-between">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Total Outflow
          </span>
          <div className="p-1.5 sm:p-2 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex-shrink-0">
            <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
        </div>
        <div>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono tracking-tight text-rose-600 dark:text-rose-400 truncate">
            -{formatCurrency(expenseTotal, currency)}
          </div>
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-0.5 sm:mt-1">
            {expenseCount} {expenseCount === 1 ? 'record' : 'records'}
          </p>
        </div>
      </div>
    </div>
  );
}
