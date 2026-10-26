import React from 'react';
import { 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  TrendingUp, 
  PiggyBank, 
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { formatCurrency } from '../utils/formatters';

export default function FinancialSummary({ 
  transactions, 
  currency 
}) {
  const incomeTotal = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const expenseTotal = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const netBalance = incomeTotal - expenseTotal;
  
  const savingsRate = incomeTotal > 0 
    ? Math.max(0, Math.min(100, Math.round(((incomeTotal - expenseTotal) / incomeTotal) * 100))) 
    : 0;

  const incomeCount = transactions.filter(t => t.type === 'income').length;
  const expenseCount = transactions.filter(t => t.type === 'expense').length;

  const getHealthBadge = () => {
    if (incomeTotal === 0 && expenseTotal === 0) {
      return { text: 'Awaiting Data', color: 'text-slate-400 bg-slate-800/60 border-slate-700/50', icon: ShieldCheck };
    }
    if (netBalance < 0) {
      return { text: 'Deficit Warning', color: 'text-rose-400 bg-rose-500/10 border-rose-500/20', icon: AlertTriangle };
    }
    if (savingsRate >= 40) {
      return { text: 'High Surplus', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: ShieldCheck };
    }
    if (savingsRate >= 20) {
      return { text: 'Healthy Savings', color: 'text-teal-400 bg-teal-500/10 border-teal-500/20', icon: ShieldCheck };
    }
    return { text: 'Balanced Budget', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', icon: ShieldCheck };
  };

  const health = getHealthBadge();
  const HealthIcon = health.icon;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. Total Net Balance */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 relative group overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Net Balance
          </span>
          <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        
        <div className="mb-2">
          <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums ${
            netBalance >= 0 ? 'text-white' : 'text-rose-400'
          }`}>
            {formatCurrency(netBalance, currency)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
          <span className="text-slate-400">Available Reserves</span>
          <span className={`font-medium ${netBalance >= 0 ? 'text-teal-400' : 'text-rose-400'}`}>
            {netBalance >= 0 ? '+ In Positive' : '- Net Loss'}
          </span>
        </div>
      </div>

      {/* 2. Total Income */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 relative group overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Inflow
          </span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums text-emerald-400">
            +{formatCurrency(incomeTotal, currency)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
          <span className="text-slate-400">Sources</span>
          <span className="font-semibold text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {incomeCount} entries
          </span>
        </div>
      </div>

      {/* 3. Total Expenses */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-rose-500/30 transition-all duration-300 relative group overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Total Outflow
          </span>
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        
        <div className="mb-2">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums text-rose-400">
            -{formatCurrency(expenseTotal, currency)}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800/60">
          <span className="text-slate-400">Burn Rate</span>
          <span className="font-semibold text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
            {expenseCount} entries
          </span>
        </div>
      </div>

      {/* 4. Savings Rate & Financial Health */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700/80 transition-all duration-300 relative group overflow-hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Savings Performance
          </span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        
        <div className="mb-2 flex items-baseline justify-between">
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono tabular-nums text-indigo-300">
            {savingsRate}%
          </div>
          <div className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${health.color}`}>
            <HealthIcon className="w-3 h-3" />
            {health.text}
          </div>
        </div>

        {/* Progress bar */}
        <div className="pt-2 border-t border-slate-800/60">
          <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-indigo-500 h-1.5 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${savingsRate}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
