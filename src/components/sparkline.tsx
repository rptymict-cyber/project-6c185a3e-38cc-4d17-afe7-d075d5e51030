import { Area, AreaChart, ResponsiveContainer } from "recharts";

export function Sparkline({ data, up = true }: { data: number[]; up?: boolean }) {
  const points = data.map((v, i) => ({ i, v }));
  const color = up ? "#3A8A3A" : "#E03131";
  const gid = `spark-${up ? "u" : "d"}-${data.length}-${data[data.length - 1] ?? 0}`;
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 2, left: 0 }}>
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.25} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gid})`}
            dot={(props) => {
              const { cx, cy, index } = props as { cx: number; cy: number; index: number };
              if (index === points.length - 1) {
                return (
                  <circle
                    key={`sp-${index}`}
                    cx={cx}
                    cy={cy}
                    r={2.5}
                    fill={color}
                    stroke="#fff"
                    strokeWidth={1}
                  />
                );
              }
              return <circle key={`sp-${index}`} cx={cx} cy={cy} r={0} fill="none" />;
            }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
