import { useState } from 'react'
import { useAllNews } from '../hooks/useNews'
import NewsCard from '../components/news/NewsCard'
import LoadingSpinner from '../components/ui/LoadingSpinner'

const FILTERS = ['all', 'bullish', 'bearish', 'neutral']

export default function NewsPage() {
  const [filter, setFilter] = useState('all')
  const { data, isLoading } = useAllNews(filter === 'all' ? null : filter)
  const articles = data?.articles || []

  const filterColors = {
    bullish: 'text-bull border-bull bg-bull/10',
    bearish: 'text-bear border-bear bg-bear/10',
    neutral: 'text-yellow-400 border-yellow-400 bg-yellow-400/10',
    all: 'text-primary border-primary bg-primary/10',
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-txt">News Feed</h1>
        <p className="text-sm text-muted">AI-scored financial headlines across all tracked stocks</p>
      </div>

      <div className="flex gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize ${filter === f ? filterColors[f] : 'text-muted border-border hover:border-primary/40 hover:text-txt'}`}
          >
            {f === 'all' ? 'All News' : f}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted self-center">{articles.length} articles</span>
      </div>

      {isLoading ? (
        <LoadingSpinner center />
      ) : articles.length === 0 ? (
        <div className="text-center py-16 text-muted">No articles found for this filter.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{articles.map((a) => <NewsCard key={a.id || a.title} article={a} />)}</div>
      )}
    </div>
  )
}
