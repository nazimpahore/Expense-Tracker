import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CURRENCIES } from '../constants/currencies';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount, currencyCode = 'USD') {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  
  try {
    return new Intl.NumberFormat(currency.locale || 'en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  } catch (e) {
    return `${currency.symbol}${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

export function formatShortMonth(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' }).format(date);
}
