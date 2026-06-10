export const fmtCurrency = (amount) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
    Number.isFinite(amount) ? amount : 0
  )

export const fmtMonth = (ym) => {
  const [year, month] = ym.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export const fmtMonthShort = (ym) => {
  const [year, month] = ym.split('-').map(Number)
  return new Date(year, month - 1).toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
}

export const currentMonth = () => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const prevMonth = (ym) => {
  const [year, month] = ym.split('-').map(Number)
  const d = new Date(year, month - 2)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const nextMonth = (ym) => {
  const [year, month] = ym.split('-').map(Number)
  const d = new Date(year, month)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export const lastNMonths = (ym, n) => {
  const months = []
  let current = ym
  for (let i = 0; i < n; i++) {
    months.unshift(current)
    current = prevMonth(current)
  }
  return months
}

export const pctChange = (current, previous) => {
  if (!previous || previous === 0) return null
  return ((current - previous) / previous) * 100
}

export const exportJSON = (expenses) => {
  const blob = new Blob([JSON.stringify(expenses, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `expenses-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export const exportCSV = (expenses) => {
  const headers = ['Month', 'Name', 'Category', 'Amount', 'Notes', 'Recurring']
  const rows = expenses.map(e => [
    e.month,
    `"${(e.name || '').replace(/"/g, '""')}"`,
    `"${(e.category || '').replace(/"/g, '""')}"`,
    (e.amount || 0).toFixed(2),
    `"${(e.notes || '').replace(/"/g, '""')}"`,
    e.isRecurring ? 'Yes' : 'No',
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `expenses-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export const importJSON = () =>
  new Promise((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return reject(new Error('No file selected'))
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          if (!Array.isArray(data)) throw new Error('Invalid format: expected an array')
          resolve(data)
        } catch (err) {
          reject(err)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  })
