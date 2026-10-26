import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowUpRight, 
  ArrowDownRight, 
  Tag, 
  Calendar, 
  CreditCard, 
  FileText, 
  Repeat,
  Check
} from 'lucide-react';
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../constants/categories';
import { PAYMENT_METHODS } from '../constants/currencies';
import CategoryIcon from './CategoryIcon';

export default function TransactionFormModal({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  currency
}) {
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [recurring, setRecurring] = useState(false);
  const [tagsInput, setTagsInput] = useState('');
  const [notes, setNotes] = useState('');

  // When initialData changes (e.g. editing mode)
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setTitle(initialData.title || '');
      setAmount(initialData.amount?.toString() || '');
      setCategory(initialData.category || '');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(initialData.paymentMethod || 'card');
      setRecurring(!!initialData.recurring);
      setTagsInput(initialData.tags ? initialData.tags.join(', ') : '');
      setNotes(initialData.notes || '');
    } else {
      // Default reset
      setType('expense');
      setTitle('');
      setAmount('');
      setCategory(EXPENSE_CATEGORIES[0].id);
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('card');
      setRecurring(false);
      setTagsInput('');
      setNotes('');
    }
  }, [initialData, isOpen]);

  // If type changes, ensure valid default category
  useEffect(() => {
    if (!initialData) {
      if (type === 'income') {
        setCategory(INCOME_CATEGORIES[0].id);
      } else {
        setCategory(EXPENSE_CATEGORIES[0].id);
      }
    }
  }, [type, initialData]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const currentCategories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount || Number(amount) <= 0 || !category) {
      return;
    }

    const parsedTags = tagsInput
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const transaction = {
      id: initialData ? initialData.id : `tx-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      category,
      date,
      paymentMethod,
      recurring,
      tags: parsedTags,
      notes: notes.trim()
    };

    onSave(transaction);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight">
            {initialData ? 'Edit Transaction' : 'Record Transaction'}
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {initialData ? 'Update record details and parameters' : 'Log an income inflow or expense outflow'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Transaction Type Segmented Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 shadow-md'
                  : 'text-slate-400 hover:text-rose-400'
              }`}
            >
              <ArrowDownRight className="w-4 h-4" />
              <span>Outflow (Expense)</span>
            </button>

            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
                  : 'text-slate-400 hover:text-emerald-400'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Inflow (Income)</span>
            </button>
          </div>

          {/* Title & Amount Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5">
            <div className="sm:col-span-7">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Description / Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={type === 'income' ? 'e.g. Monthly Salary, Freelance project' : 'e.g. Whole Foods, Apartment Rent'}
                className="w-full bg-slate-900/80 text-white placeholder-slate-500 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60"
              />
            </div>

            <div className="sm:col-span-5">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900/80 text-white placeholder-slate-500 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60"
              />
            </div>
          </div>

          {/* Category Grid Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Category
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
              {currentCategories.map((cat) => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all text-xs ${
                      isSelected
                        ? 'bg-slate-800 text-white border-teal-500 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div 
                      className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${cat.color}20` }}
                    >
                      <CategoryIcon name={cat.icon} className="w-3.5 h-3.5" color={cat.color} />
                    </div>
                    <span className="truncate font-medium">{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Date
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-slate-900/80 text-white border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                Payment Instrument
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full bg-slate-900/80 text-white border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60 cursor-pointer"
              >
                {PAYMENT_METHODS.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tags & Recurring Option */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-center">
            <div className="sm:col-span-8">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g. tax, personal, client-work"
                className="w-full bg-slate-900/80 text-white placeholder-slate-500 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60"
              />
            </div>

            <div className="sm:col-span-4 flex items-center sm:pt-6">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={recurring}
                  onChange={(e) => setRecurring(e.target.checked)}
                  className="rounded border-slate-700 text-teal-600 focus:ring-teal-500 bg-slate-900 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Repeat className="w-3 h-3 text-indigo-400" />
                  Recurring Bill
                </span>
              </label>
            </div>
          </div>

          {/* Notes textarea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              Notes & Metadata (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional memo, invoice number, or details..."
              className="w-full bg-slate-900/80 text-white placeholder-slate-500 border border-slate-700/80 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500/60"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 shadow-lg shadow-teal-900/40 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialData ? 'Update Record' : 'Save Transaction'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
