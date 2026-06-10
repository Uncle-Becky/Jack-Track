import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import ExpenseItem from '../components/ExpenseItem'
import { fmtCurrency, fmtMonth } from '../utils/helpers'

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'highest', label: 'Highest $' },
  { value: 'lowest', label: 'Lowest $' },
  { value: 'category', label: 'Category' },
]

export default function ExpensesView({
  expenses, selectedMonth, categories,
  onEdit, onDelete, onAddClick,
  goToPrevMonth, goToNextMonth,
}) {
  const [search, setSearch] = useState('')
  const [filterCat, setFilterCat] = useState('all')
  const [sort, setSort] = useState('newest')
  const [showFilters, setShowFilters] = useState(false)

  const monthExpenses = useMemo(
    () => expenses.filter(e => e.month === selectedMonth),
    [expenses, selectedMonth]
  )

  const availableCats = useMemo(
    () => [...new Set(monthExpenses.map(e => e.category))].sort(),
    [monthExpenses]
  )

  const filtered = useMemo(() => {
    let list = monthExpenses
    if (filterCat !== 'all') list = list.filter(e => e.category === filterCat)
    if (search.trim()) {
      const term = search.trim().toLowerCase()
      list = list.filter(e =>
        [e.name, e.category, e.notes || ''].join(' ').toLowerCase().includes(term)
      )
    }
    return [...list].sort((a, b) => {
      if (sort === 'newest') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sort === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt)
      if (sort === 'highest') return b.amount - a.amount
      if (sort === 'lowest') return a.amount - b.amount
      if (sort === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name)
      return 0
    })
  }, [monthExpenses, filterCat, search, sort])

  const total = useMemo(() => filtered.reduce((s, e) => s + e.amount, 0), [filtered])
  const activeFilters = (filterCat !== 'all' ? 1 : 0) + (sort !== 'newest' ? 1 : 0)

  const clearFilters = () => { setFilterCat('all'); setSort('newest') }

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Expenses</h1>
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1">
          <button
            onClick={goToPrevMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 px-1 min-w-[106px] text-center tabular-nums">
            {fmtMonth(selectedMonth)}
          </span>
          <button
            onClick={goToNextMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Search + filter toggle */}
      <div className="flex gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-3.5 py-2.5">
          <Search size={14} className="text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search expenses..."
            className="flex-1 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-slate-400 dark:text-slate-500 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className={`relative w-11 h-11 rounded-2xl border flex items-center justify-center transition-colors ${
            showFilters || activeFilters > 0
              ? 'bg-slate-950 dark:bg-white border-slate-950 dark:border-white text-white dark:text-slate-950'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
          }`}
          aria-label="Filters"
        >
          <SlidersHorizontal size={16} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {activeFilters}
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3.5 mb-3 space-y-3 overflow-hidden"
          >
            <div>
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['all', ...availableCats].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCat(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      filterCat === cat
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {cat === 'all' ? 'All' : cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-2">
                Sort by
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SORT_OPTIONS.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setSort(opt.value)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${
                      sort === opt.value
                        ? 'bg-slate-950 dark:bg-white text-white dark:text-slate-950'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            {activeFilters > 0 && (
              <button onClick={clearFilters} className="text-xs text-slate-400 dark:text-slate-500 hover:text-slate-600 underline">
                Clear filters
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expense list */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden mb-4">
        {filtered.length > 0 ? (
          <>
            <AnimatePresence initial={false}>
              {filtered.map(e => (
                <motion.div
                  key={e.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ExpenseItem expense={e} categories={categories} onEdit={onEdit} onDelete={onDelete} />
                  <div className="h-px bg-slate-50 dark:bg-slate-800 mx-4 last:hidden" />
                </motion.div>
              ))}
            </AnimatePresence>
            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {filtered.length} expense{filtered.length !== 1 ? 's' : ''}
                {(filterCat !== 'all' || search) && ' (filtered)'}
              </span>
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                {fmtCurrency(total)}
              </span>
            </div>
          </>
        ) : (
          <div className="py-14 text-center">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              {search || filterCat !== 'all' ? 'No matching expenses' : `No expenses for ${fmtMonth(selectedMonth)}`}
            </p>
            {!search && filterCat === 'all' && (
              <button
                onClick={onAddClick}
                className="mt-2 text-sm font-semibold text-slate-950 dark:text-white hover:underline"
              >
                Add one →
              </button>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <motion.button
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.92 }}
        onClick={onAddClick}
        className="fixed bottom-[76px] right-4 w-14 h-14 bg-slate-950 dark:bg-white rounded-full shadow-2xl flex items-center justify-center text-white dark:text-slate-950 z-20"
        aria-label="Add expense"
      >
        <Plus size={24} />
      </motion.button>
    </div>
  )
}
