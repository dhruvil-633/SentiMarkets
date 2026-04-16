import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (user, token) => set({ user, accessToken: token }),
      clearAuth: () => set({ user: null, accessToken: null }),
      activeTicker: 'AAPL',
      setActiveTicker: (ticker) => set({ activeTicker: ticker }),
    }),
    {
      name: 'sentimarket-store',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      })
    }
  )
)
