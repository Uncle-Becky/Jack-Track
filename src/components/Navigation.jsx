import { LayoutDashboard, List, BarChart2, Target, Settings } from 'lucide-react'

const TABS = [
  { id: 'overview', label: 'Overview', Icon: LayoutDashboard },
  { id: 'expenses', label: 'Expenses', Icon: List },
  { id: 'analytics', label: 'Analytics', Icon: BarChart2 },
  { id: 'budgets', label: 'Budgets', Icon: Target },
  { id: 'settings', label: 'Settings', Icon: Settings },
]

export default function Navigation({ activeView, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800">
      <div className="flex max-w-2xl mx-auto">
        {TABS.map(({ id, label, Icon }) => {
          const active = activeView === id
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 px-1 text-[10px] font-medium transition-colors ${
                active
                  ? 'text-slate-950 dark:text-white'
                  : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400'
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
              <span>{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
