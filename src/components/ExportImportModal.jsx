import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Download, 
  Upload, 
  FileSpreadsheet, 
  FileCode, 
  AlertCircle, 
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function ExportImportModal({
  isOpen,
  onClose,
  transactions,
  budgets,
  onImportData,
  onShowToast
}) {
  const fileInputRef = useRef(null);
  const [importMode, setImportMode] = useState('merge'); // 'merge' | 'replace'
  const [importError, setImportError] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // 1. Export as JSON
  const handleExportJSON = () => {
    const backupData = {
      version: '2.0',
      exportDate: new Date().toISOString(),
      budgets,
      transactions
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Apex-Ledger-Backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('JSON export downloaded successfully!', 'success');
  };

  // 2. Export as CSV
  const handleExportCSV = () => {
    if (!transactions.length) {
      onShowToast('No transactions to export', 'error');
      return;
    }

    const headers = ['ID', 'Title', 'Amount', 'Type', 'Category', 'Date', 'PaymentMethod', 'Recurring', 'Notes', 'Tags'];
    const rows = transactions.map(t => [
      t.id,
      `"${(t.title || '').replace(/"/g, '""')}"`,
      t.amount,
      t.type,
      t.category,
      t.date,
      t.paymentMethod || '',
      t.recurring ? 'Yes' : 'No',
      `"${(t.notes || '').replace(/"/g, '""')}"`,
      `"${(t.tags || []).join(';')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Apex-Ledger-Transactions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('CSV exported successfully for Excel/Sheets!', 'success');
  };

  // 3. Handle File Upload (JSON or CSV)
  const handleFileUpload = (e) => {
    setImportError('');
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          let importedTransactions = [];
          let importedBudgets = null;

          if (Array.isArray(parsed)) {
            importedTransactions = parsed;
          } else if (parsed && Array.isArray(parsed.transactions)) {
            importedTransactions = parsed.transactions;
            importedBudgets = parsed.budgets;
          } else {
            throw new Error('Unrecognized JSON structure');
          }

          onImportData(importedTransactions, importedBudgets, importMode);
          onShowToast(`Successfully imported ${importedTransactions.length} records!`, 'success');
          onClose();
        } catch (err) {
          setImportError('Invalid JSON format. Please upload a valid exported ledger file.');
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const lines = text.split('\n').filter(Boolean);
          if (lines.length < 2) throw new Error('Empty CSV file');

          const importedTransactions = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            if (cols.length >= 5) {
              importedTransactions.push({
                id: cols[0] || `tx-${Date.now()}-${i}`,
                title: cols[1] || 'Imported Entry',
                amount: parseFloat(cols[2]) || 0,
                type: cols[3] === 'income' ? 'income' : 'expense',
                category: cols[4] || 'other',
                date: cols[5] || new Date().toISOString().split('T')[0],
                paymentMethod: cols[6] || 'card',
                recurring: cols[7] === 'Yes',
                notes: cols[8] || '',
                tags: cols[9] ? cols[9].split(';').filter(Boolean) : []
              });
            }
          }

          onImportData(importedTransactions, null, importMode);
          onShowToast(`Imported ${importedTransactions.length} CSV transactions!`, 'success');
          onClose();
        } catch (err) {
          setImportError('Failed to parse CSV file. Ensure columns match the standard format.');
        }
      };
      reader.readAsText(file);
    } else {
      setImportError('Please upload a .json or .csv file');
    }
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
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-400" />
            Data Backup & Import
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Export financial reports for Excel or backup your full ledger state with JSON.
          </p>
        </div>

        {/* Export Options */}
        <div className="mb-6">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Export Data
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 group-hover:scale-105 transition-transform">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Export to CSV</div>
                <div className="text-[11px] text-slate-400">Excel / Google Sheets</div>
              </div>
            </button>

            <button
              onClick={handleExportJSON}
              className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-left transition-all group"
            >
              <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:scale-105 transition-transform">
                <FileCode className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-white">Export to JSON</div>
                <div className="text-[11px] text-slate-400">Full backup with budgets</div>
              </div>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="pt-5 border-t border-slate-800">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Import Data
          </label>

          {/* Import Mode Selector */}
          <div className="flex items-center gap-4 mb-3 text-xs">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="merge"
                checked={importMode === 'merge'}
                onChange={() => setImportMode('merge')}
                className="text-teal-600 focus:ring-teal-500 bg-slate-900"
              />
              <span>Merge with existing</span>
            </label>
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                value="replace"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                className="text-teal-600 focus:ring-teal-500 bg-slate-900"
              />
              <span>Replace entire ledger</span>
            </label>
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-700 hover:border-teal-500/60 rounded-xl p-6 text-center cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all"
          >
            <Upload className="w-8 h-8 text-teal-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-200">
              Click to select a .JSON or .CSV file
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports standard CSV spreadsheets and Apex JSON backups
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {importError && (
            <div className="flex items-center gap-2 p-3 mt-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{importError}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
