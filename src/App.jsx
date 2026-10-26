import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SummaryCards from './components/SummaryCards';
import TransactionForm from './components/TransactionForm';
import AnalyticsCard from './components/AnalyticsCard';
import TransactionHistory from './components/TransactionHistory';
import Toast from './components/Toast';
import { CURRENCIES } from './constants/currencies';

export default function App() {
  // 1. Transactions state (starts completely clean, persisted in localStorage)
  const [transactions, setTransactions] = useState(() => {
    try {
      const saved = localStorage.getItem('apex_transactions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Filter out legacy sample IDs if present
          return parsed.filter(t => !['tx-1','tx-2','tx-3','tx-4','tx-5','tx-6','tx-7','tx-8','tx-9','tx-10'].includes(t.id));
        }
      }
    } catch (e) {
      console.error('Error loading transactions', e);
    }
    return [];
  });

  // 2. Currency State
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('apex_currency') || 'USD';
  });

  // 3. Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('apex_theme');
    if (saved) return saved === 'dark';
    return true; // Default to dark mode
  });

  // 4. Toast notification
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    localStorage.setItem('apex_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('apex_currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('apex_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Handlers
  const handleAddTransaction = (newTx) => {
    setTransactions(prev => [newTx, ...prev]);
    showToast(`${newTx.type === 'income' ? 'Income' : 'Expense'} added successfully`, 'success');
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    showToast('Transaction removed', 'info');
  };

  const handleResetData = () => {
    if (window.confirm('Are you sure you want to clear all your transactions?')) {
      setTransactions([]);
      localStorage.removeItem('apex_transactions');
      showToast('All transaction records cleared', 'info');
    }
  };

  const handleExportCSV = () => {
    if (!transactions.length) {
      showToast('No transactions to export', 'error');
      return;
    }
    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date'];
    const rows = transactions.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.date
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `Expense-Transactions-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast('CSV export downloaded', 'success');
  };

  const handleExportJSON = () => {
    if (!transactions.length) {
      showToast('No transactions to export', 'error');
      return;
    }
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Expense-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('JSON backup downloaded', 'success');
  };

  const handleImportData = (importedList) => {
    if (Array.isArray(importedList) && importedList.length > 0) {
      setTransactions(importedList);
      showToast(`Imported ${importedList.length} transactions`, 'success');
    } else {
      showToast('No valid transactions found in file', 'error');
    }
  };

  const currentCurrencyObj = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-slate-950 text-slate-100' 
        : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-5xl mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
        {/* Simple & Clean Header */}
        <Header
          currency={currency}
          onCurrencyChange={setCurrency}
          isDarkMode={isDarkMode}
          onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onImportData={handleImportData}
          onResetData={handleResetData}
        />

        {/* 3 Executive Summary Cards */}
        <SummaryCards
          transactions={transactions}
          currency={currency}
        />

        {/* Core Workspace: 2 Clean Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 mt-4 sm:mt-6 items-start">
          {/* Left Column: Direct Add Transaction Form */}
          <div className="lg:col-span-7">
            <TransactionForm
              onAddTransaction={handleAddTransaction}
              currencySymbol={currentCurrencyObj.symbol}
            />
          </div>

          {/* Right Column: Visual Category Breakdown Chart */}
          <div className="lg:col-span-5">
            <AnalyticsCard
              transactions={transactions}
              currency={currency}
            />
          </div>
        </div>

        {/* Recent Transactions History */}
        <TransactionHistory
          transactions={transactions}
          currency={currency}
          onDeleteTransaction={handleDeleteTransaction}
        />

        {/* Quiet, Clean Footer */}
        <footer className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
          <p>
            Expense Tracker &bull; All data is stored privately in your browser
          </p>
        </footer>
      </div>

      {/* Floating Status Toast */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
