import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import LepideLogo from '../components/LepideLogo'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      setError('Please fill in both fields.')
      return
    }

    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      setError(signInError.message)
      return
    }

    navigate('/landing')
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-page px-4">
      <div className="flex flex-col items-center gap-4">
        <LepideLogo />
        <h1 className="text-2xl font-semibold text-ink">Sign in to Lepide</h1>
      </div>

      <div className="w-full max-w-sm rounded-card bg-surface p-8 shadow-card">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {error && (
            <p
              role="alert"
              className="rounded-field bg-danger-bg px-4 py-2 text-sm text-danger"
            >
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-field border border-border px-4 py-2 text-ink outline-none focus:border-brand"
              aria-describedby="email-helper"
            />
            <span id="email-helper" className="text-xs text-ink-muted">
              Use your work email
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-sm font-medium text-ink">
                Password
              </label>
              <span className="text-sm text-brand">Forgot password?</span>
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-field border border-border px-4 py-2 text-ink outline-none focus:border-brand"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-muted">
            <input type="checkbox" className="h-4 w-4 accent-[var(--color-brand)]" />
            Remember me
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-field bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="text-sm text-ink-muted">
        No account?{' '}
        <Link to="/register" className="font-medium text-brand">
          Create one
        </Link>
      </p>
    </main>
  )
}
