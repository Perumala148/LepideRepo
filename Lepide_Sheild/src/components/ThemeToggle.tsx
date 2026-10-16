import { motion } from 'framer-motion'
import BulbIcon from './BulbIcon'
import { useTheme } from '../hooks/useTheme'

// Fixed top-right light/dark switch, rendered once in App so it's available on every page
export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={!isLight}
      whileTap={{ scale: 0.9 }}
      animate={{ rotate: isLight ? 0 : -15 }}
      transition={{ duration: 0.3 }}
      className={`fixed right-4 top-4 z-50 flex h-11 w-11 items-center justify-center rounded-full border transition-colors duration-300 ${
        isLight
          ? 'border-amber-300 bg-amber-100 text-amber-500 shadow-[0_0_16px_2px_rgba(251,191,36,0.55)]'
          : 'border-border bg-surface text-ink-muted shadow-card'
      }`}
    >
      <BulbIcon className="h-6 w-6" />
    </motion.button>
  )
}
