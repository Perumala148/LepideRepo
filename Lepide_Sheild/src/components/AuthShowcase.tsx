import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import LepideLogo from './LepideLogo'
import ShieldIcon from './ShieldIcon'

const STEPS = [
  {
    title: 'Create your account',
    description: 'Sign up with your work email and set a password in seconds — no setup wizard required.',
  },
  {
    title: 'Verify & sign in',
    description: 'Confirm your email once, then sign in securely from anywhere, anytime.',
  },
  {
    title: 'Stay protected',
    description: 'Monitor data risk across your organization from one shielded dashboard.',
  },
]

const STEP_INTERVAL_MS = 3200

const PARTICLES = [
  { top: '10%', left: '78%', size: 'h-10 w-10', duration: 6, delay: 0 },
  { top: '68%', left: '86%', size: 'h-8 w-8', duration: 7, delay: 0.6 },
  { top: '80%', left: '18%', size: 'h-7 w-7', duration: 8, delay: 1.1 },
  { top: '18%', left: '8%', size: 'h-9 w-9', duration: 6.5, delay: 1.6 },
]

// Extraordinary animated side panel shown alongside the auth forms: explains the
// sign-up → verify → protect journey with an auto-advancing step list.
export default function AuthShowcase() {
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setActiveStep((step) => (step + 1) % STEPS.length)
    }, STEP_INTERVAL_MS)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative hidden overflow-hidden rounded-card bg-gradient-to-br from-brand via-brand to-brand-accent p-10 text-white shadow-card lg:flex lg:min-h-[32rem] lg:flex-col lg:justify-between">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="auth-bg-pattern absolute inset-0 opacity-20" />

        <motion.div
          className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-white/10 blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />

        {PARTICLES.map((particle, index) => (
          <motion.div
            key={index}
            className={`absolute text-white/20 ${particle.size}`}
            style={{ top: particle.top, left: particle.left }}
            animate={{ y: [0, -16, 0], rotate: [0, 6, 0] }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: particle.delay,
            }}
          >
            <ShieldIcon className="h-full w-full" />
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col gap-10">
        <LepideLogo textClassName="text-white" />

        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-semibold leading-tight">
            Enterprise-grade data security, simplified.
          </h2>
          <p className="text-white/80">
            Lepide Shield gives your team one secure place to sign in, manage access, and keep
            watch over what matters most.
          </p>
        </div>

        <ol className="flex flex-col gap-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="flex items-start gap-4">
              <motion.div
                animate={{
                  scale: activeStep === index ? 1.15 : 1,
                  backgroundColor:
                    activeStep === index ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.1)',
                }}
                transition={{ duration: 0.4 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
              >
                {index + 1}
              </motion.div>
              <div>
                <p className="font-medium">{step.title}</p>
                <p className="text-sm text-white/70">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="relative z-10 flex gap-2">
        {STEPS.map((step, index) => (
          <span
            key={step.title}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              activeStep === index ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
            }`}
          />
        ))}
      </div>
    </section>
  )
}
