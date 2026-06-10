import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel, confirmLabel = 'Delete', confirmClass = 'bg-rose-500 hover:bg-rose-600' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 16 }}
            transition={{ type: 'spring', damping: 28, stiffness: 380 }}
            className="fixed inset-x-5 top-1/2 -translate-y-1/2 z-50 bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl max-w-sm mx-auto"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle size={18} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{message}</p>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button
                onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-colors ${confirmClass}`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
