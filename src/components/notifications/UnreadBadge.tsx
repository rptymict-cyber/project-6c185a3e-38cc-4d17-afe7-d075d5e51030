import { useEffect, useState } from "react";
import { useNotificationEvents } from "@/store/notification-events";
import { cn } from "@/lib/utils";

/**
 * 안 읽은 알림 개수 배지.
 * - 0건이면 렌더링하지 않는다.
 * - 99건 초과 시 "99+"로 표시한다.
 * - persist 스토어 하이드레이션 이후에만 표시해 SSR 불일치를 방지한다.
 */
export function UnreadBadge({ className }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = useNotificationEvents((s) =>
    s.events.reduce((acc, e) => (e.read ? acc : acc + 1), 0),
  );

  if (!mounted || count <= 0) return null;

  return (
    <span
      aria-label={`안 읽은 알림 ${count}건`}
      className={cn(
        "pointer-events-none absolute -right-0.5 -top-0.5 grid min-w-[16px] place-items-center rounded-full bg-[#E43D3D] px-1 text-[9px] font-bold leading-[16px] text-white",
        className,
      )}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
