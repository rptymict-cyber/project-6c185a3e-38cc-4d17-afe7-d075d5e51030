import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, ChevronRight, ChevronDown } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type Node = {
  label: string;
  to?: string;
  badge?: string;
  children?: Node[];
};

// GNB 5개를 최상위 노드로, 하위 페이지를 자식 노드로 구성한 사이트맵.
const TREE: Node[] = [
  {
    label: "홈",
    to: "/",
    children: [
      { label: "실시간 시세", to: "/live" },
      { label: "도매시장별 조회", to: "/market/wholesale" },
      { label: "품목별 조회", to: "/market/item" },
    ],
  },
  {
    label: "시세 조회",
    to: "/market",
    children: [{ label: "검색", to: "/search" }],
  },
  {
    label: "즐겨찾기",
    to: "/watchlist",
  },
  {
    label: "통계 (시장별 가격 비교)",
    to: "/statistics",
    children: [{ label: "시장별 가격 비교", to: "/compare" }],
  },
  {
    label: "설정",
    to: "/settings",
    children: [
      { label: "알림", to: "/notifications" },
      { label: "알림 설정", to: "/notifications/settings" },
      { label: "데이터 기준 안내", to: "/data-guide" },
    ],
  },
  {
    label: "AI 시세 예측",
    to: "/prediction",
    badge: "Beta",
  },
  {
    label: "등급별 가격 정보",
    to: "/grades",
  },
];

function TreeItem({ node, depth = 0 }: { node: Node; depth?: number }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = !!node.children?.length;

  return (
    <li>
      <div className="flex items-center">
        <SheetClose asChild>
          <Link
            to={node.to ?? "/"}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-lg px-3 py-2 hover:bg-secondary"
            style={{ paddingLeft: 12 + depth * 14 }}
          >
            <span
              className={
                "min-w-0 flex-1 truncate " +
                (depth === 0
                  ? "text-[14px] font-bold text-foreground"
                  : "text-[13px] font-medium text-foreground")
              }
            >
              {node.label}
            </span>
            {node.badge && (
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                {node.badge}
              </span>
            )}
            {!hasChildren && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />}
          </Link>
        </SheetClose>
        {hasChildren && (
          <button
            onClick={() => setOpen((v) => !v)}
            className="mr-2 grid h-8 w-8 place-items-center rounded-md text-muted-foreground hover:bg-secondary"
            aria-label={open ? "접기" : "펼치기"}
          >
            {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul className="grid gap-0.5">
          {node.children!.map((c) => (
            <TreeItem key={c.label} node={c} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
}

export function AppDrawerTrigger() {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="메뉴 열기"
          className="grid h-9 w-9 place-items-center rounded-full text-foreground hover:bg-secondary"
        >
          <Menu className="h-5 w-5" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex w-[300px] max-w-[85vw] flex-col bg-background p-0"
      >
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b border-border px-4 py-3">
          <SheetTitle className="flex items-center gap-1.5 text-[15px] font-black">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-primary text-[13px] font-black text-primary-foreground">
              A
            </span>
            AGDICT
          </SheetTitle>
        </SheetHeader>
        <div className="border-b border-border px-4 py-2 text-[11px] font-semibold text-muted-foreground">
          더보기
        </div>
        <nav className="flex-1 overflow-y-auto px-1 py-2">
          <ul className="grid gap-0.5">
            {TREE.map((n) => (
              <TreeItem key={n.label} node={n} />
            ))}
          </ul>
        </nav>
        <div className="border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
          데이터 제공: KAMIS 농산물유통정보
        </div>
      </SheetContent>
    </Sheet>
  );
}
