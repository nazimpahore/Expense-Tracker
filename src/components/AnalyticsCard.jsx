import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';
import { getCategoryMeta } from '../constants/categories';
import { formatCurrency } from '../utils/formatters';

export default function AnalyticsCard({ transactions, currency }) {
  const expenseTransactions = transactions.filter(t => t.type === 'expense');
  const totalExpense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount || 0), 0);

  // Group by category
  const categoryTotals = expenseTransactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Number(t.amount || 0);
    return acc;
  }, {});

  const chartData = Object.entries(categoryTotals)
    .map(([catId, amount]) => {
      const meta = getCategoryMeta(catId, 'expense');
      return {
        id: catId,
        name: meta.label,
        value: amount,
        color: meta.color,
        icon: meta.icon,
        percentage: totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(0) : 0
      };
    })
    .sort((a, b) => b.value - a.value);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2 sm:p-2.5 rounded-xl shadow-lg text-xs pointer-events-none z-30">
          <div className="font-semibold text-slate-800 dark:text-white flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
            {data.name}
          </div>
          <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
            {formatCurrency(data.value, currency)} ({data.percentage}%)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
      <div className="flex items-center justify-between mb-3.5 sm:mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
            Spending by Category
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Visual breakdown of expenses
          </p>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="py-8 sm:py-12 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-2.5 sm:mb-3">
            <PieIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <p className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            No Expense Records
          </p>
          <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 max-w-xs mt-1 px-4">
            Add an expense using the form to see your visual spending distribution here.
          </p>
        </div>
      ) : (
        <div>
          {/* Donut Chart */}
          <div className="h-44 sm:h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={46}
                  outerRadius={68}
                  paddingAngle={3}
                  stroke="none"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>

            {/* Total Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                Outflow
              </span>
              <span className="text-xs sm:text-base font-bold font-mono text-slate-900 dark:text-white truncate max-w-[90px] text-center">
                {formatCurrency(totalExpense, currency)}
              </span>
            </div>
          </div>

          {/* Top Category Legend */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            {chartData.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0">
                <span 
                  className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-300 truncate font-medium text-[11px] sm:text-xs flex-1">
                  {item.name}
                </span>
                <span className="text-slate-400 font-mono text-[10px] sm:text-[11px] flex-shrink-0">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
