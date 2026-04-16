import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { watchlistAPI } from '../api/client'
import { useStore } from '../store/useStore'

export function useWatchlist() {
  const qc = useQueryClient()
  const user = useStore(s => s.user)

  const { data, isLoading } = useQuery({
    queryKey: ['watchlist'],
    queryFn: watchlistAPI.get,
    enabled: !!user,
  })

  const addMutation = useMutation({
    mutationFn: watchlistAPI.add,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] })
  })

  const removeMutation = useMutation({
    mutationFn: watchlistAPI.remove,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] })
  })

  return {
    watchlist: data?.watchlist ?? [],
    isLoading,
    addTicker: (ticker) => addMutation.mutate(ticker),
    removeTicker: (ticker) => removeMutation.mutate(ticker),
    addError: addMutation.error?.response?.data?.detail,
    addLoading: addMutation.isPending,
  }
}
