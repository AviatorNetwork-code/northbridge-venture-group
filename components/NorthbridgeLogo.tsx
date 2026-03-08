interface NorthbridgeLogoProps {
  className?: string;
}

export default function NorthbridgeLogo({ className = "" }: NorthbridgeLogoProps) {
  return (
    <svg
      viewBox="0 0 195 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`block h-auto w-auto shrink-0 ${className}`}
      role="img"
      aria-label="Northbridge Venture Group"
    >
      {/* Symbol: ascending bars with bridge arc */}
      <g transform="translate(0, 4)">
        <rect x="0" y="22" width="4" height="12" rx="0.8" fill="#B11226" />
        <rect x="8" y="12" width="4" height="22" rx="0.8" fill="#B11226" />
        <rect x="16" y="0" width="4" height="34" rx="0.8" fill="#B11226" />
        <path
          d="M2 22 Q10 0 20 2"
          stroke="#B11226"
          strokeWidth="1.2"
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Wordmark */}
      <g transform="translate(32, 0)">
        <text
          x="0"
          y="18"
          fill="white"
          fontFamily="system-ui, -apple-system, Inter, sans-serif"
          fontSize="12"
          fontWeight="600"
          letterSpacing="0.1em"
        >
          NORTHBRIDGE
        </text>
        <text
          x="0"
          y="32"
          fill="#B11226"
          fontFamily="system-ui, -apple-system, Inter, sans-serif"
          fontSize="7.5"
          fontWeight="600"
          letterSpacing="0.16em"
        >
          VENTURE GROUP
        </text>
      </g>
    </svg>
  );
}
