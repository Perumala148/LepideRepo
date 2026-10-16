import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import LepideLogo from '../components/LepideLogo'
import ShieldIcon from '../components/ShieldIcon'
import EyeIcon from '../components/EyeIcon'
import AuthBackground from '../components/AuthBackground'
import AuthShowcase from '../components/AuthShowcase'
import Footer from '../components/Footer'

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/

export default function Register() {
  const navigate = useNavigate()
  const shouldReduceMotion = useReducedMotion()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
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
            <h1 className="text-2xl font-semibold text-ink">Create your Lepide account</h1>
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

          <AnimatePresence>
            {notice && (
              <motion.p
                role="status"
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-field bg-success-bg px-4 py-2 text-sm text-success"
              >
                {notice}
              </motion.p>
            )}
          </AnimatePresence>

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
            <label htmlFor="password" className="text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-field border border-border px-4 py-2 pr-16 text-ink outline-none focus:border-brand"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-brand"
              >
                <EyeIcon open={showPassword} className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {isPasswordValid && (
                  <motion.span
                    key="password-valid"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    <ShieldIcon className="h-5 w-5 text-success" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirmPassword" className="text-sm font-medium text-ink">
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-invalid={passwordsMismatch}
                className={`w-full rounded-field border px-4 py-2 pr-16 text-ink outline-none focus:border-brand ${
                  passwordsMismatch ? 'border-danger' : 'border-border'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-brand"
              >
                <EyeIcon open={showConfirmPassword} className="h-5 w-5" />
              </button>
              <AnimatePresence>
                {passwordsMatch && (
                  <motion.span
                    key="confirm-match"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    <ShieldIcon className="h-5 w-5 text-success" />
                  </motion.span>
                )}
                {passwordsMismatch && (
                  <motion.span
                    key="confirm-mismatch"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, x: shouldReduceMotion ? 0 : [0, -6, 6, -4, 4, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2"
                  >
                    <ShieldIcon className="h-5 w-5 text-danger" />
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            {passwordsMismatch && <span className="text-xs text-danger">Passwords do not match</span>}
          </div>

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
            {loading ? 'Creating account…' : 'Create account'}
          </motion.button>
        </form>
          </motion.div>

          <p className="text-sm text-ink-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand">
              Sign in
            </Link>
          </p>
        </div>
      </div>

      <Footer />
    </main>
  )
}
