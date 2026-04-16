import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStockList, useStockOHLC, useIndicators } from '../hooks/useStock'
import { useAllNews } from '../hooks/useNews'
import { useWatchlist } from '../hooks/useWatchlist'
import StockCard from '../components/stock/StockCard'
import NewsCard from '../components/news/NewsCard'
import CandlestickChart from '../components/charts/CandlestickChart'
import LoadingSpinner from '../components/ui/LoadingSpinner'
import Skeleton from '../components/ui/Skeleton'

const MARKET_TICKERS = ['AAPL', 'MSFT', 'NVDA', 'TSLA', 'GOOGL']

function MarketPulseItem({ ticker }) {
  const { data, isLoading } = useStockList()
  const stock = data?.stocks?.find((s) => s.ticker === ticker)
  if (isLoading || !stock) return <Skeleton className="h-14 w-36" />
  const isUp = stock.changePct >= 0
  return (
    <div className="flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-xl">
      <div>
        <div className="font-mono font-bold text-sm text-txt">{stock.ticker}</div>
        <div className="text-xs text-muted">{stock.name.split(' ')[0]}</div>
      </div>
      <div className="text-right">
        <div className="font-mono text-sm font-semibold text-txt">${Number(stock.price).toFixed(2)}</div>
        <div className={`text-xs font-medium ${isUp ? 'text-bull' : 'text-bear'}`}>{`${isUp ? '+' : ''}${Number(stock.changePct).toFixed(2)}%`}</div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [featured, setFeatured] = useState('AAPL')
  const activeIndicators = ['sma20']
  const { data: stockListData, isLoading: stocksLoading } = useStockList()
  const { data: newsData, isLoading: newsLoading } = useAllNews()
  const { data: ohlcData } = useStockOHLC(featured)
  const { data: indData } = useIndicators(featured)
  const { watchlist, addTicker, removeTicker } = useWatchlist()

  const stocks = stockListData?.stocks || []
  const articles = newsData?.articles?.slice(0, 8) || []
  const watchlistTickers = watchlist.map((w) => w.ticker)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-txt">Dashboard</h1>
        <p className="text-sm text-muted">Market overview - 15 US equities, real-time sentiment</p>
      </div>

      <div className="flex gap-3 flex-wrap">{MARKET_TICKERS.map((t) => <MarketPulseItem key={t} ticker={t} />)}</div>

      <div className="grid grid-cols-5 gap-5">
        <div className="col-span-3 bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 flex-wrap">
              {['AAPL', 'MSFT', 'NVDA', 'TSLA'].map((t) => (
                <button
                  key={t}
                  onClick={() => setFeatured(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${featured === t ? 'bg-primary text-white' : 'text-muted hover:text-txt bg-bg border border-border'}`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button onClick={() => navigate(`/app/stock/${featured}`)} className="text-xs text-primary hover:underline">Full Analysis &rarr;</button>
          </div>
          <CandlestickChart ohlcData={ohlcData?.data} indicatorData={indData} activeIndicators={activeIndicators} height={300} />
        </div>

        <div className="col-span-2 bg-surface border border-border rounded-2xl p-4">
          <h2 className="text-sm font-semibold text-txt mb-3">Latest News</h2>
          <div className="space-y-3 overflow-y-auto max-h-[340px] pr-1">{newsLoading ? <LoadingSpinner center /> : articles.map((a) => <NewsCard key={a.id} article={a} />)}</div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-txt mb-3">All Stocks</h2>
        {stocksLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">{[...Array(10)].map((_, i) => <Skeleton key={i} className="h-32" />)}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {stocks.map((s) => (
              <StockCard
                key={s.ticker}
                stock={s}
                inWatchlist={watchlistTickers.includes(s.ticker)}
                onToggleWatch={(t) => (watchlistTickers.includes(t) ? removeTicker(t) : addTicker(t))}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
