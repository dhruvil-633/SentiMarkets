export const fmt = {
  price: (v) => v == null ? '--' : `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  pct: (v) => v == null ? '--' : `${v >= 0 ? '+' : ''}${Number(v).toFixed(2)}%`,
  vol: (v) => { if (!v) return '--'; if (v >= 1e9) return `${(v/1e9).toFixed(1)}B`; if (v >= 1e6) return `${(v/1e6).toFixed(1)}M`; return `${(v/1e3).toFixed(0)}K` },
  score: (v) => v == null ? '0.00' : (v >= 0 ? '+' : '') + Number(v).toFixed(3),
  date: (s) => new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
  relTime: (s) => {
    const diff = (Date.now() - new Date(s)) / 1000
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`
    return `${Math.floor(diff/86400)}d ago`
  },
  bull: (pct) => `${Number(pct).toFixed(1)}%`,
}
