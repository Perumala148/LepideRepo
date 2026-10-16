import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import LepideLogo from '../components/LepideLogo'

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!fullName || !email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setError('')
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError) {
      setLoading(false)
      setError(signUpError.message)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({ id: data.user.id, full_name: fullName, email })

      if (profileError) {
        setLoading(false)
        setError(profileError.message)
        return
      }
    }

    setLoading(false)

    if (data.session) {
      navigate('/landing')
    } else {
      navigate('/login')
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-page px-4">
      <div className="flex flex-col items-center gap-4">
        <LepideLogo />
        <h1 className="text-2xl font-semibold text-ink">Create your Lepide account</h1>
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
            <label htmlFor="fullName" className="text-sm font-medium text-ink">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-field border border-border px-4 py-2 text-ink outline-none focus:border-brand"
            />
          </div>

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
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-field border border-border px-4 py-2 text-ink outline-none focus:border-brand"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="rounded-field bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand">
          Sign in
        </Link>
      </p>
    </main>
  )
}
