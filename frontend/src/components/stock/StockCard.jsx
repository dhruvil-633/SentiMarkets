import { TrendingUp, TrendingDown, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { fmt } from '../../utils/formatters'

export default function StockCard({ stock, inWatchlist, onToggleWatch }) {
  const navigate = useNavigate()
  const isUp = stock.changePct >= 0
  return (
    <div
      onClick={() => navigate(`/app/stock/${stock.ticker}`)}
      className="bg-surface border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 hover:bg-surface/80 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-mono font-bold text-txt text-base">{stock.ticker}</div>
          <div className="text-xs text-muted truncate max-w-[140px]">{stock.name}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onToggleWatch?.(stock.ticker) }}
          className="text-muted hover:text-yellow-400 transition-colors"
        >
          {inWatchlist ? <Star size={14} className="fill-yellow-400 text-yellow-400" /> : <Star size={14} />}
        </button>
      </div>
      <div className="font-mono text-xl font-semibold text-txt mb-1">{fmt.price(stock.price)}</div>
      <div className={`flex items-center gap-1 text-sm font-medium ${isUp ? 'text-bull' : 'text-bear'}`}>
        {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
        {fmt.pct(stock.changePct)}
      </div>
      <div className="text-xs text-muted mt-2">Vol: {fmt.vol(stock.volume)}</div>
    </div>
  )
}
