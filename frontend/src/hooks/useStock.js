import { useQuery } from '@tanstack/react-query'
import { stockAPI } from '../api/client'

export const useStockList = () => useQuery({ queryKey: ['stock-list'], queryFn: stockAPI.list })
export const useStockOHLC = (t) => useQuery({ queryKey: ['ohlc', t], queryFn: () => stockAPI.ohlc(t), enabled: !!t })
export const useIndicators = (t) => useQuery({ queryKey: ['indicators', t], queryFn: () => stockAPI.indicators(t), enabled: !!t })
export const useStockMeta = (t) => useQuery({ queryKey: ['meta', t], queryFn: () => stockAPI.meta(t), enabled: !!t })
export const useStockSearch = (q) => useQuery({ queryKey: ['search', q], queryFn: () => stockAPI.search(q), enabled: !!q && q.length >= 1, staleTime: 30000 })
