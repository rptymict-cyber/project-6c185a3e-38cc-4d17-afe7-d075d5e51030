export function WeatherIllustration({
  size = 110,
  className,
  variant = "cloudy",
}: {
  size?: number;
  className?: string;
  variant?: "cloudy" | "sunny-cloud";
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      {variant === "sunny-cloud" ? (
        <g transform="translate(80 28)">
          <circle cx="0" cy="0" r="12" fill="#FFD24D" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <rect
              key={deg}
              x="-1.5"
              y="-20"
              width="3"
              height="6"
              rx="1.5"
              fill="#FFB020"
              transform={`rotate(${deg})`}
            />
          ))}
        </g>
      ) : null}

      {/* Back darker cloud */}
      <ellipse cx="46" cy="48" rx="30" ry="18" fill="#B9C7D6" opacity="0.9" />
      <ellipse cx="72" cy="44" rx="22" ry="14" fill="#A9B8CA" opacity="0.85" />

      {/* Main cloud */}
      <g>
        <ellipse cx="72" cy="66" rx="32" ry="20" fill="#FFFFFF" />
        <ellipse cx="44" cy="70" rx="24" ry="19" fill="#FFFFFF" />
        <ellipse cx="90" cy="74" rx="18" ry="14" fill="#EEF2F8" />
        <rect x="28" y="70" width="76" height="18" rx="9" fill="#FFFFFF" />
      </g>

      {/* Light rain drops */}
      {[
        [50, 96],
        [66, 100],
        [82, 96],
      ].map(([x, y], i) => (
        <path
          key={i}
          d={`M ${x} ${y} q -2 4 0 8 q 2 -4 0 -8 z`}
          fill="#7FB8E8"
        />
      ))}
    </svg>
  );
}
