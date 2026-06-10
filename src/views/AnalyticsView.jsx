import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  AreaChart, Area,
} from 'recharts'
import { getCategoryColor } from '../utils/constants'
import { fmtCurrency, fmtMonth, fmtMonthShort, prevMonth, lastNMonths, pctChange } from '../utils/helpers'

export default function AnalyticsView({ expenses, selectedMonth, categories, darkMode, goToPrevMonth, goToNextMonth }) {
  const [tab, setTab] = useState('month')

  const tickStyle = { fontSize: 10, fill: darkMode ? '#94a3b8' : '#64748b' }
  const gridColor = darkMode ? '#1e293b' : '#f1f5f9'
  const prevBar = darkMode ? '#475569' : '#cbd5e1'
  const currBar = darkMode ? '#a5b4fc' : '#4f46e5'
  const areaStroke = darkMode ? '#a5b4fc' : '#4f46e5'
  const tooltipStyle = {
    borderRadius: 12, border: 'none',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
    fontSize: 12,
    backgroundColor: darkMode ? '#1e293b' : '#fff',
    color: darkMode ? '#f1f5f9' : '#0f172a',
  }

  const prev = useMemo(() => prevMonth(selectedMonth), [selectedMonth])

  const pieData = useMemo(() => {
    const map = new Map()
    expenses.filter(e => e.month === selectedMonth).forEach(e => {
      map.set(e.category, (map.get(e.category) || 0) + e.amount)
    })
    return [...map.entries()].sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }))
  }, [expenses, selectedMonth])

  const pieTotal = useMemo(() => pieData.reduce((s, d) => s + d.value, 0), [pieData])

  const barData = useMemo(() => {
    const cm = new Map(), pm = new Map()
    expenses.filter(e => e.month === selectedMonth).forEach(e => cm.set(e.category, (cm.get(e.category) || 0) + e.amount))
    expenses.filter(e => e.month === prev).forEach(e => pm.set(e.category, (pm.get(e.category) || 0) + e.amount))
    const cats = new Set([...cm.keys(), ...pm.keys()])
    return [...cats]
      .map(cat => ({
        name: cat.length > 9 ? cat.slice(0, 9) + '…' : cat,
        fullName: cat,
        current: cm.get(cat) || 0,
        previous: pm.get(cat) || 0,
      }))
      .filter(d => d.current > 0 || d.previous > 0)
      .sort((a, b) => b.current - a.current)
  }, [expenses, selectedMonth, prev])

  const trendData = useMemo(() => {
    const months = lastNMonths(selectedMonth, 6)
    return months.map(m => ({
      month: fmtMonthShort(m),
      total: expenses.filter(e => e.month === m).reduce((s, e) => s + e.amount, 0),
    }))
  }, [expenses, selectedMonth])

  const trendWithChange = useMemo(() =>
    trendData.map((d, i) => ({
      ...d,
      pct: i > 0 && trendData[i - 1].total > 0
        ? ((d.total - trendData[i - 1].total) / trendData[i - 1].total) * 100
        : null,
    })),
    [trendData]
  )

  return (
    <div className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-slate-950 dark:text-white">Analytics</h1>
        <div className="flex items-center gap-0.5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-1">
          <button onClick={goToPrevMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100 px-1 min-w-[106px] text-center tabular-nums">
            {fmtMonth(selectedMonth)}
          </span>
          <button onClick={goToNextMonth} className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-4">
        {[['month', 'This Month'], ['trends', '6-Month Trend']].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === t
                ? 'bg-white dark:bg-slate-900 text-slate-950 dark:text-white shadow-sm'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'month' ? (
        <motion.div key="month" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {pieData.length > 0 ? (
            <>
              {/* Donut chart */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4">
                <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  Category breakdown
                </h2>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius="52%"
                        outerRadius="78%"
                        paddingAngle={2}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                      >
                        {pieData.map((entry) => (
                          <Cell key={entry.name} fill={getCategoryColor(entry.name, categories)} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(v) => [fmtCurrency(v), '']}
                        contentStyle={tooltipStyle}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-1">
                  {pieData.map(entry => {
                    const color = getCategoryColor(entry.name, categories)
                    const p = pieTotal > 0 ? (entry.value / pieTotal * 100).toFixed(1) : '0'
                    return (
                      <div key={entry.name} className="flex items-center gap-2.5">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                        <span className="text-xs text-slate-600 dark:text-slate-400 flex-1 truncate">{entry.name}</span>
                        <span className="text-xs text-slate-400 dark:text-slate-500 w-9 text-right">{p}%</span>
                        <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 w-16 text-right tabular-nums">
                          {fmtCurrency(entry.value)}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Bar chart: vs previous month */}
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    vs {fmtMonth(prev)}
                  </h2>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: prevBar }} />
                      Prev
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2.5 h-2.5 rounded-sm inline-block" style={{ backgroundColor: currBar }} />
                      Now
                    </span>
                  </div>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                      <XAxis dataKey="name" tick={tickStyle} axisLine={false} tickLine={false} />
                      <YAxis tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`} tick={tickStyle} axisLine={false} tickLine={false} />
                      <Tooltip
                        formatter={(v, n, { payload }) => [fmtCurrency(v), n === 'current' ? fmtMonth(selectedMonth) : fmtMonth(prev)]}
                        contentStyle={tooltipStyle}
                        cursor={{ fill: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
                      />
                      <Bar dataKey="previous" fill={prevBar} radius={[4, 4, 0, 0]} />
                      <Bar dataKey="current" fill={currBar} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 py-20 text-center">
              <p className="text-sm text-slate-500 dark:text-slate-400">No data for {fmtMonth(selectedMonth)}</p>
            </div>
          )}
        </motion.div>
      ) : (
        <motion.div key="trends" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          {/* Area chart */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-4">
            <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
              Monthly spending
            </h2>
            <div className="h-52">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={areaStroke} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={areaStroke} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                  <XAxis dataKey="month" tick={tickStyle} axisLine={false} tickLine={false} />
                  <YAxis
                    tickFormatter={v => `$${v >= 1000 ? `${(v/1000).toFixed(1)}k` : v}`}
                    tick={tickStyle}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    formatter={(v) => [fmtCurrency(v), 'Total']}
                    contentStyle={tooltipStyle}
                    cursor={{ stroke: areaStroke, strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke={areaStroke}
                    strokeWidth={2.5}
                    fill="url(#areaGrad)"
                    dot={{ r: 4, fill: areaStroke, strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: areaStroke, strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Monthly totals table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-50 dark:border-slate-800">
              <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                Month totals
              </h2>
            </div>
            {[...trendWithChange].reverse().map((d) => (
              <div key={d.month} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 dark:border-slate-800 last:border-0">
                <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{d.month}</span>
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 tabular-nums">{fmtCurrency(d.total)}</span>
                {d.pct !== null ? (
                  <span className={`text-xs font-semibold w-12 text-right tabular-nums ${
                    d.pct > 5 ? 'text-rose-500 dark:text-rose-400'
                    : d.pct < -5 ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-400'
                  }`}>
                    {d.pct > 0 ? '+' : ''}{d.pct.toFixed(1)}%
                  </span>
                ) : <span className="w-12" />}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}
