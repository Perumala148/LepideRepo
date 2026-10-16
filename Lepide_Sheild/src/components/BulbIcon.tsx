interface BulbIconProps {
  className?: string
}

// Simple light-bulb glyph built from basic primitives (safe to render, no complex path data)
export default function BulbIcon({ className = '' }: BulbIconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="10" r="6" stroke="currentColor" strokeWidth={1.5} fill="currentColor" fillOpacity={0.15} />
      <path d="M12 4V3" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M9.5 17.5h5" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
      <path d="M10 20h4" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  )
}
