import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BarChart2, TrendingUp, Brain, Newspaper, Star, Lock, Zap, ChevronRight } from 'lucide-react'

const FEATURES = [
  { icon: BarChart2,  title: 'Candlestick Charts',      desc: 'Professional OHLCV charts with TradingView-grade rendering and smooth interactions.' },
  { icon: Brain,      title: 'FinBERT Sentiment',        desc: 'AI-powered financial sentiment analysis - bullish, bearish, or neutral on every headline.' },
  { icon: TrendingUp, title: 'Technical Indicators',     desc: 'SMA, EMA, RSI, Bollinger Bands overlaid directly on your price chart.' },
  { icon: Star,       title: 'Watchlist Management',     desc: 'Track your favourite tickers with live price and sentiment updates at a glance.' },
  { icon: Newspaper,  title: 'News Aggregation',         desc: 'Curated financial news per ticker with AI-scored sentiment labels and source attribution.' },
  { icon: Lock,       title: 'Local-First Privacy',      desc: 'Your data never leaves your machine. SQLite on disk. No cloud. No tracking.' },
]

const STEPS = [
  { n: '01', title: 'Create an Account', desc: 'Register locally in seconds - username, email, password. All stored on your machine.' },
  { n: '02', title: 'Search Any Ticker', desc: 'Type AAPL, NVDA, TSLA - instantly pull up charts, indicators, and news.' },
  { n: '03', title: 'Analyse & Decide',  desc: 'Layer indicators, read sentiment scores, and build your watchlist.' },
]

const fade = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function LandingPage() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-bg text-txt font-sans overflow-x-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% -10%, #0f1629 0%, #0d0f14 60%)' }}>

      <nav className="fixed top-0 w-full z-50 border-b border-white/[0.06]"
        style={{ background: 'rgba(13,15,20,0.8)', backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <BarChart2 size={16} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">SentiMarket</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="px-4 py-2 text-sm text-muted hover:text-txt transition-colors">Sign In</button>
            <button onClick={() => navigate('/register')}
              className="px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium text-white transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="pt-40 pb-28 px-6 text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20 mb-6">
            <Zap size={11} /> AI-Powered - Local-First - Instant
          </span>
          <h1 className="text-5xl md:text-6xl font-bold text-txt leading-tight mb-6 max-w-3xl mx-auto">
            Trade Smarter with<br />
            <span className="text-primary">AI Market Intelligence</span>
          </h1>
          <p className="text-lg text-muted max-w-xl mx-auto mb-10 leading-relaxed">
            Candlestick charts, FinBERT sentiment analysis, technical indicators, and curated news -
            all running locally on your machine. No cloud. No latency. Just signal.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => navigate('/register')}
              className="px-7 py-3.5 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-all flex items-center gap-2 glow-blue">
              Get Started Free <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('/login')}
              className="px-7 py-3.5 rounded-xl font-medium text-muted hover:text-txt border border-border hover:border-primary/40 transition-all">
              Sign In
            </button>
          </div>
        </motion.div>

        <motion.div variants={fade} initial="hidden" animate="show" transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 max-w-3xl mx-auto rounded-2xl border border-border overflow-hidden glow-blue">
          <div className="bg-surface px-4 py-3 border-b border-border flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-bear/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-bull/60" />
            <span className="ml-3 text-xs text-muted font-mono">SentiMarket - Stock Analysis</span>
          </div>
          <div className="bg-[#161b26] p-6">
            <div className="flex items-end gap-1 h-28 mb-3">
              {[40,55,45,70,60,80,65,90,75,85,70,95,80,88,72,78,92,85,70,88,95,100].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all"
                  style={{ height: `${h}%`, background: i % 3 === 0 ? '#ef4444' : '#22c55e', opacity: 0.7 }} />
              ))}
            </div>
            <div className="flex items-center gap-6">
              <div><div className="text-xs text-muted">AAPL</div><div className="font-mono font-bold text-txt">$191.78</div></div>
              <div><div className="text-xs text-muted">Change</div><div className="font-mono text-bull">+1.19%</div></div>
              <div><div className="text-xs text-muted">Sentiment</div><div className="font-mono text-yellow-400">Neutral</div></div>
              <div><div className="text-xs text-muted">RSI</div><div className="font-mono text-primary">54.2</div></div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-txt mb-3">Everything You Need to Analyse Markets</h2>
            <p className="text-muted">Professional-grade tools, accessible from anywhere.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} variants={fade} initial="hidden" whileInView="show"
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="p-6 rounded-2xl border border-white/[0.06] hover:border-primary/30 transition-colors"
                style={{ background: 'rgba(255,255,255,0.025)' }}>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-primary" />
                </div>
                <h3 className="font-semibold text-txt mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-txt mb-3">Up and Running in 3 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ n, title, desc }) => (
              <div key={n} className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
                  <span className="font-mono text-primary font-bold text-sm">{n}</span>
                </div>
                <h3 className="font-semibold text-txt mb-2">{title}</h3>
                <p className="text-sm text-muted leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center p-12 rounded-3xl border border-primary/20 glow-blue"
          style={{ background: 'rgba(59,130,246,0.04)' }}>
          <h2 className="text-3xl font-bold text-txt mb-4">Ready to Start?</h2>
          <p className="text-muted mb-8">Create a local account and start analysing markets in under a minute.</p>
          <button onClick={() => navigate('/register')}
            className="px-8 py-4 bg-primary hover:bg-primary/90 rounded-xl font-semibold text-white transition-all text-lg">
            Create Free Account
          </button>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-6 text-center">
        <p className="text-sm text-muted">
          Built by <span className="text-txt font-medium">Dhruvil Patel</span> &amp; <span className="text-txt font-medium">Rajvee Padmani</span>
          {' '}· Adani University · 2025
        </p>
      </footer>
    </div>
  )
}
