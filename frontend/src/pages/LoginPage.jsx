import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [show, setShow] = useState(false)
  const { login, loginLoading, loginError } = useAuth()

  const submit = (e) => {
    e.preventDefault()
    login(form)
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0f1629 0%, #0d0f14 60%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <BarChart2 size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-txt">Welcome back</h1>
          <p className="text-muted text-sm mt-1">Sign in to your SentiMarket account</p>
        </div>

        <div className="rounded-2xl border border-border p-8" style={{ background: 'rgba(22,27,38,0.9)' }}>
          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-txt mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-txt placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                placeholder="you@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-txt mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-txt placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder="........" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-txt">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            {loginError && <p className="text-bear text-sm bg-bear/10 border border-bear/20 rounded-lg px-3 py-2">{loginError}</p>}
            <button type="submit" disabled={loginLoading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 rounded-lg font-semibold text-white text-sm transition-all flex items-center justify-center gap-2">
              {loginLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</> : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </div>
  )
}
