import { Pencil, Trash2, RefreshCw } from 'lucide-react'
import { getCategoryColor, getCategoryBadge } from '../utils/constants'
import { fmtCurrency } from '../utils/helpers'

export default function ExpenseItem({ expense, categories, onEdit, onDelete }) {
  const badgeClass = getCategoryBadge(expense.category, categories)
  const color = getCategoryColor(expense.category, categories)

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 group transition-colors">
      <div className="w-2.5 h-2.5 rounded-full shrink-0 mt-0.5" style={{ backgroundColor: color }} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate max-w-[160px]">
            {expense.name}
          </span>
          {expense.isRecurring && (
            <RefreshCw size={11} className="text-slate-400 dark:text-slate-500 shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className={`inline-block text-[11px] px-2 py-0.5 rounded-full font-medium leading-4 ${badgeClass}`}>
            {expense.category}
          </span>
          {expense.notes && (
            <span className="text-[11px] text-slate-400 dark:text-slate-500 truncate max-w-[120px]">
              {expense.notes}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          {fmtCurrency(expense.amount)}
        </span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(expense)}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            aria-label={`Edit ${expense.name}`}
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={() => onDelete(expense)}
            className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            aria-label={`Delete ${expense.name}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  )
}
