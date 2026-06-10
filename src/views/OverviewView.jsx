import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Plus, ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus, WalletCards } from 'lucide-react'
import ExpenseItem from '../components/ExpenseItem'
import { getCategoryColor } from '../utils/constants'
import { fmtCurrency, fmtMonth, prevMonth, pctChange } from '../utils/helpers'

export default function OverviewView({
  expenses, selectedMonth, categories, budgets,
  onEdit, onDelete, onAddClick, goToPrevMonth, goToNextMonth,
}) {
  const prev = useMemo(() => prevMonth(selectedMonth), [selectedMonth])

  const currentExpenses = useMemo(
    () => expenses.filter(e => e.month === selectedMonth),
    [expenses, selectedMonth]
  )

  const currentTotal = useMemo(
    () => currentExpenses.reduce((s, e) => s + e.amount, 0),
    [currentExpenses]
  )

  const prevTotal = useMemo(
    () => expenses.filter(e => e.month === prev).reduce((s, e) => s + e.amount, 0),
    [expenses, prev]
  )

  const pct = useMemo(() => pctChange(currentTotal, prevTotal), [currentTotal, prevTotal])

  const totalBudget = useMemo(
    () => Object.values(budgets).reduce((s, v) => s + (Number(v) || 0), 0),
    [budgets]
  )

  const budgetPct = totalBudget > 0 ? Math.min((currentTotal / totalBudget) * 100, 100) : 0
  const overBudget = totalBudget > 0 && currentTotal > totalBudget

  const topCategories = useMemo(() => {
    const map = new Map()
    currentExpenses.forEach(e => map.set(e.category, (map.get(e.category) || 0) + e.amount))
    return [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
  }, [currentExpenses])

  const recent = useMemo(
    () => [...currentExpenses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5),
    [currentExpenses]
  )

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            <WalletCards size={15} className="text-slate-400 dark:text-slate-500" />
            <span className="text-xs font-medium text-slate-400 dark:text-slate-500">Jack's Tracker</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Overview</h1>
        </div>

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

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-950 dark:bg-slate-100 rounded-3xl p-5 mb-4"
      >
        <p className="text-xs font-medium text-slate-400 dark:text-slate-500 mb-1 uppercase tracking-wide">
          Total spent
        </p>
        <p className="text-4xl font-bold text-white dark:text-slate-950 mb-3 tabular-nums">
          {fmtCurrency(currentTotal)}
        </p>

        <div className="flex items-center gap-2 flex-wrap">
          {pct !== null ? (
            <>
              <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                pct > 5
                  ? 'bg-rose-500/25 text-rose-300 dark:bg-rose-100 dark:text-rose-700'
                  : pct < -5
                  ? 'bg-emerald-500/25 text-emerald-300 dark:bg-emerald-100 dark:text-emerald-700'
                  : 'bg-slate-700/50 text-slate-300 dark:bg-slate-200 dark:text-slate-600'
              }`}>
                {pct > 5 ? <TrendingUp size={11} /> : pct < -5 ? <TrendingDown size={11} /> : <Minus size={11} />}
                {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">vs {fmtMonth(prev)}</span>
            </>
          ) : (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {currentExpenses.length} expense{currentExpenses.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {totalBudget > 0 && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1.5">
              <span className={`font-medium ${overBudget ? 'text-rose-400 dark:text-rose-600' : 'text-slate-400 dark:text-slate-500'}`}>
                {overBudget
                  ? `${fmtCurrency(currentTotal - totalBudget)} over budget`
                  : `${fmtCurrency(currentTotal)} of ${fmtCurrency(totalBudget)} budget`}
              </span>
              <span className={overBudget ? 'text-rose-400 dark:text-rose-600 font-semibold' : 'text-slate-400 dark:text-slate-500'}>
                {((currentTotal / totalBudget) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-slate-800 dark:bg-slate-300 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${budgetPct}%` }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`h-full rounded-full ${overBudget ? 'bg-rose-500' : 'bg-emerald-400 dark:bg-emerald-600'}`}
              />
            </div>
          </div>
        )}
      </motion.div>

      {/* Top categories */}
      {topCategories.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 mb-4"
        >
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
            Top categories
          </h2>
          <div className="space-y-3">
            {topCategories.map(([cat, amt]) => {
              const color = getCategoryColor(cat, categories)
              const pctOfTotal = currentTotal > 0 ? (amt / currentTotal) * 100 : 0
              return (
                <div key={cat} className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">{cat}</span>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 ml-2 tabular-nums">
                        {fmtCurrency(amt)}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pctOfTotal}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
                        className="h-full rounded-full"
                        style={{ backgroundColor: color }}
                      />
                    </div>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 w-8 text-right tabular-nums">
                    {pctOfTotal.toFixed(0)}%
                  </span>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}

      {/* Recent expenses */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 mb-4 overflow-hidden"
      >
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
            Recent expenses
          </h2>
          {currentExpenses.length > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">{currentExpenses.length} total</span>
          )}
        </div>

        {recent.length > 0 ? (
          recent.map(e => (
            <ExpenseItem key={e.id} expense={e} categories={categories} onEdit={onEdit} onDelete={onDelete} />
          ))
        ) : (
          <div className="px-4 py-10 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No expenses for {fmtMonth(selectedMonth)}
            </p>
            <button
              onClick={onAddClick}
              className="mt-3 text-sm font-semibold text-slate-950 dark:text-white hover:underline"
            >
              Add your first expense →
            </button>
          </div>
        )}
      </motion.div>

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
