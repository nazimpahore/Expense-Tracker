export const SAMPLE_TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Senior Engineering Salary',
    amount: 5450.00,
    type: 'income',
    category: 'salary',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'bank',
    notes: 'Monthly direct payroll deposit',
    recurring: true,
    tags: ['work', 'main-income']
  },
  {
    id: 'tx-2',
    title: 'Luxury Apartment Rent',
    amount: 1450.00,
    type: 'expense',
    category: 'housing',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'bank',
    notes: 'Downtown loft rent payment',
    recurring: true,
    tags: ['living', 'fixed']
  },
  {
    id: 'tx-3',
    title: 'UI/UX Client Retainer',
    amount: 1850.00,
    type: 'income',
    category: 'freelance',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'card',
    notes: 'Fintech mobile app redesign milestone',
    recurring: false,
    tags: ['freelance', 'design']
  },
  {
    id: 'tx-4',
    title: 'Whole Foods Market',
    amount: 142.30,
    type: 'expense',
    category: 'groceries',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'card',
    notes: 'Organic produce and pantry staples',
    recurring: false,
    tags: ['groceries', 'health']
  },
  {
    id: 'tx-5',
    title: 'Index Fund Dividend',
    amount: 320.00,
    type: 'income',
    category: 'investment',
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'bank',
    notes: 'Quarterly S&P 500 dividend payout',
    recurring: true,
    tags: ['dividends', 'passive']
  },
  {
    id: 'tx-6',
    title: 'Fiber Internet & Power Grid',
    amount: 115.50,
    type: 'expense',
    category: 'utilities',
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'card',
    notes: 'Gigabit fiber & city electric',
    recurring: true,
    tags: ['bills']
  },
  {
    id: 'tx-7',
    title: 'Bistro Dining & Coffee',
    amount: 86.40,
    type: 'expense',
    category: 'food',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'card',
    notes: 'Dinner with colleagues',
    recurring: false,
    tags: ['dining', 'social']
  },
  {
    id: 'tx-8',
    title: 'Cloud Infrastructure & GitHub Pro',
    amount: 64.00,
    type: 'expense',
    category: 'subscriptions',
    date: new Date(Date.now() - 11 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'card',
    notes: 'AWS & developer tool subscriptions',
    recurring: true,
    tags: ['dev', 'tools']
  },
  {
    id: 'tx-9',
    title: 'Metro Pass & Fuel',
    amount: 75.00,
    type: 'expense',
    category: 'transport',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'card',
    notes: 'Monthly transit recharge',
    recurring: true,
    tags: ['commute']
  },
  {
    id: 'tx-10',
    title: 'Boutique Gym Membership',
    amount: 95.00,
    type: 'expense',
    category: 'health',
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    paymentMethod: 'card',
    notes: 'Bouldering gym & sauna',
    recurring: true,
    tags: ['fitness']
  }
];

export const DEFAULT_BUDGETS = {
  housing: 1500,
  food: 400,
  groceries: 350,
  transport: 180,
  utilities: 150,
  entertainment: 120,
  shopping: 200,
  health: 120,
  education: 100,
  travel: 250,
  subscriptions: 80,
  other: 100
};
