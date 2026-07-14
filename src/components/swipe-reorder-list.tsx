import { useEffect, useRef, useState, type ReactNode } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type SRItem = { id: string; render: () => ReactNode };

const SWIPE_MAX = 80;
const OPEN_THRESHOLD = 40;

export function SwipeReorderList({
  items,
  onDelete,
  onReorder,
  className,
  wrapperClassName,
  dragHandlePosition = "center",
  swipeToDelete = true,
}: {
  items: SRItem[];
  onDelete?: (id: string) => void;
  onReorder: (ids: string[]) => void;
  className?: string;
  wrapperClassName?: string;
  dragHandlePosition?: "center" | "top-right";
  swipeToDelete?: boolean;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState(0);
  const [order, setOrder] = useState(items.map((i) => i.id));
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());
  const dragState = useRef<{
    startY: number;
    startIndex: number;
    height: number;
    order: string[];
  } | null>(null);

  // Sync external order changes
  useEffect(() => {
    setOrder(items.map((i) => i.id));
  }, [items]);

  useEffect(() => {
    if (!dragId) return;
    const onMove = (e: PointerEvent) => {
      if (!dragState.current) return;
      const st = dragState.current;
      const dy = e.clientY - st.startY;
      setDragOffset(dy);
      const delta = Math.round(dy / st.height);
      const targetIndex = Math.max(0, Math.min(st.order.length - 1, st.startIndex + delta));
      if (targetIndex !== order.indexOf(dragId)) {
        const next = st.order.filter((id) => id !== dragId);
        next.splice(targetIndex, 0, dragId);
        setOrder(next);
      }
    };
    const onUp = () => {
      onReorder(order);
      setDragId(null);
      setDragOffset(0);
      dragState.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, [dragId, order, onReorder]);

  const byId = new Map(items.map((i) => [i.id, i] as const));

  return (
    <ul className="grid gap-2 px-4 py-4">
      {order.map((id, idx) => {
        const item = byId.get(id);
        if (!item) return null;
        const dragging = dragId === id;
        return (
          <SwipeRow
            key={id}
            id={id}
            open={openId === id}
            dragging={dragging}
            dragOffset={dragging ? dragOffset : 0}
            registerRef={(el) => {
              if (el) rowRefs.current.set(id, el);
              else rowRefs.current.delete(id);
            }}
            onOpenChange={(open) => setOpenId(open ? id : null)}
            onDelete={() => {
              setOpenId(null);
              onDelete?.(id);
            }}
            onGripDown={(e) => {
              const el = rowRefs.current.get(id);
              const height = el?.getBoundingClientRect().height ?? 64;
              dragState.current = {
                startY: e.clientY,
                startIndex: idx,
                height: height + 8, // gap
                order: [...order],
              };
              setDragId(id);
            }}
            className={className}
            wrapperClassName={wrapperClassName}
            dragHandlePosition={dragHandlePosition}
            swipeToDelete={swipeToDelete}
          >
            {item.render()}
          </SwipeRow>
        );
      })}
    </ul>
  );
}

function SwipeRow({
  id: _id,
  open,
  dragging,
  dragOffset,
  registerRef,
  onOpenChange,
  onDelete,
  onGripDown,
  children,
  className,
  wrapperClassName,
  dragHandlePosition = "center",
}: {
  id: string;
  open: boolean;
  dragging: boolean;
  dragOffset: number;
  registerRef: (el: HTMLLIElement | null) => void;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onGripDown: (e: React.PointerEvent) => void;
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  dragHandlePosition?: "center" | "top-right";
}) {
  const [tx, setTx] = useState(open ? -SWIPE_MAX : 0);
  const startX = useRef<number | null>(null);
  const startTx = useRef(0);
  const moved = useRef(false);

  useEffect(() => {
    setTx(open ? -SWIPE_MAX : 0);
  }, [open]);

  return (
    <li
      ref={registerRef}
      className={cn(
        "relative overflow-hidden rounded-[10px]",
        dragging && "z-10 shadow-lg",
        wrapperClassName,
      )}
      style={{
        transform: dragging ? `translateY(${dragOffset}px)` : undefined,
        transition: dragging ? "none" : "transform 160ms ease",
      }}
    >
      {/* delete button under */}
      <button
        type="button"
        aria-label="삭제"
        onClick={onDelete}
        className={cn(
          "absolute inset-y-0 right-0 flex w-20 items-center justify-center bg-[#E03131] text-white transition-opacity duration-200",
          tx <= -OPEN_THRESHOLD ? "opacity-100" : "opacity-0",
        )}
      >
        <Trash2 className="h-5 w-5" />
      </button>
      {/* foreground content */}
      <div
        className={cn("relative z-10 flex w-full items-stretch bg-surface", className)}
        style={{
          transform: `translateX(${tx}px)`,
          transition: startX.current === null ? "transform 180ms ease" : "none",
        }}

        onPointerDown={(e) => {
          if ((e.target as HTMLElement).closest("[data-drag-handle]")) return;
          startX.current = e.clientX;
          startTx.current = tx;
          moved.current = false;
        }}
        onPointerMove={(e) => {
          if (startX.current === null) return;
          const dx = e.clientX - startX.current;
          if (Math.abs(dx) > 4) moved.current = true;
          const next = Math.max(-SWIPE_MAX, Math.min(0, startTx.current + dx));
          setTx(next);
        }}
        onPointerUp={() => {
          if (startX.current === null) return;
          startX.current = null;
          const shouldOpen = tx < -OPEN_THRESHOLD;
          onOpenChange(shouldOpen);
        }}
        onPointerCancel={() => {
          startX.current = null;
          setTx(open ? -SWIPE_MAX : 0);
        }}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
            moved.current = false;
          }
        }}
      >
        <div className="min-w-0 flex-1">{children}</div>
        <button
          type="button"
          aria-label="순서 변경"
          data-drag-handle
          onPointerDown={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onGripDown(e);
          }}
          className={cn(
            "touch-none text-muted-foreground",
            dragHandlePosition === "top-right"
              ? "absolute right-3 top-4 z-10 grid h-8 w-8 place-items-center"
              : "flex w-10 shrink-0 items-center justify-center",
          )}
        >
          <GripVertical
            className={cn("shrink-0", dragHandlePosition === "top-right" ? "h-4 w-4" : "h-5 w-5")}
          />
        </button>
      </div>
    </li>
  );
}
