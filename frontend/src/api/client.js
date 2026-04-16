import axios from 'axios'
import { useStore } from '../store/useStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

api.interceptors.request.use((config) => {
  const token = useStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      useStore.getState().clearAuth()
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: (data) => api.post('/auth/register', data).then(r => r.data),
  login: (data) => api.post('/auth/login', data).then(r => r.data),
  logout: () => api.post('/auth/logout').then(r => r.data),
  me: () => api.get('/auth/me').then(r => r.data),
}

export const stockAPI = {
  list: () => api.get('/stock/list').then(r => r.data),
  search: (q) => api.get(`/stock/search?q=${q}`).then(r => r.data),
  ohlc: (ticker) => api.get(`/stock/${ticker}/ohlc`).then(r => r.data),
  indicators: (ticker) => api.get(`/stock/${ticker}/indicators`).then(r => r.data),
  meta: (ticker) => api.get(`/stock/${ticker}/meta`).then(r => r.data),
}

export const newsAPI = {
  forTicker: (ticker, sentiment) =>
    api.get(`/news/${ticker}${sentiment ? `?sentiment=${sentiment}` : ''}`).then(r => r.data),
  allFeed: (sentiment) =>
    api.get(`/news/all/feed${sentiment ? `?sentiment=${sentiment}` : ''}`).then(r => r.data),
}

export const sentimentAPI = {
  forTicker: (ticker) => api.get(`/sentiment/${ticker}`).then(r => r.data),
  overview: () => api.get('/sentiment/all/overview').then(r => r.data),
}

export const watchlistAPI = {
  get: () => api.get('/watchlist/enriched').then(r => r.data),
  add: (ticker) => api.post('/watchlist', { ticker }).then(r => r.data),
  remove: (ticker) => api.delete(`/watchlist/${ticker}`).then(r => r.data),
}

export default api
