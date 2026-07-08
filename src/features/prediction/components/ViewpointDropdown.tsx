import { ChevronDown, Check } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { PredictionViewpoint } from "../types";
import { cn } from "@/lib/utils";

const OPTIONS: {
  id: PredictionViewpoint;
  label: string;
  sub: string;
}[] = [
  { id: "farmer", label: "농민 관점", sub: "팔 때 유리한 시점" },
  { id: "wholesaler", label: "도매상 관점", sub: "살 때 유리한 시점" },
];

export function ViewpointDropdown({
  value,
  onChange,
}: {
  value: PredictionViewpoint;
  onChange: (v: PredictionViewpoint) => void;
}) {
  const current = OPTIONS.find((o) => o.id === value) ?? OPTIONS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-[#3A8A3A]/40 bg-[#F0F9F0] px-3 py-1.5 text-[12px] font-semibold text-[#1F5C1F] active:bg-[#E4F3E4]"
        >
          {current.label}
          <ChevronDown className="h-3.5 w-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {OPTIONS.map((o) => {
          const active = o.id === value;
          return (
            <DropdownMenuItem
              key={o.id}
              onClick={() => onChange(o.id)}
              className="flex items-start gap-2 py-2.5"
            >
              <div className="flex-1">
                <div
                  className={cn(
                    "text-[13px] font-semibold",
                    active ? "text-[#1F5C1F]" : "text-foreground",
                  )}
                >
                  {o.label}
                </div>
                <div className="text-[11px] text-muted-foreground">{o.sub}</div>
              </div>
              {active && <Check className="mt-0.5 h-4 w-4 text-[#3A8A3A]" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
