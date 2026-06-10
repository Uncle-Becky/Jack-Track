export const EXPENSES_KEY = 'jack-expense-tracker-v2'
export const BUDGETS_KEY = 'jack-budgets-v1'
export const SETTINGS_KEY = 'jack-settings-v1'
export const OLD_EXPENSES_KEY = 'jack-monthly-expense-tracker-v1'

export const DEFAULT_CATEGORIES = [
  'Groceries',
  'Rent / Mortgage',
  'Utilities',
  'Phone',
  'Internet',
  'Insurance',
  'Gas / Transportation',
  'Subscriptions',
  'Medical',
  'Eating Out',
  'Debt Payments',
  'Other',
]

export const PALETTE = [
  '#10b981',
  '#6366f1',
  '#f59e0b',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#f97316',
  '#14b8a6',
  '#ef4444',
  '#a855f7',
  '#64748b',
  '#84cc16',
]

const BADGE_VARIANTS = [
  'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-400',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
  'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-400',
  'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400',
  'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  'bg-lime-100 text-lime-700 dark:bg-lime-900/40 dark:text-lime-400',
]

export function getCategoryColor(category, categories) {
  const idx = categories.indexOf(category)
  return PALETTE[(idx >= 0 ? idx : categories.length - 1) % PALETTE.length]
}

export function getCategoryBadge(category, categories) {
  const idx = categories.indexOf(category)
  return BADGE_VARIANTS[(idx >= 0 ? idx : categories.length - 1) % BADGE_VARIANTS.length]
}

export const SEED_EXPENSES = [
  { id: 's1', name: 'Groceries', category: 'Groceries', amount: 134.22, month: '2026-06', notes: '', createdAt: '2026-06-02T10:00:00Z', isRecurring: false },
  { id: 's2', name: 'Rent', category: 'Rent / Mortgage', amount: 1450, month: '2026-06', notes: '', createdAt: '2026-06-01T09:00:00Z', isRecurring: true },
  { id: 's3', name: 'Internet', category: 'Internet', amount: 79.99, month: '2026-06', notes: '', createdAt: '2026-06-01T10:00:00Z', isRecurring: true },
  { id: 's4', name: 'Phone bill', category: 'Phone', amount: 65, month: '2026-06', notes: '', createdAt: '2026-06-05T10:00:00Z', isRecurring: true },
  { id: 's5', name: 'Netflix', category: 'Subscriptions', amount: 15.99, month: '2026-06', notes: '', createdAt: '2026-06-01T10:00:00Z', isRecurring: true },
  { id: 's6', name: 'Spotify', category: 'Subscriptions', amount: 9.99, month: '2026-06', notes: '', createdAt: '2026-06-01T10:00:00Z', isRecurring: true },
  { id: 's7', name: 'Dinner out', category: 'Eating Out', amount: 54.80, month: '2026-06', notes: 'Anniversary dinner', createdAt: '2026-06-07T19:00:00Z', isRecurring: false },
  { id: 's8', name: 'Groceries', category: 'Groceries', amount: 127.43, month: '2026-05', notes: '', createdAt: '2026-05-03T10:00:00Z', isRecurring: false },
  { id: 's9', name: 'Grocery run', category: 'Groceries', amount: 63.12, month: '2026-05', notes: '', createdAt: '2026-05-17T10:00:00Z', isRecurring: false },
  { id: 's10', name: 'Rent', category: 'Rent / Mortgage', amount: 1450, month: '2026-05', notes: '', createdAt: '2026-05-01T09:00:00Z', isRecurring: true },
  { id: 's11', name: 'Internet', category: 'Internet', amount: 79.99, month: '2026-05', notes: '', createdAt: '2026-05-01T10:00:00Z', isRecurring: true },
  { id: 's12', name: 'Electric bill', category: 'Utilities', amount: 94.20, month: '2026-05', notes: '', createdAt: '2026-05-07T10:00:00Z', isRecurring: false },
  { id: 's13', name: 'Phone bill', category: 'Phone', amount: 65, month: '2026-05', notes: '', createdAt: '2026-05-05T10:00:00Z', isRecurring: true },
  { id: 's14', name: 'Netflix', category: 'Subscriptions', amount: 15.99, month: '2026-05', notes: '', createdAt: '2026-05-01T10:00:00Z', isRecurring: true },
  { id: 's15', name: 'Spotify', category: 'Subscriptions', amount: 9.99, month: '2026-05', notes: '', createdAt: '2026-05-01T10:00:00Z', isRecurring: true },
  { id: 's16', name: 'Gym membership', category: 'Subscriptions', amount: 29.99, month: '2026-05', notes: '', createdAt: '2026-05-01T10:00:00Z', isRecurring: true },
  { id: 's17', name: 'Gas', category: 'Gas / Transportation', amount: 52.30, month: '2026-05', notes: '', createdAt: '2026-05-12T15:00:00Z', isRecurring: false },
  { id: 's18', name: 'Birthday dinner', category: 'Eating Out', amount: 68.50, month: '2026-05', notes: '', createdAt: '2026-05-10T19:00:00Z', isRecurring: false },
  { id: 's19', name: 'Groceries', category: 'Groceries', amount: 98.75, month: '2026-04', notes: '', createdAt: '2026-04-05T10:00:00Z', isRecurring: false },
  { id: 's20', name: 'Rent', category: 'Rent / Mortgage', amount: 1450, month: '2026-04', notes: '', createdAt: '2026-04-01T09:00:00Z', isRecurring: true },
  { id: 's21', name: 'Internet', category: 'Internet', amount: 79.99, month: '2026-04', notes: '', createdAt: '2026-04-01T10:00:00Z', isRecurring: true },
  { id: 's22', name: 'Lunch out', category: 'Eating Out', amount: 23.45, month: '2026-04', notes: '', createdAt: '2026-04-15T12:00:00Z', isRecurring: false },
  { id: 's23', name: 'Doctor copay', category: 'Medical', amount: 45, month: '2026-04', notes: 'Copay', createdAt: '2026-04-20T10:00:00Z', isRecurring: false },
  { id: 's24', name: 'Phone bill', category: 'Phone', amount: 65, month: '2026-04', notes: '', createdAt: '2026-04-05T10:00:00Z', isRecurring: true },
  { id: 's25', name: 'Gas', category: 'Gas / Transportation', amount: 48.90, month: '2026-04', notes: '', createdAt: '2026-04-10T15:00:00Z', isRecurring: false },
  { id: 's26', name: 'Groceries', category: 'Groceries', amount: 145.20, month: '2026-03', notes: '', createdAt: '2026-03-04T10:00:00Z', isRecurring: false },
  { id: 's27', name: 'Rent', category: 'Rent / Mortgage', amount: 1450, month: '2026-03', notes: '', createdAt: '2026-03-01T09:00:00Z', isRecurring: true },
  { id: 's28', name: 'Internet', category: 'Internet', amount: 79.99, month: '2026-03', notes: '', createdAt: '2026-03-01T10:00:00Z', isRecurring: true },
  { id: 's29', name: 'Gas', category: 'Gas / Transportation', amount: 61.50, month: '2026-03', notes: '', createdAt: '2026-03-08T15:00:00Z', isRecurring: false },
  { id: 's30', name: 'Phone bill', category: 'Phone', amount: 65, month: '2026-03', notes: '', createdAt: '2026-03-05T10:00:00Z', isRecurring: true },
  { id: 's31', name: 'Netflix', category: 'Subscriptions', amount: 15.99, month: '2026-03', notes: '', createdAt: '2026-03-01T10:00:00Z', isRecurring: true },
  { id: 's32', name: 'Groceries', category: 'Groceries', amount: 112.60, month: '2026-02', notes: '', createdAt: '2026-02-03T10:00:00Z', isRecurring: false },
  { id: 's33', name: 'Rent', category: 'Rent / Mortgage', amount: 1450, month: '2026-02', notes: '', createdAt: '2026-02-01T09:00:00Z', isRecurring: true },
  { id: 's34', name: 'Internet', category: 'Internet', amount: 79.99, month: '2026-02', notes: '', createdAt: '2026-02-01T10:00:00Z', isRecurring: true },
  { id: 's35', name: "Valentine's dinner", category: 'Eating Out', amount: 95.00, month: '2026-02', notes: "Valentine's Day", createdAt: '2026-02-14T19:00:00Z', isRecurring: false },
  { id: 's36', name: 'Phone bill', category: 'Phone', amount: 65, month: '2026-02', notes: '', createdAt: '2026-02-05T10:00:00Z', isRecurring: true },
  { id: 's37', name: 'Groceries', category: 'Groceries', amount: 156.80, month: '2026-01', notes: 'Stocked up', createdAt: '2026-01-03T10:00:00Z', isRecurring: false },
  { id: 's38', name: 'Rent', category: 'Rent / Mortgage', amount: 1450, month: '2026-01', notes: '', createdAt: '2026-01-01T09:00:00Z', isRecurring: true },
  { id: 's39', name: 'Internet', category: 'Internet', amount: 79.99, month: '2026-01', notes: '', createdAt: '2026-01-01T10:00:00Z', isRecurring: true },
  { id: 's40', name: 'Gym membership', category: 'Subscriptions', amount: 29.99, month: '2026-01', notes: "New Year's resolution", createdAt: '2026-01-02T10:00:00Z', isRecurring: true },
  { id: 's41', name: 'Phone bill', category: 'Phone', amount: 65, month: '2026-01', notes: '', createdAt: '2026-01-05T10:00:00Z', isRecurring: true },
  { id: 's42', name: 'Insurance', category: 'Insurance', amount: 180.00, month: '2026-01', notes: "Renter's + auto", createdAt: '2026-01-10T10:00:00Z', isRecurring: true },
]
