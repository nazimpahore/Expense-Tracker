import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Legend
} from 'recharts';
import { 
  PieChart as PieIcon, 
  BarChart3, 
  AlertCircle, 
  CheckCircle2, 
  SlidersHorizontal,
  Info
} from 'lucide-react';
import { getCategoryMeta, EXPENSE_CATEGORIES } from '../constants/categories';
import { formatCurrency, formatShortMonth } from '../utils/formatters';
import CategoryIcon from './CategoryIcon';

export default function AnalyticsSection({
  transactions,
  budgets,
  currency,
  onOpenBudgetModal
}) {
  const [activeTab, setActiveTab] = useState('breakdown'); // 'breakdown' | 'cashflow' | 'budgets'

  // 1. Prepare Category Breakdown Data (Expenses only)
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals)
    .map(([catId, amount]) => {
      const meta = getCategoryMeta(catId, 'expense');
      return {
        id: catId,
        name: meta.label,
        value: amount,
        color: meta.color,
        icon: meta.icon,
        percentage: totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : 0
      };
    })
    .sort((a, b) => b.value - a.value);

  // 2. Prepare Cashflow Timeline Data (Grouped by Month)
  const timelineMap = {};
  transactions.forEach(t => {
    const monthKey = formatShortMonth(t.date) || 'Recent';
    if (!timelineMap[monthKey]) {
      timelineMap[monthKey] = { month: monthKey, income: 0, expense: 0, net: 0 };
    }
    if (t.type === 'income') {
      timelineMap[monthKey].income += Number(t.amount || 0);
    } else {
      timelineMap[monthKey].expense += Number(t.amount || 0);
    }
    timelineMap[monthKey].net = timelineMap[monthKey].income - timelineMap[monthKey].expense;
  });

  const cashflowData = Object.values(timelineMap);

  // Custom Chart Tooltip
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
            <span className="font-semibold text-xs text-white">{data.name}</span>
          </div>
          <div className="text-sm font-bold font-mono text-white">
            {formatCurrency(data.value, currency)}
          </div>
          <div className="text-[11px] text-slate-400">
            {data.percentage}% of total expenses
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomBarTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700/80 p-3 rounded-xl shadow-xl backdrop-blur-md">
          <div className="font-semibold text-xs text-slate-300 mb-2">{label}</div>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4 text-xs mb-1">
              <span className="flex items-center gap-1.5" style={{ color: entry.color }}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-mono font-bold text-white">
                {formatCurrency(entry.value, currency)}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 mb-8 border border-slate-800/80 shadow-2xl relative">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 mb-5 border-b border-slate-800/80">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-400" />
            Financial Intelligence & Analytics
          </h2>
          <p className="text-xs text-slate-400">
            Real-time capital flow, category distribution, and monthly budget limits
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-900/90 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'breakdown'
                ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Spending Breakdown</span>
          </button>

          <button
            onClick={() => setActiveTab('cashflow')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'cashflow'
                ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Cashflow History</span>
          </button>

          <button
            onClick={() => setActiveTab('budgets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'budgets'
                ? 'bg-teal-600/30 text-teal-300 border border-teal-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Budget Tracker</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Spending Breakdown Donut Chart */}
      {activeTab === 'breakdown' && (
        <div>
          {pieData.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-full bg-slate-800/80 flex items-center justify-center text-slate-500 mb-3">
                <PieIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-300">No Expense Data Recorded</p>
              <p className="text-xs text-slate-500 max-w-xs mt-1">
                Add an expense transaction or load sample demo data to explore visual breakdowns.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              {/* Donut Chart */}
              <div className="lg:col-span-6 h-[260px] sm:h-[300px] relative flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={105}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>

                {/* Center Badge */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Total Outflow
                  </span>
                  <span className="text-lg sm:text-xl font-bold font-mono text-white mt-0.5">
                    {formatCurrency(totalExpense, currency)}
                  </span>
                </div>
              </div>

              {/* Category Breakdown Progress Bars */}
              <div className="lg:col-span-6 space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {pieData.map((item) => (
                  <div key={item.id} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700/80 transition-all">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-6 h-6 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: `${item.color}20` }}
                        >
                          <CategoryIcon name={item.icon} className="w-3.5 h-3.5" color={item.color} />
                        </div>
                        <span className="font-medium text-slate-200">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-white">
                          {formatCurrency(item.value, currency)}
                        </span>
                        <span className="text-[11px] text-slate-400 w-10 text-right">
                          {item.percentage}%
                        </span>
                      </div>
                    </div>
                    {/* Tiny Progress bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Cashflow History Bar Chart */}
      {activeTab === 'cashflow' && (
        <div>
          {cashflowData.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <BarChart3 className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-sm font-medium text-slate-300">No Historical Records Yet</p>
            </div>
          ) : (
            <div className="h-[280px] sm:h-[320px] w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={cashflowData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={{ stroke: '#334155' }} 
                  />
                  <YAxis 
                    stroke="#64748B" 
                    fontSize={11} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip content={<CustomBarTooltip />} />
                  <Legend 
                    verticalAlign="top" 
                    height={36} 
                    formatter={(val) => <span className="text-xs font-medium text-slate-300">{val}</span>} 
                  />
                  <Bar dataKey="income" name="Inflow (Income)" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="expense" name="Outflow (Expenses)" fill="#F43F5E" radius={[4, 4, 0, 0]} maxBarSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Category Budget Limits & Progress Tracker */}
      {activeTab === 'budgets' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Info className="w-3.5 h-3.5 text-teal-400" />
              <span>Target spending ceilings configured for this billing period</span>
            </div>
            <button
              onClick={onOpenBudgetModal}
              className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
            >
              Adjust Limits &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {EXPENSE_CATEGORIES.slice(0, 9).map((cat) => {
              const spent = categoryTotals[cat.id] || 0;
              const limit = budgets[cat.id] || cat.defaultBudget;
              const percent = limit > 0 ? Math.round((spent / limit) * 100) : 0;
              const isOver = spent > limit;
              const isWarning = !isOver && percent >= 80;

              return (
                <div 
                  key={cat.id} 
                  className={`p-3.5 rounded-xl border transition-all ${
                    isOver 
                      ? 'bg-rose-500/5 border-rose-500/30' 
                      : isWarning 
                        ? 'bg-amber-500/5 border-amber-500/30' 
                        : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-2">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}20` }}
                      >
                        <CategoryIcon name={cat.icon} className="w-4 h-4" color={cat.color} />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{cat.label}</div>
                        <div className="text-[10px] text-slate-400">
                          Limit: {formatCurrency(limit, currency)}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`font-mono font-bold ${
                        isOver ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-slate-200'
                      }`}>
                        {formatCurrency(spent, currency)}
                      </div>
                      <div className={`text-[10px] font-semibold ${
                        isOver ? 'text-rose-400' : isWarning ? 'text-amber-400' : 'text-teal-400'
                      }`}>
                        {percent}% used
                      </div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        isOver 
                          ? 'bg-rose-500' 
                          : isWarning 
                            ? 'bg-amber-500' 
                            : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, percent)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
