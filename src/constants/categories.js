export const EXPENSE_CATEGORIES = [
  { id: 'housing', label: 'Housing & Rent', icon: 'Home', color: '#6366F1', defaultBudget: 1200 },
  { id: 'food', label: 'Food & Dining', icon: 'Utensils', color: '#F59E0B', defaultBudget: 450 },
  { id: 'groceries', label: 'Groceries', icon: 'ShoppingCart', color: '#10B981', defaultBudget: 350 },
  { id: 'transport', label: 'Transportation', icon: 'Car', color: '#0EA5E9', defaultBudget: 200 },
  { id: 'utilities', label: 'Utilities & Bills', icon: 'Zap', color: '#EAB308', defaultBudget: 180 },
  { id: 'entertainment', label: 'Entertainment & Leisure', icon: 'Film', color: '#8B5CF6', defaultBudget: 150 },
  { id: 'shopping', label: 'Shopping & Gear', icon: 'ShoppingBag', color: '#EC4899', defaultBudget: 250 },
  { id: 'health', label: 'Healthcare & Fitness', icon: 'HeartPulse', color: '#14B8A6', defaultBudget: 120 },
  { id: 'education', label: 'Education & Courses', icon: 'GraduationCap', color: '#3B82F6', defaultBudget: 100 },
  { id: 'travel', label: 'Travel & Vacations', icon: 'Plane', color: '#F97316', defaultBudget: 300 },
  { id: 'subscriptions', label: 'Subscriptions & SaaS', icon: 'Repeat', color: '#A855F7', defaultBudget: 80 },
  { id: 'other', label: 'Miscellaneous', icon: 'HelpCircle', color: '#64748B', defaultBudget: 100 }
];

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary & Payroll', icon: 'Briefcase', color: '#10B981' },
  { id: 'freelance', label: 'Freelance & Contracting', icon: 'Laptop', color: '#0D9488' },
  { id: 'investment', label: 'Investment & Dividends', icon: 'TrendingUp', color: '#0284C7' },
  { id: 'business', label: 'Business & Ventures', icon: 'Building', color: '#8B5CF6' },
  { id: 'rental', label: 'Rental Income', icon: 'Key', color: '#D97706' },
  { id: 'gift', label: 'Gifts & Bonus', icon: 'Gift', color: '#EC4899' },
  { id: 'other_income', label: 'Other Income', icon: 'PlusCircle', color: '#64748B' }
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const getCategoryMeta = (categoryId, type = 'expense') => {
  const match = ALL_CATEGORIES.find(c => c.id === categoryId);
  if (match) return match;
  return {
    id: categoryId || 'other',
    label: categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : 'General',
    icon: type === 'income' ? 'TrendingUp' : 'Tag',
    color: '#64748B'
  };
};
