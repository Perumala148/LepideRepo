import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="relative z-10 text-center text-xs text-ink-disabled"
    >
      © {new Date().getFullYear()} Lepide. All rights reserved.
    </motion.footer>
  )
}
