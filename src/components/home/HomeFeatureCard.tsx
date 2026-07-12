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
      className="flex h-[64px] items-center gap-2 rounded-[16px] bg-[#F4F6F8] px-3 active:bg-[#E8EBEE]"
    >
      <div className="grid h-[40px] w-[40px] shrink-0 place-items-center">
        {image}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[14px] font-bold text-[#111827]">
          {title}
        </div>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-[#9CA3AF]" />
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
    <svg viewBox="0 0 112 92" className="h-full w-full" aria-hidden="true">
      <rect x="0" y="78" width="112" height="4" rx="2" fill="#E9ECEF" />
      {/* Cabbage */}
      <circle cx="42" cy="48" r="16" fill="#8CC98C" />
      <circle cx="42" cy="48" r="10" fill="#B7E4B7" />
      {/* Radish */}
      <ellipse cx="66" cy="52" rx="10" ry="14" fill="#fff" stroke="#CED4DA" strokeWidth="1.2" />
      <path d="M62 40 Q66 32 70 40" stroke="#3A8A3A" strokeWidth="2" fill="none" />
      {/* Apple */}
      <circle cx="86" cy="54" r="10" fill="#E03131" />
      <path d="M86 46 Q88 42 92 42" stroke="#3A8A3A" strokeWidth="2" fill="none" />
      {/* Onion */}
      <ellipse cx="26" cy="58" rx="9" ry="10" fill="#F5C36B" />
      <path d="M22 50 L26 44 L30 50" stroke="#3A8A3A" strokeWidth="1.8" fill="none" />
      {/* Basket */}
      <path d="M10 62 L102 62 L94 78 L18 78 Z" fill="#D9A066" stroke="#8A5A2B" strokeWidth="1.5" />
      <line x1="24" y1="62" x2="28" y2="78" stroke="#8A5A2B" strokeWidth="1" />
      <line x1="40" y1="62" x2="42" y2="78" stroke="#8A5A2B" strokeWidth="1" />
      <line x1="56" y1="62" x2="56" y2="78" stroke="#8A5A2B" strokeWidth="1" />
      <line x1="72" y1="62" x2="70" y2="78" stroke="#8A5A2B" strokeWidth="1" />
      <line x1="88" y1="62" x2="84" y2="78" stroke="#8A5A2B" strokeWidth="1" />
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
