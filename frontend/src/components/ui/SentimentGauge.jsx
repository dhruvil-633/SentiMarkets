export default function SentimentGauge({ score = 0, label = 'neutral' }) {
  const clamped = Math.max(-1, Math.min(1, score))
  const degrees = ((clamped + 1) / 2) * 180
  const rad = ((degrees - 90) * Math.PI) / 180
  const cx = 80, cy = 80, r = 60
  const nx = cx + r * Math.cos(rad - Math.PI/2)
  const ny = cy + r * Math.sin(rad - Math.PI/2)

  const color = label === 'bullish' ? '#22c55e' : label === 'bearish' ? '#ef4444' : '#eab308'

  return (
    <div className="flex flex-col items-center">
      <svg width="160" height="100" viewBox="0 0 160 100">
        <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke="#2a2f3e" strokeWidth="12" strokeLinecap="round"/>
        <path d="M 20 80 A 60 60 0 0 1 140 80" fill="none" stroke={color} strokeWidth="12"
          strokeLinecap="round" strokeDasharray="188.5"
          strokeDashoffset={188.5 * (1 - (clamped + 1) / 2)}
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}/>
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke={color} strokeWidth="2.5" strokeLinecap="round"/>
        <circle cx={cx} cy={cy} r="5" fill={color} />
        <text x="14" y="98" fill="#ef4444" fontSize="10" fontFamily="Inter">Bear</text>
        <text x="116" y="98" fill="#22c55e" fontSize="10" fontFamily="Inter">Bull</text>
      </svg>
      <div className="text-center mt-1">
        <div className="font-mono text-lg font-semibold" style={{ color }}>
          {score >= 0 ? '+' : ''}{score.toFixed(3)}
        </div>
        <div className="text-xs text-muted capitalize font-medium">{label}</div>
      </div>
    </div>
  )
}
