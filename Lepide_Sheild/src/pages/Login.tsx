import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import LepideLogo from '../components/LepideLogo'
import ShieldIcon from '../components/ShieldIcon'
import AuthBackground from '../components/AuthBackground'
import AuthShowcase from '../components/AuthShowcase'
import Footer from '../components/Footer'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export default function Login() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [errorKey, setErrorKey] = useState(0)
  const [loading, setLoading] = useState(false)

  const isEmailValid = EMAIL_PATTERN.test(email)

  // Bumping errorKey remounts the alert so the shake animation replays even on a repeated message
  function showError(message: string) {
    setError(message)
    setErrorKey((key) => key + 1)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      showError('Please fill in both fields.')
      return
    }

    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    setLoading(false)

    if (signInError) {
      showError(signInError.message)
      return
    }

    navigate('/landing')
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-8 overflow-hidden bg-page px-4 py-10">
      <AuthBackground />

      <div className="relative z-10 grid w-full max-w-5xl items-center gap-10 lg:grid-cols-2">
        <AuthShowcase />

        <div className="flex flex-col items-center gap-8">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4 lg:hidden"
          >
            <LepideLogo />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-2xl font-semibold text-ink">Sign in to Lepide</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
            className="shield-card w-full max-w-sm rounded-card border border-transparent bg-surface p-8 shadow-card"
          >
        <form className="flex flex-col gap-5" onSubmit={handleSubmit} noValidate>
          <AnimatePresence mode="wait">
            {error && (
              <motion.p
                key={errorKey}
                role="alert"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, x: shouldReduceMotion ? 0 : [0, -8, 8, -6, 6, 0] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-field bg-danger-bg px-4 py-2 text-sm text-danger"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

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
              <AnimatePresence>
                {isEmailValid && (
                  <motion.span
                    key="email-valid"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <ShieldIcon className="h-5 w-5 text-success" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
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

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { scale: 1.02 }}
            whileTap={loading ? undefined : { scale: 0.97 }}
            className="flex items-center justify-center gap-2 rounded-field bg-brand px-4 py-2 font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-50"
          >
            <motion.span
              animate={
                shouldReduceMotion
                  ? undefined
                  : loading
                    ? { scale: [1, 1.2, 1], rotate: [0, -8, 8, 0] }
                    : { scale: [1, 1.1, 1] }
              }
              transition={{ duration: loading ? 0.9 : 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ShieldIcon className="h-5 w-5" />
            </motion.span>
            {loading ? 'Signing in…' : 'Sign in'}
          </motion.button>
        </form>
          </motion.div>

          <p className="text-sm text-ink-muted">
            No account?{' '}
            <Link to="/register" className="font-medium text-brand">
              Create one
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
