import React, { useState, useRef, useEffect } from 'react';
import { 
  Sun, 
  Moon, 
  MoreVertical, 
  FileSpreadsheet, 
  FileCode, 
  RotateCcw,
  Upload
} from 'lucide-react';
import Logo from './Logo';
import { CURRENCIES } from '../constants/currencies';

export default function Header({
  currency,
  onCurrencyChange,
  isDarkMode,
  onToggleTheme,
  onExportCSV,
  onExportJSON,
  onImportData,
  onResetData
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    if (file.name.endsWith('.json')) {
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          const list = Array.isArray(parsed) ? parsed : (parsed.transactions || []);
          onImportData(list);
          setMenuOpen(false);
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
      reader.readAsText(file);
    } else if (file.name.endsWith('.csv')) {
      reader.onload = (event) => {
        try {
          const text = event.target.result;
          const lines = text.split('\n').filter(Boolean);
          const list = [];
          for (let i = 1; i < lines.length; i++) {
            const cols = lines[i].split(',').map(s => s.trim().replace(/^"|"$/g, ''));
            if (cols.length >= 4) {
              list.push({
                id: cols[0] || `tx-${Date.now()}-${i}`,
                title: cols[1] || 'Imported Entry',
                amount: parseFloat(cols[2]) || 0,
                type: cols[3] === 'income' ? 'income' : 'expense',
                category: cols[4] || 'other',
                date: cols[5] || new Date().toISOString().split('T')[0]
              });
            }
          }
          onImportData(list);
          setMenuOpen(false);
        } catch (err) {
          alert('Could not parse CSV file.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <header className="flex items-center justify-between py-3 sm:py-4 mb-4 sm:mb-8 border-b border-slate-200 dark:border-slate-800/80 gap-2">
      {/* Brand Logo (Responsive font and icon size) */}
      <Logo />

      {/* Right Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Currency Selector */}
        <select
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value)}
          className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700/80 rounded-xl px-2 py-1.5 sm:px-2.5 sm:py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500/40 transition-colors cursor-pointer h-9 sm:h-auto"
          title="Change currency"
        >
          {CURRENCIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.code} ({c.symbol})
            </option>
          ))}
        </select>

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 active:scale-95 transition-all"
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          aria-label="Toggle color theme"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
        </button>

        {/* More Actions Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700/80 active:scale-95 transition-all"
            title="Options & Data Backup"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 sm:w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-2xl shadow-2xl py-1.5 z-40 animate-fade-in text-xs">
              <button
                onClick={() => {
                  onExportCSV();
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>Export as CSV</span>
              </button>

              <button
                onClick={() => {
                  onExportJSON();
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <FileCode className="w-4 h-4 text-teal-500 flex-shrink-0" />
                <span>Export as JSON</span>
              </button>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Upload className="w-4 h-4 text-slate-500 flex-shrink-0" />
                <span>Import Backup</span>
              </button>

              <div className="my-1 border-t border-slate-200 dark:border-slate-800" />

              <button
                onClick={() => {
                  onResetData();
                  setMenuOpen(false);
                }}
                className="w-full px-3.5 py-2.5 text-left flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
              >
                <RotateCcw className="w-4 h-4 flex-shrink-0" />
                <span>Reset All Data</span>
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json,.csv"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
