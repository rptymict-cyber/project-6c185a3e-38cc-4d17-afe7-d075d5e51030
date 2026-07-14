export function WeatherIllustration({
  size = 110,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      aria-hidden="true"
    >
      {/* Sun */}
      <g transform="translate(78 26)">
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
      {/* Back cloud */}
      <ellipse cx="46" cy="52" rx="26" ry="16" fill="#DCE9F5" opacity="0.85" />
      {/* Main cloud */}
      <g>
        <ellipse cx="70" cy="66" rx="30" ry="20" fill="#FFFFFF" />
        <ellipse cx="46" cy="70" rx="22" ry="18" fill="#FFFFFF" />
        <ellipse cx="86" cy="72" rx="18" ry="14" fill="#F1F5FB" />
        <rect x="30" y="70" width="70" height="16" rx="8" fill="#FFFFFF" />
      </g>
      {/* Rain */}
      {[
        [46, 92],
        [58, 98],
        [70, 92],
        [82, 98],
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
