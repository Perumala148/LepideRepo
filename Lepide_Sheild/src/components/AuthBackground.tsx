import { motion, useReducedMotion } from 'framer-motion'
import ShieldIcon from './ShieldIcon'

// Decorative, non-interactive backdrop shared by the auth pages: a subtle dotted
// security-mesh pattern, two drifting color blobs, and a large faint shield watermark.
export default function AuthBackground() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="auth-bg-pattern absolute inset-0" />

      <motion.div
        className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, 30, -20, 0], y: [0, -20, 20, 0], scale: [1, 1.1, 0.95, 1] }
        }
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-brand/20 blur-3xl"
        animate={
          shouldReduceMotion
            ? undefined
            : { x: [0, -25, 20, 0], y: [0, 20, -15, 0], scale: [1, 0.95, 1.1, 1] }
        }
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[32rem] -translate-x-1/2 -translate-y-1/2 text-brand/5"
        animate={shouldReduceMotion ? undefined : { rotate: [-3, 3, -3], scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ShieldIcon className="h-full w-full" />
      </motion.div>
    </div>
  )
}
