import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Star } from 'lucide-react'
import { useStockOHLC, useIndicators, useStockMeta } from '../hooks/useStock'
import { useTickerNews } from '../hooks/useNews'
import { useTickerSentiment } from '../hooks/useSentiment'
import { useWatchlist } from '../hooks/useWatchlist'
import CandlestickChart from '../components/charts/CandlestickChart'
import RSIChart from '../components/charts/RSIChart'
import IndicatorToggle from '../components/stock/IndicatorToggle'
import NewsCard from '../components/news/NewsCard'
import SentimentGauge from '../components/ui/SentimentGauge'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import { fmt } from '../utils/formatters'

export default function StockAnalysis() {
  const { ticker } = useParams()
  const T = ticker?.toUpperCase() || 'AAPL'
  const [activeIndicators, setActiveIndicators] = useState(['sma20', 'bb'])

  const { data: ohlcData, isLoading: ohlcLoading } = useStockOHLC(T)
  const { data: indData } = useIndicators(T)
  const { data: meta } = useStockMeta(T)
  const { data: newsData, isLoading: newsLoading } = useTickerNews(T)
  const { data: sentimentData } = useTickerSentiment(T)
  const { watchlist, addTicker, removeTicker } = useWatchlist()

  const inWatch = watchlist.some((w) => w.ticker === T)
  const toggleInd = (key) => setActiveIndicators((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]))
  const isUp = (meta?.changePct || 0) >= 0

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-mono font-bold text-txt">{T}</h1>
            <button onClick={() => (inWatch ? removeTicker(T) : addTicker(T))} className={`p-1.5 rounded-lg transition-colors ${inWatch ? 'text-yellow-400 bg-yellow-400/10' : 'text-muted hover:text-yellow-400'}`}>
              <Star size={16} className={inWatch ? 'fill-yellow-400' : ''} />
            </button>
          </div>
          {meta && <p className="text-muted text-sm">{meta.name} - {meta.exchange} - {meta.sector}</p>}
        </div>
        {meta && (
          <div className="text-right">
            <div className="font-mono text-3xl font-bold text-txt">{fmt.price(meta.price)}</div>
            <div className={`font-mono text-sm font-semibold ${isUp ? 'text-bull' : 'text-bear'}`}>{fmt.pct(meta.changePct)} today</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="col-span-3 space-y-3">
          <div className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center gap-4 flex-wrap">
            <span className="text-xs text-muted font-medium">Indicators:</span>
            <IndicatorToggle active={activeIndicators} onChange={toggleInd} />
          </div>

          <div className="bg-surface border border-border rounded-2xl p-4">
            {ohlcLoading ? <LoadingSpinner center /> : <CandlestickChart ohlcData={ohlcData?.data} indicatorData={indData} activeIndicators={activeIndicators} height={400} />}
          </div>

          {activeIndicators.includes('rsi') && indData?.rsi_14 && (
            <div className="bg-surface border border-border rounded-2xl p-4">
              <div className="text-xs text-muted mb-2 font-medium">RSI (14)</div>
              <RSIChart rsiData={indData.rsi_14} height={110} />
            </div>
          )}

          {meta && (
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: 'Open', value: fmt.price(meta.open) },
                { label: 'High', value: fmt.price(meta.high) },
                { label: 'Low', value: fmt.price(meta.low) },
                { label: 'Volume', value: fmt.vol(meta.volume) },
              ].map(({ label, value }) => (
                <div key={label} className="bg-surface border border-border rounded-xl p-3 text-center">
                  <div className="text-xs text-muted mb-1">{label}</div>
                  <div className="font-mono font-semibold text-txt text-sm">{value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="col-span-1 space-y-4">
          <div className="bg-surface border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-txt mb-3">AI Sentiment</h3>
            {sentimentData ? (
              <>
                <SentimentGauge score={sentimentData.aggregate_score} label={sentimentData.label} />
                <div className="mt-4 space-y-2">
                  {[
                    { label: 'Bullish', pct: sentimentData.bullish_pct, color: 'bg-bull' },
                    { label: 'Bearish', pct: sentimentData.bearish_pct, color: 'bg-bear' },
                    { label: 'Neutral', pct: sentimentData.neutral_pct, color: 'bg-yellow-400' },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted">{label}</span>
                        <span className="text-txt font-mono">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted mt-3">{sentimentData.article_count} articles analysed</p>
              </>
            ) : (
              <LoadingSpinner center />
            )}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-4">
            <h3 className="text-sm font-semibold text-txt mb-3">Recent News</h3>
            <div className="space-y-3 overflow-y-auto max-h-[400px]">
              {newsLoading ? <LoadingSpinner center /> : (newsData?.articles || []).slice(0, 6).map((a) => <NewsCard key={a.id} article={a} />)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
