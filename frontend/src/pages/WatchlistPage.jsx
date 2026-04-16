import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trash2, Plus, TrendingUp, TrendingDown } from 'lucide-react'
import { useWatchlist } from '../hooks/useWatchlist'
import SentimentBadge from '../components/news/SentimentBadge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { fmt } from '../utils/formatters'

const ALL_TICKERS = ['AAPL','MSFT','GOOGL','AMZN','NVDA','TSLA','META','JPM','JNJ','V','WMT','XOM','BAC','DIS','NFLX']

export default function WatchlistPage() {
  const [input, setInput] = useState('')
  const [confirm, setConfirm] = useState(null)
  const navigate = useNavigate()
  const { watchlist, isLoading, addTicker, removeTicker, addError, addLoading } = useWatchlist()

  const handleAdd = () => {
    const t = input.trim().toUpperCase()
    if (!t) return
    addTicker(t)
    setInput('')
  }

  if (isLoading) return <LoadingSpinner center />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-txt">Watchlist</h1>
        <p className="text-sm text-muted">Your saved tickers with live price and sentiment</p>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-txt mb-3">Add Ticker</h2>
        <div className="flex gap-3 items-start flex-wrap">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="e.g. AAPL"
              className="bg-bg border border-border rounded-lg px-4 py-2.5 text-sm font-mono text-txt placeholder:text-muted focus:outline-none focus:border-primary transition-colors w-36"
            />
            <button onClick={handleAdd} disabled={addLoading} className="px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 rounded-lg text-sm font-medium text-white flex items-center gap-1.5 transition-all">
              <Plus size={14} /> Add
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {ALL_TICKERS.filter((t) => !watchlist.some((w) => w.ticker === t)).slice(0, 8).map((t) => (
              <button key={t} onClick={() => addTicker(t)} className="px-3 py-1.5 text-xs font-mono font-semibold text-muted border border-border rounded-lg hover:border-primary/50 hover:text-primary transition-all">
                + {t}
              </button>
            ))}
          </div>
        </div>
        {addError && <p className="text-bear text-xs mt-2">{addError}</p>}
      </div>

      {watchlist.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <div className="text-4xl mb-3">[ ]</div>
          <p className="text-sm">Your watchlist is empty. Add some tickers above.</p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Ticker', 'Company', 'Price', 'Change', 'Sentiment', 'Added', ''].map((h) => (
                  <th key={h} className="px-4 py-3 text-xs font-medium text-muted text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => {
                const isUp = (item.changePct || 0) >= 0
                return (
                  <tr key={item.ticker} onClick={() => navigate(`/app/stock/${item.ticker}`)} className="border-b border-border/50 hover:bg-white/[0.02] cursor-pointer transition-colors group">
                    <td className="px-4 py-3"><span className="font-mono font-bold text-primary text-sm">{item.ticker}</span></td>
                    <td className="px-4 py-3 text-sm text-muted max-w-[160px] truncate">{item.name || '-'}</td>
                    <td className="px-4 py-3 font-mono text-sm text-txt">{fmt.price(item.price)}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 font-mono text-sm font-medium ${isUp ? 'text-bull' : 'text-bear'}`}>
                        {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                        {fmt.pct(item.changePct)}
                      </span>
                    </td>
                    <td className="px-4 py-3"><SentimentBadge label={item.sentiment_label || 'neutral'} score={item.aggregate_score} /></td>
                    <td className="px-4 py-3 text-xs text-muted">{fmt.date(item.added_at)}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      {confirm === item.ticker ? (
                        <div className="flex gap-2">
                          <button onClick={() => { removeTicker(item.ticker); setConfirm(null) }} className="text-xs text-bear hover:underline">Remove</button>
                          <button onClick={() => setConfirm(null)} className="text-xs text-muted hover:underline">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setConfirm(item.ticker)} className="text-muted hover:text-bear transition-colors opacity-0 group-hover:opacity-100">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
