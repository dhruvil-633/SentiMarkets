import { NavLink } from 'react-router-dom'
import { LayoutDashboard, TrendingUp, Newspaper, Star, LogOut, BarChart2 } from 'lucide-react'
import { useStore } from '../../store/useStore'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/app/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/app/stock/AAPL', icon: TrendingUp, label: 'Stock Analysis' },
  { to: '/app/news', icon: Newspaper, label: 'News Feed' },
  { to: '/app/watchlist', icon: Star, label: 'Watchlist' },
]

export default function Sidebar() {
  const { user } = useStore()
  const { logout } = useAuth()

  return (
    <aside className="w-60 min-h-screen bg-surface border-r border-border flex flex-col fixed left-0 top-0 z-30">
      <div className="px-5 py-5 border-b border-border flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <BarChart2 size={16} className="text-white" />
        </div>
        <span className="font-bold text-txt text-lg tracking-tight">SentiMarket</span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/15 text-primary border-l-2 border-primary pl-[10px]'
                  : 'text-muted hover:text-txt hover:bg-white/5'
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <div className="text-sm font-medium text-txt truncate">{user?.username}</div>
            <div className="text-xs text-muted truncate">{user?.email}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted hover:text-bear hover:bg-bear/10 transition-all"
        >
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </aside>
  )
}
