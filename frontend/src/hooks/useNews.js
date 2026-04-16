import { useQuery } from '@tanstack/react-query'
import { newsAPI } from '../api/client'

export const useTickerNews = (ticker, sentiment) =>
  useQuery({ queryKey: ['news', ticker, sentiment], queryFn: () => newsAPI.forTicker(ticker, sentiment), enabled: !!ticker })

export const useAllNews = (sentiment) =>
  useQuery({ queryKey: ['news-all', sentiment], queryFn: () => newsAPI.allFeed(sentiment) })
