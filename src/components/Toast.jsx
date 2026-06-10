import { AnimatePresence, motion } from 'framer-motion'
import { X, RotateCcw } from 'lucide-react'

export default function Toast({ toast, onDismiss, onUndo }) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 380 }}
          className="fixed bottom-[84px] left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl text-sm font-medium w-[calc(100%-2rem)] max-w-sm"
        >
          <span className="flex-1 leading-tight">{toast.message}</span>
          {toast.undoFn && (
            <button
              onClick={onUndo}
              className="flex items-center gap-1 text-emerald-400 dark:text-emerald-600 hover:text-emerald-300 font-semibold shrink-0 text-sm"
            >
              <RotateCcw size={13} />
              Undo
            </button>
          )}
          <button
            onClick={onDismiss}
            className="text-slate-400 dark:text-slate-500 hover:text-white dark:hover:text-slate-900 shrink-0 transition-colors"
          >
            <X size={15} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
