interface LepideLogoProps {
  className?: string
}

// Brand mark hotlinked from the Lepidus design system, per design.md asset reference
export default function LepideLogo({ className = '' }: LepideLogoProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <img
        src="https://lepide-design-system.vercel.app/v1/brand/lepide-mark.svg"
        alt="Lepide"
        width={36}
        height={36}
      />
      <span className="text-xl font-semibold text-brand">Lepide</span>
    </div>
  )
}
