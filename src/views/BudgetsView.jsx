import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Check, X } from 'lucide-react'
import { getCategoryColor } from '../utils/constants'
import { fmtCurrency, fmtMonth } from '../utils/helpers'

export default function BudgetsView({ expenses, selectedMonth, categories, budgets, onUpdateBudget }) {
  const [editingCat, setEditingCat] = useState(null)
  const [editVal, setEditVal] = useState('')

  const spending = useMemo(() => {
    const map = new Map()
    expenses.filter(e => e.month === selectedMonth).forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount)
    })
    return map
  }, [expenses, selectedMonth])

  const totalSpent = useMemo(() => [...spending.values()].reduce((s, v) => s + v, 0), [spending])
  const totalBudget = useMemo(() => Object.values(budgets).reduce((s, v) => s + (Number(v) || 0), 0), [budgets])

  const catsToShow = useMemo(() => {
    const withActivity = new Set([
      ...categories.filter(c => spending.get(c) > 0),
      ...categories.filter(c => Number(budgets[c]) > 0),
    ])
    const rest = categories.filter(c => !withActivity.has(c))
    return [...withActivity, ...rest]
  }, [categories, spending, budgets])

  const startEdit = (cat) => {
    setEditingCat(cat)
    setEditVal(budgets[cat] ? String(budgets[cat]) : '')
  }

  const saveEdit = () => {
    const val = parseFloat(editVal)
    if (!isNaN(val) && val >= 0) onUpdateBudget(editingCat, val)
    else if (editVal === '') onUpdateBudget(editingCat, 0)
    setEditingCat(null)
  }

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Budgets</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">{fmtMonth(selectedMonth)}</p>
      </div>

      {/* Total summary */}
      {totalBudget > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4 mb-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              Total budget
            </span>
            <span className={`text-sm font-bold tabular-nums ${
              totalSpent > totalBudget
                ? 'text-rose-600 dark:text-rose-400'
                : 'text-slate-900 dark:text-slate-100'
            }`}>
              {fmtCurrency(totalSpent)} / {fmtCurrency(totalBudget)}
            </span>
          </div>
          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalSpent / totalBudget) * 100, 100)}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className={`h-full rounded-full ${totalSpent > totalBudget ? 'bg-rose-500' : 'bg-emerald-500'}`}
            />
          </div>
          <p className="text-xs mt-1.5 text-slate-400 dark:text-slate-500">
            {totalSpent > totalBudget
              ? `${fmtCurrency(totalSpent - totalBudget)} over budget`
              : `${fmtCurrency(totalBudget - totalSpent)} remaining`}
          </p>
        </motion.div>
      )}

      <p className="text-xs text-slate-400 dark:text-slate-500 mb-3 px-1">
        Tap any row to set or edit a monthly budget
      </p>

      <div className="space-y-2">
        {catsToShow.map((cat, i) => {
          const spent = spending.get(cat) || 0
          const budget = Number(budgets[cat]) || 0
          const hasBudget = budget > 0
          const pct = hasBudget ? Math.min((spent / budget) * 100, 100) : 0
          const over = hasBudget && spent > budget
          const color = getCategoryColor(cat, categories)
          const isEditing = editingCat === cat

          return (
            <motion.div
              key={cat}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.015 }}
              className={`bg-white dark:bg-slate-900 rounded-2xl border overflow-hidden transition-colors ${
                over
                  ? 'border-rose-200 dark:border-rose-900/50'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color }} />
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex-1 truncate">{cat}</span>

                {isEditing ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-slate-400 dark:text-slate-500">$</span>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingCat(null) }}
                      autoFocus
                      placeholder="0"
                      className="w-20 text-sm font-semibold text-right bg-slate-50 dark:bg-slate-800 rounded-lg px-2 py-1 outline-none border border-slate-300 dark:border-slate-600 text-slate-900 dark:text-slate-100"
                    />
                    <button
                      onClick={saveEdit}
                      className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center"
                    >
                      <Check size={13} />
                    </button>
                    <button
                      onClick={() => setEditingCat(null)}
                      className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center"
                    >
                      <X size={13} />
                    </button>
                  </div>
                ) : (
                  <button onClick={() => startEdit(cat)} className="text-right min-w-[80px]">
                    {hasBudget ? (
                      <span className={`text-sm font-semibold tabular-nums ${over ? 'text-rose-600 dark:text-rose-400' : 'text-slate-700 dark:text-slate-300'}`}>
                        {fmtCurrency(spent)}
                        <span className="text-slate-400 dark:text-slate-500 font-normal"> / {fmtCurrency(budget)}</span>
                      </span>
                    ) : spent > 0 ? (
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {fmtCurrency(spent)}
                        <span className="text-xs font-normal text-slate-400 dark:text-slate-500 ml-1">set</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400 dark:text-slate-500">Set budget</span>
                    )}
                  </button>
                )}
              </div>

              {hasBudget && !isEditing && (
                <div className="px-4 pb-3">
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: over ? '#ef4444' : color }}
                    />
                  </div>
                  <p className={`text-xs mt-1 tabular-nums ${over ? 'text-rose-500 dark:text-rose-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {over
                      ? `${fmtCurrency(spent - budget)} over`
                      : `${fmtCurrency(budget - spent)} left · ${pct.toFixed(0)}%`}
                  </p>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
