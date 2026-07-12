import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export type HomeFeatureCardProps = {
  eyebrow?: string;
  title: string;
  image: ReactNode;
  to: string;
};

export function HomeFeatureCard({ title, image, to }: HomeFeatureCardProps) {
  return (
    <Link
      to={to}
      className="flex h-[56px] items-center gap-1.5 rounded-[16px] bg-[#F4F6F8] px-2 active:bg-[#E8EBEE]"
    >
      <div className="grid h-[28px] w-[28px] shrink-0 place-items-center">
        {image}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[12px] font-bold text-[#111827]">
          {title}
        </div>
      </div>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[#9CA3AF]" />
    </Link>
  );
}

/* ---------------- Illustrations ---------------- */

export function WholesaleMarketIllustration() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      {/* Warehouse */}
      <rect x="12" y="14" width="20" height="18" rx="2" fill="#F1F3F5" stroke="#CED4DA" strokeWidth="1.2" />
      <path d="M12 14 L22 8 L32 14 Z" fill="#3A8A3A" />
      <rect x="17" y="20" width="10" height="12" fill="#fff" stroke="#CED4DA" strokeWidth="1" />
      <line x1="22" y1="20" x2="22" y2="32" stroke="#CED4DA" strokeWidth="1" />
      {/* Truck */}
      <rect x="4" y="22" width="10" height="7" rx="1.5" fill="#fff" stroke="#3A8A3A" strokeWidth="1.2" />
      <rect x="13" y="25" width="5" height="4" rx="1" fill="#3A8A3A" />
      <circle cx="7" cy="31" r="2" fill="#343A40" />
      <circle cx="16" cy="31" r="2" fill="#343A40" />
    </svg>
  );
}

export function ItemBasketIllustration() {
  return (
    <svg viewBox="0 0 40 40" className="h-full w-full" aria-hidden="true">
      {/* Cabbage */}
      <circle cx="16" cy="18" r="6" fill="#8CC98C" />
      <circle cx="16" cy="18" r="3.5" fill="#B7E4B7" />
      {/* Apple */}
      <circle cx="28" cy="20" r="5" fill="#E03131" />
      <path d="M28 15 Q29 13 31 13" stroke="#3A8A3A" strokeWidth="1.2" fill="none" />
      {/* Basket */}
      <path d="M6 24 L34 24 L30 34 L10 34 Z" fill="#D9A066" stroke="#8A5A2B" strokeWidth="1.2" />
      <line x1="12" y1="24" x2="14" y2="34" stroke="#8A5A2B" strokeWidth="0.8" />
      <line x1="18" y1="24" x2="18" y2="34" stroke="#8A5A2B" strokeWidth="0.8" />
      <line x1="24" y1="24" x2="23" y2="34" stroke="#8A5A2B" strokeWidth="0.8" />
      <line x1="30" y1="24" x2="27" y2="34" stroke="#8A5A2B" strokeWidth="0.8" />
    </svg>
  );
}

export function AIPredictionIllustration() {
  return (
    <svg viewBox="0 0 112 92" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="78" width="112" height="4" rx="2" fill="#E9ECEF" />
      {/* Monitor */}
      <rect x="14" y="16" width="76" height="52" rx="4" fill="#fff" stroke="#3A8A3A" strokeWidth="1.8" />
      <rect x="18" y="20" width="68" height="44" rx="2" fill="#F0F9F0" />
      {/* Chart bars */}
      <rect x="24" y="46" width="6" height="14" fill="#B7E4B7" />
      <rect x="34" y="40" width="6" height="20" fill="#8CC98C" />
      <rect x="44" y="34" width="6" height="26" fill="#3A8A3A" />
      {/* Trend line */}
      <path d="M22 52 L34 44 L46 36 L60 28 L78 22" stroke="#E03131" strokeWidth="2" fill="none" strokeLinecap="round" />
      <circle cx="78" cy="22" r="2.5" fill="#E03131" />
      {/* Stand */}
      <rect x="46" y="68" width="12" height="6" fill="#CED4DA" />
      <rect x="38" y="74" width="28" height="3" rx="1" fill="#CED4DA" />
      {/* AI chip */}
      <rect x="70" y="54" width="22" height="16" rx="3" fill="#3A8A3A" />
      <text x="81" y="65" textAnchor="middle" fontSize="9" fontWeight="800" fill="#fff" fontFamily="sans-serif">AI</text>
      {/* Magnifier */}
      <circle cx="96" cy="60" r="7" fill="none" stroke="#495057" strokeWidth="1.8" />
      <line x1="101" y1="65" x2="107" y2="71" stroke="#495057" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
