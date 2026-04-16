import { useState } from 'react'
import { Link } from 'react-router-dom'
import { BarChart2, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [err, setErr] = useState('')
  const { register, registerLoading, registerError } = useAuth()

  const submit = (e) => {
    e.preventDefault()
    setErr('')
    if (form.username.length < 3) return setErr('Username must be at least 3 characters')
    if (form.password.length < 6) return setErr('Password must be at least 6 characters')
    if (form.password !== form.confirm) return setErr('Passwords do not match')
    register({ username: form.username, email: form.email, password: form.password })
  }

  const error = err || registerError

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at 50% 0%, #0f1629 0%, #0d0f14 60%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center mx-auto mb-4">
            <BarChart2 size={22} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-txt">Create account</h1>
          <p className="text-muted text-sm mt-1">Local account - your data stays on your machine</p>
        </div>

        <div className="rounded-2xl border border-border p-8" style={{ background: 'rgba(22,27,38,0.9)' }}>
          <form onSubmit={submit} className="space-y-4">
            {[
              { key: 'username', label: 'Username', type: 'text', ph: 'dhruvil_patel' },
              { key: 'email', label: 'Email', type: 'email', ph: 'you@example.com' },
            ].map(({ key, label, type, ph }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-txt mb-1.5">{label}</label>
                <input type={type} required value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-txt placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                  placeholder={ph} />
              </div>
            ))}
            {['password', 'confirm'].map((key) => (
              <div key={key}>
                <label className="block text-sm font-medium text-txt mb-1.5">{key === 'password' ? 'Password' : 'Confirm Password'}</label>
                <div className="relative">
                  <input type={show ? 'text' : 'password'} required value={form[key]}
                    onChange={e => setForm({...form, [key]: e.target.value})}
                    className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 pr-10 text-sm text-txt placeholder:text-muted focus:outline-none focus:border-primary transition-colors"
                    placeholder="........" />
                  {key === 'password' && (
                    <button type="button" onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-txt">
                      {show ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {error && <p className="text-bear text-sm bg-bear/10 border border-bear/20 rounded-lg px-3 py-2">{error}</p>}
            <button type="submit" disabled={registerLoading}
              className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-60 rounded-lg font-semibold text-white text-sm transition-all flex items-center justify-center gap-2 mt-2">
              {registerLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating...</> : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-muted mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
