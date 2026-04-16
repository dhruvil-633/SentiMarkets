export default function SentimentBadge({ label, score }) {
  const cfg = {
    bullish: { bg: 'bg-bull/10', text: 'text-bull', border: 'border-bull/30', dot: 'bg-bull' },
    bearish: { bg: 'bg-bear/10', text: 'text-bear', border: 'border-bear/30', dot: 'bg-bear' },
    neutral: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30', dot: 'bg-yellow-400' },
  }
  const c = cfg[label] || cfg.neutral
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {label.charAt(0).toUpperCase() + label.slice(1)}
      {score != null && <span className="opacity-70">({score >= 0 ? '+' : ''}{Number(score).toFixed(2)})</span>}
    </span>
  )
}
