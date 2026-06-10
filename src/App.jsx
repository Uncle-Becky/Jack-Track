import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Navigation from './components/Navigation'
import ExpenseForm from './components/ExpenseForm'
import Toast from './components/Toast'
import ConfirmModal from './components/ConfirmModal'
import OverviewView from './views/OverviewView'
import ExpensesView from './views/ExpensesView'
import AnalyticsView from './views/AnalyticsView'
import BudgetsView from './views/BudgetsView'
import SettingsView from './views/SettingsView'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useToast } from './hooks/useToast'
import {
  EXPENSES_KEY, BUDGETS_KEY, SETTINGS_KEY,
  OLD_EXPENSES_KEY, SEED_EXPENSES, DEFAULT_CATEGORIES,
} from './utils/constants'
import { currentMonth, prevMonth, nextMonth } from './utils/helpers'

function loadInitialExpenses() {
  try {
    const stored = localStorage.getItem(EXPENSES_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
    const old = localStorage.getItem(OLD_EXPENSES_KEY)
    if (old) {
      const parsed = JSON.parse(old)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return SEED_EXPENSES
}

export default function App() {
  const [expenses, setExpenses] = useLocalStorage(EXPENSES_KEY, loadInitialExpenses)
  const [budgets, setBudgets] = useLocalStorage(BUDGETS_KEY, {})
  const [settings, setSettings] = useLocalStorage(SETTINGS_KEY, { darkMode: false, customCategories: [] })

  const [activeView, setActiveView] = useState('overview')
  const [selectedMonth, setSelectedMonth] = useState(currentMonth)
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [pendingDelete, setPendingDelete] = useState(null)

  const { toast, showToast, dismissToast, handleUndo } = useToast()

  const categories = [...DEFAULT_CATEGORIES, ...(settings.customCategories || [])]

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.darkMode)
  }, [settings.darkMode])

  const addExpense = useCallback((data) => {
    const expense = { id: crypto.randomUUID(), ...data, createdAt: new Date().toISOString() }
    setExpenses(prev => [expense, ...prev])
    setSelectedMonth(data.month)
  }, [setExpenses])

  const updateExpense = useCallback((data) => {
    setExpenses(prev => prev.map(e => e.id === data.id ? { ...e, ...data } : e))
    setSelectedMonth(data.month)
  }, [setExpenses])

  const handleFormSave = useCallback((data) => {
    if (editingExpense) updateExpense({ ...editingExpense, ...data })
    else addExpense(data)
    setShowForm(false)
    setEditingExpense(null)
  }, [editingExpense, addExpense, updateExpense])

  const handleFormClose = useCallback(() => {
    setShowForm(false)
    setEditingExpense(null)
  }, [])

  const handleEdit = useCallback((expense) => {
    setEditingExpense(expense)
    setShowForm(true)
  }, [])

  const handleDelete = useCallback((expense) => {
    setPendingDelete(expense)
  }, [])

  const executeDelete = useCallback(() => {
    if (!pendingDelete) return
    const deleted = pendingDelete
    setExpenses(prev => prev.filter(e => e.id !== deleted.id))
    setPendingDelete(null)
    showToast(
      `"${deleted.name}" deleted`,
      () => setExpenses(prev => [deleted, ...prev])
    )
  }, [pendingDelete, setExpenses, showToast])

  const handleAddClick = useCallback(() => {
    setEditingExpense(null)
    setShowForm(true)
  }, [])

  const updateBudget = useCallback((category, amount) => {
    setBudgets(prev => ({ ...prev, [category]: amount }))
  }, [setBudgets])

  const toggleDarkMode = useCallback(() => {
    setSettings(prev => ({ ...prev, darkMode: !prev.darkMode }))
  }, [setSettings])

  const addCategory = useCallback((name) => {
    setSettings(prev => ({ ...prev, customCategories: [...(prev.customCategories || []), name] }))
  }, [setSettings])

  const removeCategory = useCallback((name) => {
    setSettings(prev => ({ ...prev, customCategories: (prev.customCategories || []).filter(c => c !== name) }))
  }, [setSettings])

  const importExpenses = useCallback((data) => {
    setExpenses(data)
    showToast(`Imported ${data.length} expense${data.length !== 1 ? 's' : ''}`)
  }, [setExpenses, showToast])

  const clearAllData = useCallback(() => {
    setExpenses([])
    showToast('All expenses cleared')
  }, [setExpenses, showToast])

  const goToPrevMonth = useCallback(() => setSelectedMonth(m => prevMonth(m)), [])
  const goToNextMonth = useCallback(() => setSelectedMonth(m => nextMonth(m)), [])

  const sharedProps = {
    expenses, selectedMonth, categories,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onAddClick: handleAddClick,
    goToPrevMonth,
    goToNextMonth,
  }

  const views = {
    overview: <OverviewView {...sharedProps} budgets={budgets} />,
    expenses: <ExpensesView {...sharedProps} />,
    analytics: <AnalyticsView expenses={expenses} selectedMonth={selectedMonth} categories={categories} darkMode={settings.darkMode} goToPrevMonth={goToPrevMonth} goToNextMonth={goToNextMonth} />,
    budgets: <BudgetsView expenses={expenses} selectedMonth={selectedMonth} categories={categories} budgets={budgets} onUpdateBudget={updateBudget} />,
    settings: <SettingsView settings={settings} expenses={expenses} categories={categories} onToggleDark={toggleDarkMode} onAddCategory={addCategory} onRemoveCategory={removeCategory} onImport={importExpenses} onClearAll={clearAllData} />,
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
      <main className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16 }}
          >
            {views[activeView]}
          </motion.div>
        </AnimatePresence>
      </main>

      <Navigation activeView={activeView} onNavigate={setActiveView} />

      <ExpenseForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSave={handleFormSave}
        editingExpense={editingExpense}
        categories={categories}
        selectedMonth={selectedMonth}
      />

      <ConfirmModal
        isOpen={!!pendingDelete}
        title="Delete expense?"
        message={pendingDelete ? `"${pendingDelete.name}" will be permanently removed. You can undo this.` : ''}
        onConfirm={executeDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <Toast toast={toast} onDismiss={dismissToast} onUndo={handleUndo} />
    </div>
  )
}
