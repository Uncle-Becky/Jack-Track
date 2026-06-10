import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, RefreshCw } from 'lucide-react'

const EMPTY_FORM = { name: '', category: '', amount: '', month: '', notes: '', isRecurring: false }

export default function ExpenseForm({ isOpen, onClose, onSave, editingExpense, categories, selectedMonth }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (!isOpen) return
    if (editingExpense) {
      setForm({ ...editingExpense, amount: String(editingExpense.amount) })
    } else {
      setForm({ ...EMPTY_FORM, category: categories[0] || '', month: selectedMonth })
    }
    setErrors({})
  }, [isOpen, editingExpense, selectedMonth, categories])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    const amt = Number(form.amount)
    if (!form.amount || isNaN(amt) || amt <= 0) e.amount = 'Enter a valid amount'
    if (!form.category) e.category = 'Select a category'
    if (!form.month) e.month = 'Select a month'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave({ ...form, amount: Number(form.amount) })
  }

  const set = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const inputClass = (field) =>
    `w-full rounded-xl border px-3.5 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-colors focus:border-slate-950 dark:focus:border-slate-400 ${
      errors[field]
        ? 'border-rose-400 dark:border-rose-500'
        : 'border-slate-200 dark:border-slate-700'
    }`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 360 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl shadow-2xl max-h-[92vh] overflow-y-auto"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-slate-700" />
            </div>

            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {editingExpense ? 'Edit Expense' : 'Add Expense'}
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-8">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Expense name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={set('name')}
                  placeholder="e.g. Weekly groceries"
                  autoComplete="off"
                  className={inputClass('name')}
                />
                {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm font-medium pointer-events-none">
                    $
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.amount}
                    onChange={set('amount')}
                    placeholder="0.00"
                    className={`${inputClass('amount')} pl-8`}
                  />
                </div>
                {errors.amount && <p className="text-xs text-rose-500 mt-1">{errors.amount}</p>}
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={set('category')}
                  className={inputClass('category')}
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                {errors.category && <p className="text-xs text-rose-500 mt-1">{errors.category}</p>}
              </div>

              {/* Month */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Month
                </label>
                <input
                  type="month"
                  value={form.month}
                  onChange={set('month')}
                  className={inputClass('month')}
                />
                {errors.month && <p className="text-xs text-rose-500 mt-1">{errors.month}</p>}
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                  Notes <span className="text-slate-400 font-normal">(optional)</span>
                </label>
                <textarea
                  value={form.notes}
                  onChange={set('notes')}
                  placeholder="Any additional details..."
                  rows={2}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 px-3.5 py-3 text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-slate-950 dark:focus:border-slate-400 resize-none transition-colors"
                />
              </div>

              {/* Recurring toggle */}
              <button
                type="button"
                onClick={() => setForm(f => ({ ...f, isRecurring: !f.isRecurring }))}
                className={`flex items-center gap-2.5 w-full rounded-xl border px-3.5 py-3 text-sm font-medium transition-colors ${
                  form.isRecurring
                    ? 'border-slate-950 dark:border-slate-400 bg-slate-950 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <RefreshCw size={15} />
                {form.isRecurring ? 'Marked as recurring' : 'Mark as recurring'}
              </button>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-slate-950 dark:bg-white text-white dark:text-slate-900 font-semibold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
              >
                {editingExpense ? 'Save changes' : 'Add expense'}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
