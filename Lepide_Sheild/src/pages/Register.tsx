import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import LepideLogo from '../components/LepideLogo'
import ShieldIcon from '../components/ShieldIcon'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export default function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [errorKey, setErrorKey] = useState(0)
  const [notice, setNotice] = useState('')
  const [loading, setLoading] = useState(false)

  const isEmailValid = EMAIL_PATTERN.test(email)
  const isPasswordValid = password.length >= 6
  const passwordsMatch = confirmPassword.length > 0 && confirmPassword === password
  const passwordsMismatch = confirmPassword.length > 0 && confirmPassword !== password

  // Bumping errorKey remounts the alert so the shake animation replays even on a repeated message
  function showError(message: string) {
    setNotice('')
    setError(message)
    setErrorKey((key) => key + 1)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!fullName || !email || !password || !confirmPassword) {
      showError('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      showError('Passwords do not match.')
      return
    }

    setError('')
    setNotice('')
    setLoading(true)

    // The `profiles` row is created server-side by a DB trigger on auth.users
    // (see README), so no client insert is needed and RLS never blocks it.
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    setLoading(false)

    if (signUpError) {
      showError(
        signUpError.message.toLowerCase().includes('rate limit')
          ? 'Too many sign-up emails sent recently. Please wait a while and try again, or ask an admin to disable "Confirm email" for testing.'
          : signUpError.message,
      )
      return
    }

    if (data.session) {
      navigate('/landing')
      return
    }

    setNotice('Account created! Check your email to confirm it, then sign in.')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-page px-4">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl" />
        <ShieldIcon className="animate-shield-float absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 text-brand/5" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        <LepideLogo />
        <h1 className="text-2xl font-semibold text-ink">Create your Lepide account</h1>
      </div>

      <div className="shield-card relative z-10 w-full max-w-sm rounded-card border border-transparent bg-surface p-8 shadow-card">
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          {error && (
            <p
              key={errorKey}
              role="alert"
              className="animate-shake rounded-field bg-danger-bg px-4 py-2 text-sm text-danger"
            >
              {error}
            </p>
          )}

          {notice && (
            <p
              role="status"
              className="animate-pop-in rounded-field bg-success-bg px-4 py-2 text-sm text-success"
            >
              {notice}
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
            <div className="relative">
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-field border border-border px-4 py-2 pr-10 text-ink outline-none focus:border-brand"
                aria-describedby="email-helper"
              />
              {isEmailValid && (
                <ShieldIcon className="animate-pop-in pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />
              )}
            </div>
            <span id="email-helper" className="text-xs text-ink-muted">
              Use your work email
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-field border border-border px-4 py-2 pr-10 text-ink outline-none focus:border-brand"
              />
              {isPasswordValid && (
                <ShieldIcon className="animate-pop-in pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={passwordsMismatch}
                className={`w-full rounded-field border px-4 py-2 pr-10 text-ink outline-none focus:border-brand ${
                  passwordsMismatch ? 'border-danger' : 'border-border'
                }`}
              />
              {passwordsMatch && (
                <ShieldIcon className="animate-pop-in pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-success" />
              )}
              {passwordsMismatch && (
                <ShieldIcon className="animate-shake pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-danger" />
              )}
            </div>
            {passwordsMismatch && <span className="text-xs text-danger">Passwords do not match</span>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-field bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            <ShieldIcon className={`h-5 w-5 ${loading ? 'animate-shield-scan' : 'animate-shield-pulse'}`} />
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>

      <p className="relative z-10 text-sm text-ink-muted">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-brand">
          Sign in
        </Link>
      </p>
    </main>
  )
}
