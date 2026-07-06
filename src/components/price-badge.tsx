import { cn } from "@/lib/utils";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";

export function PriceBadge({
  changePct,
  size = "sm",
}: {
  changePct: number;
  size?: "sm" | "md";
}) {
  const flat = Math.abs(changePct) < 0.05;
  const up = changePct > 0;
  const cls = flat
    ? "bg-secondary text-price-flat"
    : up
      ? "bg-price-up-bg text-price-up"
      : "bg-price-down-bg text-price-down";
  const Icon = flat ? Minus : up ? ArrowUp : ArrowDown;
  const sign = flat ? "" : up ? "+" : "";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full font-semibold tabular-nums",
        cls,
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-[13px]",
      )}
    >
      <Icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} />
      {sign}
      {changePct.toFixed(1)}%
    </span>
  );
}

export function priceColor(change: number) {
  if (Math.abs(change) < 0.5) return "text-price-flat";
  return change > 0 ? "text-price-up" : "text-price-down";
}
