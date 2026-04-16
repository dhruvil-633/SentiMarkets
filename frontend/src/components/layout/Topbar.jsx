import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useStockSearch } from '../../hooks/useStock'
import { fmt } from '../../utils/formatters'

function useDebounce(value, delay) {
  const [d, setD] = useState(value)
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t) }, [value, delay])
  return d
}

export default function Topbar() {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const debounced = useDebounce(q, 300)
  const navigate = useNavigate()
  const ref = useRef(null)

  const { data } = useStockSearch(debounced)
  const results = data?.results || []

  useEffect(() => { setOpen(debounced.length > 0 && results.length > 0) }, [debounced, results])
  useEffect(() => {
    const handler = (e) => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const pick = (ticker) => {
    setQ(''); setOpen(false)
    navigate(`/app/stock/${ticker}`)
  }

  return (
    <header className="h-14 bg-surface border-b border-border flex items-center px-6 gap-4">
      <div className="relative flex-1 max-w-md" ref={ref}>
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search ticker or company..."
          className="w-full bg-bg border border-border rounded-lg pl-9 pr-4 py-2 text-sm text-txt placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
        />
        {open && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden">
            {results.map((r) => (
              <button
                key={r.ticker}
                onClick={() => pick(r.ticker)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-primary text-sm w-16 text-left">{r.ticker}</span>
                  <span className="text-xs text-muted">{r.name}</span>
                </div>
                <span className={`text-xs font-mono ${r.changePct >= 0 ? 'text-bull' : 'text-bear'}`}>
                  {fmt.pct(r.changePct)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
      <Clock />
    </header>
  )
}

function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(t) }, [])
  return (
    <div className="text-right">
      <div className="font-mono text-sm text-txt">{time.toLocaleTimeString()}</div>
      <div className="text-xs text-muted">{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
    </div>
  )
}
