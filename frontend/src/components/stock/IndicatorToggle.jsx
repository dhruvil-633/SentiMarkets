const INDICATORS = [
  { key: 'sma20', label: 'SMA 20', color: '#3b82f6' },
  { key: 'sma50', label: 'SMA 50', color: '#f97316' },
  { key: 'ema20', label: 'EMA 20', color: '#a855f7' },
  { key: 'bb', label: 'Bollinger', color: '#6b7280' },
  { key: 'rsi', label: 'RSI 14', color: '#eab308' },
]

export default function IndicatorToggle({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {INDICATORS.map(({ key, label, color }) => {
        const on = active.includes(key)
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
              on ? 'text-white border-transparent' : 'text-muted border-border hover:border-primary/50'
            }`}
            style={on ? { background: color, borderColor: color } : {}}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
