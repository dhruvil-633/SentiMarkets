import { ExternalLink } from 'lucide-react'
import SentimentBadge from './SentimentBadge'
import { fmt } from '../../utils/formatters'

export default function NewsCard({ article }) {
  const { title, description, source, publishedAt, sentiment_label, sentiment_score, url, ticker } = article
  return (
    <div className="bg-surface border border-border rounded-xl p-4 hover:border-primary/40 transition-colors group">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {ticker && <span className="text-xs font-mono font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded">{ticker}</span>}
          <span className="text-xs text-muted">{source}</span>
        </div>
        <span className="text-xs text-muted">{fmt.relTime(publishedAt)}</span>
      </div>
      <h3 className="text-sm font-semibold text-txt leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">{title}</h3>
      {description && <p className="text-xs text-muted line-clamp-2 mb-3 leading-relaxed">{description}</p>}
      <div className="flex items-center justify-between">
        <SentimentBadge label={sentiment_label} score={sentiment_score} />
        <a href={url} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-primary transition-colors">
          Read <ExternalLink size={11} />
        </a>
      </div>
    </div>
  )
}
