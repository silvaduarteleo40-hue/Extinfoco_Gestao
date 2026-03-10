/**
 * EXTINFOCO logo: a fire extinguisher with the letter "E" on the body.
 */
export default function LogoExtinfoco({ size = 40, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="EXTINFOCO logo"
    >
      {/* Cylinder body */}
      <rect x="18" y="22" width="28" height="34" rx="6" fill="#DC2626" />

      {/* Highlight on body */}
      <rect x="22" y="26" width="6" height="26" rx="3" fill="#EF4444" opacity="0.5" />

      {/* Top cap */}
      <rect x="22" y="16" width="20" height="8" rx="3" fill="#B91C1C" />

      {/* Nozzle pipe */}
      <rect x="38" y="10" width="4" height="12" rx="2" fill="#9CA3AF" />

      {/* Nozzle tip */}
      <ellipse cx="40" cy="10" rx="4" ry="2.5" fill="#6B7280" />

      {/* Handle */}
      <rect x="10" y="18" width="10" height="4" rx="2" fill="#9CA3AF" />
      <rect x="10" y="18" width="4" height="12" rx="2" fill="#9CA3AF" />

      {/* Letter E on body */}
      <text
        x="32"
        y="44"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="white"
        fontSize="16"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
      >
        E
      </text>
    </svg>
  )
}
