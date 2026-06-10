import { useState } from 'react'
import { Moon, Sun, Download, Upload, Trash2, Plus, X, RefreshCw, ChevronRight } from 'lucide-react'
import { exportJSON, exportCSV, importJSON } from '../utils/helpers'
import { DEFAULT_CATEGORIES } from '../utils/constants'

export default function SettingsView({ settings, expenses, categories, onToggleDark, onAddCategory, onRemoveCategory, onImport, onClearAll }) {
  const [newCat, setNewCat] = useState('')
  const [catError, setCatError] = useState('')
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [importError, setImportError] = useState('')

  const handleAddCat = () => {
    const name = newCat.trim()
    if (!name) return
    if (categories.map(c => c.toLowerCase()).includes(name.toLowerCase())) {
      setCatError('Category already exists')
      return
    }
    onAddCategory(name)
    setNewCat('')
    setCatError('')
  }

  const handleImport = async () => {
    setImportError('')
    try {
      const data = await importJSON()
      onImport(data)
    } catch (e) {
      setImportError(e.message || 'Failed to import')
    }
  }

  const customCats = settings.customCategories || []
  const recurringExpenses = [...new Map(
    expenses.filter(e => e.isRecurring).map(e => [`${e.name}|${e.category}`, e])
  ).values()]

  return (
    <div className="px-4 pt-6 pb-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-950 dark:text-white mb-6">Settings</h1>

      {/* Appearance */}
      <Section title="Appearance">
        <Row>
          <div className="flex items-center gap-3">
            {settings.darkMode
              ? <Moon size={17} className="text-slate-600 dark:text-slate-300" />
              : <Sun size={17} className="text-amber-500" />}
            <span className="text-sm font-medium text-slate-800 dark:text-slate-200">Dark mode</span>
          </div>
          <button
            onClick={onToggleDark}
            className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
              settings.darkMode ? 'bg-slate-950 dark:bg-slate-200' : 'bg-slate-200 dark:bg-slate-700'
            }`}
            aria-label="Toggle dark mode"
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white dark:bg-slate-900 rounded-full shadow-sm transition-transform ${
              settings.darkMode ? 'translate-x-5' : 'translate-x-0.5'
            }`} />
          </button>
        </Row>
      </Section>

      {/* Custom categories */}
      <Section title="Custom Categories">
        <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-50 dark:border-slate-800">
          <input
            value={newCat}
            onChange={e => { setNewCat(e.target.value); setCatError('') }}
            onKeyDown={e => e.key === 'Enter' && handleAddCat()}
            placeholder="New category name"
            className="flex-1 text-sm bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 outline-none py-0.5"
          />
          <button
            onClick={handleAddCat}
            className="w-7 h-7 rounded-lg bg-slate-950 dark:bg-white flex items-center justify-center text-white dark:text-slate-950 shrink-0"
          >
            <Plus size={13} />
          </button>
        </div>
        {catError && <p className="text-xs text-rose-500 px-4 py-1.5">{catError}</p>}

        {customCats.length > 0 ? (
          customCats.map(cat => (
            <div key={cat} className="flex items-center justify-between px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
              <span className="text-sm text-slate-700 dark:text-slate-300">{cat}</span>
              <button
                onClick={() => onRemoveCategory(cat)}
                className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-rose-100 dark:hover:bg-rose-900/30 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 dark:text-slate-500 px-4 py-3">No custom categories yet</p>
        )}
      </Section>

      {/* Recurring expenses */}
      {recurringExpenses.length > 0 && (
        <Section title={`Recurring Expenses (${recurringExpenses.length})`}>
          {recurringExpenses.map(e => (
            <div key={e.id} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
              <RefreshCw size={13} className="text-slate-400 dark:text-slate-500 shrink-0" />
              <span className="text-sm text-slate-700 dark:text-slate-300 flex-1 truncate">{e.name}</span>
              <span className="text-xs text-slate-400 dark:text-slate-500 shrink-0">{e.category}</span>
            </div>
          ))}
        </Section>
      )}

      {/* Data */}
      <Section title={`Data · ${expenses.length} expenses`}>
        <RowButton icon={<Download size={16} className="text-slate-500 dark:text-slate-400" />} onClick={() => exportJSON(expenses)}>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Export as JSON</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Full backup, re-importable</p>
        </RowButton>
        <RowButton icon={<Download size={16} className="text-slate-500 dark:text-slate-400" />} onClick={() => exportCSV(expenses)}>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Export as CSV</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Open in spreadsheets</p>
        </RowButton>
        <RowButton icon={<Upload size={16} className="text-slate-500 dark:text-slate-400" />} onClick={handleImport}>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">Import from JSON</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Replaces all current data</p>
        </RowButton>
        {importError && (
          <p className="text-xs text-rose-500 px-4 py-2">{importError}</p>
        )}
      </Section>

      {/* Danger zone */}
      <div className="mb-2">
        <p className="text-xs font-semibold text-rose-400 uppercase tracking-wide mb-2 px-1">Danger Zone</p>
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {showClearConfirm ? (
            <div className="p-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 mb-1">
                This will permanently delete all {expenses.length} expenses and cannot be undone.
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-4">Budgets and settings are preserved.</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onClearAll(); setShowClearConfirm(false) }}
                  className="flex-1 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-sm font-semibold transition-colors"
                >
                  Delete all
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-rose-50 dark:hover:bg-rose-900/10 text-left transition-colors"
            >
              <Trash2 size={16} className="text-rose-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-rose-600 dark:text-rose-400">Clear all data</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">Permanently delete all expenses</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-2 px-1">{title}</p>
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        {children}
      </div>
    </div>
  )
}

function Row({ children }) {
  return (
    <div className="flex items-center justify-between px-4 py-3.5">
      {children}
    </div>
  )
}

function RowButton({ icon, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 w-full px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-left transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
    >
      {icon}
      <div className="flex-1">{children}</div>
      <ChevronRight size={14} className="text-slate-300 dark:text-slate-600 shrink-0" />
    </button>
  )
}
