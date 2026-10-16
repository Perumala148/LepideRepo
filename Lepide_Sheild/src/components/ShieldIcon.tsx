interface ShieldIconProps {
  className?: string
}

// Shield-check brand motif reused across auth pages for the "Lepide Shield" feel
export default function ShieldIcon({ className = '' }: ShieldIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75l2.25 2.25L15 9.75M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a16.95 16.95 0 0 1-6.598 13.388c-.001.001-.003.002-.005.004A17 17 0 0 1 12 21.818a17 17 0 0 1-2.398-1.608l-.005-.004A16.95 16.95 0 0 1 2.997 6.818V5.774c0-.54.384-1.007.917-1.096A48.32 48.32 0 0 1 12 3Z"
      />
    </svg>
  )
}
