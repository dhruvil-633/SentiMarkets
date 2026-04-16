import { useQuery } from '@tanstack/react-query'
import { sentimentAPI } from '../api/client'

export const useTickerSentiment = (ticker) =>
  useQuery({ queryKey: ['sentiment', ticker], queryFn: () => sentimentAPI.forTicker(ticker), enabled: !!ticker })

export const useSentimentOverview = () =>
  useQuery({ queryKey: ['sentiment-overview'], queryFn: sentimentAPI.overview })
