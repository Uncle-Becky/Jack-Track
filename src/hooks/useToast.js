import { useState, useCallback, useRef } from 'react'

export function useToast() {
  const [toast, setToast] = useState(null)
  const timerRef = useRef(null)

  const showToast = useCallback((message, undoFn = null, duration = 5000) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast({ message, undoFn })
    timerRef.current = setTimeout(() => setToast(null), duration)
  }, [])

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(null)
  }, [])

  const handleUndo = useCallback(() => {
    if (toast?.undoFn) toast.undoFn()
    if (timerRef.current) clearTimeout(timerRef.current)
    setToast(null)
  }, [toast])

  return { toast, showToast, dismissToast, handleUndo }
}
