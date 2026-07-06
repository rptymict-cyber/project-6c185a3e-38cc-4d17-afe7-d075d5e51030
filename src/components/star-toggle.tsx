import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarToggle({
  active,
  onClick,
  label = "즐겨찾기",
  size = 20,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
  label?: string;
  size?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      aria-label={label}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick(e);
      }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full p-1.5 transition-colors",
        active ? "text-amber-500" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Star
        style={{ width: size, height: size }}
        className={active ? "fill-amber-400" : ""}
      />
    </button>
  );
}
